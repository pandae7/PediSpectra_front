'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { Calendar, Send } from 'lucide-react'
import { getConsultations, getDoctors, initializeMockData, type Consultation, type DoctorProfile } from '@/lib/mock-data'
import { getMessages, sendMessage, seedDemoMessages, type Message } from '@/lib/messages'
import { Navbar } from '@/components/layout/navbar'
import { cn } from '@/lib/utils'

export default function PatientMessagesPage() {
  const params = useParams()
  const consultId = params.consultId as string
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [consult, setConsult] = useState<Consultation | null>(null)
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    initializeMockData()
    const consultations = getConsultations()
    const doctors = getDoctors()
    const found = consultations.find((c) => c.id === consultId)
    if (found) {
      setConsult(found)
      const doc = doctors.find((d) => d.id === found.doctorId)
      if (doc) {
        setDoctor(doc)
        seedDemoMessages(consultId, doc.name, found.patientName)
      }
    }
    setMessages(getMessages(consultId))
  }, [consultId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!input.trim() || !consult) return
    const msg = sendMessage({
      consultId,
      from: 'patient',
      fromName: consult.patientName,
      text: input.trim(),
    })
    setMessages([...messages, msg])
    setInput('')
  }

  if (!consult || !doctor) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar showBack backHref="/patient/consultations" />
        <div className="flex items-center justify-center py-20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <Navbar showBack backHref="/patient/consultations" />

      {/* Chat header */}
      <div className="border-b border-border px-4 py-3">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">{doctor.name}</p>
            <p className="text-xs text-muted-foreground">{doctor.subspeciality} · Post-consultation chat</p>
          </div>
          <a
            href={`/booking/${doctor.id}`}
            className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
          >
            <Calendar className="h-3 w-3 text-primary" />
            Book Follow-up
          </a>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mx-auto max-w-2xl space-y-4">
          <div className="rounded-lg bg-muted/50 p-3 text-center text-xs text-muted-foreground">
            This chat is available for 7 days after your consultation. For new concerns, please book a follow-up.
          </div>

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'flex',
                msg.from === 'patient' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'max-w-[75%] rounded-2xl px-4 py-2.5',
                  msg.from === 'patient'
                    ? 'rounded-br-md bg-primary text-primary-foreground'
                    : 'rounded-bl-md border border-border bg-card text-foreground'
                )}
              >
                <p className="text-sm">{msg.text}</p>
                <p className={cn(
                  'mt-1 text-[10px]',
                  msg.from === 'patient' ? 'text-primary-foreground/70' : 'text-muted-foreground'
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
            placeholder="Type your question..."
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
