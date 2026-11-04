'use client'

import { useState, useRef, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { ChevronDown, Check, Pencil, Plus, Users } from 'lucide-react'
import { ChildAvatar } from '@/components/layout/child-avatar'
import { usePatient } from '@/lib/patient-context'
import { formatAge } from '@/lib/child-age'
import { cn } from '@/lib/utils'

// Active-child switcher. Selecting a child scopes every patient-side page
// (consultations, history, growth) to that child, preventing cross-child mix-ups.
export function ChildSwitcher() {
  const { currentPatient, activeChild, setActiveChild } = usePatient()
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  if (!currentPatient || currentPatient.children.length === 0) return null

  const select = (childId: string) => {
    setActiveChild(childId)
    setOpen(false)
    // A consultation page belongs to one child, so leave it when switching.
    if (/^\/patient\/(pre-consult|consult-room|post-consult|messages)\//.test(pathname)) {
      router.push('/patient/consultations')
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex h-9 items-center gap-2 rounded-lg border px-2.5 text-sm transition-colors',
          open ? 'border-primary text-foreground' : 'border-border text-muted-foreground hover:text-foreground'
        )}
        aria-label="Switch child"
        aria-expanded={open}
      >
        {activeChild ? (
          <ChildAvatar child={activeChild} siblings={currentPatient.children} size="sm" />
        ) : null}
        <span className="max-w-[8rem] truncate">{activeChild?.name ?? 'Select child'}</span>
        <ChevronDown className="h-3.5 w-3.5" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-border bg-card p-2 shadow-xl">
          <p className="px-3 pb-1.5 pt-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Viewing records for
          </p>
          {currentPatient.children.map((child) => {
            const isActive = child.id === activeChild?.id
            return (
              <div key={child.id} className="flex items-center gap-1 rounded-lg hover:bg-accent">
                <button
                  onClick={() => select(child.id)}
                  className="flex flex-1 items-center gap-3 px-3 py-2.5 text-left text-sm text-foreground"
                >
                  <ChildAvatar child={child} siblings={currentPatient.children} size="md" />
                  <span className="flex-1">
                    <span className="block font-medium">{child.name}</span>
                    <span className="block text-xs text-muted-foreground">
                      {formatAge(child)} &middot; {child.sex}
                    </span>
                  </span>
                  {isActive && <Check className="h-4 w-4 text-primary" />}
                </button>
                <a
                  href={'/patient/children/' + child.id}
                  onClick={() => setOpen(false)}
                  aria-label={'Edit ' + child.name}
                  className="mr-1 rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </a>
              </div>
            )
          })}

          <div className="mt-1 border-t border-border pt-1">
            <a
              href="/patient/children/new"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
            >
              <Plus className="h-4 w-4 text-primary" />
              Add child
            </a>
            <a
              href="/patient/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
            >
              <Users className="h-4 w-4 text-primary" />
              Manage profiles
            </a>
          </div>
        </div>
      )}
    </div>
  )
}