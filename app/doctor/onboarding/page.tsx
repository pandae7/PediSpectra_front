'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CheckCircle, FileUp, Stethoscope } from 'lucide-react'
import { useDoctor } from '@/lib/doctor-context'
import {
  SUBSPECIALITIES,
  MEDICAL_COUNCILS,
  CREDENTIAL_LABELS,
  getPlatformFee,
  type CredentialType,
  type DoctorProfile,
} from '@/lib/mock-data'
import { submissionNotice } from '@/lib/doctor-verification'

const DEMO_OTP = '123456'
const REQUIRED_DOCS: CredentialType[] = ['degree_certificate', 'government_id']
const OPTIONAL_DOCS: CredentialType[] = ['subspeciality_proof', 'hospital_affiliation', 'profile_photo']
const STEPS = ['Account', 'Professional', 'Documents', 'Agreements']

const inputCls =
  'h-11 w-full rounded-lg border border-border bg-background px-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  )
}

export default function DoctorOnboardingPage() {
  const router = useRouter()
  const { onboardDoctor } = useDoctor()
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  const [acct, setAcct] = useState({ email: '', phone: '', contactVia: 'email' as 'email' | 'phone' })
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [verified, setVerified] = useState(false)
  const [otpError, setOtpError] = useState('')

  const [form, setForm] = useState({
    name: '',
    subspeciality: '',
    yearsExperience: '',
    pgCollege: '',
    workingHospital: '',
    city: '',
    languages: '',
    council: '',
    registrationNumber: '',
    registrationYear: '',
  })
  const [docs, setDocs] = useState<Partial<Record<CredentialType, string>>>({})
  const [agree, setAgree] = useState({ terms: false, data: false, truth: false })

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(acct.email.trim())
  const phoneOk = acct.phone.replace(/\D/g, '').length >= 10
  const accountValid = emailOk && (acct.contactVia === 'email' || phoneOk) && verified

  const yearNow = new Date().getFullYear()
  const regYear = Number(form.registrationYear)
  const professionalValid =
    form.name.trim().length > 0 &&
    form.subspeciality.length > 0 &&
    form.yearsExperience.length > 0 &&
    Number(form.yearsExperience) >= 0 &&
    Number(form.yearsExperience) <= 60 &&
    form.pgCollege.trim().length > 0 &&
    form.workingHospital.trim().length > 0 &&
    form.council.length > 0 &&
    form.registrationNumber.trim().length >= 4 &&
    regYear >= 1950 &&
    regYear <= yearNow
  const docsValid = REQUIRED_DOCS.every((t) => !!docs[t])
  const agreeValid = agree.terms && agree.data && agree.truth

  const canNext = [accountValid, professionalValid, docsValid, agreeValid][step]

  const sendOtp = () => {
    setOtpError('')
    setOtpSent(true)
    setOtp('')
  }
  const checkOtp = () => {
    if (otp === DEMO_OTP) {
      setVerified(true)
      setOtpError('')
    } else {
      setOtpError('That code is not right. Please try again.')
    }
  }

  const handleSubmit = () => {
    if (!(accountValid && professionalValid && docsValid && agreeValid)) return
    const now = new Date().toISOString()
    const name = form.name.trim()
    const newDoctor: DoctorProfile = {
      id: `dr-${Date.now()}`,
      name: name.startsWith('Dr.') ? name : `Dr. ${name}`,
      subspeciality: form.subspeciality,
      yearsExperience: Number(form.yearsExperience),
      pgCollege: form.pgCollege.trim(),
      workingHospital: form.workingHospital.trim(),
      fee: getPlatformFee(form.subspeciality),
      rating: 4.5,
      consultationCount: 0,
      languages: form.languages.split(',').map((l) => l.trim()).filter(Boolean),
      city: form.city.trim() || 'Online',
      bio: '',
      availability: [],
      verification: {
        status: 'pending_review',
        email: acct.email.trim(),
        phone: acct.phone.trim() || undefined,
        contactVia: acct.contactVia,
        registrationNumber: form.registrationNumber.trim(),
        council: form.council,
        registrationYear: regYear,
        documents: (Object.entries(docs) as [CredentialType, string][]).map(([type, fileName]) => ({ type, fileName })),
        termsAcceptedAt: now,
        dataConsentAcceptedAt: now,
        submittedAt: now,
        notices: [submissionNotice(false)],
      },
    }
    onboardDoctor(newDoctor)
    setSubmitted(true)
    setTimeout(() => router.push('/doctor/waiting-room'), 1500)
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Application submitted</h2>
          <p className="mt-2 text-muted-foreground">Taking you to your wait room...</p>
        </div>
      </div>
    )
  }

  const docRow = (t: CredentialType, required: boolean) => (
    <label
      key={t}
      className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-3 hover:border-primary/50"
    >
      <span className="min-w-0">
        <span className="block text-sm font-medium text-foreground">
          {CREDENTIAL_LABELS[t]} {required && <span className="text-destructive">*</span>}
        </span>
        <span className="block truncate text-xs text-muted-foreground">
          {docs[t] ?? 'PDF, JPG or PNG, up to 5 MB'}
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs text-foreground">
        <FileUp className="h-3.5 w-3.5" />
        {docs[t] ? 'Replace' : 'Choose file'}
      </span>
      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) setDocs((d) => ({ ...d, [t]: f.name }))
        }}
      />
    </label>
  )

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <button
          onClick={() => router.push('/')}
          className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </button>

        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Stethoscope className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Doctor registration</h1>
              <p className="text-sm text-muted-foreground">
                Create your account and submit your credentials for verification
              </p>
            </div>
          </div>

          {/* Stepper */}
          <ol className="mb-8 grid grid-cols-4 gap-2">
            {STEPS.map((s, i) => (
              <li key={s} className="min-w-0">
                <div className={`h-1.5 rounded-full ${i <= step ? 'bg-primary' : 'bg-muted'}`} />
                <p className={`mt-1.5 truncate text-xs ${i === step ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                  {i + 1}. {s}
                </p>
              </li>
            ))}
          </ol>

          <div className="space-y-5">
            {step === 0 && (
              <>
                <Field label="Email address" required hint="Required. We use it for your account and verification updates.">
                  <input
                    type="email"
                    value={acct.email}
                    disabled={verified}
                    onChange={(e) => setAcct({ ...acct, email: e.target.value })}
                    placeholder="priya@hospital.com"
                    className={inputCls}
                  />
                </Field>
                <Field label="Mobile number" required={acct.contactVia === 'phone'} hint="Used for WhatsApp alerts about your application.">
                  <input
                    type="tel"
                    value={acct.phone}
                    disabled={verified}
                    onChange={(e) => setAcct({ ...acct, phone: e.target.value })}
                    placeholder="98765 43210"
                    className={inputCls}
                  />
                </Field>
                <fieldset disabled={verified}>
                  <legend className="mb-1.5 text-sm font-medium text-foreground">Send my one-time code to</legend>
                  <div className="flex gap-3">
                    {(['email', 'phone'] as const).map((c) => (
                      <label
                        key={c}
                        className={`flex flex-1 cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-sm ${
                          acct.contactVia === c ? 'border-primary bg-primary/5 text-foreground' : 'border-border text-muted-foreground'
                        }`}
                      >
                        <input
                          type="radio"
                          name="via"
                          checked={acct.contactVia === c}
                          onChange={() => setAcct({ ...acct, contactVia: c })}
                        />
                        {c === 'email' ? 'Email' : 'Mobile (SMS)'}
                      </label>
                    ))}
                  </div>
                </fieldset>

                {!verified && (
                  <div className="rounded-xl border border-border bg-muted/30 p-4">
                    {!otpSent ? (
                      <button
                        type="button"
                        onClick={sendOtp}
                        disabled={!emailOk || (acct.contactVia === 'phone' && !phoneOk)}
                        className="h-10 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-50"
                      >
                        Send code
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-sm text-foreground">
                          Enter the 6-digit code sent to your {acct.contactVia === 'email' ? 'email' : 'mobile'}.
                        </p>
                        <p className="text-[11px] text-muted-foreground">Demo: use {DEMO_OTP}.</p>
                        <div className="flex gap-2">
                          <input
                            inputMode="numeric"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            placeholder="123456"
                            className={inputCls + ' max-w-[10rem] tracking-widest'}
                          />
                          <button
                            type="button"
                            onClick={checkOtp}
                            disabled={otp.length !== 6}
                            className="h-11 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-50"
                          >
                            Verify
                          </button>
                        </div>
                        {otpError && <p className="text-xs text-destructive">{otpError}</p>}
                      </div>
                    )}
                  </div>
                )}
                {verified && (
                  <p className="flex items-center gap-2 text-sm text-primary">
                    <CheckCircle className="h-4 w-4" /> Verified
                  </p>
                )}
              </>
            )}

            {step === 1 && (
              <>
                <Field label="Full name" required>
                  <input
                    type="text"
                    maxLength={100}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Dr. Priya Sharma"
                    className={inputCls}
                  />
                </Field>
                <Field label="Subspeciality" required>
                  <select
                    value={form.subspeciality}
                    onChange={(e) => setForm({ ...form, subspeciality: e.target.value })}
                    className={inputCls}
                  >
                    <option value="">Select subspeciality...</option>
                    {SUBSPECIALITIES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </Field>

                <div className="rounded-xl border border-border bg-muted/20 p-4">
                  <p className="mb-3 text-sm font-semibold text-foreground">Medical registration</p>
                  <div className="space-y-4">
                    <Field label="Registering council" required>
                      <select
                        value={form.council}
                        onChange={(e) => setForm({ ...form, council: e.target.value })}
                        className={inputCls}
                      >
                        <option value="">Select council...</option>
                        {MEDICAL_COUNCILS.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </Field>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Registration number" required>
                        <input
                          type="text"
                          maxLength={30}
                          value={form.registrationNumber}
                          onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })}
                          placeholder="KMC 123456"
                          className={inputCls}
                        />
                      </Field>
                      <Field label="Year of registration" required>
                        <input
                          type="number"
                          min={1950}
                          max={yearNow}
                          value={form.registrationYear}
                          onChange={(e) => setForm({ ...form, registrationYear: e.target.value })}
                          placeholder="2012"
                          className={inputCls}
                        />
                      </Field>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Years of experience" required>
                    <input
                      type="number"
                      min={0}
                      max={60}
                      value={form.yearsExperience}
                      onChange={(e) => setForm({ ...form, yearsExperience: e.target.value })}
                      placeholder="12"
                      className={inputCls}
                    />
                  </Field>
                  <Field
                    label="Consultation fee (₹)"
                    hint="Set by the platform per specialty (GP ₹500 · specialist ₹750). Doctors cannot change this."
                  >
                    <div className="flex h-11 w-full items-center rounded-lg border border-border bg-muted/40 px-3 text-foreground">
                      {form.subspeciality ? `₹${getPlatformFee(form.subspeciality)}` : '--'}
                    </div>
                  </Field>
                </div>
                <Field label="Postgraduate college" required>
                  <input
                    type="text"
                    maxLength={200}
                    value={form.pgCollege}
                    onChange={(e) => setForm({ ...form, pgCollege: e.target.value })}
                    placeholder="AIIMS Delhi"
                    className={inputCls}
                  />
                </Field>
                <Field label="Working hospital" required>
                  <input
                    type="text"
                    maxLength={200}
                    value={form.workingHospital}
                    onChange={(e) => setForm({ ...form, workingHospital: e.target.value })}
                    placeholder="Narayana Health, Bangalore"
                    className={inputCls}
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="City">
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      placeholder="Bangalore"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Languages (comma-separated)">
                    <input
                      type="text"
                      value={form.languages}
                      onChange={(e) => setForm({ ...form, languages: e.target.value })}
                      placeholder="English, Hindi, Kannada"
                      className={inputCls}
                    />
                  </Field>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <p className="text-sm text-muted-foreground">
                  Upload clear copies. Our team checks these against your registration number. In this demo, only the
                  file name is kept.
                </p>
                <div className="space-y-3">
                  {REQUIRED_DOCS.map((t) => docRow(t, true))}
                  {OPTIONAL_DOCS.map((t) => docRow(t, false))}
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
                  <p className="mb-2 font-semibold text-foreground">Before you submit</p>
                  <ul className="list-disc space-y-1 pl-5">
                    <li>The platform sets consultation fees. Your payout is 60% after a flat 40% platform commission.</li>
                    <li>Free follow-ups: 3 days for GP and 5 days for specialists.</li>
                    <li>Consultations are not recorded at launch.</li>
                  </ul>
                </div>
                {([
                  ['terms', 'I have read and accept the Doctor Terms and Conditions.'],
                  ['data', 'I consent to One Roof Pediatrics processing my professional and identity data to verify and list me.'],
                  ['truth', 'I confirm the details and documents I submitted are true and belong to me.'],
                ] as const).map(([k, label]) => (
                  <label key={k} className="flex cursor-pointer items-start gap-3 text-sm text-foreground">
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={agree[k]}
                      onChange={(e) => setAgree({ ...agree, [k]: e.target.checked })}
                    />
                    {label}
                  </label>
                ))}
              </>
            )}
          </div>

          <div className="mt-8 flex gap-3">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="h-12 rounded-xl border border-border px-5 font-medium text-foreground hover:bg-muted/40"
              >
                Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                disabled={!canNext}
                className="h-12 flex-1 rounded-xl bg-primary font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canNext}
                className="h-12 flex-1 rounded-xl bg-primary font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                Submit for verification
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
