'use client'

import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  PhoneCall,
  Radio,
  Star,
  Video,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { FlowHeader } from '@/components/flow/flow-header'
import { PhoneFrame } from '@/components/flow/phone-frame'
import { StatusPill } from '@/components/flow/status-pill'
import { Button } from '@/components/ui/button'
import { useConsult } from '@/lib/consult-context'
import { ONCALL_COUNT, ONCALL_POOL } from '@/lib/mock-data'
import { useStepGuard } from '@/lib/use-step-guard'
import { cn } from '@/lib/utils'

type Phase = 'broadcasting' | 'accepted' | 'connecting' | 'unavailable'

export default function WaitingPage() {
  const allowed = useStepGuard('waiting')
  const router = useRouter()
  const { intake, matchedDoctor, setMatchedDoctor, endConsult } = useConsult()

  const [phase, setPhase] = useState<Phase>('broadcasting')
  const [seconds, setSeconds] = useState(0)
  // Demo control: lets you preview the "no doctor available" fallback path.
  const [forceUnavailable, setForceUnavailable] = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }, [])

  const runHappyPath = useCallback(() => {
    clearTimers()
    setPhase('broadcasting')
    // A pediatrician from the on-call pool accepts the request.
    timers.current.push(
      setTimeout(() => {
        const doctor = ONCALL_POOL[Math.floor(Math.random() * ONCALL_POOL.length)]
        setMatchedDoctor(doctor)
        setPhase('accepted')
      }, 3200),
    )
    // Brief "connecting" beat before the call would start.
    timers.current.push(setTimeout(() => setPhase('connecting'), 5200))
  }, [clearTimers, setMatchedDoctor])

  const runUnavailablePath = useCallback(() => {
    clearTimers()
    setPhase('broadcasting')
    timers.current.push(setTimeout(() => setPhase('unavailable'), 4000))
  }, [clearTimers])

  // Elapsed timer.
  useEffect(() => {
    if (!allowed) return
    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [allowed])

  // Kick off the matching simulation.
  useEffect(() => {
    if (!allowed) return
    if (forceUnavailable) {
      runUnavailablePath()
    } else {
      runHappyPath()
    }
    return clearTimers
  }, [allowed, forceUnavailable, runHappyPath, runUnavailablePath, clearTimers])

  if (!allowed) return null

  const mins = String(Math.floor(seconds / 60)).padStart(2, '0')
  const secs = String(seconds % 60).padStart(2, '0')

  const startConsult = () => {
    // In a real app this opens the video call. Here we advance to the summary.
    endConsult()
    router.push('/summary')
  }

  const retry = () => {
    setForceUnavailable(false)
    setSeconds(0)
  }

  return (
    <PhoneFrame>
      <FlowHeader
        title="Connecting you to a doctor"
        subtitle="Step 5 of 6 · Urgent on-call queue"
        currentStep="waiting"
      />

      <main className="flex flex-1 flex-col px-5 py-6">
        {/* Patient chip */}
        <div className="mb-6 flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
          <div className="leading-tight">
            <p className="text-xs text-muted-foreground">Consult for</p>
            <p className="text-sm font-medium text-foreground">
              {intake.childName || 'Your child'}
            </p>
          </div>
          <div className="text-right leading-tight">
            <p className="text-xs text-muted-foreground">Elapsed</p>
            <p className="font-mono text-sm font-medium tabular-nums text-foreground">
              {mins}:{secs}
            </p>
          </div>
        </div>

        {/* Phase content */}
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          {phase === 'broadcasting' && (
            <BroadcastView />
          )}

          {(phase === 'accepted' || phase === 'connecting') && matchedDoctor && (
            <div className="flex flex-col items-center">
              <div className="relative mb-5">
                <span
                  className="flex size-24 items-center justify-center rounded-full text-2xl font-semibold text-primary-foreground"
                  style={{ backgroundColor: matchedDoctor.avatarColor }}
                  aria-hidden="true"
                >
                  {matchedDoctor.initials}
                </span>
                <span className="absolute -bottom-1 -right-1 flex items-center justify-center rounded-full border-4 border-card bg-success p-1.5">
                  <CheckCircle2 className="size-4 text-primary-foreground" />
                </span>
              </div>
              <StatusPill tone="success" className="mb-3">
                Pediatrician accepted
              </StatusPill>
              <h2 className="text-lg font-semibold text-foreground">{matchedDoctor.name}</h2>
              <p className="text-sm text-muted-foreground">{matchedDoctor.qualification}</p>
              <div className="mt-1 flex items-center gap-1 text-xs font-medium text-warning">
                <Star className="size-3.5 fill-warning text-warning" />
                {matchedDoctor.rating} · {matchedDoctor.experienceYears} yrs · {matchedDoctor.consults.toLocaleString('en-IN')} consults
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Speaks {matchedDoctor.languages.join(', ')}
              </p>

              {phase === 'connecting' ? (
                <Button size="lg" className="mt-7 h-12 w-full text-[15px]" onClick={startConsult}>
                  <Video className="size-4" />
                  Join video consult
                </Button>
              ) : (
                <p className="mt-7 flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" />
                  Preparing secure video room…
                </p>
              )}
            </div>
          )}

          {phase === 'unavailable' && (
            <div className="flex flex-col items-center">
              <span className="mb-5 flex size-20 items-center justify-center rounded-full bg-warning/15">
                <AlertTriangle className="size-9 text-warning" />
              </span>
              <h2 className="text-lg font-semibold text-balance text-foreground">
                No pediatrician could connect right now
              </h2>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-pretty text-muted-foreground">
                All on-call doctors are busy. You won&apos;t be charged. Choose what works best for
                your child right now.
              </p>

              <div className="mt-7 flex w-full flex-col gap-2.5">
                <Button size="lg" className="h-12 text-[15px]" onClick={retry}>
                  <PhoneCall className="size-4" />
                  Request a priority callback
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 border-danger/40 text-[15px] text-danger hover:bg-danger/10 hover:text-danger"
                  onClick={() => router.push('/safety')}
                >
                  Go to nearest emergency room
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Demo controls */}
        {(phase === 'broadcasting' || phase === 'unavailable') && (
          <div className="mt-6 rounded-xl border border-dashed border-border bg-muted/30 p-3">
            <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Demo controls
            </p>
            <label className="flex items-center justify-between gap-3 text-xs text-foreground">
              <span>Simulate &quot;no doctor available&quot; outcome</span>
              <input
                type="checkbox"
                checked={forceUnavailable}
                onChange={(e) => {
                  setForceUnavailable(e.target.checked)
                  setSeconds(0)
                }}
                className="size-4 accent-warning"
              />
            </label>
          </div>
        )}
      </main>
    </PhoneFrame>
  )
}

function BroadcastView() {
  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-6 flex size-28 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
        <span className="absolute inset-2 animate-pulse rounded-full bg-primary/15" />
        <span className="relative flex size-20 items-center justify-center rounded-full bg-primary/20">
          <Radio className="size-9 text-primary" />
        </span>
      </div>
      <h2 className="text-lg font-semibold text-balance text-foreground">
        Notifying on-call pediatricians
      </h2>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-pretty text-muted-foreground">
        Your request was sent to {ONCALL_COUNT} general pediatricians on call. The first available
        doctor will accept and connect with you.
      </p>

      <div className="mt-6 flex items-center gap-2">
        {ONCALL_POOL.map((doc, i) => (
          <span
            key={doc.id}
            className={cn(
              'flex size-9 items-center justify-center rounded-full text-xs font-semibold text-primary-foreground',
            )}
            style={{ backgroundColor: doc.avatarColor, animationDelay: `${i * 200}ms` }}
            aria-hidden="true"
          >
            {doc.initials}
          </span>
        ))}
      </div>
      <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <Loader2 className="size-3.5 animate-spin" />
        Waiting for a doctor to accept…
      </p>
    </div>
  )
}
