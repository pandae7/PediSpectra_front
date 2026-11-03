'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Stethoscope } from 'lucide-react'
import { routeSymptoms, SYMPTOM_CHIPS } from '@/lib/triage-engine'
import { getSubspecialityMeta } from '@/lib/mock-data'

interface Msg {
  from: 'bot' | 'user'
  text?: string
  suggestions?: string[]
}

const GREETING: Msg = {
  from: 'bot',
  text: "Hi! Tell me what's troubling your child — a symptom or concern — and I'll point you to the right specialist. You can also tap a common one below.",
}

export function SymptomChat() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Msg[]>([GREETING])
  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  const respond = (query: string) => {
    const q = query.trim()
    if (!q) return
    const results = routeSymptoms(q)
    const botMsg: Msg =
      results.length > 0
        ? {
            from: 'bot',
            text:
              results.length === 1
                ? 'Based on what you described, the right specialist is likely:'
                : 'Based on what you described, these specialists are most relevant:',
            suggestions: results.map((r) => r.subspeciality),
          }
        : {
            from: 'bot',
            text: "I couldn't match that to a specific specialist. A General Pediatrician is a great first stop — they'll guide you to the right expert if needed.",
            suggestions: ['General Pediatrics & Newborn Care'],
          }
    setMessages((m) => [...m, { from: 'user', text: q }, botMsg])
  }

  const onSend = () => {
    respond(input)
    setInput('')
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open symptom helper"
        className="fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform hover:scale-105"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-[60] flex h-[32rem] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
          <div className="flex items-center gap-2 border-b border-border bg-primary px-4 py-3 text-primary-foreground">
            <Stethoscope className="h-5 w-5" />
            <div>
              <p className="text-sm font-semibold">Find the Right Specialist</p>
              <p className="text-[11px] opacity-90">Guided by your child&apos;s symptoms</p>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div key={i} className={m.from === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <div
                  className={
                    'max-w-[85%] rounded-2xl px-3 py-2 text-sm ' +
                    (m.from === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-border bg-background text-foreground')
                  }
                >
                  {m.text && <p>{m.text}</p>}
                  {m.suggestions && (
                    <div className="mt-2 space-y-2">
                      {m.suggestions.map((s) => {
                        const meta = getSubspecialityMeta(s)
                        return (
                          <a
                            key={s}
                            href={`/doctors?subspeciality=${encodeURIComponent(s)}`}
                            className="flex items-center justify-between gap-2 rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-primary/20"
                          >
                            <span>{meta?.friendlyTitle ?? s}</span>
                            <span className="text-primary">See doctors &rarr;</span>
                          </a>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SYMPTOM_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => respond(chip)}
                    className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          <p className="border-t border-border px-4 py-2 text-[10px] leading-snug text-muted-foreground">
            This helps you choose a specialist and is not medical advice or a diagnosis. For emergencies, contact your doctor or local emergency services.
          </p>

          <div className="flex items-center gap-2 border-t border-border p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSend()}
              placeholder="Describe a symptom..."
              className="h-10 flex-1 rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
            <button
              onClick={onSend}
              aria-label="Send"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}