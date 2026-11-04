'use client'

import { useState } from 'react'
import { Info, Plus, Trash2 } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { GrowthCharts } from '@/components/growth/growth-charts'
import { usePatient } from '@/lib/patient-context'
import type { Measurement } from '@/lib/patient-data'

function todayISO() {
  const d = new Date()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
}

const inputCls =
  'h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'

export default function GrowthChartPage() {
  const { currentPatient, activeChild, updateCurrentPatient, isLoading } = usePatient()

  const [date, setDate] = useState(todayISO())
  const [ageInput, setAgeInput] = useState('')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar showBack backHref="/" />
        <div className="flex items-center justify-center py-20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </div>
    )
  }

  if (!currentPatient || !activeChild) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar showBack backHref="/" />
        <div className="mx-auto max-w-md px-4 py-20 text-center">
          <h1 className="text-xl font-bold text-foreground">Growth chart</h1>
          <p className="mt-2 text-muted-foreground">Log in to view and track your child&apos;s growth.</p>
          <a
            href="/login/patient?returnTo=/patient/growth-chart"
            className="mt-6 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Log in
          </a>
        </div>
      </div>
    )
  }

  const child = activeChild
  const measurements = child.measurements ?? []

  const ageYears = ageInput.trim() ? Number(ageInput) : child.age
  const w = weight.trim() ? Number(weight) : undefined
  const h = height.trim() ? Number(height) : undefined
  const valid =
    (w !== undefined || h !== undefined) &&
    (w === undefined || (w > 0.5 && w <= 200)) &&
    (h === undefined || (h >= 25 && h <= 230)) &&
    Number.isFinite(ageYears) &&
    ageYears >= 0 &&
    ageYears <= 18 &&
    date.length > 0

  const saveMeasurements = (next: Measurement[]) => {
    updateCurrentPatient({
      ...currentPatient,
      children: currentPatient.children.map((c) => (c.id === child.id ? { ...c, measurements: next } : c)),
    })
  }

  const handleAdd = () => {
    if (!valid) return
    const m: Measurement = {
      id: `m-${Date.now()}`,
      date,
      ageYears,
      weightKg: w,
      heightCm: h,
      source: 'manual',
    }
    saveMeasurements([...measurements, m])
    setWeight('')
    setHeight('')
    setAgeInput('')
  }

  const handleDelete = (id: string) => saveMeasurements(measurements.filter((m) => m.id !== id))

  const sorted = [...measurements].sort((a, b) => b.ageYears - a.ageYears || b.date.localeCompare(a.date))

  return (
    <div className="min-h-screen bg-background">
      <Navbar showBack backHref="/" />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-foreground">Growth chart: {child.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {child.age} yrs &middot; {child.sex}
        </p>

        <div className="mt-4 flex items-start gap-2 rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p>
            Demo reference curves are illustrative only and are not official WHO data. They are not for clinical use.
            Always discuss your child&apos;s growth with your doctor.
          </p>
        </div>

        <div className="mt-6">
          <GrowthCharts child={child} />
        </div>

        {/* Add measurement */}
        <div className="mt-6 rounded-xl border border-border bg-card p-5">
          <h2 className="font-semibold text-foreground">Add a measurement</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">Enter weight, height, or both.</p>

          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">Date</label>
              <input type="date" value={date} max={todayISO()} onChange={(e) => setDate(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">Age (years)</label>
              <input
                type="number"
                min={0}
                max={18}
                step={0.1}
                value={ageInput}
                onChange={(e) => setAgeInput(e.target.value)}
                placeholder={String(child.age)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">Weight (kg)</label>
              <input
                type="number"
                min={0}
                step={0.1}
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g. 18.5"
                className={inputCls}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">Height (cm)</label>
              <input
                type="number"
                min={0}
                step={0.1}
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="e.g. 105"
                className={inputCls}
              />
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={!valid}
            className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Add measurement
          </button>
        </div>

        {/* History */}
        <div className="mt-6 rounded-xl border border-border bg-card p-5">
          <h2 className="font-semibold text-foreground">Measurement history</h2>
          {sorted.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">No measurements recorded yet for {child.name}.</p>
          ) : (
            <div className="mt-3 divide-y divide-border">
              {sorted.map((m) => (
                <div key={m.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <div>
                    <p className="text-foreground">
                      {m.weightKg !== undefined && <span>{m.weightKg} kg</span>}
                      {m.weightKg !== undefined && m.heightCm !== undefined && <span className="text-muted-foreground"> &middot; </span>}
                      {m.heightCm !== undefined && <span>{m.heightCm} cm</span>}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Age {m.ageYears} yrs &middot;{' '}
                      {new Date(m.date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {' '}&middot; {m.source === 'signup' ? 'at signup' : m.source === 'pre-consult' ? 'pre-consult' : 'added by you'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(m.id)}
                    aria-label="Remove measurement"
                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}