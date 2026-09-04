'use client'

import { useState, useEffect, Suspense } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, Check, Clock } from 'lucide-react'
import { getDoctors, initializeMockData, type DoctorProfile } from '@/lib/mock-data'
import { usePatient } from '@/lib/patient-context'
import { cn } from '@/lib/utils'

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function generateNext14Days() {
  const days: { date: Date; label: string; dayName: string }[] = []
  const today = new Date()
  for (let i = 1; i <= 14; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    days.push({
      date: d,
      label: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      dayName: DAYS_OF_WEEK[d.getDay()],
    })
  }
  return days
}

function BookingContent() {
  const params = useParams()
  const router = useRouter()
  const doctorId = params.doctorId as string
  const { currentPatient, isLoading: patientLoading } = usePatient()

  const [doctor, setDoctor] = useState<DoctorProfile | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const next14Days = generateNext14Days()

  useEffect(() => {
    initializeMockData()
    const docs = getDoctors()
    const found = docs.find((d) => d.id === doctorId)
    if (found) setDoctor(found)
  }, [doctorId])

  useEffect(() => {
    if (!patientLoading && !currentPatient) {
      router.replace(`/login/patient?returnTo=${encodeURIComponent(`/booking/${doctorId}`)}`)
    }
  }, [patientLoading, currentPatient, doctorId, router])

  if (patientLoading || !currentPatient) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!doctor) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Doctor not found.</p>
      </div>
    )
  }

  // Get available time slots for selected date
  const getTimeSlotsForDate = (date: Date) => {
    const dayName = DAYS_OF_WEEK[date.getDay()]
    return doctor.availability
      .filter((s) => s.day === dayName)
      .map((s) => s.time)
  }

  // Which dates have availability
  const datesWithSlots = next14Days.filter(
    (d) => getTimeSlotsForDate(d.date).length > 0
  )

  const availableTimesForSelected = selectedDate
    ? getTimeSlotsForDate(selectedDate)
    : []

  const handleProceedToPayment = () => {
    if (!selectedDate || !selectedTime) return
    const dateStr = selectedDate.toISOString().split('T')[0]
    router.push(
      `/booking/${doctorId}/payment?date=${dateStr}&time=${encodeURIComponent(selectedTime)}`
    )
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <button
          onClick={() => router.push(`/doctors/${doctorId}`)}
          className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to profile
        </button>

        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          {/* Doctor summary */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <span className="text-lg font-bold">
                {doctor.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{doctor.name}</h1>
              <p className="text-sm text-muted-foreground">
                {doctor.subspeciality} · ₹{doctor.fee} per consultation
              </p>
            </div>
          </div>

          {/* Step 1: Select date */}
          <div className="mb-6">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Calendar className="h-4 w-4 text-primary" />
              Select a Date (next 2 weeks)
            </h2>

            <div className="grid grid-cols-7 gap-2">
              {next14Days.map((day) => {
                const hasSlots = datesWithSlots.some(
                  (d) => d.date.toDateString() === day.date.toDateString()
                )
                const isSelected = selectedDate?.toDateString() === day.date.toDateString()

                return (
                  <button
                    key={day.date.toISOString()}
                    onClick={() => {
                      if (hasSlots) {
                        setSelectedDate(day.date)
                        setSelectedTime(null)
                      }
                    }}
                    disabled={!hasSlots}
                    className={cn(
                      'flex flex-col items-center rounded-lg border p-2 text-center transition-all',
                      isSelected
                        ? 'border-primary bg-primary/15 text-primary'
                        : hasSlots
                          ? 'border-border bg-background text-foreground hover:border-primary/50'
                          : 'border-border/50 bg-muted/30 text-muted-foreground opacity-50'
                    )}
                  >
                    <span className="text-[10px] uppercase">{day.dayName.slice(0, 3)}</span>
                    <span className="text-sm font-semibold">{day.date.getDate()}</span>
                    <span className="text-[10px]">
                      {day.date.toLocaleDateString('en-IN', { month: 'short' })}
                    </span>
                    {hasSlots && (
                      <div className="mt-1 h-1 w-1 rounded-full bg-primary" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Step 2: Select time */}
          {selectedDate && (
            <div className="mb-6">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                <Clock className="h-4 w-4 text-primary" />
                Available Slots for{' '}
                {selectedDate.toLocaleDateString('en-IN', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'short',
                })}
              </h2>

              {availableTimesForSelected.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {availableTimesForSelected.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={cn(
                        'rounded-lg border px-4 py-2 text-sm font-medium transition-all',
                        selectedTime === time
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border text-foreground hover:border-primary/50'
                      )}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No slots available on this date.
                </p>
              )}
            </div>
          )}

          {/* Confirm */}
          {selectedDate && selectedTime && (
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
              <div className="mb-3 flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium text-foreground">Booking Summary</p>
              </div>
              <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Doctor:</span>
                  <p className="font-medium text-foreground">{doctor.name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Subspeciality:</span>
                  <p className="font-medium text-foreground">{doctor.subspeciality}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Date:</span>
                  <p className="font-medium text-foreground">
                    {selectedDate.toLocaleDateString('en-IN', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Time:</span>
                  <p className="font-medium text-foreground">{selectedTime}</p>
                </div>
              </div>
              <button
                onClick={handleProceedToPayment}
                className="h-11 w-full rounded-lg bg-primary font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Proceed to Payment — ₹{doctor.fee}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-background"><p className="text-muted-foreground">Loading...</p></div>}>
      <BookingContent />
    </Suspense>
  )
}
