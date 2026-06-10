'use client'

import {
  CalendarClock,
  CheckCircle2,
  Download,
  FileText,
  Home,
  Pill,
  RotateCcw,
  Stethoscope,
  TriangleAlert,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ActionBar } from '@/components/flow/action-bar'
import { FlowHeader } from '@/components/flow/flow-header'
import { PhoneFrame } from '@/components/flow/phone-frame'
import { StatusPill } from '@/components/flow/status-pill'
import { Button } from '@/components/ui/button'
import { useConsult } from '@/lib/consult-context'
import { useStepGuard } from '@/lib/use-step-guard'

const PRESCRIPTION = [
  {
    name: 'Paracetamol (Calpol) 250mg/5ml',
    dose: '7.5 ml every 6 hours if fever above 100.4°F',
    duration: 'Up to 3 days',
  },
  {
    name: 'ORS solution',
    dose: 'Small sips after each loose stool',
    duration: 'Until hydrated',
  },
]

const ADVICE = [
  'Offer fluids frequently in small amounts to prevent dehydration.',
  'Light, easily digestible meals. Continue breastfeeding if applicable.',
  'Monitor temperature every 4–6 hours and note any spikes.',
  'Rest at home; avoid school/daycare for 48 hours.',
]

const WATCH_OUT = [
  'Fever above 102°F that does not come down with medicine',
  'Refusing all fluids or no urine for 8+ hours',
  'Fast or laboured breathing, or any of the emergency signs',
]

export default function SummaryPage() {
  const allowed = useStepGuard('summary')
  const router = useRouter()
  const { intake, matchedDoctor, phone, reset } = useConsult()

  if (!allowed) return null

  const doctor = matchedDoctor
  const today = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  const startOver = () => {
    reset()
    router.push('/')
  }

  return (
    <PhoneFrame>
      <FlowHeader
        title="Consultation summary"
        subtitle="Step 6 of 6 · Visit complete"
        currentStep="summary"
      />

      <main className="flex flex-1 flex-col gap-4 px-5 py-5">
        {/* Completed banner */}
        <section className="flex items-center gap-3 rounded-xl border border-success/30 bg-success/10 p-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-success/20">
            <CheckCircle2 className="size-5 text-success" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-foreground">Consult completed</p>
            <p className="text-xs text-muted-foreground">
              {today} · Summary sent to +91 {phone || '•••• •••• ••'}
            </p>
          </div>
        </section>

        {/* Doctor + patient */}
        <section className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            {doctor ? (
              <span
                className="flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-primary-foreground"
                style={{ backgroundColor: doctor.avatarColor }}
                aria-hidden="true"
              >
                {doctor.initials}
              </span>
            ) : (
              <span className="flex size-11 items-center justify-center rounded-full bg-muted">
                <Stethoscope className="size-5 text-muted-foreground" />
              </span>
            )}
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-sm font-medium text-foreground">
                {doctor?.name ?? 'Pediatrician'}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {doctor?.qualification ?? 'General Pediatrics'}
              </p>
            </div>
            <StatusPill tone="neutral">Seen</StatusPill>
          </div>
          <dl className="mt-3 grid grid-cols-2 gap-3 border-t border-border pt-3 text-xs">
            <div>
              <dt className="text-muted-foreground">Patient</dt>
              <dd className="font-medium text-foreground">{intake.childName || 'Child'}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Age</dt>
              <dd className="font-medium text-foreground">
                {intake.ageValue ? `${intake.ageValue} ${intake.ageUnit}` : '—'}
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="text-muted-foreground">Reported concern</dt>
              <dd className="font-medium text-foreground">{intake.symptoms || '—'}</dd>
            </div>
          </dl>
        </section>

        {/* Assessment */}
        <Section icon={<FileText className="size-4 text-primary" />} title="Assessment">
          <p className="text-sm leading-relaxed text-foreground">
            Likely viral fever with mild throat congestion. No red-flag signs observed during the
            video consult. Suitable for home management with monitoring.
          </p>
        </Section>

        {/* Prescription */}
        <Section icon={<Pill className="size-4 text-primary" />} title="Prescription">
          <ul className="flex flex-col gap-3">
            {PRESCRIPTION.map((rx) => (
              <li key={rx.name} className="border-b border-border pb-3 last:border-0 last:pb-0">
                <p className="text-sm font-medium text-foreground">{rx.name}</p>
                <p className="text-xs text-muted-foreground">{rx.dose}</p>
                <p className="text-xs text-muted-foreground">Duration: {rx.duration}</p>
              </li>
            ))}
          </ul>
        </Section>

        {/* Home care advice */}
        <Section icon={<Home className="size-4 text-primary" />} title="Home care advice">
          <ul className="flex flex-col gap-2">
            {ADVICE.map((tip) => (
              <li key={tip} className="flex gap-2 text-sm leading-relaxed text-foreground">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                {tip}
              </li>
            ))}
          </ul>
        </Section>

        {/* When to seek emergency care */}
        <section className="rounded-xl border border-danger/30 bg-danger/10 p-4">
          <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-danger">
            <TriangleAlert className="size-4" />
            Go to emergency if you notice
          </h3>
          <ul className="flex flex-col gap-2">
            {WATCH_OUT.map((sign) => (
              <li key={sign} className="flex gap-2 text-sm leading-relaxed text-foreground">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-danger" />
                {sign}
              </li>
            ))}
          </ul>
        </section>

        {/* Follow up */}
        <section className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
          <CalendarClock className="size-5 shrink-0 text-muted-foreground" />
          <p className="text-sm leading-relaxed text-foreground">
            Follow up in <span className="font-medium">48 hours</span> if symptoms persist. A free
            follow-up consult is included.
          </p>
        </section>

        <Button variant="outline" size="lg" className="h-11 w-full">
          <Download className="size-4" />
          Download prescription (PDF)
        </Button>

        <button
          type="button"
          onClick={startOver}
          className="mx-auto mt-1 flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <RotateCcw className="size-3.5" />
          Start a new consultation
        </button>
      </main>

      <ActionBar hint="Your summary is saved to your PediSpectra account.">
        <Button size="lg" className="h-12 text-[15px]" onClick={() => router.push('/')}>
          Done
        </Button>
      </ActionBar>
    </PhoneFrame>
  )
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-4">
      <h3 className="mb-2.5 flex items-center gap-1.5 text-sm font-semibold text-foreground">
        {icon}
        {title}
      </h3>
      {children}
    </section>
  )
}
