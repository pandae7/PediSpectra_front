'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Calendar, Send } from 'lucide-react'
import { useDoctor } from '@/lib/doctor-context'
import { getMessages, sendMessage, seedDemoMessages, type Message } from '@/lib/messages'
import { Navbar } from '@/components/layout/navbar'
import { cn } from '@/lib/utils'

export default function DoctorMessagesPage() {
  const params = useParams()
  const router = useRouter()
  const consultId = params.consultId as string
  const { currentDoctor, consultations, isLoading } = useDoctor()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const consult = consultations.find((c) => c.id === consultId)

  useEffect(() => {
    if (!isLoading && !currentDoctor) router.push('/login/doctor')
  }, [currentDoctor, isLoading, router])

  useEffect(() => {
    if (currentDoctor && consult) {
      seedDemoMessages(consultId, currentDoctor.name, consult.patientName)
      setMessages(getMessages(consultId))
    }
  }, [consultId, currentDoctor, consult])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (isLoading || !currentDoctor || !consult) return null

  const handleSend = () => {
    if (!input.trim()) return
    const msg = sendMessage({
      consultId,
      from: 'doctor',
      fromName: currentDoctor.name,
      text: input.trim(),
    })
    setMessages([...messages, msg])
    setInput('')
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <Navbar showBack backHref="/doctor/history" />

      {/* Chat header */}
      <div className="border-b border-border px-4 py-3">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">{consult.childName}</p>
            <p className="text-xs text-muted-foreground">Parent: {consult.patientName} · {consult.subspeciality}</p>
          </div>
          <a
            href={`/booking/${currentDoctor.id}?patient=${encodeURIComponent(consult.childName)}`}
            className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
          >
            <Calendar className="h-3 w-3 text-primary" />
            Schedule Follow-up
          </a>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mx-auto max-w-2xl space-y-4">
          <div className="rounded-lg bg-muted/50 p-3 text-center text-xs text-muted-foreground">
            Post-consultation chat with {consult.patientName}. If the query needs deeper evaluation, suggest a follow-up.
          </div>

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'flex',
                msg.from === 'doctor' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'max-w-[75%] rounded-2xl px-4 py-2.5',
                  msg.from === 'doctor'
                    ? 'rounded-br-md bg-primary text-primary-foreground'
                    : 'rounded-bl-md border border-border bg-card text-foreground'
                )}
              >
                <p className="text-sm">{msg.text}</p>
                <p className={cn(
                  'mt-1 text-[10px]',
                  msg.from === 'doctor' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                )}>
                  {new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border px-4 py-3">
        <div className="mx-auto flex max-w-2xl gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your response..."
            className="h-11 flex-1 rounded-xl border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
