'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import {
  type PatientProfile,
  type Child,
  getPatients,
  addPatient,
  updatePatient,
  CURRENT_PATIENT_KEY,
  ACTIVE_CHILD_KEY,
} from './patient-data'
import { getConsultations, updateConsultation } from './mock-data'

// Older bookings were saved without a childId. Attach them to the matching child
// (same parent name and child name) so they do not disappear from every child's view.
function claimLegacyConsultations(patient: PatientProfile) {
  try {
    for (const c of getConsultations()) {
      if (c.childId || c.patientName !== patient.parentName) continue
      const child = patient.children.find(
        (ch) => ch.name.trim().toLowerCase() === c.childName.trim().toLowerCase()
      )
      if (child) updateConsultation({ ...c, childId: child.id })
    }
  } catch {}
}

interface PatientContextValue {
  currentPatient: PatientProfile | null
  activeChild: Child | null
  setActiveChild: (childId: string) => void
  isLoading: boolean
  login: (patient: PatientProfile) => void
  logout: () => void
  signup: (profile: Omit<PatientProfile, 'id' | 'createdAt'>) => PatientProfile
  updateCurrentPatient: (profile: PatientProfile) => void
}

const PatientContext = createContext<PatientContextValue | null>(null)

export function PatientProvider({ children }: { children: ReactNode }) {
  const [currentPatient, setCurrentPatientState] = useState<PatientProfile | null>(null)
  const [activeChildId, setActiveChildId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Restore logged-in patient from localStorage
    try {
      const savedId = localStorage.getItem(CURRENT_PATIENT_KEY)
      if (savedId) {
        const patients = getPatients()
        const patient = patients.find((p) => p.id === savedId)
        if (patient) {
          setCurrentPatientState(patient)
          claimLegacyConsultations(patient)
          const savedChild = localStorage.getItem(ACTIVE_CHILD_KEY)
          const validChild = patient.children.find((ch) => ch.id === savedChild)
          setActiveChildId(validChild ? validChild.id : patient.children[0]?.id ?? null)
        }
      }
    } catch {}
    setIsLoading(false)
  }, [])

  const login = (patient: PatientProfile) => {
    setCurrentPatientState(patient)
    claimLegacyConsultations(patient)
    const firstChild = patient.children[0]?.id ?? null
    setActiveChildId(firstChild)
    try {
      localStorage.setItem(CURRENT_PATIENT_KEY, patient.id)
      if (firstChild) localStorage.setItem(ACTIVE_CHILD_KEY, firstChild)
    } catch {}
  }

  const setActiveChild = (childId: string) => {
    setActiveChildId(childId)
    try {
      localStorage.setItem(ACTIVE_CHILD_KEY, childId)
    } catch {}
  }

  const logout = () => {
    setCurrentPatientState(null)
    setActiveChildId(null)
    try {
      localStorage.removeItem(CURRENT_PATIENT_KEY)
      localStorage.removeItem(ACTIVE_CHILD_KEY)
    } catch {}
  }

  const signup = (profile: Omit<PatientProfile, 'id' | 'createdAt'>) => {
    const newPatient: PatientProfile = {
      ...profile,
      id: `patient-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    addPatient(newPatient)
    login(newPatient)
    return newPatient
  }

  const updateCurrentPatient = (profile: PatientProfile) => {
    updatePatient(profile)
    setCurrentPatientState(profile)
  }

  const activeChild =
    currentPatient?.children.find((ch) => ch.id === activeChildId) ??
    currentPatient?.children[0] ??
    null

  return (
    <PatientContext.Provider
      value={{
        currentPatient,
        activeChild,
        setActiveChild,
        isLoading,
        login,
        logout,
        signup,
        updateCurrentPatient,
      }}
    >
      {children}
    </PatientContext.Provider>
  )
}

export function usePatient() {
  const ctx = useContext(PatientContext)
  if (!ctx) throw new Error('usePatient must be used within PatientProvider')
  return ctx
}
