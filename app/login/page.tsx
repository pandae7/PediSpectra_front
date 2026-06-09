'use client'

import { ArrowRight, MessageSquare, Phone } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ActionBar } from '@/components/flow/action-bar'
import { FlowHeader } from '@/components/flow/flow-header'
import { Field, TextInput } from '@/components/flow/form-fields'
import { OtpInput } from '@/components/flow/otp-input'
import { PhoneFrame } from '@/components/flow/phone-frame'
import { Button } from '@/components/ui/button'
import { useConsult } from '@/lib/consult-context'
import { useStepGuard } from '@/lib/use-step-guard'

export default function LoginPage() {
  const allowed = useStepGuard('login')
  const router = useRouter()
  const { phone, setPhone, verifyOtp } = useConsult()
  const [stage, setStage] = useState<'phone' | 'otp'>('phone')
  const [otp, setOtp] = useState('')

  if (!allowed) return null

  const phoneValid = phone.replace(/\D/g, '').length === 10
  const otpValid = otp.length === 6

  const sendOtp = () => {
    if (phoneValid) setStage('otp')
  }

  const confirm = () => {
    if (otpValid) {
      verifyOtp()
      router.push('/payment')
    }
  }

  return (
    <PhoneFrame>
      <FlowHeader
        title={stage === 'phone' ? 'Verify your number' : 'Enter the code'}
        subtitle="Step 3 of 6 · Secure your consult record"
        currentStep="login"
        onBack={() => (stage === 'otp' ? setStage('phone') : router.push('/intake'))}
      />

      <main className="flex flex-1 flex-col gap-6 px-5 py-7">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
          {stage === 'phone' ? <Phone className="size-5" /> : <MessageSquare className="size-5" />}
        </div>

        {stage === 'phone' ? (
          <>
            <div className="space-y-1.5">
              <h2 className="text-xl font-semibold text-foreground">
                What&apos;s your mobile number?
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                We&apos;ll text a 6-digit code to confirm it&apos;s you and keep
                your child&apos;s consult notes safe.
              </p>
            </div>

            <Field label="Mobile number" htmlFor="phone">
              <div className="flex items-center gap-2">
                <span className="flex h-11 items-center rounded-xl border border-border bg-muted px-3 text-sm font-medium text-muted-foreground">
                  +91
                </span>
                <TextInput
                  id="phone"
                  inputMode="numeric"
                  autoFocus
                  placeholder="98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                />
              </div>
            </Field>
          </>
        ) : (
          <>
            <div className="space-y-1.5">
              <h2 className="text-xl font-semibold text-foreground">
                Enter the 6-digit code
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Sent to <span className="font-medium text-foreground">+91 {phone}</span>.{' '}
                <button
                  type="button"
                  className="text-primary underline-offset-4 hover:underline"
                  onClick={() => setStage('phone')}
                >
                  Change
                </button>
              </p>
            </div>

            <OtpInput value={otp} onChange={setOtp} />

            <p className="text-center text-xs text-muted-foreground">
              Demo mode — enter any 6 digits to continue.
            </p>
          </>
        )}
      </main>

      {stage === 'phone' ? (
        <ActionBar hint="Standard messaging rates may apply.">
          <Button size="lg" className="h-12 text-[15px]" disabled={!phoneValid} onClick={sendOtp}>
            Send code
            <ArrowRight className="size-4" />
          </Button>
        </ActionBar>
      ) : (
        <ActionBar
          hint={
            <button type="button" className="text-primary underline-offset-4 hover:underline">
              Resend code in 0:30
            </button>
          }
        >
          <Button size="lg" className="h-12 text-[15px]" disabled={!otpValid} onClick={confirm}>
            Verify &amp; continue
            <ArrowRight className="size-4" />
          </Button>
        </ActionBar>
      )}
    </PhoneFrame>
  )
}
