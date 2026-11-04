'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ChildForm, type ChildFormValues } from '@/components/patient/child-form'
import { usePatient } from '@/lib/patient-context'
import { getAgeYears } from '@/lib/child-age'
import type { Child } from '@/lib/patient-data'

export default function NewChildPage() {
  const router = useRouter()
  const { currentPatient, isLoading, updateCurrentPatient, setActiveChild } = usePatient()

  useEffect(() => {
    if (!isLoading && !currentPatient) {
      router.replace('/login/patient?returnTo=' + encodeURIComponent('/patient/children/new'))
    }
  }, [isLoading, currentPatient, router])

  if (isLoading || !currentPatient) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar showBack backHref="/patient/profile" />
        <div className="flex items-center justify-center py-24">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </div>
    )
  }

  const handleSubmit = (v: ChildFormValues) => {
    const child: Child = {
      id: 'child-' + Date.now(),
      name: v.name,
      dob: v.dob,
      age: Math.floor(getAgeYears({ age: 0, dob: v.dob })),
      sex: v.sex,
      measurements: [],
    }
    updateCurrentPatient({ ...currentPatient, children: [...currentPatient.children, child] })
    setActiveChild(child.id)
    router.push('/patient/home')
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar showBack backHref="/patient/profile" />
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h1 className="text-xl font-bold text-foreground">Add a child</h1>
          <p className="mt-1 mb-6 text-sm text-muted-foreground">
            Each child has their own profile, consultations and growth records.
          </p>
          <ChildForm submitLabel="Add child" onSubmit={handleSubmit} />
        </div>
      </div>
      <Footer />
    </div>
  )
}