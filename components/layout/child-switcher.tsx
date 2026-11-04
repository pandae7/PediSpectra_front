'use client'

import { useState, useRef, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Baby, ChevronDown, Check } from 'lucide-react'
import { usePatient } from '@/lib/patient-context'
import { cn } from '@/lib/utils'

// Active-child switcher. Selecting a child scopes all patient-side data
// (consultations, history, growth) to that child, preventing cross-child
// mix-ups. Always visible in the navbar when a parent with children is logged in.
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

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex h-9 items-center gap-2 rounded-lg border px-3 text-sm transition-colors',
          open ? 'border-primary text-foreground' : 'border-border text-muted-foreground hover:text-foreground'
        )}
        aria-label="Switch child"
        aria-expanded={open}
      >
        <Baby className="h-4 w-4 text-primary" />
        <span className="max-w-[8rem] truncate">{activeChild?.name ?? 'Select child'}</span>
        <ChevronDown className="h-3.5 w-3.5" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-border bg-card p-2 shadow-xl">
          <p className="px-3 pb-1.5 pt-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Viewing records for
          </p>
          {currentPatient.children.map((child) => {
            const isActive = child.id === activeChild?.id
            return (
              <button
                key={child.id}
                onClick={() => {
                  setActiveChild(child.id)
                  // A consultation page belongs to one child, so leave it when switching.
                  if (/^\/patient\/(pre-consult|consult-room|post-consult|messages)\//.test(pathname)) {
                    router.push('/patient/consultations')
                  }
                  setOpen(false)
                }}
                className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-accent"
              >
                <span className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {child.name.charAt(0) || '?'}
                  </span>
                  <span>
                    <span className="block font-medium">{child.name}</span>
                    <span className="block text-xs text-muted-foreground">
                      {child.age} yrs &middot; {child.sex}
                    </span>
                  </span>
                </span>
                {isActive && <Check className="h-4 w-4 text-primary" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}