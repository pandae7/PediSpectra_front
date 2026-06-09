'use client'

import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ActionBar } from '@/components/flow/action-bar'
import { FlowHeader } from '@/components/flow/flow-header'
import { ChipGroup, Field, TextArea, TextInput } from '@/components/flow/form-fields'
import { PhoneFrame } from '@/components/flow/phone-frame'
import { Button } from '@/components/ui/button'
import { useConsult } from '@/lib/consult-context'
import { RELATION_OPTIONS, SEX_OPTIONS } from '@/lib/mock-data'
import { useStepGuard } from '@/lib/use-step-guard'
import { cn } from '@/lib/utils'

export default function IntakePage() {
  const allowed = useStepGuard('intake')
  const router = useRouter()
  const { intake, updateIntake, intakeComplete } = useConsult()

  if (!allowed) return null

  const proceed = () => {
    if (intakeComplete) router.push('/login')
  }

  return (
    <PhoneFrame>
      <FlowHeader
        title="Tell us about your child"
        subtitle="Step 2 of 6 · Helps the doctor prepare"
        currentStep="intake"
        onBack={() => router.push('/safety')}
      />

      <main className="flex flex-1 flex-col gap-5 px-5 py-5">
        <Field label="Child's name" htmlFor="childName">
          <TextInput
            id="childName"
            placeholder="e.g. Aarav"
            value={intake.childName}
            onChange={(e) => updateIntake({ childName: e.target.value })}
          />
        </Field>

        <Field label="Age">
          <div className="flex gap-2">
            <TextInput
              inputMode="numeric"
              placeholder="0"
              aria-label="Age value"
              className="w-20 text-center"
              value={intake.ageValue}
              onChange={(e) =>
                updateIntake({ ageValue: e.target.value.replace(/\D/g, '').slice(0, 2) })
              }
            />
            <div className="flex gap-2">
              {(['years', 'months'] as const).map((unit) => (
                <button
                  key={unit}
                  type="button"
                  onClick={() => updateIntake({ ageUnit: unit })}
                  className={cn(
                    'rounded-lg border px-4 text-sm font-medium capitalize transition-colors',
                    intake.ageUnit === unit
                      ? 'border-primary bg-primary/15 text-primary'
                      : 'border-border bg-secondary text-muted-foreground',
                  )}
                >
                  {unit}
                </button>
              ))}
            </div>
          </div>
        </Field>

        <Field label="Sex">
          <ChipGroup
            ariaLabel="Sex"
            options={SEX_OPTIONS}
            value={intake.sex}
            onChange={(val) => updateIntake({ sex: val })}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Weight (kg)" htmlFor="weight" hint="Optional">
            <TextInput
              id="weight"
              inputMode="decimal"
              placeholder="e.g. 14"
              value={intake.weightKg}
              onChange={(e) => updateIntake({ weightKg: e.target.value })}
            />
          </Field>
          <Field label="Temperature (°F)" htmlFor="temp" hint="Optional">
            <TextInput
              id="temp"
              inputMode="decimal"
              placeholder="e.g. 101"
              value={intake.temperature}
              onChange={(e) => updateIntake({ temperature: e.target.value })}
            />
          </Field>
        </div>

        <Field label="You are the child's" hint="Helps the doctor address you correctly">
          <ChipGroup
            ariaLabel="Relation to child"
            options={RELATION_OPTIONS}
            value={intake.relation}
            onChange={(val) => updateIntake({ relation: val })}
          />
        </Field>

        <Field label="What's going on?" htmlFor="symptoms">
          <TextArea
            id="symptoms"
            placeholder="e.g. Fever since last night, not eating, mild cough"
            value={intake.symptoms}
            onChange={(e) => updateIntake({ symptoms: e.target.value })}
          />
        </Field>

        <Field label="Since when?" htmlFor="duration" hint="Optional">
          <TextInput
            id="duration"
            placeholder="e.g. 2 days"
            value={intake.duration}
            onChange={(e) => updateIntake({ duration: e.target.value })}
          />
        </Field>
      </main>

      <ActionBar hint={!intakeComplete ? 'Name, age, sex and symptoms are required' : undefined}>
        <Button size="lg" className="h-12 text-[15px]" disabled={!intakeComplete} onClick={proceed}>
          Continue to verify number
          <ArrowRight className="size-4" />
        </Button>
      </ActionBar>
    </PhoneFrame>
  )
}
