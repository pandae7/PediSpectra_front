'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, FileText, History } from 'lucide-react'
import { useDoctor } from '@/lib/doctor-context'

export default function DoctorHistoryPage() {
  const router = useRouter()
  const { currentDoctor, getCompleted, isLoading } = useDoctor()

  useEffect(() => {
    if (!isLoading && !currentDoctor) router.push('/login/doctor')
  }, [currentDoctor, isLoading, router])

  if (isLoading || !currentDoctor) return null

  const completed = getCompleted()

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
            {completed.map((consult) => (
              <div key={consult.id} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-lg font-semibold text-foreground">{consult.childName}</p>
                    <p className="text-sm text-muted-foreground">
                      Parent: {consult.patientName} · {consult.subspeciality}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {consult.date} at {consult.time}
                    </p>
                  </div>
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                    Completed
                  </span>
                </div>

                {/* Post-consult remarks */}
                {consult.postConsultData && (
                  <div className="mt-4 rounded-lg border border-border bg-background p-3">
                    <div className="mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <FileText className="h-3 w-3" />
                      Remarks
                    </div>
                    <p className="text-sm text-foreground">
                      {(consult.postConsultData as { remarks?: string }).remarks || 'No remarks added.'}
                    </p>
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
