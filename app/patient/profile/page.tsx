'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, MapPin, Phone, Plus, Trash2, User } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { usePatient } from '@/lib/patient-context'
import type { Child } from '@/lib/patient-data'

let childIdCounter = 0
function newChildId() {
  childIdCounter += 1
  return `child-draft-${Date.now()}-${childIdCounter}`
}

export default function PatientProfilePage() {
  const router = useRouter()
  const { currentPatient, isLoading, updateCurrentPatient } = usePatient()
  const [children, setChildren] = useState<Child[]>([])
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    if (!isLoading && !currentPatient) {
      router.replace('/login/patient')
    }
  }, [isLoading, currentPatient, router])

  useEffect(() => {
    if (currentPatient) {
      setChildren(currentPatient.children)
      setDirty(false)
    }
  }, [currentPatient])

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

  const handleAddChild = () => {
    setChildren((prev) => [...prev, { id: newChildId(), name: '', age: 0, sex: 'Male' }])
    setDirty(true)
  }

  const handleRemoveChild = (id: string) => {
    setChildren((prev) => (prev.length > 1 ? prev.filter((c) => c.id !== id) : prev))
    setDirty(true)
  }

  const handleChildChange = (id: string, field: keyof Child, value: string) => {
    setChildren((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, [field]: field === 'age' ? Number(value) : value } : c
      )
    )
    setDirty(true)
  }

  const isValid =
    children.length > 0 && children.every((c) => c.name.trim().length > 0 && c.age > 0 && c.sex)

  const handleSave = () => {
    if (!isValid) return
    updateCurrentPatient({
      ...currentPatient,
      children: children.map((c) => ({ ...c, name: c.name.trim() })),
    })
    setDirty(false)
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
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{currentPatient.city || 'Not provided'}</span>
              </div>
            </div>
          </div>

          {/* Children */}
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Children</h2>

            <div className="space-y-3">
              {children.map((child, idx) => (
                <div key={child.id} className="rounded-lg border border-border bg-background p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Child {idx + 1}</span>
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

            {dirty && (
              <button
                onClick={handleSave}
                disabled={!isValid}
                className="mt-5 h-11 w-full rounded-lg bg-primary font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                Save Changes
              </button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
