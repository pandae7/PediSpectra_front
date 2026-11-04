'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, MapPin, Pencil, Phone, Plus, User } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ChildAvatar } from '@/components/layout/child-avatar'
import { usePatient } from '@/lib/patient-context'
import { formatAge } from '@/lib/child-age'

export default function PatientProfilePage() {
  const router = useRouter()
  const { currentPatient, activeChild, setActiveChild, isLoading, updateCurrentPatient } = usePatient()
  const [editingCity, setEditingCity] = useState(false)
  const [cityDraft, setCityDraft] = useState('')

  useEffect(() => {
    if (!isLoading && !currentPatient) {
      router.replace('/login/patient')
    }
  }, [isLoading, currentPatient, router])

  if (isLoading || !currentPatient) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar showBack backHref="/" />
        <div className="flex items-center justify-center px-4 py-24">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  const startCityEdit = () => {
    setCityDraft(currentPatient.city ?? '')
    setEditingCity(true)
  }

  const saveCity = () => {
    updateCurrentPatient({ ...currentPatient, city: cityDraft.trim() || undefined })
    setEditingCity(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar showBack backHref="/" />

      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl space-y-6">
          <h1 className="text-2xl font-bold text-foreground">My Profile</h1>

          {/* Parent details */}
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">{currentPatient.parentName}</h2>
                <p className="text-sm text-muted-foreground">Parent / Guardian</p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{currentPatient.phone || 'Not provided'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{currentPatient.email || 'Not provided'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                {editingCity ? (
                  <div className="flex flex-1 items-center gap-2">
                    <input
                      type="text"
                      value={cityDraft}
                      onChange={(e) => setCityDraft(e.target.value)}
                      maxLength={80}
                      placeholder="City"
                      className="h-9 flex-1 rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <button
                      onClick={saveCity}
                      className="h-9 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingCity(false)}
                      className="h-9 rounded-lg border border-border px-3 text-sm text-muted-foreground hover:text-foreground"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-foreground">{currentPatient.city || 'Not provided'}</span>
                    <button
                      onClick={startCityEdit}
                      aria-label="Edit city"
                      className="ml-1 rounded p-1 text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Name, phone and email can&apos;t be changed here yet.
            </p>
          </div>

          {/* Children */}
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Children</h2>

            <div className="space-y-3">
              {currentPatient.children.map((child) => {
                const isActive = child.id === activeChild?.id
                return (
                  <div
                    key={child.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-3"
                  >
                    <div className="flex items-center gap-3">
                      <ChildAvatar child={child} siblings={currentPatient.children} size="lg" />
                      <div>
                        <p className="font-medium text-foreground">
                          {child.name}
                          {isActive && (
                            <span className="ml-2 rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-medium text-primary">
                              Viewing
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatAge(child)} &middot; {child.sex}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!isActive && (
                        <button
                          onClick={() => setActiveChild(child.id)}
                          className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent"
                        >
                          Switch to
                        </button>
                      )}
                      <a
                        href={'/patient/children/' + child.id}
                        className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent"
                      >
                        <Pencil className="h-3 w-3" />
                        Edit
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>

            <a
              href="/patient/children/new"
              className="mt-4 flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              <Plus className="h-4 w-4" />
              Add a child
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}