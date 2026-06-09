'use client'

import { ArrowLeft, ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FLOW_STEPS, type FlowStep } from '@/lib/consult-context'
import { cn } from '@/lib/utils'

// Steps that show up in the progress indicator (landing is the entry, not a tracked step).
const TRACKED: FlowStep[] = ['safety', 'intake', 'login', 'payment', 'waiting', 'summary']

export function FlowHeader({
  title,
  subtitle,
  currentStep,
  onBack,
  showProgress = true,
}: {
  title: string
  subtitle?: string
  currentStep: FlowStep
  onBack?: () => void
  showProgress?: boolean
}) {
  const router = useRouter()
  const currentIndex = TRACKED.indexOf(currentStep)

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex items-center gap-3 px-4 py-3">
        {onBack ? (
          <button
            type="button"
            onClick={onBack ?? (() => router.back())}
            aria-label="Go back"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
          </button>
        ) : (
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <ShieldCheck className="size-4" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-sm font-semibold leading-tight text-foreground">
            {title}
          </h1>
          {subtitle ? (
            <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
      </div>

      {showProgress && currentIndex >= 0 ? (
        <div className="flex gap-1 px-4 pb-2.5" aria-hidden="true">
          {TRACKED.map((step, i) => (
            <span
              key={step}
              className={cn(
                'h-1 flex-1 rounded-full transition-colors',
                i < currentIndex && 'bg-primary',
                i === currentIndex && 'bg-primary',
                i > currentIndex && 'bg-muted',
              )}
            />
          ))}
        </div>
      ) : null}
    </header>
  )
}

export { FLOW_STEPS }
