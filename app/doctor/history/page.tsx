'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Bell, Calendar, Edit, FileText, History, Save, X } from 'lucide-react'
import { useDoctor } from '@/lib/doctor-context'
import { Navbar } from '@/components/layout/navbar'

export default function DoctorHistoryPage() {
  const router = useRouter()
  const { currentDoctor, getCompleted, completeConsultation, isLoading } = useDoctor()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editRemarks, setEditRemarks] = useState('')
  const [followUpSent, setFollowUpSent] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!isLoading && !currentDoctor) router.push('/login/doctor')
  }, [currentDoctor, isLoading, router])

  if (isLoading || !currentDoctor) return null

  const completed = getCompleted()

  const startEdit = (consultId: string, currentRemarks: string) => {
    setEditingId(consultId)
    setEditRemarks(currentRemarks)
  }

  const saveEdit = (consultId: string) => {
    if (editRemarks.trim()) {
      completeConsultation(consultId, editRemarks)
    }
    setEditingId(null)
    setEditRemarks('')
  }

  const sendFollowUpReminder = (consultId: string) => {
    setFollowUpSent((prev) => new Set([...prev, consultId]))
    // In real app, this would trigger an email/WhatsApp to the patient
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar showBack backHref="/doctor/dashboard" />

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <h1 className="mb-6 text-2xl font-bold text-foreground">Patient History</h1>

        {completed.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <History className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-medium text-foreground">No completed consultations</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Your consultation history will appear here after you complete appointments.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {completed.map((consult) => {
              const remarks = (consult.postConsultData as { remarks?: string })?.remarks || ''
              const isEditing = editingId === consult.id
              const reminderSent = followUpSent.has(consult.id)

              return (
                <div key={consult.id} className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-lg font-semibold text-foreground">{consult.childName}</p>
                      <p className="text-sm text-muted-foreground">
                        Parent: {consult.patientName} · {consult.subspeciality}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {new Date(consult.date + 'T00:00:00').toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })} at {consult.time}
                      </p>
                    </div>
                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                      Completed
                    </span>
                  </div>

                  {/* Remarks — view or edit mode */}
                  <div className="mt-4 rounded-lg border border-border bg-background p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                        <FileText className="h-3 w-3" />
                        Consultation Remarks
                      </div>
                      {!isEditing && (
                        <button
                          onClick={() => startEdit(consult.id, remarks)}
                          className="flex items-center gap-1 rounded px-2 py-1 text-xs text-primary hover:bg-primary/10"
                        >
                          <Edit className="h-3 w-3" />
                          Edit
                        </button>
                      )}
                    </div>

                    {isEditing ? (
                      <div>
                        <textarea
                          value={editRemarks}
                          onChange={(e) => setEditRemarks(e.target.value)}
                          rows={5}
                          className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                        />
                        <div className="mt-2 flex gap-2">
                          <button
                            onClick={() => saveEdit(consult.id)}
                            className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
                          >
                            <Save className="h-3 w-3" />
                            Save Changes
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground"
                          >
                            <X className="h-3 w-3" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="whitespace-pre-line text-sm text-foreground">
                        {remarks || 'No remarks added.'}
                      </p>
                    )}
                  </div>

                  {/* Actions: Follow-up */}
                  <div className="mt-4 flex flex-wrap gap-3 border-t border-border pt-4">
                    <a
                      href={`/doctor/consultation/${consult.id}`}
                      className="rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground hover:bg-muted"
                    >
                      View Full Details
                    </a>
                    {reminderSent ? (
                      <span className="flex items-center gap-1 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-xs text-primary">
                        <Bell className="h-3 w-3" />
                        Follow-up Reminder Sent
                      </span>
                    ) : (
                      <button
                        onClick={() => sendFollowUpReminder(consult.id)}
                        className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground hover:bg-muted"
                      >
                        <Bell className="h-3 w-3 text-primary" />
                        Send Follow-up Reminder
                      </button>
                    )}
                    <a
                      href={`/booking/${consult.doctorId}?patient=${encodeURIComponent(consult.childName)}`}
                      className="flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground"
                    >
                      <Calendar className="h-3 w-3" />
                      Book Follow-up
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
