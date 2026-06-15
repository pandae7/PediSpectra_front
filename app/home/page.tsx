'use client'

import {
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  MessageCircle,
  Search,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ActionBar } from '@/components/flow/action-bar'
import { PhoneFrame } from '@/components/flow/phone-frame'
import { StatusPill } from '@/components/flow/status-pill'
import { Button } from '@/components/ui/button'
import { useConsult } from '@/lib/consult-context'
import { cn } from '@/lib/utils'

const SPECIALITIES = [
  'General Pediatrics',
  'Pediatric Pulmonology',
  'Pediatric Neurology',
  'Pediatric Gastroenterology',
  'Developmental Pediatrics',
]

export default function HomePage() {
  const router = useRouter()
  const {
    parentProfile,
    childProfiles,
    selectedChildId,
    setSelectedChildId,
    setFlowMode,
  } = useConsult()
  const selectedChild = childProfiles.find((child) => child.id === selectedChildId) ?? childProfiles[0]

  const startUrgent = () => {
    setFlowMode('urgent')
    router.push('/')
  }

  return (
    <PhoneFrame>
      <div className="sticky top-0 z-20 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="leading-tight">
            <p className="text-sm font-semibold text-foreground">PediSpectra</p>
            <p className="text-[11px] text-muted-foreground">
              {parentProfile.name ? `Hi, ${parentProfile.name}` : 'Family dashboard'}
            </p>
          </div>
          <StatusPill tone="success" icon={<ShieldCheck className="size-3.5" />}>
            Verified demo
          </StatusPill>
        </div>
      </div>

      <main className="flex flex-1 flex-col gap-5 px-5 py-5">
        <section className="space-y-3">
          <h1 className="text-balance text-2xl font-semibold leading-tight text-foreground">
            Choose care for your child
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Start with the assistant to find the right pediatrician or select a child profile and
            book from available doctors.
          </p>
        </section>

        <section className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Child profiles</h2>
            <button
              type="button"
              onClick={() => router.push('/profile')}
              className="text-xs font-medium text-primary underline-offset-4 hover:underline"
            >
              Manage
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {childProfiles.map((child) => {
              const active = selectedChild?.id === child.id
              return (
                <button
                  key={child.id}
                  type="button"
                  onClick={() => setSelectedChildId(child.id)}
                  className={cn(
                    'min-w-40 rounded-xl border p-3 text-left transition-colors',
                    active ? 'border-primary bg-primary/15' : 'border-border bg-card',
                  )}
                >
                  <span className="block text-sm font-semibold text-foreground">{child.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {child.ageValue} {child.ageUnit} - {child.sex}
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        <section className="rounded-xl border border-primary/30 bg-primary/10 p-4">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <MessageCircle className="size-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Guided speciality assistant</h2>
              <p className="text-xs text-muted-foreground">Recommended next build item</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Answer quick questions about symptoms, duration, language, and urgency. PediSpectra will
            recommend a subspeciality and available doctors.
          </p>
          <Button className="mt-4 h-11 w-full" onClick={() => router.push('/assistant')}>
            Start assistant
            <ArrowRight className="size-4" />
          </Button>
        </section>

        <section className="grid grid-cols-1 gap-2.5">
          <button
            type="button"
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left"
          >
            <Search className="size-5 text-primary" />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-foreground">Browse specialists</span>
              <span className="block text-xs text-muted-foreground">View pediatric subspecialities</span>
            </span>
            <ArrowRight className="size-4 text-muted-foreground" />
          </button>
          <button
            type="button"
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left"
          >
            <CalendarClock className="size-5 text-primary" />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-foreground">Book appointment</span>
              <span className="block text-xs text-muted-foreground">Scheduled consult flow comes next</span>
            </span>
            <ArrowRight className="size-4 text-muted-foreground" />
          </button>
          <button
            type="button"
            onClick={startUrgent}
            className="flex items-center gap-3 rounded-xl border border-danger/30 bg-danger/10 p-4 text-left"
          >
            <AlertTriangle className="size-5 text-danger" />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-danger">Need urgent consult?</span>
              <span className="block text-xs text-muted-foreground">Go to safety check and urgent queue</span>
            </span>
            <ArrowRight className="size-4 text-danger" />
          </button>
        </section>

        <section className="rounded-xl border border-border bg-card p-4">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
            <Stethoscope className="size-4 text-primary" />
            Demo specialities
          </h2>
          <div className="flex flex-wrap gap-2">
            {SPECIALITIES.map((item) => (
              <span key={item} className="rounded-lg border border-border bg-secondary px-3 py-2 text-xs text-muted-foreground">
                {item}
              </span>
            ))}
          </div>
        </section>
      </main>

      <ActionBar hint="Next: connect this home page to subspeciality matching and scheduling.">
        <Button size="lg" className="h-12 text-[15px]" disabled>
          Continue demo path soon
        </Button>
      </ActionBar>
    </PhoneFrame>
  )
}
