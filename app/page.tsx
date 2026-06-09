'use client'

import { AlertTriangle, ArrowRight, Clock, ShieldCheck, Stethoscope } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ActionBar } from '@/components/flow/action-bar'
import { PhoneFrame } from '@/components/flow/phone-frame'
import { StatusPill } from '@/components/flow/status-pill'
import { Button } from '@/components/ui/button'
import { useConsult } from '@/lib/consult-context'

export default function LandingPage() {
  const router = useRouter()
  const { reset } = useConsult()

  const startConsult = () => {
    reset()
    router.push('/safety')
  }

  return (
    <PhoneFrame>
      {/* Source context: arrived via WhatsApp */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Stethoscope className="size-4" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-foreground">PediCare 24/7</p>
            <p className="text-[11px] text-muted-foreground">Pediatric urgent care</p>
          </div>
        </div>
        <StatusPill tone="success" icon={<span className="size-1.5 rounded-full bg-success" />}>
          Doctors online
        </StatusPill>
      </div>

      <main className="flex flex-1 flex-col gap-6 px-5 py-7">
        <div className="space-y-3">
          <StatusPill tone="primary" icon={<Clock className="size-3.5" />}>
            Avg. wait under 5 min
          </StatusPill>
          <h1 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-foreground">
            Need help for your child now?
          </h1>
          <p className="text-pretty text-[15px] leading-relaxed text-muted-foreground">
            Start with a quick safety check. If online consultation is
            appropriate, we&apos;ll connect you to a pediatric doctor.
          </p>
        </div>

        {/* Reassurance row */}
        <ul className="grid grid-cols-1 gap-2.5">
          {[
            { icon: ShieldCheck, text: 'Verified pediatricians, available 24/7' },
            { icon: Stethoscope, text: 'Video consult with prescription if needed' },
            { icon: Clock, text: 'No appointment — connect in minutes' },
          ].map(({ icon: Icon, text }) => (
            <li
              key={text}
              className="flex items-center gap-3 rounded-xl border border-border bg-card px-3.5 py-3"
            >
              <Icon className="size-4 shrink-0 text-primary" />
              <span className="text-sm text-foreground">{text}</span>
            </li>
          ))}
        </ul>

        {/* Emergency warning band — informational, not interactive */}
        <div className="rounded-xl border border-danger/30 bg-danger/10 p-3.5">
          <div className="flex gap-2.5">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-danger" />
            <p className="text-[13px] leading-relaxed text-danger-foreground/90">
              <span className="font-semibold text-danger">Go to emergency now</span>{' '}
              for severe breathing difficulty, seizure, unconsciousness, blue
              lips, poisoning, major injury, or severe dehydration.
            </p>
          </div>
        </div>
      </main>

      <ActionBar hint="By continuing you agree to a quick safety check first.">
        <Button size="lg" className="h-12 text-[15px]" onClick={startConsult}>
          Start urgent consult
          <ArrowRight className="size-4" />
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="h-12 text-[15px]"
          onClick={() => router.push('/safety')}
        >
          Check emergency signs
        </Button>
      </ActionBar>
    </PhoneFrame>
  )
}
