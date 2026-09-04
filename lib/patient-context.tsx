'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import {
  type PatientProfile,
  getPatients,
  addPatient,
  updatePatient,
  CURRENT_PATIENT_KEY,
} from './patient-data'

interface PatientContextValue {
  currentPatient: PatientProfile | null
  isLoading: boolean
  login: (patient: PatientProfile) => void
  logout: () => void
  signup: (profile: Omit<PatientProfile, 'id' | 'createdAt'>) => PatientProfile
  updateCurrentPatient: (profile: PatientProfile) => void
}

const PatientContext = createContext<PatientContextValue | null>(null)

export function PatientProvider({ children }: { children: ReactNode }) {
  const [currentPatient, setCurrentPatientState] = useState<PatientProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Restore logged-in patient from localStorage
    try {
      const savedId = localStorage.getItem(CURRENT_PATIENT_KEY)
      if (savedId) {
        const patients = getPatients()
        const patient = patients.find((p) => p.id === savedId)
        if (patient) setCurrentPatientState(patient)
      }
    } catch {}
    setIsLoading(false)
  }, [])

  const login = (patient: PatientProfile) => {
    setCurrentPatientState(patient)
    try {
      localStorage.setItem(CURRENT_PATIENT_KEY, patient.id)
    } catch {}
  }

  const logout = () => {
    setCurrentPatientState(null)
    try {
      localStorage.removeItem(CURRENT_PATIENT_KEY)
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

  return (
    <PatientContext.Provider
      value={{
        currentPatient,
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
