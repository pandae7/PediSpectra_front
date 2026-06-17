'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Bell, Calendar, Clock, FileText, Video } from 'lucide-react'
import { getConsultations, getDoctors, initializeMockData, type Consultation, type DoctorProfile } from '@/lib/mock-data'

export default function PatientConsultationsPage() {
  const router = useRouter()
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [doctors, setDoctors] = useState<DoctorProfile[]>([])

  useEffect(() => {
    initializeMockData()
    setConsultations(getConsultations())
    setDoctors(getDoctors())
  }, [])

  const upcoming = consultations
    .filter((c) => c.status === 'upcoming')
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))

  const completed = consultations
    .filter((c) => c.status === 'completed')
    .sort((a, b) => b.date.localeCompare(a.date))

  const getDoctorName = (doctorId: string) => {
    const doc = doctors.find((d) => d.id === doctorId)
    return doc?.name || 'Doctor'
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <button
          onClick={() => router.push('/')}
          className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </button>

        <h1 className="mb-6 text-2xl font-bold text-foreground">My Consultations</h1>

        {/* Upcoming */}
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Upcoming</h2>

          {upcoming.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-6 text-center">
              <Calendar className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-3 font-medium text-foreground">No upcoming consultations</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Browse doctors and book your first consultation.
              </p>
              <a
                href="/doctors"
                className="mt-4 inline-block rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground"
              >
                Find a Doctor
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {upcoming.map((consult) => (
                <div key={consult.id} className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-foreground">
                        {getDoctorName(consult.doctorId)}
                      </p>
                      <p className="text-sm text-muted-foreground">{consult.subspeciality}</p>
                      <div className="mt-2 flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1 text-foreground">
                          <Calendar className="h-4 w-4 text-primary" />
                          {new Date(consult.date + 'T00:00:00').toLocaleDateString('en-IN', {
                            weekday: 'short', day: 'numeric', month: 'short'
                          })}
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
                  <div className="mt-4 flex flex-wrap gap-3 border-t border-border pt-4">
                    <a
                      href={`/patient/pre-consult/${consult.id}`}
                      className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-accent"
                    >
                      <FileText className="h-4 w-4 text-primary" />
                      Fill Pre-Consult Info
                    </a>
                    <button
                      className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-accent"
                    >
                      <Bell className="h-4 w-4 text-primary" />
                      Send WhatsApp Reminder
                    </button>
                    <a
                      href={`/patient/consult-room/${consult.id}`}
                      className="ml-auto flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                    >
                      <Video className="h-4 w-4" />
                      Join Call
                    </a>
                  </div>

                  {/* Reminder text */}
                  <p className="mt-3 text-xs text-muted-foreground">
                    💡 A reminder will be sent 1 hour before your consultation. Please fill the
                    pre-consult form before the appointment so the doctor can review your child's
                    information.
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Completed */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-foreground">Completed</h2>

          {completed.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-6 text-center">
              <p className="text-sm text-muted-foreground">No completed consultations yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {completed.map((consult) => (
                <div key={consult.id} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">
                        {getDoctorName(consult.doctorId)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {consult.subspeciality} · {new Date(consult.date + 'T00:00:00').toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </p>
                    </div>
                    <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                      Completed
                    </span>
                  </div>
                  {consult.postConsultData && (
                    <div className="mt-3 rounded-lg border border-border bg-background p-3">
                      <p className="mb-1 text-xs font-medium text-muted-foreground">Doctor's Remarks</p>
                      <p className="whitespace-pre-line text-xs text-foreground">
                        {(consult.postConsultData as { remarks?: string }).remarks?.slice(0, 200)}
                        {((consult.postConsultData as { remarks?: string }).remarks?.length || 0) > 200 && '...'}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
