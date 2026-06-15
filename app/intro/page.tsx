'use client'

import { ArrowRight, CalendarClock, HeartPulse, Search, ShieldCheck, Stethoscope } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ActionBar } from '@/components/flow/action-bar'
import { FlowHeader } from '@/components/flow/flow-header'
import { PhoneFrame } from '@/components/flow/phone-frame'
import { Button } from '@/components/ui/button'
import { useConsult } from '@/lib/consult-context'

const BENEFITS = [
  {
    icon: Search,
    title: 'Find the right pediatric care',
    text: 'Answer a few questions so PediSpectra can guide you to a general pediatrician or subspecialist.',
  },
  {
    icon: CalendarClock,
    title: 'Book around your schedule',
    text: 'Use the demo flow to choose a doctor and appointment path without rushing into urgent care.',
  },
  {
    icon: ShieldCheck,
    title: 'Safety first',
    text: 'If symptoms look urgent, we will route you to the urgent safety flow instead.',
  },
]

export default function IntroPage() {
  const router = useRouter()
  const { setFlowMode } = useConsult()

  const continueFlow = () => {
    setFlowMode('normal')
    router.push('/login')
  }

  const urgentFlow = () => {
    setFlowMode('urgent')
    router.push('/')
  }

  return (
    <PhoneFrame>
      <FlowHeader
        title="Welcome to PediSpectra"
        subtitle="Parent account and child profiles"
        currentStep="landing"
        onBack={() => router.push('/invite')}
        showProgress={false}
      />

      <main className="flex flex-1 flex-col gap-6 px-5 py-7">
        <div className="space-y-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Stethoscope className="size-5" />
          </div>
          <h1 className="text-balance text-3xl font-semibold leading-tight text-foreground">
            Start by creating your family profile
          </h1>
          <p className="text-pretty text-[15px] leading-relaxed text-muted-foreground">
            One parent account can manage multiple child profiles, then use PediSpectra to pick the
            right care path for each child.
          </p>
        </div>

        <section className="flex flex-col gap-2.5">
          {BENEFITS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-xl border border-border bg-card p-4">
              <div className="mb-2 flex items-center gap-2">
                <Icon className="size-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground">{title}</h2>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </section>

        <button
          type="button"
          onClick={urgentFlow}
          className="flex items-center justify-center gap-2 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm font-medium text-danger transition-colors hover:bg-danger/15"
        >
          <HeartPulse className="size-4" />
          Need urgent help instead?
        </button>
      </main>

      <ActionBar hint="Demo login uses any 6-digit OTP after phone entry.">
        <Button size="lg" className="h-12 text-[15px]" onClick={continueFlow}>
          Continue to login
          <ArrowRight className="size-4" />
        </Button>
      </ActionBar>
    </PhoneFrame>
  )
}
