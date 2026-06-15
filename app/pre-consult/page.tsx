'use client'

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileText,
  HeartPulse,
  Paperclip,
  Pill,
  Ruler,
  ShieldCheck,
  Thermometer,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ActionBar } from '@/components/flow/action-bar'
import { Field, TextArea, TextInput } from '@/components/flow/form-fields'
import { PhoneFrame } from '@/components/flow/phone-frame'
import { StatusPill } from '@/components/flow/status-pill'
import { Button } from '@/components/ui/button'
import { useConsult } from '@/lib/consult-context'
import { SCHEDULED_DOCTORS } from '@/lib/scheduled-doctors'
import { cn } from '@/lib/utils'

const MOCK_DOCUMENTS = [
  {
    id: 'old-rx',
    title: 'Previous prescription',
    helper: 'Photo or PDF from an earlier visit',
  },
  {
    id: 'lab-report',
    title: 'Lab report',
    helper: 'Blood test, urine test, culture report',
  },
  {
    id: 'rash-photo',
    title: 'Symptom photo',
    helper: 'Rash, swelling, stool, or visible concern',
  },
]

export default function PreConsultPage() {
  const router = useRouter()
  const {
    bookedSlot,
    childProfiles,
    preConsultHandoff,
    preConsultReady,
    selectedChildId,
    updatePreConsultHandoff,
  } = useConsult()
  const child = childProfiles.find((item) => item.id === selectedChildId) ?? childProfiles[0]
  const doctor = bookedSlot
    ? SCHEDULED_DOCTORS.find((item) => item.id === bookedSlot.doctorId)
    : null
  const slot = doctor?.slots.find((item) => item.id === bookedSlot?.slotId)

  const toggleDocument = (id: string) => {
    const selected = preConsultHandoff.selectedDocuments.includes(id)
    updatePreConsultHandoff({
      selectedDocuments: selected
        ? preConsultHandoff.selectedDocuments.filter((item) => item !== id)
        : [...preConsultHandoff.selectedDocuments, id],
    })
  }

  return (
    <PhoneFrame>
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            type="button"
            onClick={() => router.push('/doctors')}
            aria-label="Go back"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-sm font-semibold leading-tight text-foreground">
              Prepare for consult
            </h1>
            <p className="truncate text-xs text-muted-foreground">
              Share current condition with the doctor
            </p>
          </div>
          <StatusPill tone="primary">Parent handoff</StatusPill>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-5 px-5 py-5">
        <section className="rounded-xl border border-primary/30 bg-primary/10 p-4">
          <div className="mb-3 flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">Before the video call</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                This update will be shared with the consulting doctor before the appointment starts.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 border-t border-border pt-3 text-xs">
            <div>
              <p className="text-muted-foreground">Child</p>
              <p className="font-medium text-foreground">{child?.name ?? 'Selected child'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Doctor</p>
              <p className="font-medium text-foreground">{doctor?.name ?? 'Selected doctor'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Speciality</p>
              <p className="font-medium text-foreground">{doctor?.speciality ?? bookedSlot?.speciality}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Slot</p>
              <p className="font-medium text-foreground">
                {slot ? `${slot.day}, ${slot.time}` : 'Selected slot'}
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <HeartPulse className="size-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Current condition</h2>
          </div>
          <Field label="What is happening now?" htmlFor="condition-update" hint="Required">
            <TextArea
              id="condition-update"
              placeholder="Example: Wheezing since morning, cough is worse at night, no fever right now."
              value={preConsultHandoff.conditionUpdate}
              onChange={(e) => updatePreConsultHandoff({ conditionUpdate: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Temperature" htmlFor="temperature">
              <div className="relative">
                <Thermometer className="pointer-events-none absolute left-3 top-3.5 size-4 text-muted-foreground" />
                <TextInput
                  id="temperature"
                  inputMode="decimal"
                  placeholder="99.5 F"
                  className="pl-9"
                  value={preConsultHandoff.temperature}
                  onChange={(e) => updatePreConsultHandoff({ temperature: e.target.value })}
                />
              </div>
            </Field>
            <Field label="Weight" htmlFor="weight">
              <div className="relative">
                <Ruler className="pointer-events-none absolute left-3 top-3.5 size-4 text-muted-foreground" />
                <TextInput
                  id="weight"
                  inputMode="decimal"
                  placeholder="18 kg"
                  className="pl-9"
                  value={preConsultHandoff.weightKg}
                  onChange={(e) => updatePreConsultHandoff({ weightKg: e.target.value })}
                />
              </div>
            </Field>
          </div>
          <Field label="Height" htmlFor="height" hint="Optional now, useful for doctor-side BMI later">
            <TextInput
              id="height"
              inputMode="decimal"
              placeholder="110 cm"
              value={preConsultHandoff.heightCm}
              onChange={(e) => updatePreConsultHandoff({ heightCm: e.target.value })}
            />
          </Field>
        </section>

        <section className="space-y-3 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <Pill className="size-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Medical context</h2>
          </div>
          <Field label="Medicines already given" htmlFor="medicines">
            <TextArea
              id="medicines"
              placeholder="Example: Salbutamol nebulization at 2 PM, paracetamol yesterday night."
              value={preConsultHandoff.medicinesGiven}
              onChange={(e) => updatePreConsultHandoff({ medicinesGiven: e.target.value })}
            />
          </Field>
          <Field label="Allergies" htmlFor="allergies">
            <TextInput
              id="allergies"
              placeholder="No known allergies"
              value={preConsultHandoff.allergies}
              onChange={(e) => updatePreConsultHandoff({ allergies: e.target.value })}
            />
          </Field>
          <Field label="Known conditions" htmlFor="conditions">
            <TextInput
              id="conditions"
              placeholder="Asthma, epilepsy, congenital heart disease, etc."
              value={preConsultHandoff.previousConditions}
              onChange={(e) => updatePreConsultHandoff({ previousConditions: e.target.value })}
            />
          </Field>
        </section>

        <section className="space-y-3 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <Paperclip className="size-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Attach previous records</h2>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Demo only: these buttons simulate selecting files. Real upload/storage can be added later.
          </p>
          <div className="grid grid-cols-1 gap-2.5">
            {MOCK_DOCUMENTS.map((doc) => {
              const active = preConsultHandoff.selectedDocuments.includes(doc.id)
              return (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => toggleDocument(doc.id)}
                  className={cn(
                    'flex items-center gap-3 rounded-xl border p-3.5 text-left transition-colors',
                    active ? 'border-primary bg-primary/15' : 'border-border bg-secondary',
                  )}
                >
                  <FileText className="size-4 shrink-0 text-primary" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-foreground">{doc.title}</span>
                    <span className="block text-xs text-muted-foreground">{doc.helper}</span>
                  </span>
                  {active ? <CheckCircle2 className="size-5 text-primary" /> : null}
                </button>
              )
            })}
          </div>
        </section>

        <section className="space-y-3 rounded-xl border border-border bg-card p-4">
          <Field label="Anything else the doctor should know?" htmlFor="parent-note">
            <TextArea
              id="parent-note"
              placeholder="Example: Child gets anxious on video calls, please speak slowly."
              value={preConsultHandoff.parentNote}
              onChange={(e) => updatePreConsultHandoff({ parentNote: e.target.value })}
            />
          </Field>
          <label className="flex items-start gap-3 rounded-xl border border-border bg-secondary p-3.5 text-sm text-foreground">
            <input
              type="checkbox"
              checked={preConsultHandoff.consentToShare}
              onChange={(e) => updatePreConsultHandoff({ consentToShare: e.target.checked })}
              className="mt-1 size-4 accent-primary"
            />
            <span>
              I agree to share this information and selected records with the consulting doctor for
              this appointment.
              <span className="mt-1 block text-xs text-muted-foreground">Required to continue.</span>
            </span>
          </label>
        </section>
      </main>

      <ActionBar
        hint={
          preConsultReady
            ? 'Ready to share with the doctor.'
            : 'Add current condition and consent to continue.'
        }
      >
        <Button
          size="lg"
          className="h-12 text-[15px]"
          disabled={!preConsultReady}
          onClick={() => router.push('/consultations')}
        >
          Save handoff
          <ArrowRight className="size-4" />
        </Button>
      </ActionBar>
    </PhoneFrame>
  )
}
