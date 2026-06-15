'use client'

import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  IndianRupee,
  Languages,
  Star,
  Stethoscope,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ActionBar } from '@/components/flow/action-bar'
import { PhoneFrame } from '@/components/flow/phone-frame'
import { StatusPill } from '@/components/flow/status-pill'
import { Button } from '@/components/ui/button'
import { useConsult } from '@/lib/consult-context'
import {
  getDoctorsForSpeciality,
  SCHEDULED_DOCTORS,
  type DoctorSlot,
  type ScheduledDoctor,
} from '@/lib/scheduled-doctors'
import { formatINR } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export default function DoctorsPage() {
  const router = useRouter()
  const {
    bookedSlot,
    childProfiles,
    recommendedSpeciality,
    selectedChildId,
    setBookedSlot,
  } = useConsult()
  const child = childProfiles.find((item) => item.id === selectedChildId) ?? childProfiles[0]
  const doctors = useMemo(() => {
    const exactMatches = getDoctorsForSpeciality(recommendedSpeciality)
    return exactMatches.length > 0 ? exactMatches : SCHEDULED_DOCTORS.filter((doctor) => doctor.speciality === 'General Pediatrics')
  }, [recommendedSpeciality])

  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0]?.id ?? '')
  const selectedDoctor = doctors.find((doctor) => doctor.id === selectedDoctorId) ?? doctors[0]
  const [selectedSlotId, setSelectedSlotId] = useState(selectedDoctor?.slots[0]?.id ?? '')
  const selectedSlot = selectedDoctor?.slots.find((slot) => slot.id === selectedSlotId) ?? selectedDoctor?.slots[0]

  const selectDoctor = (doctor: ScheduledDoctor) => {
    setSelectedDoctorId(doctor.id)
    setSelectedSlotId(doctor.slots[0]?.id ?? '')
  }

  const confirmBooking = () => {
    if (!selectedDoctor || !selectedSlot) return
    setBookedSlot({
      doctorId: selectedDoctor.id,
      slotId: selectedSlot.id,
      speciality: selectedDoctor.speciality,
    })
  }

  const bookedDoctor = bookedSlot
    ? SCHEDULED_DOCTORS.find((doctor) => doctor.id === bookedSlot.doctorId)
    : null
  const confirmedSlot = bookedDoctor?.slots.find((slot) => slot.id === bookedSlot?.slotId)

  return (
    <PhoneFrame>
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            type="button"
            onClick={() => router.push('/assistant')}
            aria-label="Go back"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-sm font-semibold leading-tight text-foreground">
              Select doctor and slot
            </h1>
            <p className="truncate text-xs text-muted-foreground">
              {recommendedSpeciality ?? 'Recommended speciality'}
            </p>
          </div>
          <StatusPill tone="primary">{doctors.length} doctors</StatusPill>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-5 px-5 py-5">
        {bookedDoctor && confirmedSlot ? (
          <BookingConfirmed
            childName={child?.name}
            doctor={bookedDoctor}
            slot={confirmedSlot}
            onBackHome={() => router.push('/home')}
          />
        ) : (
          <>
            <section className="rounded-xl border border-primary/30 bg-primary/10 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Stethoscope className="size-5 text-primary" />
                <h2 className="text-base font-semibold text-foreground">
                  Matching by recommended subspeciality
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Showing doctors for {recommendedSpeciality ?? 'the recommended speciality'}.
                Availability, language, and deeper ranking can be added later.
              </p>
              {child ? (
                <p className="mt-3 rounded-lg border border-border bg-secondary px-3 py-2 text-xs text-muted-foreground">
                  Booking for <span className="font-medium text-foreground">{child.name}</span>
                </p>
              ) : null}
            </section>

            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-foreground">Available doctors</h2>
              {doctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  active={selectedDoctor?.id === doctor.id}
                  onClick={() => selectDoctor(doctor)}
                />
              ))}
            </section>

            {selectedDoctor ? (
              <section className="space-y-3">
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Choose slot</h2>
                  <p className="text-xs text-muted-foreground">
                    {selectedDoctor.name} - {selectedDoctor.speciality}
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-2.5">
                  {selectedDoctor.slots.map((slot) => (
                    <SlotButton
                      key={slot.id}
                      slot={slot}
                      active={selectedSlotId === slot.id}
                      onClick={() => setSelectedSlotId(slot.id)}
                    />
                  ))}
                </div>
              </section>
            ) : null}
          </>
        )}
      </main>

      {bookedDoctor && confirmedSlot ? (
        <ActionBar hint="Next, update the child's condition for the doctor.">
          <Button size="lg" className="h-12 text-[15px]" onClick={() => router.push('/pre-consult')}>
            Prepare for consult
            <ChevronRight className="size-4" />
          </Button>
        </ActionBar>
      ) : (
        <ActionBar
          hint={
            selectedDoctor && selectedSlot
              ? `${formatINR(selectedDoctor.fee)} consultation fee - payment screen comes next`
              : 'Select a doctor and slot to continue.'
          }
        >
          <Button
            size="lg"
            className="h-12 text-[15px]"
            disabled={!selectedDoctor || !selectedSlot}
            onClick={confirmBooking}
          >
            Confirm slot
            <ChevronRight className="size-4" />
          </Button>
        </ActionBar>
      )}
    </PhoneFrame>
  )
}

