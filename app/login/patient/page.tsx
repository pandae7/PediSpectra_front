'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Heart, Mail, Phone, Plus, Trash2 } from 'lucide-react'
import { usePatient } from '@/lib/patient-context'
import { findPatientByIdentifier, type Child } from '@/lib/patient-data'
import { cn } from '@/lib/utils'

type IdentifierType = 'phone' | 'email'
type Step = 'identifier' | 'otp' | 'signup'

let childIdCounter = 0
function newChildId() {
  childIdCounter += 1
  return `child-draft-${Date.now()}-${childIdCounter}`
}

function emptyChild(): Child {
  return { id: newChildId(), name: '', age: 0, sex: 'Male' }
}

function PatientLoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnTo = searchParams.get('returnTo') || '/'
  const { login, signup } = usePatient()

  const [step, setStep] = useState<Step>('identifier')
  const [identifierType, setIdentifierType] = useState<IdentifierType>('phone')
  const [identifierValue, setIdentifierValue] = useState('')
  const [otp, setOtp] = useState('')

  // Signup fields
  const [parentName, setParentName] = useState('')
  const [secondaryValue, setSecondaryValue] = useState('')
  const [city, setCity] = useState('')
  const [children, setChildren] = useState<Child[]>([emptyChild()])

  const isPhoneValid = /^\d{10}$/.test(identifierValue.trim())
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifierValue.trim())
  const isIdentifierValid = identifierType === 'phone' ? isPhoneValid : isEmailValid

  const isOtpValid = /^\d{6}$/.test(otp)

  const isSignupValid =
    parentName.trim().length > 0 &&
    children.length > 0 &&
    children.every((c) => c.name.trim().length > 0 && c.age > 0 && c.sex)

  const handleContinue = () => {
    if (!isIdentifierValid) return
    setStep('otp')
  }

  const handleVerify = () => {
    if (!isOtpValid) return
    const found = findPatientByIdentifier(identifierType, identifierValue.trim())
    if (found) {
      login(found)
      router.push(returnTo)
    } else {
      setStep('signup')
    }
  }

  const handleAddChild = () => {
    setChildren((prev) => [...prev, emptyChild()])
  }

  const handleRemoveChild = (id: string) => {
    setChildren((prev) => (prev.length > 1 ? prev.filter((c) => c.id !== id) : prev))
  }

  const handleChildChange = (id: string, field: keyof Child, value: string) => {
    setChildren((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, [field]: field === 'age' ? Number(value) : value }
          : c
      )
    )
  }

  const handleSignup = () => {
    if (!isSignupValid) return

    const profile = {
      identifierType,
      parentName: parentName.trim(),
      city: city.trim() || undefined,
      children: children.map((c) => ({ ...c, name: c.name.trim() })),
      ...(identifierType === 'phone'
        ? { phone: identifierValue.trim(), email: secondaryValue.trim() || undefined }
        : { email: identifierValue.trim(), phone: secondaryValue.trim() || undefined }),
    }

    signup(profile)
    router.push(returnTo)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md">
        <button
          onClick={() => router.push('/')}
          className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </button>

        <div className="rounded-2xl border border-border bg-card p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Heart className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {step === 'signup' ? 'Create your account' : 'Patient Login'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {step === 'identifier' && 'Login or sign up to book a consultation'}
                {step === 'otp' && `We sent a code to your ${identifierType}`}
                {step === 'signup' && 'Tell us a bit about your family'}
              </p>
            </div>
          </div>

          {/* Step 1: Identifier entry */}
          {step === 'identifier' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 rounded-lg border border-border bg-background p-1">
                <button
                  onClick={() => {
                    setIdentifierType('phone')
                    setIdentifierValue('')
                  }}
                  className={cn(
                    'flex items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium transition-colors',
                    identifierType === 'phone'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Phone className="h-3.5 w-3.5" />
                  Phone
                </button>
                <button
                  onClick={() => {
                    setIdentifierType('email')
                    setIdentifierValue('')
                  }}
                  className={cn(
                    'flex items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium transition-colors',
                    identifierType === 'email'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Mail className="h-3.5 w-3.5" />
                  Email
                </button>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  {identifierType === 'phone' ? 'Phone number' : 'Email address'}
                </label>
                <input
                  type={identifierType === 'phone' ? 'tel' : 'email'}
                  value={identifierValue}
                  onChange={(e) => setIdentifierValue(e.target.value)}
                  placeholder={identifierType === 'phone' ? '9876543210' : 'you@example.com'}
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <button
                onClick={handleContinue}
                disabled={!isIdentifierValid}
                className="h-11 w-full rounded-lg bg-primary font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2: OTP verification */}
          {step === 'otp' && (
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Enter 6-digit code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 text-center text-lg tracking-widest text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  Demo mode — enter any 6-digit code to continue.
                </p>
              </div>

              <button
                onClick={handleVerify}
                disabled={!isOtpValid}
                className="h-11 w-full rounded-lg bg-primary font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                Verify
              </button>

              <button
                onClick={() => {
                  setStep('identifier')
                  setOtp('')
                }}
                className="w-full text-center text-sm text-muted-foreground hover:text-foreground"
              >
                Change {identifierType === 'phone' ? 'phone number' : 'email'}
              </button>
            </div>
          )}

          {/* Step 3: Signup */}
          {step === 'signup' && (
            <div className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Parent / Guardian name
                </label>
                <input
                  type="text"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  placeholder="Your full name"
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  {identifierType === 'phone' ? 'Email' : 'Phone number'}{' '}
                  <span className="text-muted-foreground">(optional)</span>
                </label>
                <input
                  type={identifierType === 'phone' ? 'email' : 'tel'}
                  value={secondaryValue}
                  onChange={(e) => setSecondaryValue(e.target.value)}
                  placeholder={identifierType === 'phone' ? 'you@example.com' : '9876543210'}
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <p className="mt-1.5 text-xs text-muted-foreground">
                  We&apos;ll use this to send booking confirmations and updates.
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  City <span className="text-muted-foreground">(optional)</span>
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Bangalore"
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">Children</label>
                </div>

                <div className="space-y-3">
                  {children.map((child, idx) => (
                    <div
                      key={child.id}
                      className="rounded-lg border border-border bg-background p-3"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">
                          Child {idx + 1}
                        </span>
                        {children.length > 1 && (
                          <button
                            onClick={() => handleRemoveChild(child.id)}
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                            aria-label={`Remove child ${idx + 1}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={child.name}
                          onChange={(e) => handleChildChange(child.id, 'name', e.target.value)}
                          placeholder="Child's name"
                          className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="number"
                            min={0}
                            max={25}
                            value={child.age || ''}
                            onChange={(e) => handleChildChange(child.id, 'age', e.target.value)}
                            placeholder="Age"
                            className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                          <select
                            value={child.sex}
                            onChange={(e) => handleChildChange(child.id, 'sex', e.target.value)}
                            className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleAddChild}
                  className="mt-3 flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                >
                  <Plus className="h-4 w-4" />
                  Add another child
                </button>
              </div>

              <button
                onClick={handleSignup}
                disabled={!isSignupValid}
                className="h-11 w-full rounded-lg bg-primary font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                Create account
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function PatientLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      }
    >
      <PatientLoginContent />
    </Suspense>
  )
}
