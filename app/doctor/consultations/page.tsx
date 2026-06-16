'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, Clock, X } from 'lucide-react'
import { useDoctor } from '@/lib/doctor-context'

export default function DoctorConsultationsPage() {
  const router = useRouter()
  const { currentDoctor, getUpcoming, reschedule, cancelConsultation, isLoading } = useDoctor()
  const [showCancel, setShowCancel] = useState<string | null>(null)
  const [showReschedule, setShowReschedule] = useState<string | null>(null)
  const [newDate, setNewDate] = useState('')
  const [newTime, setNewTime] = useState('')

  useEffect(() => {
    if (!isLoading && !currentDoctor) router.push('/login/doctor')
  }, [currentDoctor, isLoading, router])

  if (isLoading || !currentDoctor) return null

  const upcoming = getUpcoming()

  const handleReschedule = (consultId: string) => {
    if (newDate && newTime) {
      reschedule(consultId, newDate, newTime)
      setShowReschedule(null)
      setNewDate('')
      setNewTime('')
    }
  }

  const handleCancel = (consultId: string) => {
    cancelConsultation(consultId)
    setShowCancel(null)
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <button
          onClick={() => router.push('/doctor/dashboard')}
          className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>

        <h1 className="mb-6 text-2xl font-bold text-foreground">Upcoming Consultations</h1>

        {upcoming.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-medium text-foreground">No upcoming consultations</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Your schedule is clear. New bookings will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcoming.map((consult) => (
              <div key={consult.id} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-lg font-semibold text-foreground">{consult.childName}</p>
                    <p className="text-sm text-muted-foreground">
                      Parent: {consult.patientName} · {consult.subspeciality}
                    </p>
                    <div className="mt-2 flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1 text-foreground">
                        <Calendar className="h-4 w-4 text-primary" />
                        {consult.date}
                      </span>
                      <span className="flex items-center gap-1 text-foreground">
                        <Clock className="h-4 w-4 text-primary" />
                        {consult.time}
                      </span>
                    </div>
                  </div>
                  <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">
                    Upcoming
                  </span>
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-3 border-t border-border pt-4">
                  <button
                    onClick={() => setShowReschedule(consult.id)}
                    className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                  >
                    Reschedule
                  </button>
                  <button
                    onClick={() => setShowCancel(consult.id)}
                    className="rounded-lg border border-destructive/30 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                  >
                    Cancel
                  </button>
                  <a
                    href={`/doctor/consult-room/${consult.id}`}
                    className="ml-auto rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    Join Call
                  </a>
                </div>

                {/* Reschedule modal */}
                {showReschedule === consult.id && (
                  <div className="mt-4 rounded-lg border border-border bg-background p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">Reschedule to:</p>
                      <button onClick={() => setShowReschedule(null)} className="text-muted-foreground hover:text-foreground">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex gap-3">
                      <input
                        type="date"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="h-10 flex-1 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none"
                      />
                      <input
                        type="time"
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                        className="h-10 w-32 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none"
                      />
                      <button
                        onClick={() => handleReschedule(consult.id)}
                        disabled={!newDate || !newTime}
                        className="h-10 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-50"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                )}

                {/* Cancel confirmation */}
                {showCancel === consult.id && (
                  <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                    <p className="text-sm text-foreground">
                      Are you sure you want to cancel this consultation?
                    </p>
                    <div className="mt-3 flex gap-3">
                      <button
                        onClick={() => handleCancel(consult.id)}
                        className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-white"
                      >
                        Yes, Cancel
                      </button>
                      <button
                        onClick={() => setShowCancel(null)}
                        className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground"
                      >
                        Keep it
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
