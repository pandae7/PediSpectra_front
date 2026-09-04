'use client'

import { useState, useEffect, Suspense } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, CreditCard, CheckCircle, Shield, Smartphone } from 'lucide-react'
import { getDoctors, addConsultation, initializeMockData, type DoctorProfile } from '@/lib/mock-data'
import { usePatient } from '@/lib/patient-context'
import { cn } from '@/lib/utils'

function PaymentContent() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const doctorId = params.doctorId as string
  const date = searchParams.get('date') || ''
  const time = searchParams.get('time') || ''
  const { currentPatient, isLoading: patientLoading } = usePatient()

  const [doctor, setDoctor] = useState<DoctorProfile | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi')
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    initializeMockData()
    const docs = getDoctors()
    const found = docs.find((d) => d.id === doctorId)
    if (found) setDoctor(found)
  }, [doctorId])

  useEffect(() => {
    if (!patientLoading && !currentPatient) {
      const returnTo = `/booking/${doctorId}/payment?${searchParams.toString()}`
      router.replace(`/login/patient?returnTo=${encodeURIComponent(returnTo)}`)
    }
  }, [patientLoading, currentPatient, doctorId, router, searchParams])

  if (patientLoading || !currentPatient) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!doctor) return null

  const handlePay = () => {
    setProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      // Create the consultation
      const newConsultation = {
        id: `consult-${Date.now()}`,
        doctorId: doctor.id,
        patientName: currentPatient.parentName,
        childName: currentPatient.children[0]?.name || 'Child',
        subspeciality: doctor.subspeciality,
        date,
        time,
        status: 'upcoming' as const,
      }
      addConsultation(newConsultation)

      setProcessing(false)
      setSuccess(true)

      setTimeout(() => {
        router.push('/patient/consultations')
      }, 2500)
    }, 2000)
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Payment Successful!</h2>
          <p className="mt-2 text-muted-foreground">
            Your consultation with {doctor.name} is confirmed.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Redirecting to your consultations...
          </p>
        </div>
      </div>
    )
  }

  const formattedDate = date
    ? new Date(date + 'T00:00:00').toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : ''

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h1 className="mb-6 text-xl font-bold text-foreground">Payment</h1>

          {/* Order summary */}
          <div className="mb-6 rounded-lg border border-border bg-background p-4">
            <h2 className="mb-3 text-sm font-semibold text-foreground">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Doctor</span>
                <span className="font-medium text-foreground">{doctor.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subspeciality</span>
                <span className="text-foreground">{doctor.subspeciality}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span className="text-foreground">{formattedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time</span>
                <span className="text-foreground">{time}</span>
              </div>
              <div className="mt-3 flex justify-between border-t border-border pt-3">
                <span className="font-semibold text-foreground">Total</span>
                <span className="text-lg font-bold text-primary">₹{doctor.fee}</span>
              </div>
            </div>
          </div>

          {/* Payment method */}
          <div className="mb-6">
            <h2 className="mb-3 text-sm font-semibold text-foreground">Payment Method</h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPaymentMethod('upi')}
                className={cn(
                  'flex items-center gap-2 rounded-lg border p-3 text-sm transition-all',
                  paymentMethod === 'upi'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-foreground hover:border-primary/50'
                )}
              >
                <Smartphone className="h-5 w-5" />
                UPI
              </button>
              <button
                onClick={() => setPaymentMethod('card')}
                className={cn(
                  'flex items-center gap-2 rounded-lg border p-3 text-sm transition-all',
                  paymentMethod === 'card'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-foreground hover:border-primary/50'
                )}
              >
                <CreditCard className="h-5 w-5" />
                Card
              </button>
            </div>
          </div>

          {/* Mock payment fields */}
          {paymentMethod === 'upi' ? (
            <div className="mb-6">
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                UPI ID
              </label>
              <input
                type="text"
                placeholder="yourname@upi"
                className="h-11 w-full rounded-lg border border-border bg-background px-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          ) : (
            <div className="mb-6 space-y-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="4242 4242 4242 4242"
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Expiry</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="h-11 w-full rounded-lg border border-border bg-background px-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="h-11 w-full rounded-lg border border-border bg-background px-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Pay button */}
          <button
            onClick={handlePay}
            disabled={processing}
            className="h-12 w-full rounded-xl bg-primary font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {processing ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Processing...
              </span>
            ) : (
              `Pay ₹${doctor.fee}`
            )}
          </button>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5" />
            Secured by Razorpay. Demo mode — no real charge.
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-background"><p className="text-muted-foreground">Loading...</p></div>}>
      <PaymentContent />
    </Suspense>
  )
}
