'use client'

import { Check, CreditCard, Lock, ShieldCheck, Star, Stethoscope, Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ActionBar } from '@/components/flow/action-bar'
import { FlowHeader } from '@/components/flow/flow-header'
import { PhoneFrame } from '@/components/flow/phone-frame'
import { StatusPill } from '@/components/flow/status-pill'
import { Button } from '@/components/ui/button'
import { useConsult } from '@/lib/consult-context'
import { formatINR, ONCALL_COUNT, PLANS } from '@/lib/mock-data'
import { useStepGuard } from '@/lib/use-step-guard'
import { cn } from '@/lib/utils'

export default function PaymentPage() {
  const allowed = useStepGuard('payment')
  const router = useRouter()
  const { planId, setPlanId, completePayment } = useConsult()
  const [selected, setSelected] = useState(planId ?? PLANS[0].id)

  if (!allowed) return null

  const activePlan = PLANS.find((p) => p.id === selected) ?? PLANS[0]

  const proceed = () => {
    setPlanId(selected)
    // No doctor is pre-assigned here. The request is broadcast to the on-call
    // pool and a pediatrician is assigned only when one accepts (waiting room).
    completePayment()
    router.push('/waiting')
  }

  return (
    <PhoneFrame>
      <FlowHeader
        title="Confirm & connect"
        subtitle="Step 4 of 6 · Choose your consult"
        currentStep="payment"
        onBack={() => router.push('/login')}
      />

      <main className="flex flex-1 flex-col gap-5 px-5 py-5">
        {/* Plans */}
        <section className="space-y-2.5">
          <h2 className="text-sm font-semibold text-foreground">Consultation type</h2>
          {PLANS.map((plan) => {
            const active = selected === plan.id
            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelected(plan.id)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl border p-3.5 text-left transition-colors',
                  active ? 'border-primary bg-primary/10' : 'border-border bg-card',
                )}
              >
                <span
                  className={cn(
                    'flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors',
                    active ? 'border-primary bg-primary text-primary-foreground' : 'border-border',
                  )}
                >
                  {active ? <Check className="size-3" /> : null}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                    {plan.id === 'priority' ? <Zap className="size-3.5 text-warning" /> : null}
                    {plan.name}
                  </span>
                  <span className="block text-xs text-muted-foreground">{plan.description}</span>
                  <span className="mt-0.5 block text-xs text-success">{plan.eta}</span>
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {formatINR(plan.price)}
                </span>
              </button>
            )
          })}
        </section>

        {/* On-call pool — no doctor is pre-assigned for urgent care */}
        <section className="rounded-xl border border-border bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <Stethoscope className="size-4 text-primary" />
              On-call pediatricians
            </h2>
            <StatusPill tone="success">{ONCALL_COUNT} online now</StatusPill>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Your request goes to all on-call <span className="text-foreground">general
            pediatricians</span> at once. The first one available accepts and connects with you —
            so you&apos;re never left waiting on a single doctor. You&apos;ll see their name and
            profile the moment they join.
          </p>
          <div className="mt-3 flex items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
            <Star className="size-3.5 text-warning" />
            All on-call doctors are verified, 4.8★+ rated pediatricians.
          </div>
        </section>

        {/* Reassurance band */}
        <section className="flex items-start gap-2.5 rounded-xl border border-success/30 bg-success/10 p-3.5">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" />
          <p className="text-xs leading-relaxed text-foreground">
            If no pediatrician can connect within a few minutes, we&apos;ll arrange a priority
            callback or guide you to the nearest emergency room — and your payment is fully
            refunded.
          </p>
        </section>

        {/* Payment method (designed, on hold) */}
        <section className="space-y-2.5">
          <h2 className="text-sm font-semibold text-foreground">Payment</h2>
          <div className="flex items-center justify-between rounded-xl border border-border bg-card p-3.5 opacity-70">
            <div className="flex items-center gap-3">
              <CreditCard className="size-4 text-muted-foreground" />
              <div className="leading-tight">
                <p className="text-sm text-foreground">UPI / Card / Netbanking</p>
                <p className="text-xs text-muted-foreground">Secure checkout</p>
              </div>
            </div>
            <StatusPill tone="warning">Coming soon</StatusPill>
          </div>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="size-3.5" />
            Payments are disabled in this prototype.
          </p>
        </section>
      </main>

      <ActionBar
        hint={
          <span className="flex items-center justify-center gap-1.5">
            <ShieldCheck className="size-3.5 text-success" />
            {formatINR(activePlan.price)} · refundable if no doctor connects
          </span>
        }
      >
        <Button size="lg" className="h-12 text-[15px]" onClick={proceed}>
          Bypass payment &amp; connect (demo)
        </Button>
      </ActionBar>
    </PhoneFrame>
  )
}
