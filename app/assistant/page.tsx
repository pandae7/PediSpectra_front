'use client'

import { AlertTriangle, ArrowLeft, ArrowRight, CalendarClock, CheckCircle2, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ActionBar } from '@/components/flow/action-bar'
import { PhoneFrame } from '@/components/flow/phone-frame'
import { StatusPill } from '@/components/flow/status-pill'
import { Button } from '@/components/ui/button'
import { useConsult } from '@/lib/consult-context'
import {
  DURATION_OPTIONS,
  getSpecialityMatches,
  SYMPTOM_OPTIONS,
  URGENCY_OPTIONS,
  type MatchInput,
  type SymptomCategory,
  type SymptomDuration,
  type UrgencyLevel,
} from '@/lib/speciality-matching'
import { cn } from '@/lib/utils'

type Step = 1 | 2 | 3 | 4

export default function AssistantPage() {
  const router = useRouter()
  const { childProfiles, selectedChildId, setBookedSlot, setFlowMode, setRecommendedSpeciality } = useConsult()
  const selectedChild = childProfiles.find((child) => child.id === selectedChildId) ?? childProfiles[0]

  const [step, setStep] = useState<Step>(1)
  const [category, setCategory] = useState<SymptomCategory | null>(null)
  const [duration, setDuration] = useState<SymptomDuration | null>(null)
  const [urgency, setUrgency] = useState<UrgencyLevel | null>(null)

  const input = useMemo<MatchInput | null>(
    () => (category && duration && urgency ? { category, duration, urgency } : null),
    [category, duration, urgency],
  )
  const matches = useMemo(() => (input ? getSpecialityMatches(input) : []), [input])
  const progress = step === 4 ? 100 : Math.round((step / 3) * 100)

  const goUrgent = () => {
    setFlowMode('urgent')
    router.push('/')
  }

  const viewDoctors = () => {
    const topMatch = matches[0]
    if (!topMatch) return
    setRecommendedSpeciality(topMatch.speciality)
    setBookedSlot(null)
    router.push('/doctors')
  }

  const canContinue =
    (step === 1 && category) ||
    (step === 2 && duration) ||
    (step === 3 && urgency)

  const continueStep = () => {
    if (step < 3 && canContinue) setStep((step + 1) as Step)
    if (step === 3 && canContinue) setStep(4)
  }

  const back = () => {
    if (step === 1) router.push('/home')
    else setStep((step - 1) as Step)
  }

  return (
    <PhoneFrame>
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            type="button"
            onClick={back}
            aria-label="Go back"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-sm font-semibold leading-tight text-foreground">
              Speciality assistant
            </h1>
            <p className="truncate text-xs text-muted-foreground">
              {selectedChild?.name ? `For ${selectedChild.name}` : 'Choose the right care path'}
            </p>
          </div>
          <StatusPill tone={step === 4 ? 'success' : 'primary'}>
            {step === 4 ? 'Match ready' : `Step ${step}/3`}
          </StatusPill>
        </div>
        <div className="px-4 pb-2.5" aria-hidden="true">
          <div className="h-1 rounded-full bg-muted">
            <div className="h-1 rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-5 px-5 py-5">
        {step === 1 ? (
          <QuestionBlock
            eyebrow="Main concern"
            title="What best describes the concern?"
            text="Pick the closest option. You can still choose a different doctor later."
          >
            {SYMPTOM_OPTIONS.map((option) => (
              <Choice
                key={option.id}
                active={category === option.id}
                title={option.label}
                text={option.examples}
                onClick={() => setCategory(option.id)}
              />
            ))}
          </QuestionBlock>
        ) : null}

        {step === 2 ? (
          <QuestionBlock
            eyebrow="Pattern"
            title="How long has this been happening?"
            text="Duration helps decide whether a specialist or a first pediatric review is better."
          >
            {DURATION_OPTIONS.map((option) => (
              <Choice
                key={option.id}
                active={duration === option.id}
                title={option.label}
                text={option.helper}
                onClick={() => setDuration(option.id)}
              />
            ))}
          </QuestionBlock>
        ) : null}

        {step === 3 ? (
          <QuestionBlock
            eyebrow="Urgency"
            title="How soon do you need care?"
            text="If you are worried right now, PediSpectra can suggest urgent review instead of waiting for a specialist slot."
          >
            {URGENCY_OPTIONS.map((option) => (
              <Choice
                key={option.id}
                active={urgency === option.id}
                title={option.label}
                text={option.helper}
                onClick={() => setUrgency(option.id)}
              />
            ))}
          </QuestionBlock>
        ) : null}

        {step === 4 ? (
          <section className="flex flex-col gap-4">
            <div className="rounded-xl border border-success/30 bg-success/10 p-4">
              <div className="mb-2 flex items-center gap-2">
                <CheckCircle2 className="size-5 text-success" />
                <h2 className="text-lg font-semibold text-foreground">Recommended care path</h2>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                This is a demo recommendation based on the quick answers. A parent can still browse
                specialists or choose urgent consult if symptoms worsen.
              </p>
            </div>

            {urgency === 'urgent' ? (
              <button
                type="button"
                onClick={goUrgent}
                className="flex items-start gap-3 rounded-xl border border-danger/30 bg-danger/10 p-4 text-left"
              >
                <AlertTriangle className="mt-0.5 size-5 shrink-0 text-danger" />
                <span>
                  <span className="block text-sm font-semibold text-danger">Consider urgent pediatric review</span>
                  <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                    If breathing, seizure, unconsciousness, blue lips, poisoning, major injury, or
                    severe dehydration is present, go to emergency care now.
                  </span>
                </span>
              </button>
            ) : null}

            <div className="flex flex-col gap-3">
              {matches.map((match, index) => (
                <article key={match.speciality} className="rounded-xl border border-border bg-card p-4">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <StatusPill tone={index === 0 ? 'primary' : 'neutral'}>{match.label}</StatusPill>
                      <h3 className="mt-2 text-base font-semibold text-foreground">{match.speciality}</h3>
                    </div>
                    <span className="rounded-lg bg-secondary px-2.5 py-1 text-xs font-semibold text-foreground">
                      {match.score}%
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{match.reason}</p>
                  <div className="mt-3 flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2 text-xs text-muted-foreground">
                    <CalendarClock className="size-3.5 text-primary" />
                    {match.nextStep}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </main>

      {step === 4 ? (
        <ActionBar hint="Doctors are filtered by the recommended subspeciality.">
          <Button size="lg" className="h-12 text-[15px]" disabled={matches.length === 0} onClick={viewDoctors}>
            View matching doctors
            <ArrowRight className="size-4" />
          </Button>
        </ActionBar>
      ) : (
        <ActionBar hint="This assistant is guidance only, not emergency diagnosis.">
          <Button size="lg" className="h-12 text-[15px]" disabled={!canContinue} onClick={continueStep}>
            Continue
            <ArrowRight className="size-4" />
          </Button>
        </ActionBar>
      )}
    </PhoneFrame>
  )
}

function QuestionBlock({
  eyebrow,
  title,
  text,
  children,
}: {
  eyebrow: string
  title: string
  text: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="space-y-2">
        <StatusPill tone="primary" icon={<Search className="size-3.5" />}>
          {eyebrow}
        </StatusPill>
        <h2 className="text-balance text-2xl font-semibold leading-tight text-foreground">{title}</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
      </div>
      <div className="flex flex-col gap-2.5">{children}</div>
    </section>
  )
}

function Choice({
  active,
  title,
  text,
  onClick,
}: {
  active: boolean
  title: string
  text: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-start gap-3 rounded-xl border p-4 text-left transition-colors',
        active ? 'border-primary bg-primary/15' : 'border-border bg-card hover:border-primary/40',
      )}
    >
      <span
        className={cn(
          'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border',
          active ? 'border-primary bg-primary text-primary-foreground' : 'border-border',
        )}
      >
        {active ? <CheckCircle2 className="size-3.5" /> : null}
      </span>
      <span>
        <span className="block text-sm font-semibold text-foreground">{title}</span>
        <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{text}</span>
      </span>
    </button>
  )
}
