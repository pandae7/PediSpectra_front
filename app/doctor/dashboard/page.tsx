'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Calendar,
  Clock,
  History,
  LogOut,
  Stethoscope,
  Users,
  Video,
} from 'lucide-react'
import { useDoctor } from '@/lib/doctor-context'
import { ThemeSelector } from '@/components/ui/theme-selector'

export default function DoctorDashboardPage() {
  const router = useRouter()
  const { currentDoctor, logout, getUpcoming, getCompleted, isLoading } = useDoctor()

  useEffect(() => {
    if (!isLoading && !currentDoctor) {
      router.push('/login/doctor')
    }
  }, [currentDoctor, isLoading, router])

  if (isLoading || !currentDoctor) return null

  const upcoming = getUpcoming()
  const completed = getCompleted()

  const navItems = [
    { label: 'Upcoming', icon: Calendar, href: '/doctor/consultations', count: upcoming.length },
    { label: 'Availability', icon: Clock, href: '/doctor/availability' },
    { label: 'Patient History', icon: History, href: '/doctor/history', count: completed.length },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Stethoscope className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">
              One Roof <span className="text-primary">Pediatrics</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeSelector />
            <button
              onClick={() => { logout(); router.push('/') }}
              className="flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-sm text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* Welcome */}
        <section className="mb-8">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            Hello, {currentDoctor.name}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {currentDoctor.subspeciality} · {currentDoctor.workingHospital}
          </p>
        </section>

        {/* Stats */}
        <section className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{upcoming.length}</p>
                <p className="text-sm text-muted-foreground">Upcoming</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{currentDoctor.consultationCount}</p>
                <p className="text-sm text-muted-foreground">Total Consultations</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Video className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{completed.length}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation */}
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Quick Actions</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{item.label}</p>
                  </div>
                  {item.count !== undefined && (
                    <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-sm font-medium text-primary">
                      {item.count}
                    </span>
                  )}
                </a>
              )
            })}
          </div>
        </section>

        {/* Upcoming preview */}
        {upcoming.length > 0 && (
          <section>
            <h2 className="mb-4 text-lg font-semibold text-foreground">Next Consultations</h2>
            <div className="space-y-3">
              {upcoming.slice(0, 3).map((consult) => (
                <div
                  key={consult.id}
                  className="flex items-center justify-between rounded-xl border border-border bg-card p-4"
                >
                  <div>
                    <p className="font-medium text-foreground">{consult.childName}</p>
                    <p className="text-sm text-muted-foreground">
                      {consult.patientName} · {consult.subspeciality}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{consult.date}</p>
                    <p className="text-sm text-muted-foreground">{consult.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
