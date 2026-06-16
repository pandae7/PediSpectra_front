'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import {
  type DoctorProfile,
  type Consultation,
  getDoctors,
  addDoctor,
  getConsultations,
  updateConsultation,
  initializeMockData,
} from './mock-data'

interface DoctorContextValue {
  // Current logged-in doctor
  currentDoctor: DoctorProfile | null
  isLoading: boolean
  setCurrentDoctor: (doctor: DoctorProfile) => void
  logout: () => void

  // Doctor registry
  doctors: DoctorProfile[]
  onboardDoctor: (doctor: DoctorProfile) => void

  // Consultations
  consultations: Consultation[]
  getUpcoming: () => Consultation[]
  getCompleted: () => Consultation[]
  reschedule: (consultId: string, newDate: string, newTime: string) => void
  cancelConsultation: (consultId: string) => void
  completeConsultation: (consultId: string, remarks: string) => void
}

const DoctorContext = createContext<DoctorContextValue | null>(null)

export function DoctorProvider({ children }: { children: ReactNode }) {
  const [currentDoctor, setCurrentDoctorState] = useState<DoctorProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [doctors, setDoctors] = useState<DoctorProfile[]>([])
  const [consultations, setConsultations] = useState<Consultation[]>([])

  useEffect(() => {
    initializeMockData()
    setDoctors(getDoctors())
    setConsultations(getConsultations())

    // Restore logged-in doctor from localStorage
    try {
      const savedId = localStorage.getItem('pedispectra-current-doctor')
      if (savedId) {
        const docs = getDoctors()
        const doc = docs.find((d) => d.id === savedId)
        if (doc) setCurrentDoctorState(doc)
      }
    } catch {}
    setIsLoading(false)
  }, [])

  const setCurrentDoctor = (doctor: DoctorProfile) => {
    setCurrentDoctorState(doctor)
    try {
      localStorage.setItem('pedispectra-current-doctor', doctor.id)
    } catch {}
  }

  const logout = () => {
    setCurrentDoctorState(null)
    try {
      localStorage.removeItem('pedispectra-current-doctor')
    } catch {}
  }

  const onboardDoctor = (doctor: DoctorProfile) => {
    const updated = addDoctor(doctor)
    setDoctors(updated)
    setCurrentDoctor(doctor)
  }

  const getUpcoming = () => {
    if (!currentDoctor) return []
    return consultations
      .filter((c) => c.doctorId === currentDoctor.id && c.status === 'upcoming')
      .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))
  }

  const getCompleted = () => {
    if (!currentDoctor) return []
    return consultations
      .filter((c) => c.doctorId === currentDoctor.id && c.status === 'completed')
      .sort((a, b) => b.date.localeCompare(a.date))
  }

  const reschedule = (consultId: string, newDate: string, newTime: string) => {
    const consult = consultations.find((c) => c.id === consultId)
    if (!consult) return
    const updated = { ...consult, date: newDate, time: newTime }
    const all = updateConsultation(updated)
    setConsultations(all)
  }

  const cancelConsultation = (consultId: string) => {
    const consult = consultations.find((c) => c.id === consultId)
    if (!consult) return
    const updated = { ...consult, status: 'cancelled' as const }
    const all = updateConsultation(updated)
    setConsultations(all)
  }

  const completeConsultation = (consultId: string, remarks: string) => {
    const consult = consultations.find((c) => c.id === consultId)
    if (!consult) return
    const updated = {
      ...consult,
      status: 'completed' as const,
      postConsultData: { remarks, completedAt: new Date().toISOString() },
    }
    const all = updateConsultation(updated)
    setConsultations(all)
  }

  return (
    <DoctorContext.Provider
      value={{
        currentDoctor,
        isLoading,
        setCurrentDoctor,
        logout,
        doctors,
        onboardDoctor,
        consultations,
        getUpcoming,
        getCompleted,
        reschedule,
        cancelConsultation,
        completeConsultation,
      }}
    >
      {children}
    </DoctorContext.Provider>
  )
}

export function useDoctor() {
  const ctx = useContext(DoctorContext)
  if (!ctx) throw new Error('useDoctor must be used within DoctorProvider')
  return ctx
}
