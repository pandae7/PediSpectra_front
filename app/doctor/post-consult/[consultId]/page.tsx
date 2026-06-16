'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, CheckCircle, FileText, Upload } from 'lucide-react'
import { useDoctor } from '@/lib/doctor-context'

export default function DoctorPostConsultPage() {
  const router = useRouter()
  const params = useParams()
  const consultId = params.consultId as string
  const { currentDoctor, consultations, completeConsultation, isLoading } = useDoctor()

  const [remarks, setRemarks] = useState('')
  const [fileName, setFileName] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const consult = consultations.find((c) => c.id === consultId)

  useEffect(() => {
    if (!isLoading && !currentDoctor) router.push('/login/doctor')
  }, [currentDoctor, isLoading, router])

  if (isLoading || !currentDoctor) return null

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setFileName(file.name)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!remarks.trim()) return

    completeConsultation(consultId, remarks)
    setSubmitted(true)

    setTimeout(() => {
      router.push('/doctor/dashboard')
    }, 2000)
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Consultation Complete</h2>
          <p className="mt-2 text-muted-foreground">Remarks saved. Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <button
          onClick={() => router.push('/doctor/dashboard')}
          className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>

        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-foreground">Post-Consultation Summary</h1>
            {consult && (
              <p className="mt-1 text-sm text-muted-foreground">
                Patient: {consult.childName} ({consult.patientName}) · {consult.subspeciality}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Remarks */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Final Remarks / Prescription Notes <span className="text-destructive">*</span>
              </label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                maxLength={5000}
                rows={6}
                placeholder="Write your consultation remarks, diagnosis, treatment plan, and any follow-up instructions..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {remarks.length}/5000 characters
              </p>
            </div>

            {/* File upload */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Upload Prescription (optional)
              </label>
              <div className="flex items-center gap-3">
                <label className="flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-border px-4 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                  <Upload className="h-4 w-4" />
                  Choose File
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
                {fileName && (
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <FileText className="h-4 w-4 text-primary" />
                    {fileName}
                  </div>
                )}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">PDF, JPG, or PNG up to 10 MB</p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!remarks.trim()}
              className="h-12 w-full rounded-xl bg-primary font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              Submit & Complete Consultation
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
