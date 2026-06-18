'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CheckCircle, Stethoscope } from 'lucide-react'
import { useDoctor } from '@/lib/doctor-context'
import { SUBSPECIALITIES } from '@/lib/mock-data'

export default function DoctorOnboardingPage() {
  const router = useRouter()
  const { onboardDoctor } = useDoctor()

  const [form, setForm] = useState({
    name: '',
    subspeciality: '',
    yearsExperience: '',
    pgCollege: '',
    workingHospital: '',
    fee: '',
    city: '',
    languages: '',
  })

  const [submitted, setSubmitted] = useState(false)

  const isValid =
    form.name.trim().length > 0 &&
    form.subspeciality.length > 0 &&
    form.yearsExperience.length > 0 &&
    Number(form.yearsExperience) >= 0 &&
    Number(form.yearsExperience) <= 60 &&
    form.pgCollege.trim().length > 0 &&
    form.workingHospital.trim().length > 0 &&
    form.fee.trim().length > 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return

    const newDoctor = {
      id: `dr-${Date.now()}`,
      name: form.name.startsWith('Dr.') ? form.name : `Dr. ${form.name}`,
      subspeciality: form.subspeciality,
      yearsExperience: Number(form.yearsExperience),
      pgCollege: form.pgCollege,
      workingHospital: form.workingHospital,
      fee: Number(form.fee),
      rating: 4.5,
      consultationCount: 0,
      languages: form.languages.split(',').map((l) => l.trim()).filter(Boolean),
      city: form.city || 'Online',
      bio: '',
      availability: [],
    }

    onboardDoctor(newDoctor)
    setSubmitted(true)

    setTimeout(() => {
      router.push('/doctor/dashboard')
    }, 1500)
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Welcome aboard!</h2>
          <p className="mt-2 text-muted-foreground">Redirecting to your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <button
          onClick={() => router.push('/')}
          className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </button>

        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Stethoscope className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Doctor Onboarding</h1>
              <p className="text-sm text-muted-foreground">Create your professional profile</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Full Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                maxLength={100}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Dr. Priya Sharma"
                className="h-11 w-full rounded-lg border border-border bg-background px-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Subspeciality */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Subspeciality <span className="text-destructive">*</span>
              </label>
              <select
                value={form.subspeciality}
                onChange={(e) => setForm({ ...form, subspeciality: e.target.value })}
                className="h-11 w-full rounded-lg border border-border bg-background px-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Select subspeciality...</option>
                {SUBSPECIALITIES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Years of Experience + Fee */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Years of Experience <span className="text-destructive">*</span>
                </label>
                <input
                  type="number"
                  min={0}
                  max={60}
                  value={form.yearsExperience}
                  onChange={(e) => setForm({ ...form, yearsExperience: e.target.value })}
                  placeholder="12"
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Consultation Fee (₹) <span className="text-destructive">*</span>
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.fee}
                  onChange={(e) => setForm({ ...form, fee: e.target.value })}
                  placeholder="800"
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* PG College */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Postgraduate College <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                maxLength={200}
                value={form.pgCollege}
                onChange={(e) => setForm({ ...form, pgCollege: e.target.value })}
                placeholder="AIIMS Delhi"
                className="h-11 w-full rounded-lg border border-border bg-background px-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Working Hospital */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Working Hospital <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                maxLength={200}
                value={form.workingHospital}
                onChange={(e) => setForm({ ...form, workingHospital: e.target.value })}
                placeholder="Narayana Health, Bangalore"
                className="h-11 w-full rounded-lg border border-border bg-background px-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* City + Languages */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="Bangalore"
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Languages (comma-separated)
                </label>
                <input
                  type="text"
                  value={form.languages}
                  onChange={(e) => setForm({ ...form, languages: e.target.value })}
                  placeholder="English, Hindi, Kannada"
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!isValid}
              className="h-12 w-full rounded-xl bg-primary font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              Complete Onboarding
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
