'use client'

import { AlertTriangle, ArrowRight, Check, Phone, ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ActionBar } from '@/components/flow/action-bar'
import { FlowHeader } from '@/components/flow/flow-header'
import { PhoneFrame } from '@/components/flow/phone-frame'
import { Button } from '@/components/ui/button'
import { useConsult } from '@/lib/consult-context'
import { RED_FLAGS } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export default function SafetyPage() {
  const router = useRouter()
  const { redFlagsSelected, setRedFlags, completeSafety } = useConsult()
  const [selected, setSelected] = useState<string[]>(redFlagsSelected)
  const [noneConfirmed, setNoneConfirmed] = useState(false)

  const hasRedFlag = selected.length > 0

  const toggle = (id: string) => {
    setNoneConfirmed(false)
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  const proceed = () => {
    setRedFlags(selected)
    completeSafety(true)
    router.push('/intake')
  }

  return (
    <PhoneFrame>
      <FlowHeader
        title="Quick safety check"
        subtitle="Step 1 of 6 · Keep your child within reach"
        currentStep="safety"
        onBack={() => router.push('/')}
      />

      <main className="flex flex-1 flex-col gap-4 px-5 py-5">
        <p className="text-sm leading-relaxed text-muted-foreground">
          Select any signs your child has right now. This helps us route you
          safely — some symptoms need emergency care, not an online consult.
        </p>

        <fieldset className="flex flex-col gap-2.5">
          <legend className="sr-only">Emergency red-flag symptoms</legend>
          {RED_FLAGS.map((flag) => {
            const active = selected.includes(flag.id)
            return (
              <button
                key={flag.id}
                type="button"
                role="checkbox"
                aria-checked={active}
                onClick={() => toggle(flag.id)}
                className={cn(
                  'flex items-start gap-3 rounded-xl border p-3.5 text-left transition-colors',
                  active
                    ? 'border-danger/50 bg-danger/10'
                    : 'border-border bg-card hover:border-muted-foreground/40',
                )}
              >
                <span
                  className={cn(
                    'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors',
                    active ? 'border-danger bg-danger text-danger-foreground' : 'border-border',
                  )}
                >
                  {active ? <Check className="size-3.5" /> : null}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-foreground">
                    {flag.label}
                  </span>
                  <span className="block text-xs leading-relaxed text-muted-foreground">
                    {flag.description}
                  </span>
                </span>
              </button>
            )
          })}
        </fieldset>

        {hasRedFlag ? (
          <div className="rounded-xl border border-danger/40 bg-danger/10 p-4">
            <div className="flex gap-2.5">
              <AlertTriangle className="mt-0.5 size-5 shrink-0 text-danger" />
              <div>
                <p className="text-sm font-semibold text-danger">
                  This may be an emergency
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-danger-foreground/90">
                  Based on what you selected, your child needs in-person
                  emergency care now. An online consult is not safe for these
                  symptoms.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            role="checkbox"
            aria-checked={noneConfirmed}
            onClick={() => setNoneConfirmed((v) => !v)}
            className={cn(
              'flex items-center gap-3 rounded-xl border p-3.5 text-left transition-colors',
              noneConfirmed
                ? 'border-primary/50 bg-primary/10'
                : 'border-border bg-card',
            )}
          >
            <span
              className={cn(
                'flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors',
                noneConfirmed ? 'border-primary bg-primary text-primary-foreground' : 'border-border',
              )}
            >
              {noneConfirmed ? <Check className="size-3.5" /> : null}
            </span>
            <span className="text-sm text-foreground">
              None of these apply to my child right now
            </span>
          </button>
        )}
      </main>

      {hasRedFlag ? (
        <ActionBar hint="If you cannot reach emergency services, go to the nearest hospital.">
          <Button
            size="lg"
            className="h-12 bg-danger text-danger-foreground text-[15px] hover:bg-danger/90"
            onClick={() => {
              window.location.href = 'tel:112'
            }}
          >
            <Phone className="size-4" />
            Call emergency (112)
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="h-11 text-muted-foreground"
            onClick={() => {
              setSelected([])
            }}
          >
            Clear selection
          </Button>
        </ActionBar>
      ) : (
        <ActionBar
          hint={
            <span className="flex items-center justify-center gap-1.5">
              <ShieldCheck className="size-3.5 text-success" />
              Online consultation is appropriate
            </span>
          }
        >
          <Button
            size="lg"
            className="h-12 text-[15px]"
            disabled={!noneConfirmed}
            onClick={proceed}
          >
            Continue to child details
            <ArrowRight className="size-4" />
          </Button>
        </ActionBar>
      )}
    </PhoneFrame>
  )
}
