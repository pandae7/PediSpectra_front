'use client'

import { ChildAvatar } from '@/components/layout/child-avatar'
import { usePatient } from '@/lib/patient-context'
import { getChildAccent } from '@/lib/child-theme'
import { formatAge } from '@/lib/child-age'

// Slim bar under the navbar on child-scoped pages: whose records you are looking at.
export function ChildContextBar() {
  const { currentPatient, activeChild } = usePatient()
  if (!currentPatient || !activeChild) return null
  const accent = getChildAccent(currentPatient.children, activeChild.id)

  return (
    <div className="border-b border-border bg-card/60" style={{ borderTop: '3px solid ' + accent }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <ChildAvatar child={activeChild} siblings={currentPatient.children} size="md" />
          <p className="truncate text-sm">
            <span className="font-semibold text-foreground">{activeChild.name}</span>
            <span className="text-muted-foreground">
              {' '}&middot; {formatAge(activeChild)} &middot; {activeChild.sex}
            </span>
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3 text-xs">
          <a href="/patient/home" className="text-muted-foreground transition-colors hover:text-foreground">
            Hub
          </a>
          <a
            href={'/patient/children/' + activeChild.id}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Edit profile
          </a>
        </div>
      </div>
    </div>
  )
}