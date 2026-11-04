'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Activity, Calendar, MessageCircle, Pencil, Stethoscope } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ChildAvatar } from '@/components/layout/child-avatar'
import { ChildSwitcher } from '@/components/layout/child-switcher'
import { SymptomChat } from '@/components/triage/symptom-chat'
import { usePatient } from '@/lib/patient-context'
import {
  getConsultations,
  getDoctors,
  initializeMockData,
  GP_SUBSPECIALITY,
  type Consultation,
  type DoctorProfile,
} from '@/lib/mock-data'
import { estimatePercentile } from '@/lib/growth-data'
import { formatAge, localDateISO } from '@/lib/child-age'
import { cn } from '@/lib/utils'

const DAY_MS = 24 * 60 * 60 * 1000

function timeToMinutes(t: string) {
  const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(t.trim())
  if (!m) return 0
  let h = Number(m[1]) % 12
  if (m[3].toUpperCase() === 'PM') h += 12
  return h * 60 + Number(m[2])
}

// Whole days from today to the given ISO date (negative = in the past).
function dayDiff(iso: string) {
  const today = new Date()
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
  return Math.round((new Date(iso + 'T00:00:00').getTime() - start) / DAY_MS)
}

function formatDay(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
}

function addDaysISO(iso: string, days: number) {
  const d = new Date(iso + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return localDateISO(d)
}

function agoLabel(days: number) {
  if (days <= 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 30) return days + ' days ago'
  const months = Math.floor(days / 30)
  return months + (months === 1 ? ' month ago' : ' months ago')
}

function Card({ title, className, children }: { title: string; className?: string; children: ReactNode }) {
  return (
    <div className={cn('rounded-xl border border-border bg-card p-5', className)}>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
      {children}
    </div>
  )
}

function Sparkline({ values }: { values: number[] }) {
  if (values.length < 2) return null
  const w = 280
  const h = 44
  const pad = 4
  const min = Math.min(...values)
  const span = Math.max(...values) - min || 1
  const pts = values.map((v, i) => [
    pad + (i * (w - pad * 2)) / (values.length - 1),
    h - pad - ((v - min) / span) * (h - pad * 2),
  ])
  return (
    <svg viewBox={'0 0 ' + w + ' ' + h} className="h-11 w-full" role="img" aria-label="Weight trend">
      <polyline
        points={pts.map((p) => p.join(',')).join(' ')}
        className="fill-none stroke-primary"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="3" className="fill-primary" />
      ))}
    </svg>
  )
}

interface Todo {
  key: string
  text: string
  href: string
  badge?: string
}

