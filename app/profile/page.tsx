'use client'

import { ArrowRight, Plus, Trash2, UserRound } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { ActionBar } from '@/components/flow/action-bar'
import { Field, ChipGroup, TextInput } from '@/components/flow/form-fields'
import { FlowHeader } from '@/components/flow/flow-header'
import { PhoneFrame } from '@/components/flow/phone-frame'
import { Button } from '@/components/ui/button'
import { useConsult, type ChildProfile } from '@/lib/consult-context'
import { SEX_OPTIONS } from '@/lib/mock-data'

const AGE_UNITS = ['years', 'months'] as const

const DRAFT_CHILD: ChildProfile = {
  id: 'child-draft',
  name: '',
  ageValue: '',
  ageUnit: 'years',
  sex: '',
}

function createChild(): ChildProfile {
  return {
    id: `child-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: '',
    ageValue: '',
    ageUnit: 'years',
    sex: '',
  }
}

export default function ProfilePage() {
  const router = useRouter()
  const {
    parentProfile,
    updateParentProfile,
    childProfiles,
    setChildProfiles,
    setSelectedChildId,
    normalProfileComplete,
  } = useConsult()

  const children = useMemo(() => (childProfiles.length > 0 ? childProfiles : [DRAFT_CHILD]), [childProfiles])

  const updateChild = (id: string, patch: Partial<ChildProfile>) => {
    setChildProfiles(children.map((child) => (child.id === id ? { ...child, ...patch } : child)))
  }

  const addChild = () => {
    setChildProfiles([...children, createChild()])
  }

  const removeChild = (id: string) => {
    const next = children.filter((child) => child.id !== id)
    setChildProfiles(next.length > 0 ? next : [createChild()])
  }

  const continueFlow = () => {
    const firstComplete = children.find(
      (child) => child.name.trim() && child.ageValue.trim() && child.sex.trim(),
    )
    if (firstComplete) setSelectedChildId(firstComplete.id)
    router.push('/home')
  }

  return (
    <PhoneFrame>
      <FlowHeader
        title="Family profile"
        subtitle="One parent account, multiple children"
        currentStep="landing"
        onBack={() => router.push('/login')}
        showProgress={false}
      />

      <main className="flex flex-1 flex-col gap-5 px-5 py-5">
        <section className="rounded-xl border border-border bg-card p-4">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <UserRound className="size-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Parent details</h2>
              <p className="text-xs text-muted-foreground">Used for appointments and updates</p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Field label="Parent name" htmlFor="parent-name">
              <TextInput
                id="parent-name"
                placeholder="Your name"
                value={parentProfile.name}
                onChange={(e) => updateParentProfile({ name: e.target.value })}
              />
            </Field>
            <Field label="Email" htmlFor="parent-email" hint="Optional for demo">
              <TextInput
                id="parent-email"
                type="email"
                placeholder="name@example.com"
                value={parentProfile.email}
                onChange={(e) => updateParentProfile({ email: e.target.value })}
              />
            </Field>
            <Field label="City" htmlFor="parent-city" hint="Optional for demo">
              <TextInput
                id="parent-city"
                placeholder="Hyderabad"
                value={parentProfile.city}
                onChange={(e) => updateParentProfile({ city: e.target.value })}
              />
            </Field>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Child profiles</h2>
              <p className="text-xs text-muted-foreground">Add every child you may book for</p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addChild}>
              <Plus className="size-4" />
              Add
            </Button>
          </div>

          {children.map((child, index) => (
            <div key={child.id} className="rounded-xl border border-border bg-card p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Child {index + 1}</h3>
                {children.length > 1 ? (
                  <button
                    type="button"
                    aria-label="Remove child profile"
                    onClick={() => removeChild(child.id)}
                    className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-danger"
                  >
                    <Trash2 className="size-4" />
                  </button>
                ) : null}
              </div>
              <div className="flex flex-col gap-3">
                <Field label="Child name" htmlFor={`${child.id}-name`}>
                  <TextInput
                    id={`${child.id}-name`}
                    placeholder="Child name"
                    value={child.name}
                    onChange={(e) => updateChild(child.id, { name: e.target.value })}
                  />
                </Field>
                <Field label="Age" htmlFor={`${child.id}-age`}>
                  <div className="grid grid-cols-[1fr_auto] gap-2">
                    <TextInput
                      id={`${child.id}-age`}
                      inputMode="numeric"
                      placeholder="6"
                      value={child.ageValue}
                      onChange={(e) =>
                        updateChild(child.id, { ageValue: e.target.value.replace(/\D/g, '').slice(0, 2) })
                      }
                    />
                    <ChipGroup
                      options={AGE_UNITS}
                      value={child.ageUnit}
                      onChange={(ageUnit) => updateChild(child.id, { ageUnit: ageUnit as ChildProfile['ageUnit'] })}
                      ariaLabel="Age unit"
                    />
                  </div>
                </Field>
                <Field label="Sex">
                  <ChipGroup
                    options={SEX_OPTIONS}
                    value={child.sex}
                    onChange={(sex) => updateChild(child.id, { sex })}
                    ariaLabel="Child sex"
                  />
                </Field>
              </div>
            </div>
          ))}
        </section>
      </main>

      <ActionBar hint="You can add more child profiles later.">
        <Button size="lg" className="h-12 text-[15px]" disabled={!normalProfileComplete} onClick={continueFlow}>
          Save profile
          <ArrowRight className="size-4" />
        </Button>
      </ActionBar>
    </PhoneFrame>
  )
}
