'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { useParams, usePathname } from 'next/navigation'
import { Lock } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { usePatient } from '@/lib/patient-context'
import { getConsultations } from '@/lib/mock-data'

// Guards pages that are opened by consultation ID. A consultation is only shown
// while its child is the active child, so one child's records can never be seen
// or acted on while viewing another child's profile.
export function ConsultAccessGate({ children }: { children: ReactNode }) {
  const params = useParams()
  const consultId = params.consultId as string
  const pathname = usePathname()
  const { currentPatient, activeChild, setActiveChild, isLoading } = usePatient()
  const [lookup, setLookup] = useState<{ loaded: boolean; childId?: string }>({ loaded: false })

  useEffect(() => {
    const found = getConsultations().find((c) => c.id === consultId)
    setLookup({ loaded: true, childId: found?.childId })
  }, [consultId])

  const shell = (body: ReactNode) => (
    <div className="min-h-screen bg-background">
      <Navbar showBack backHref="/patient/consultations" />
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">{body}</div>
    </div>
  )

  const icon = (
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15">
      <Lock className="h-6 w-6 text-primary" />
    </div>
  )

  if (isLoading || !lookup.loaded) {
    return shell(<div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />)
  }

  if (!currentPatient) {
    return shell(
      <>
        {icon}
        <h1 className="mt-5 text-xl font-bold text-foreground">Log in to continue</h1>
        <p className="mt-2 text-sm text-muted-foreground">Log in to view this consultation.</p>
        <a
          href={`/login/patient?returnTo=${encodeURIComponent(pathname)}`}
          className="mt-6 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Log in
        </a>
      </>
    )
  }

  const owner = lookup.childId ? currentPatient.children.find((c) => c.id === lookup.childId) : undefined

  if (!owner) {
    return shell(
      <>
        {icon}
        <h1 className="mt-5 text-xl font-bold text-foreground">Consultation not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This consultation isn&apos;t linked to any of your children&apos;s profiles.
        </p>
        <a
          href="/patient/consultations"
          className="mt-6 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Go to consultations
        </a>
      </>
    )
  }

  if (owner.id !== activeChild?.id) {
    return shell(
      <>
        {icon}
        <h1 className="mt-5 text-xl font-bold text-foreground">This consultation is for {owner.name}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You are viewing {activeChild?.name ?? 'another child'}&apos;s records. Switch to {owner.name}&apos;s profile to open it.
        </p>
        <button
          onClick={() => setActiveChild(owner.id)}
          className="mt-6 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Switch to {owner.name}
        </button>
        <a href="/patient/consultations" className="mt-3 text-sm text-muted-foreground hover:text-foreground">
          Back to {activeChild?.name ?? 'my'} consultations
        </a>
      </>
    )
  }

  return <>{children}</>
}