export default function ChildHomePage() {
  const router = useRouter()
  const { currentPatient, activeChild, isLoading } = usePatient()
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [doctors, setDoctors] = useState<DoctorProfile[]>([])
  const [preDone, setPreDone] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (!isLoading && !currentPatient) {
      router.replace('/login/patient?returnTo=' + encodeURIComponent('/patient/home'))
    }
  }, [isLoading, currentPatient, router])

  useEffect(() => {
    initializeMockData()
    const all = getConsultations()
    setConsultations(all)
    setDoctors(getDoctors())
    const done: Record<string, boolean> = {}
    for (const c of all) {
      try {
        done[c.id] = !!localStorage.getItem('pedispectra-preconsult-' + c.id)
      } catch {}
    }
    setPreDone(done)
  }, [])

  if (isLoading || !currentPatient || !activeChild) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar showBack backHref="/" />
        <div className="flex items-center justify-center py-24">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </div>
    )
  }

  const child = activeChild
  const siblings = currentPatient.children
  const doctorName = (id: string) => doctors.find((d) => d.id === id)?.name ?? 'Doctor'

  const mine = consultations.filter((c) => c.childId === child.id)
  const upcoming = mine
    .filter((c) => c.status === 'upcoming')
    .sort((a, b) => a.date.localeCompare(b.date) || timeToMinutes(a.time) - timeToMinutes(b.time))
  const completed = mine.filter((c) => c.status === 'completed').sort((a, b) => b.date.localeCompare(a.date))
  const next = upcoming[0]
  const recent = completed.slice(0, 3)

  // Growth snapshot
  const measurements = child.measurements ?? []
  const latestOf = (key: 'weightKg' | 'heightCm') => {
    const list = measurements.filter((m) => m[key] !== undefined)
    if (list.length === 0) return null
    return list.reduce((a, b) => (b.ageYears > a.ageYears || (b.ageYears === a.ageYears && b.date >= a.date) ? b : a))
  }
  const lw = latestOf('weightKg')
  const lh = latestOf('heightCm')
  const wEst = lw ? estimatePercentile('weight', child.sex, lw.ageYears, lw.weightKg as number) : null
  const hEst = lh ? estimatePercentile('height', child.sex, lh.ageYears, lh.heightCm as number) : null
  const weightSeries = [...measurements]
    .filter((m) => m.weightKg !== undefined)
    .sort((a, b) => a.ageYears - b.ageYears)
    .map((m) => m.weightKg as number)
  const lastMeasured = measurements.length > 0 ? measurements.map((m) => m.date).sort().slice(-1)[0] : null
  const daysSinceMeasured = lastMeasured ? -dayDiff(lastMeasured) : null

  // To do and reminders
  const todos: Todo[] = []
  for (const c of upcoming) {
    if (!preDone[c.id]) {
      todos.push({ key: 'pre-' + c.id, text: 'Fill pre-consult form (' + formatDay(c.date) + ')', href: '/patient/pre-consult/' + c.id })
    }
  }
  if (daysSinceMeasured === null || daysSinceMeasured > 90) {
    todos.push({ key: 'measure', text: `Add ${child.name}'s latest weight and height`, href: '/patient/growth-chart' })
  }
  for (const c of completed) {
    const windowDays = c.subspeciality === GP_SUBSPECIALITY ? 3 : 5
    const elapsed = -dayDiff(c.date)
    if (elapsed >= 0 && elapsed <= windowDays) {
      todos.push({
        key: 'fu-' + c.id,
        text: 'Free follow-up with ' + doctorName(c.doctorId) + ' until ' + formatDay(addDaysISO(c.date, windowDays)),
        href: '/booking/' + c.doctorId,
        badge: 'Free',
      })
    }
  }

  const countdown = next
    ? (() => {
        const d = dayDiff(next.date)
        if (d === 0) return ' (today)'
        if (d === 1) return ' (tomorrow)'
        return d > 1 ? ' (in ' + d + ' days)' : ''
      })()
    : ''
  const doctorInitials = next
    ? doctorName(next.doctorId)
        .replace(/^Dr\.?\s*/i, '')
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
    : ''

  const primaryBtn =
    'inline-flex h-10 items-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90'
  const outlineBtn =
    'inline-flex h-10 items-center rounded-lg border border-border px-4 text-sm text-foreground transition-colors hover:bg-accent'
  const tileCls =
    'flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/50'

  return (
    <div className="min-h-screen bg-background">
      <Navbar showBack backHref="/" />

      <div className="mx-auto max-w-6xl space-y-5 px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-4">
            <ChildAvatar child={child} siblings={siblings} size="xl" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">{child.name}&apos;s health hub</h1>
              <p className="text-sm text-muted-foreground">
                {formatAge(child)} &middot; {child.sex} &middot; Showing {child.name}&apos;s records only
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href={'/patient/children/' + child.id} className={cn(outlineBtn, 'gap-2')}>
              <Pencil className="h-3.5 w-3.5" />
              Edit profile
            </a>
            <ChildSwitcher />
          </div>
        </div>

        {/* Next appointment + growth */}
        <div className="grid gap-5 lg:grid-cols-3">
          <Card title="Next appointment" className="lg:col-span-2">
            {next ? (
              <div className="mt-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-base font-bold text-primary">
                      {doctorInitials}
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-foreground">{doctorName(next.doctorId)}</p>
                      <p className="text-sm text-muted-foreground">{next.subspeciality}</p>
                      <p className="mt-1 text-sm text-foreground">
                        {formatDay(next.date)} &middot; {next.time}
                        {countdown}
                      </p>
                    </div>
                  </div>
                  {!preDone[next.id] && (
                    <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-medium text-foreground">
                      Pre-consult form pending
                    </span>
                  )}
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  {!preDone[next.id] ? (
                    <a href={'/patient/pre-consult/' + next.id} className={primaryBtn}>
                      Fill pre-consult form
                    </a>
                  ) : (
                    <a href={'/patient/consult-room/' + next.id} className={primaryBtn}>
                      Join video consult
                    </a>
                  )}
                  <a href="/patient/consultations" className={outlineBtn}>
                    View all
                  </a>
                </div>
              </div>
            ) : (
              <div className="mt-3">
                <p className="text-sm text-muted-foreground">No upcoming appointment for {child.name}.</p>
                <a href="/doctors" className={cn(primaryBtn, 'mt-4')}>
                  Find a doctor
                </a>
              </div>
            )}
          </Card>

          <Card title="Growth snapshot">
            {lw || lh ? (
              <div className="mt-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xl font-bold text-foreground">{lw ? lw.weightKg + ' kg' : '--'}</p>
                    <p className="text-[11px] text-muted-foreground">{wEst ? wEst.text : 'No weight yet'}</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-foreground">{lh ? lh.heightCm + ' cm' : '--'}</p>
                    <p className="text-[11px] text-muted-foreground">{hEst ? hEst.text : 'No height yet'}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <Sparkline values={weightSeries} />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {daysSinceMeasured !== null ? 'Last measured ' + agoLabel(daysSinceMeasured) : ''}
                  </span>
                  <a href="/patient/growth-chart" className="text-primary hover:underline">
                    View growth chart &rarr;
                  </a>
                </div>
              </div>
            ) : (
              <div className="mt-3">
                <p className="text-sm text-muted-foreground">No measurements recorded for {child.name} yet.</p>
                <a href="/patient/growth-chart" className={cn(outlineBtn, 'mt-4')}>
                  Add the first measurement
                </a>
              </div>
            )}
          </Card>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <a href="/doctors" className={tileCls}>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Stethoscope className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-foreground">Find a doctor</span>
              <span className="block text-xs text-muted-foreground">Book for {child.name}</span>
            </span>
          </a>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event('open-symptom-chat'))}
            className={tileCls}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
              <MessageCircle className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-foreground">Describe symptoms</span>
              <span className="block text-xs text-muted-foreground">Not sure who to see?</span>
            </span>
          </button>
          <a href="/patient/consultations" className={tileCls}>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Calendar className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-foreground">Consultations</span>
              <span className="block text-xs text-muted-foreground">{child.name}&apos;s visits</span>
            </span>
          </a>
          <a href="/patient/growth-chart" className={tileCls}>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Activity className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-foreground">Growth chart</span>
              <span className="block text-xs text-muted-foreground">Add a measurement</span>
            </span>
          </a>
        </div>

        {/* Recent visits + to do */}
        <div className="grid gap-5 lg:grid-cols-3">
          <Card title="Recent visits" className="lg:col-span-2">
            {recent.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">No visits yet for {child.name}.</p>
            ) : (
              <div className="mt-2 divide-y divide-border">
                {recent.map((c) => (
                  <div key={c.id} className="flex items-center justify-between gap-3 py-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{doctorName(c.doctorId)}</p>
                      <p className="text-xs text-muted-foreground">
                        {c.subspeciality} &middot; {formatDay(c.date)}
                      </p>
                    </div>
                    <a href={'/patient/post-consult/' + c.id} className="text-xs text-primary hover:underline">
                      View prescription &rarr;
                    </a>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card title="To do and reminders">
            {todos.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">You&apos;re all caught up.</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {todos.map((t) => (
                  <li key={t.key}>
                    <a href={t.href} className="flex items-start gap-2 text-sm text-foreground hover:text-primary">
                      <span className="mt-1 h-3.5 w-3.5 shrink-0 rounded border border-border" />
                      <span>
                        {t.text}
                        {t.badge && (
                          <span className="ml-2 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium text-primary">
                            {t.badge}
                          </span>
                        )}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-4 text-[11px] text-muted-foreground">Reminders also go out by WhatsApp or SMS.</p>
          </Card>
        </div>
      </div>

      <Footer />
      <SymptomChat />
    </div>
  )
}