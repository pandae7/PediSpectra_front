import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HeartRatingProps {
  value?: number
  showValue?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZE_MAP = {
  sm: { icon: 'h-3.5 w-3.5', label: 'text-xs' },
  md: { icon: 'h-4 w-4', label: 'text-sm' },
  lg: { icon: 'h-5 w-5', label: 'text-base' },
} as const

export function HeartRating({ value, showValue = false, size = 'md', className }: HeartRatingProps) {
  const { icon, label } = SIZE_MAP[size]

  const isValid = typeof value === 'number' && !Number.isNaN(value)
  const clamped = isValid ? Math.min(Math.max(value as number, 0), 5) : 0
  const fillPct = (clamped / 5) * 100

  return (
    <div
      role="img"
      aria-label={isValid ? `${clamped} out of 5` : 'No rating'}
      className={cn('inline-flex items-center gap-1.5', className)}
    >
      <div className="relative inline-flex" aria-hidden="true">
        {/* Base row — outline hearts */}
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Heart key={i} className={cn(icon, 'text-border')} />
          ))}
        </div>
        {/* Overlay row — filled hearts, clipped to fill width */}
        {isValid && (
          <div
            className="absolute inset-0 flex items-center gap-0.5 overflow-hidden"
            style={{ width: `${fillPct}%` }}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <Heart key={i} className={cn(icon, 'shrink-0 fill-primary text-primary')} />
            ))}
          </div>
        )}
      </div>
      {showValue && isValid && (
        <span className={cn(label, 'font-semibold text-foreground')}>{clamped.toFixed(1)}</span>
      )}
    </div>
  )
}
