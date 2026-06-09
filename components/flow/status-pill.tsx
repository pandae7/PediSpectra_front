import { cn } from '@/lib/utils'

type StatusTone = 'neutral' | 'success' | 'warning' | 'danger' | 'primary'

const toneMap: Record<StatusTone, string> = {
  neutral: 'bg-muted text-muted-foreground border-border',
  success: 'bg-success/10 text-success border-success/30',
  warning: 'bg-warning/10 text-warning border-warning/30',
  danger: 'bg-danger/10 text-danger border-danger/30',
  primary: 'bg-primary/10 text-primary border-primary/30',
}

export function StatusPill({
  children,
  tone = 'neutral',
  className,
  icon,
}: {
  children: React.ReactNode
  tone?: StatusTone
  className?: string
  icon?: React.ReactNode
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
        toneMap[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  )
}
