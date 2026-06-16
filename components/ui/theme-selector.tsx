'use client'

import { useState, useRef, useEffect } from 'react'
import { Palette, Check } from 'lucide-react'
import { useTheme } from '@/lib/theme-context'
import { cn } from '@/lib/utils'

export function ThemeSelector() {
  const { activeTheme, setThemeById, registry } = useTheme()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-sm text-muted-foreground transition-colors hover:text-foreground',
          open && 'border-primary text-foreground'
        )}
        aria-label="Switch theme"
        aria-expanded={open}
      >
        <Palette className="h-4 w-4" />
        <span className="hidden sm:inline">{activeTheme.emoji} {activeTheme.label}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-border bg-card p-2 shadow-xl">
          <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Choose theme
          </p>
          {registry.map((theme) => (
            <button
              key={theme.id}
              onClick={() => {
                setThemeById(theme.id)
                setOpen(false)
              }}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-accent',
                activeTheme.id === theme.id && 'bg-primary/10'
              )}
            >
              <span className="text-lg">{theme.emoji}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{theme.label}</p>
                <p className="text-xs text-muted-foreground">{theme.description}</p>
              </div>
              {activeTheme.id === theme.id && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
