'use client'

import {
  ArrowLeft,
  Bell,
  CalendarCheck2,
  CalendarClock,
  ChevronRight,
  Clock3,
  MessageCircle,
  Paperclip,
  RefreshCcw,
  Stethoscope,
  Video,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { ActionBar } from '@/components/flow/action-bar'
import { PhoneFrame } from '@/components/flow/phone-frame'
import { StatusPill } from '@/components/flow/status-pill'
import { Button } from '@/components/ui/button'
import { useConsult } from '@/lib/consult-context'
import { formatINR } from '@/lib/mock-data'
import { SCHEDULED_DOCTORS } from '@/lib/scheduled-doctors'

export default function ConsultationsPage() {
  const router = useRouter()
  const [demoJoinEnabled, setDemoJoinEnabled] = useState(false)
  const {
    bookedSlot,
    childProfiles,
    preConsultHandoff,
    preConsultReady,
    selectedChildId,
  } = useConsult()

  const child = childProfiles.find((item) => item.id === selectedChildId) ?? childProfiles[0]
  const doctor = bookedSlot
    ? SCHEDULED_DOCTORS.find((item) => item.id === bookedSlot.doctorId)
    : null
  const slot = doctor?.slots.find((item) => item.id === bookedSlot?.slotId)

  if (!bookedSlot || !doctor || !slot) {
    return (
      <PhoneFrame>
        <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3">
            <button
              type="button"
              onClick={() => router.push('/home')}
              aria-label="Go back"
              className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
            </button>
            <div>
              <h1 className="text-sm font-semibold leading-tight text-foreground">Consultations</h1>
              <p className="text-xs text-muted-foreground">Scheduled appointments</p>
            </div>
          </div>
        </header>

        <main className="flex flex-1 flex-col justify-center px-5 py-8">
          <section className="rounded-xl border border-border bg-card p-5 text-center">
            <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
              <CalendarClock className="size-7" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">No consultation booked yet</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Start from the speciality assistant, select a doctor, and choose a slot.
            </p>
            <Button className="mt-5 h-11 w-full" onClick={() => router.push('/assistant')}>
              Start assistant
              <ChevronRight className="size-4" />
            </Button>
          </section>
        </main>
      </PhoneFrame>
    )
  }

  const attachedCount = preConsultHandoff.selectedDocuments.length

  return (
    <PhoneFrame>
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            type="button"
            onClick={() => router.push('/home')}
            aria-label="Go back"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-sm font-semibold leading-tight text-foreground">
              My consultations
            </h1>
            <p className="truncate text-xs text-muted-foreground">
              Upcoming appointment and handoff
            </p>
          </div>
          <StatusPill tone="success">Scheduled</StatusPill>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-5 px-5 py-5">
        <section className="rounded-xl border border-primary/30 bg-primary/10 p-4">
          <div className="mb-4 flex items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <CalendarCheck2 className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-foreground">Upcoming consultation</h2>
                <StatusPill tone="primary">{slot.label}</StatusPill>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {slot.day}, {slot.date} at {slot.time}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 border-t border-border pt-3 text-xs">
            <div>
              <p className="text-muted-foreground">Child</p>
              <p className="font-medium text-foreground">{child?.name ?? 'Selected child'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Fee</p>
              <p className="font-medium text-foreground">{formatINR(doctor.fee)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Doctor</p>
              <p className="font-medium text-foreground">{doctor.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Speciality</p>
              <p className="font-medium text-foreground">{doctor.speciality}</p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Stethoscope className="size-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Doctor handoff</h2>
            </div>
            <StatusPill tone={preConsultReady ? 'success' : 'warning'}>
              {preConsultReady ? 'Shared' : 'Pending'}
            </StatusPill>
          </div>

          <div className="space-y-3 text-sm">
            <div className="rounded-lg border border-border bg-secondary p-3">
              <p className="text-xs text-muted-foreground">Current condition</p>
              <p className="mt-1 leading-relaxed text-foreground">
                {preConsultHandoff.conditionUpdate || 'No condition update added yet.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <MiniFact label="Temperature" value={preConsultHandoff.temperature || 'Not added'} />
              <MiniFact label="Weight" value={preConsultHandoff.weightKg || 'Not added'} />
              <MiniFact label="Height" value={preConsultHandoff.heightCm || 'Not added'} />
              <MiniFact label="Allergies" value={preConsultHandoff.allergies || 'Not added'} />
            </div>

            <button
              type="button"
              onClick={() => router.push('/pre-consult')}
              className="flex w-full items-center justify-between rounded-xl border border-border bg-card p-3 text-left transition-colors hover:border-primary/40"
            >
              <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                <RefreshCcw className="size-4 text-primary" />
                Update condition
              </span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-2.5">
          <InfoRow
            icon={<Paperclip className="size-4 text-primary" />}
            title={`${attachedCount} records attached`}
            helper="Prescriptions, reports, and symptom photos selected in pre-consult"
          />
          <InfoRow
            icon={<Bell className="size-4 text-primary" />}
            title="Reminders planned"
            helper="WhatsApp reminder now, 1 hour before, and 10 minutes before the slot"
          />
          <InfoRow
            icon={<Clock3 className="size-4 text-primary" />}
            title={demoJoinEnabled ? 'Join button unlocked for demo' : 'Join button unlocks later'}
            helper={
              demoJoinEnabled
                ? 'Demo override is on, so this booking can enter the video room now'
                : 'For scheduled consults, joining can be enabled close to appointment time'
            }
          />
        </section>

        <section className="rounded-xl border border-dashed border-border bg-muted/30 p-4">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Demo controls
          </p>
          <label className="flex items-center justify-between gap-3 text-sm text-foreground">
            <span>Enable join button now</span>
            <input
              type="checkbox"
              checked={demoJoinEnabled}
              onChange={(event) => setDemoJoinEnabled(event.target.checked)}
              className="size-4 accent-primary"
            />
          </label>
        </section>

        <section className="rounded-xl border border-border bg-card p-4">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
            <MessageCircle className="size-4 text-primary" />
            WhatsApp link behavior
          </h2>
          <div className="space-y-2 text-xs leading-relaxed text-muted-foreground">
            <p>
              The confirmation and reminder link should open this consultation page directly after
              OTP/session validation.
            </p>
            <p>
              Later we can replace this demo state with a booking id route like
              <span className="font-mono text-foreground"> /consultations/PS-1042</span>.
            </p>
          </div>
        </section>
      </main>

      <ActionBar
        hint={
          demoJoinEnabled
            ? 'Demo override is active. This opens the scheduled video room.'
            : 'Video join is disabled for a later scheduled slot in this demo.'
        }
      >
        <Button
          size="lg"
          className="h-12 text-[15px]"
          disabled={!demoJoinEnabled}
          onClick={() => router.push('/consultation-room')}
        >
          <Video className="size-4" />
          {demoJoinEnabled ? 'Join video consult' : 'Join consultation later'}
        </Button>
      </ActionBar>
    </PhoneFrame>
  )
}

function MiniFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-secondary p-3">
      <p className="text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium text-foreground">{value}</p>
    </div>
  )
}

function InfoRow({
  icon,
  title,
  helper,
}: {
  icon: ReactNode
  title: string
  helper: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs leading-relaxed text-muted-foreground">{helper}</p>
      </div>
    </div>
  )
}
