import { cn } from '@/lib/utils'

export function Field({
  label,
  htmlFor,
  hint,
  children,
  className,
}: {
  label: string
  htmlFor?: string
  hint?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  )
}

export function TextInput({ className, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      className={cn(
        'h-11 w-full rounded-xl border border-border bg-secondary px-3.5 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors',
        'focus:border-primary focus:ring-2 focus:ring-primary/25',
        className,
      )}
      {...props}
    />
  )
}

export function TextArea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      className={cn(
        'min-h-24 w-full rounded-xl border border-border bg-secondary px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors resize-none',
        'focus:border-primary focus:ring-2 focus:ring-primary/25',
        className,
      )}
      {...props}
    />
  )
}

export function ChipGroup({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: readonly string[]
  value: string
  onChange: (val: string) => void
  ariaLabel: string
}) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value === opt
        return (
          <button
            key={opt}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt)}
            className={cn(
              'rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors',
              active
                ? 'border-primary bg-primary/15 text-primary'
                : 'border-border bg-secondary text-muted-foreground hover:text-foreground',
            )}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}
