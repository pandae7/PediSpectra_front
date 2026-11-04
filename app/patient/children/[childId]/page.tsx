'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ChildAvatar } from '@/components/layout/child-avatar'
import { ChildForm, type ChildFormValues } from '@/components/patient/child-form'
import { usePatient } from '@/lib/patient-context'
import { getAgeYears } from '@/lib/child-age'

export default function EditChildPage() {
  const params = useParams()
  const childId = params.childId as string
  const router = useRouter()
  const { currentPatient, isLoading, updateCurrentPatient } = usePatient()

  useEffect(() => {
    if (!isLoading && !currentPatient) {
      router.replace('/login/patient?returnTo=' + encodeURIComponent('/patient/children/' + childId))
    }
  }, [isLoading, currentPatient, router, childId])

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

  const child = currentPatient.children.find((c) => c.id === childId)

  if (!child) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar showBack backHref="/patient/profile" />
        <div className="mx-auto max-w-md px-4 py-20 text-center">
          <h1 className="text-xl font-bold text-foreground">Child not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">This profile isn&apos;t on your account.</p>
          <a
            href="/patient/profile"
            className="mt-6 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Back to my profile
          </a>
        </div>
      </div>
    )
  }

  const handleSubmit = (v: ChildFormValues) => {
    const age = v.dob ? Math.floor(getAgeYears({ age: child.age, dob: v.dob })) : child.age
    updateCurrentPatient({
      ...currentPatient,
      children: currentPatient.children.map((c) =>
        c.id === child.id ? { ...c, name: v.name, sex: v.sex, dob: v.dob || undefined, age } : c
      ),
    })
    router.push('/patient/profile')
  }

  const hasGrowthData = (child.measurements ?? []).length > 0

  return (
    <div className="min-h-screen bg-background">
      <Navbar showBack backHref="/patient/profile" />
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-4">
              <ChildAvatar child={child} siblings={currentPatient.children} size="xl" />
              <div>
                <h1 className="text-xl font-bold text-foreground">Edit {child.name}&apos;s profile</h1>
                <p className="text-sm text-muted-foreground">Changes apply to this child only.</p>
              </div>
            </div>
            <ChildForm
              key={child.id}
              initial={{ name: child.name, dob: child.dob ?? '', sex: child.sex }}
              dobRequired={!!child.dob}
              warnOnSexChange={hasGrowthData}
              submitLabel="Save changes"
              onSubmit={handleSubmit}
            />
          </div>

          <div className="rounded-2xl border border-destructive/30 bg-card p-6">
            <h2 className="text-sm font-semibold text-foreground">Remove profile</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Medical records are retained, so removing a profile is handled as a separate process.
            </p>
            <button
              type="button"
              className="mt-4 h-10 rounded-lg border border-destructive/50 px-4 text-sm font-medium text-destructive"
            >
              Remove profile
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}