import { cn } from '@/lib/utils'

/**
 * Sticky bottom action bar — the primary CTA pattern for the urgent flow.
 * Stays in the thumb zone on mobile.
 */
export function ActionBar({
  children,
  className,
  hint,
}: {
  children: React.ReactNode
  className?: string
  hint?: React.ReactNode
}) {
  return (
    <div className="sticky bottom-0 z-20 mt-auto border-t border-border bg-background/95 px-4 pb-5 pt-3 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      {hint ? <div className="mb-2 text-center text-xs text-muted-foreground">{hint}</div> : null}
      <div className={cn('flex flex-col gap-2', className)}>{children}</div>
    </div>
  )
}
