'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, CheckCircle, FileText, Upload } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'

export default function PreConsultFormPage() {
  const router = useRouter()
  const params = useParams()
  const consultId = params.consultId as string

  const [form, setForm] = useState({
    chiefComplaint: '',
    duration: '',
    medications: '',
    allergies: '',
    vaccinationHistory: '',
    additionalNotes: '',
  })
  const [files, setFiles] = useState<{ name: string; size: string }[]>([])
  const [submitted, setSubmitted] = useState(false)

  const isValid = form.chiefComplaint.trim().length > 0 && form.duration.trim().length > 0

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files
    if (!selected) return
    const newFiles = Array.from(selected).map((f) => ({
      name: f.name,
      size: `${(f.size / 1024 / 1024).toFixed(1)} MB`,
    }))
    setFiles([...files, ...newFiles])
  }

  const removeFile = (name: string) => {
    setFiles(files.filter((f) => f.name !== name))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return

    // Save to localStorage
    try {
      localStorage.setItem(`pedispectra-preconsult-${consultId}`, JSON.stringify({
        ...form,
        files: files.map((f) => f.name),
        submittedAt: new Date().toISOString(),
      }))
    } catch {}

    setSubmitted(true)
    setTimeout(() => {
      router.push('/patient/consultations')
    }, 2000)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar showBack backHref="/patient/consultations" />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Pre-Consult Info Submitted</h2>
            <p className="mt-2 text-muted-foreground">Your doctor will review this before the consultation.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar showBack backHref="/patient/consultations" />

      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-foreground">Pre-Consultation Form</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Share details about your child's condition so the doctor can prepare for the consultation.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Chief Complaint */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Chief Complaint <span className="text-destructive">*</span>
              </label>
              <textarea
                value={form.chiefComplaint}
                onChange={(e) => setForm({ ...form, chiefComplaint: e.target.value })}
                rows={3}
                maxLength={2000}
                placeholder="What is the main concern? e.g., Fever and cough since 3 days, not eating well..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Duration <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                placeholder="e.g., Since 3 days, Started last week"
                className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Medications */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Current Medications
              </label>
              <textarea
                value={form.medications}
                onChange={(e) => setForm({ ...form, medications: e.target.value })}
                rows={2}
                maxLength={1000}
                placeholder="Any medicines already given? e.g., Paracetamol 250mg twice daily, Cough syrup..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Allergies */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Known Allergies
              </label>
              <input
                type="text"
                value={form.allergies}
                onChange={(e) => setForm({ ...form, allergies: e.target.value })}
                placeholder="e.g., Penicillin allergy, No known allergies"
                className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Vaccination History */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Vaccination History
              </label>
              <textarea
                value={form.vaccinationHistory}
                onChange={(e) => setForm({ ...form, vaccinationHistory: e.target.value })}
                rows={2}
                maxLength={1000}
                placeholder="e.g., All vaccines up to date as per IAP schedule, Missed MMR booster..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Additional Notes */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Additional Notes
              </label>
              <textarea
                value={form.additionalNotes}
                onChange={(e) => setForm({ ...form, additionalNotes: e.target.value })}
                rows={2}
                maxLength={2000}
                placeholder="Anything else the doctor should know? e.g., Child is anxious during video calls..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Upload Documents
              </label>
              <p className="mb-2 text-xs text-muted-foreground">
                Previous prescriptions, lab reports, or photos of symptoms. PDF/JPG/PNG, max 10 MB each.
              </p>
              <label className="flex h-10 w-fit cursor-pointer items-center gap-2 rounded-lg border border-border px-4 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                <Upload className="h-4 w-4" />
                Choose Files
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
              {files.length > 0 && (
                <div className="mt-3 space-y-2">
                  {files.map((file) => (
                    <div key={file.name} className="flex items-center justify-between rounded-lg border border-border bg-background p-2.5">
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="text-foreground">{file.name}</span>
                        <span className="text-xs text-muted-foreground">{file.size}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(file.name)}
                        className="text-xs text-destructive hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!isValid}
              className="h-12 w-full rounded-xl bg-primary font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              Submit Pre-Consult Info
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
