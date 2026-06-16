'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Stethoscope } from 'lucide-react'
import { useDoctor } from '@/lib/doctor-context'

export default function DoctorLoginPage() {
  const router = useRouter()
  const { doctors, setCurrentDoctor } = useDoctor()
  const [selectedId, setSelectedId] = useState('')

  const handleLogin = () => {
    const doc = doctors.find((d) => d.id === selectedId)
    if (doc) {
      setCurrentDoctor(doc)
      router.push('/doctor/dashboard')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <button
          onClick={() => router.push('/')}
          className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </button>

        <div className="rounded-2xl border border-border bg-card p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Stethoscope className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Doctor Login</h1>
              <p className="text-sm text-muted-foreground">Select your profile to continue</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Select Doctor</label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="h-11 w-full rounded-lg border border-border bg-background px-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Choose a doctor profile...</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name} — {doc.subspeciality}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleLogin}
            disabled={!selectedId}
            className="mt-6 h-11 w-full rounded-lg bg-primary font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            Login as Doctor
          </button>

          <div className="mt-4 border-t border-border pt-4 text-center">
            <p className="text-sm text-muted-foreground">
              New doctor?{' '}
              <a href="/doctor/onboarding" className="text-primary hover:underline">
                Onboard here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