function DoctorCard({
  doctor,
  active,
  onClick,
}: {
  doctor: ScheduledDoctor
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full rounded-xl border p-4 text-left transition-colors',
        active ? 'border-primary bg-primary/15' : 'border-border bg-card hover:border-primary/40',
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className="flex size-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-primary-foreground"
          style={{ backgroundColor: doctor.avatarColor }}
          aria-hidden="true"
        >
          {doctor.initials}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-foreground">{doctor.name}</span>
          <span className="block text-xs leading-relaxed text-muted-foreground">{doctor.qualification}</span>
          <span className="mt-2 flex flex-wrap gap-1.5">
            {doctor.tags.map((tag) => (
              <span key={tag} className="rounded-md bg-secondary px-2 py-1 text-[11px] text-muted-foreground">
                {tag}
              </span>
            ))}
          </span>
        </span>
        {active ? <CheckCircle2 className="size-5 shrink-0 text-primary" /> : null}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border pt-3 text-xs">
        <span className="flex items-center gap-1 text-muted-foreground">
          <Star className="size-3.5 text-warning" />
          {doctor.rating}
        </span>
        <span className="text-muted-foreground">{doctor.experienceYears} yrs</span>
        <span className="flex items-center justify-end gap-1 text-foreground">
          <IndianRupee className="size-3.5" />
          {doctor.fee}
        </span>
      </div>
      <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Languages className="size-3.5 text-primary" />
        {doctor.languages.join(', ')}
      </div>
    </button>
  )
}

function SlotButton({
  slot,
  active,
  onClick,
}: {
  slot: DoctorSlot
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center justify-between rounded-xl border p-3.5 text-left transition-colors',
        active ? 'border-primary bg-primary/15' : 'border-border bg-card hover:border-primary/40',
      )}
    >
      <span>
        <span className="block text-sm font-semibold text-foreground">
          {slot.day}, {slot.date}
        </span>
        <span className="block text-xs text-muted-foreground">{slot.time}</span>
      </span>
      <StatusPill tone={slot.label === 'Earliest' ? 'success' : 'neutral'}>{slot.label}</StatusPill>
    </button>
  )
}

function BookingConfirmed({
  childName,
  doctor,
  slot,
  onBackHome,
}: {
  childName?: string
  doctor: ScheduledDoctor
  slot: DoctorSlot
  onBackHome: () => void
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="rounded-xl border border-success/30 bg-success/10 p-5 text-center">
        <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-success/20">
          <CheckCircle2 className="size-7 text-success" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Slot held for demo</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          This confirms the selected doctor and time. Payment and reminder flow can come next.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-xs text-muted-foreground">Doctor</p>
        <p className="mt-1 text-sm font-semibold text-foreground">{doctor.name}</p>
        <p className="text-xs text-muted-foreground">{doctor.speciality}</p>
        <div className="mt-3 grid grid-cols-2 gap-3 border-t border-border pt-3 text-xs">
          <div>
            <p className="text-muted-foreground">Child</p>
            <p className="font-medium text-foreground">{childName ?? 'Selected child'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Fee</p>
            <p className="font-medium text-foreground">{formatINR(doctor.fee)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Date</p>
            <p className="font-medium text-foreground">
              {slot.day}, {slot.date}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Time</p>
            <p className="font-medium text-foreground">{slot.time}</p>
          </div>
        </div>
      </div>

      <Button variant="outline" className="h-11" onClick={onBackHome}>
        Back to family home
      </Button>
    </section>
  )
}
