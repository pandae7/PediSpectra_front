'use client'

import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  FileText,
  Mic,
  MicOff,
  MoreHorizontal,
  PhoneOff,
  ShieldCheck,
  Stethoscope,
  Video,
  VideoOff,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { ActionBar } from '@/components/flow/action-bar'
import { PhoneFrame } from '@/components/flow/phone-frame'
import { StatusPill } from '@/components/flow/status-pill'
import { Button } from '@/components/ui/button'
import { useConsult } from '@/lib/consult-context'
import { SCHEDULED_DOCTORS } from '@/lib/scheduled-doctors'
import { cn } from '@/lib/utils'

export default function ConsultationRoomPage() {
  const router = useRouter()
  const [micOn, setMicOn] = useState(true)
  const [cameraOn, setCameraOn] = useState(true)
  const {
    bookedSlot,
    childProfiles,
    preConsultHandoff,
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
              onClick={() => router.push('/consultations')}
              aria-label="Go back"
              className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
            </button>
            <div>
              <h1 className="text-sm font-semibold leading-tight text-foreground">Video consult</h1>
              <p className="text-xs text-muted-foreground">No active booking found</p>
            </div>
          </div>
        </header>

        <main className="flex flex-1 flex-col justify-center px-5 py-8">
          <section className="rounded-xl border border-border bg-card p-5 text-center">
            <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
              <Video className="size-7" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">No video room available</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Book a consultation first, then use the consultations page to join.
            </p>
            <Button className="mt-5 h-11 w-full" onClick={() => router.push('/consultations')}>
              Back to consultations
            </Button>
          </section>
        </main>
      </PhoneFrame>
    )
  }

  return (
    <PhoneFrame>
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            type="button"
            onClick={() => router.push('/consultations')}
            aria-label="Go back"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-sm font-semibold leading-tight text-foreground">
              Video consultation
            </h1>
            <p className="truncate text-xs text-muted-foreground">
              {doctor.name} - {doctor.speciality}
            </p>
          </div>
          <StatusPill tone="success">Live demo</StatusPill>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-5 px-5 py-5">
        <section className="relative overflow-hidden rounded-2xl border border-border bg-card">
          <div className="flex aspect-[9/13] flex-col justify-between bg-[radial-gradient(circle_at_top,#244d43,transparent_42%),linear-gradient(180deg,#13231f,#07110f)] p-4">
            <div className="flex items-center justify-between">
              <StatusPill tone="success" icon={<ShieldCheck className="size-3.5" />}>
                Secure room
              </StatusPill>
              <span className="rounded-full bg-background/70 px-2.5 py-1 font-mono text-xs text-foreground">
                00:42
              </span>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <span
                className="flex size-28 items-center justify-center rounded-full text-3xl font-semibold text-primary-foreground shadow-2xl"
                style={{ backgroundColor: doctor.avatarColor }}
                aria-hidden="true"
              >
                {doctor.initials}
              </span>
              <h2 className="mt-4 text-xl font-semibold text-white">{doctor.name}</h2>
              <p className="mt-1 text-sm text-white/70">{doctor.qualification}</p>
              <div className="mt-3 flex items-center gap-2 rounded-full bg-black/25 px-3 py-1.5 text-xs text-white/80">
                <CheckCircle2 className="size-3.5 text-primary" />
                Connected with parent
              </div>
            </div>

            <div className="flex items-end justify-between gap-3">
              <div className="rounded-xl border border-white/10 bg-black/30 p-3 text-xs text-white/80">
                <p className="text-white/50">Consult for</p>
                <p className="font-medium text-white">{child?.name ?? 'Selected child'}</p>
              </div>
              <div className="flex aspect-[3/4] w-24 flex-col items-center justify-center rounded-xl border border-white/10 bg-black/40 text-white/70">
                {cameraOn ? (
                  <>
                    <Camera className="mb-1 size-5" />
                    <span className="text-[11px]">You</span>
                  </>
                ) : (
                  <>
                    <VideoOff className="mb-1 size-5" />
                    <span className="text-[11px]">Camera off</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-3 gap-2.5">
          <RoomControl active={micOn} onClick={() => setMicOn((value) => !value)}>
            {micOn ? <Mic className="size-5" /> : <MicOff className="size-5" />}
            <span>{micOn ? 'Mute' : 'Unmute'}</span>
          </RoomControl>
          <RoomControl active={cameraOn} onClick={() => setCameraOn((value) => !value)}>
            {cameraOn ? <Video className="size-5" /> : <VideoOff className="size-5" />}
            <span>{cameraOn ? 'Camera' : 'Camera off'}</span>
          </RoomControl>
          <RoomControl active>
            <MoreHorizontal className="size-5" />
            <span>More</span>
          </RoomControl>
        </section>

        <section className="rounded-xl border border-border bg-card p-4">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
            <FileText className="size-4 text-primary" />
            Shared with doctor
          </h2>
          <div className="space-y-3 text-sm">
            <div className="rounded-lg border border-border bg-secondary p-3">
              <p className="text-xs text-muted-foreground">Current condition</p>
              <p className="mt-1 leading-relaxed text-foreground">
                {preConsultHandoff.conditionUpdate || 'No condition update added.'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <MiniFact label="Slot" value={`${slot.day}, ${slot.time}`} />
              <MiniFact label="Records" value={`${preConsultHandoff.selectedDocuments.length} attached`} />
              <MiniFact label="Temperature" value={preConsultHandoff.temperature || 'Not added'} />
              <MiniFact label="Weight" value={preConsultHandoff.weightKg || 'Not added'} />
            </div>
          </div>
        </section>
      </main>

      <ActionBar hint="Demo room only. Real video provider integration can come later.">
        <Button
          size="lg"
          variant="destructive"
          className="h-12 text-[15px]"
          onClick={() => router.push('/consultations')}
        >
          <PhoneOff className="size-4" />
          End demo call
        </Button>
      </ActionBar>
    </PhoneFrame>
  )
}

function RoomControl({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick?: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex h-16 flex-col items-center justify-center gap-1 rounded-xl border text-xs font-medium transition-colors',
        active
          ? 'border-border bg-card text-foreground'
          : 'border-danger/30 bg-danger/10 text-danger',
      )}
    >
      {children}
    </button>
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
