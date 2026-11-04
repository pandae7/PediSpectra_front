'use client'

import { useState } from 'react'
import { isValidDob, localDateISO } from '@/lib/child-age'
import type { Child } from '@/lib/patient-data'

export interface ChildFormValues {
  name: string
  dob: string
  sex: Child['sex']
}

interface ChildFormProps {
  initial?: ChildFormValues
  dobRequired?: boolean
  warnOnSexChange?: boolean
  submitLabel: string
  onSubmit: (values: ChildFormValues) => void
}

const inputCls =
  'h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'

export function ChildForm({ initial, dobRequired = true, warnOnSexChange = false, submitLabel, onSubmit }: ChildFormProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [dob, setDob] = useState(initial?.dob ?? '')
  const [sex, setSex] = useState<Child['sex']>(initial?.sex ?? 'Male')

  const dobOk = dob === '' ? !dobRequired : isValidDob(dob)
  const valid = name.trim().length > 0 && dobOk
  const sexChanged = !!initial && sex !== initial.sex

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (valid) onSubmit({ name: name.trim(), dob, sex })
      }}
      className="space-y-5"
    >
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={100}
          placeholder="Child's name"
          className={inputCls}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Date of birth</label>
        <input
          type="date"
          value={dob}
          max={localDateISO()}
          onChange={(e) => setDob(e.target.value)}
          className={inputCls}
        />
        {dob !== '' && !dobOk ? (
          <p className="mt-1 text-xs text-destructive">Enter a valid date of birth (not in the future, up to 25 years ago).</p>
        ) : (
          <p className="mt-1 text-xs text-muted-foreground">
            Age is worked out from this, so growth charts stay accurate over time.
          </p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Sex</label>
        <select value={sex} onChange={(e) => setSex(e.target.value as Child['sex'])} className={inputCls}>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        {warnOnSexChange && sexChanged && (
          <p className="mt-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-foreground">
            Changing sex re-plots this child&apos;s whole growth history against the other reference curve.
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={!valid}
        className="h-11 w-full rounded-lg bg-primary font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {submitLabel}
      </button>
    </form>
  )
}