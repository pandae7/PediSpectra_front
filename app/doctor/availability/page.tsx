'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Check, Clock } from 'lucide-react'
import { useDoctor } from '@/lib/doctor-context'
import { cn } from '@/lib/utils'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

function generateTimeSlots(): string[] {
  const slots: string[] = []
  for (let h = 8; h < 20; h++) {
    const hour12 = h > 12 ? h - 12 : h
    const period = h >= 12 ? 'PM' : 'AM'
    slots.push(`${hour12.toString().padStart(2, '0')}:00 ${period}`)
    slots.push(`${hour12.toString().padStart(2, '0')}:30 ${period}`)
  }
  return slots
}

const TIME_SLOTS = generateTimeSlots()

export default function DoctorAvailabilityPage() {
  const router = useRouter()
  const { currentDoctor } = useDoctor()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!currentDoctor) {
      router.push('/login/doctor')
      return
    }
    // Load existing availability
    try {
      const stored = localStorage.getItem(`pedispectra-availability-${currentDoctor.id}`)
      if (stored) {
        setSelected(new Set(JSON.parse(stored)))
      } else {
        // Seed from mock data
        const initial = currentDoctor.availability.map((s) => `${s.day}-${s.time}`)
        setSelected(new Set(initial))
      }
    } catch {}
  }, [currentDoctor, router])

  if (!currentDoctor) return null

  const toggleSlot = (day: string, time: string) => {
    const key = `${day}-${time}`
    const next = new Set(selected)
    if (next.has(key)) {
      next.delete(key)
    } else {
      next.add(key)
    }
    setSelected(next)
    setSaved(false)
  }

  const handleSave = () => {
    try {
      localStorage.setItem(
        `pedispectra-availability-${currentDoctor.id}`,
        JSON.stringify(Array.from(selected))
      )
    } catch {}
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => router.push('/doctor/dashboard')}
          className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Set Availability</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Click time slots to mark when you're available. 30-minute slots from 8 AM to 8 PM.
            </p>
          </div>
          <button
            onClick={handleSave}
            className="flex h-10 items-center gap-2 rounded-lg bg-primary px-5 font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            {saved ? <Check className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
            {saved ? 'Saved!' : 'Save'}
          </button>
        </div>

        {/* Grid */}
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-border">
                <th className="sticky left-0 bg-card px-3 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
                  Time
                </th>
                {DAYS.map((day) => (
                  <th key={day} className="px-2 py-3 text-center text-xs font-medium uppercase text-muted-foreground">
                    {day.slice(0, 3)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map((time) => (
                <tr key={time} className="border-b border-border/50">
                  <td className="sticky left-0 bg-card px-3 py-1 text-xs text-muted-foreground">
                    {time}
                  </td>
                  {DAYS.map((day) => {
                    const key = `${day}-${time}`
                    const isSelected = selected.has(key)
                    return (
                      <td key={key} className="px-1 py-1 text-center">
                        <button
                          onClick={() => toggleSlot(day, time)}
                          className={cn(
                            'h-7 w-full rounded transition-colors',
                            isSelected
                              ? 'bg-primary/80 hover:bg-primary'
                              : 'bg-muted/30 hover:bg-muted'
                          )}
                          aria-label={`${day} ${time} ${isSelected ? 'selected' : 'not selected'}`}
                        />
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          {selected.size} slot{selected.size !== 1 ? 's' : ''} selected
        </p>
      </div>
    </div>
  )
}
