'use client'

import { useRef } from 'react'
import { cn } from '@/lib/utils'

export function OtpInput({
  value,
  onChange,
  length = 6,
}: {
  value: string
  onChange: (val: string) => void
  length?: number
}) {
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, '').slice(-1)
    const chars = value.split('')
    chars[index] = digit
    const next = chars.join('').slice(0, length)
    onChange(next)
    if (digit && index < length - 1) {
      inputs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (pasted) {
      onChange(pasted)
      inputs.current[Math.min(pasted.length, length - 1)]?.focus()
    }
  }

  return (
    <div className="flex justify-between gap-2" onPaste={handlePaste}>
      {Array.from({ length }).map((_, i) => (
        <input
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          ref={(el) => {
            inputs.current[i] = el
          }}
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          aria-label={`Digit ${i + 1}`}
          value={value[i] ?? ''}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className={cn(
            'h-14 w-full rounded-xl border bg-secondary text-center text-xl font-semibold text-foreground transition-colors outline-none',
            'focus:border-primary focus:ring-2 focus:ring-primary/30',
            value[i] ? 'border-primary/50' : 'border-border',
          )}
        />
      ))}
    </div>
  )
}
