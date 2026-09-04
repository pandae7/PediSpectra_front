/**
 * Patient Data — Storage helpers for patient profiles (localStorage-only demo).
 * Mirrors the patterns established in mock-data.ts.
 */

export interface Child {
  id: string
  name: string
  age: number
  sex: 'Male' | 'Female' | 'Other'
}

export interface PatientProfile {
  id: string
  identifierType: 'phone' | 'email'
  phone?: string
  email?: string
  parentName: string
  city?: string
  children: Child[]
  createdAt: string
}

const PATIENTS_KEY = 'pedispectra-patients'
export const CURRENT_PATIENT_KEY = 'pedispectra-current-patient'

export function getPatients(): PatientProfile[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(PATIENTS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function findPatientByIdentifier(
  type: 'phone' | 'email',
  value: string
): PatientProfile | null {
  const patients = getPatients()
  const normalized = value.trim().toLowerCase()
  const found = patients.find((p) => {
    if (type === 'phone') return p.phone?.trim() === value.trim()
    return p.email?.trim().toLowerCase() === normalized
  })
  return found || null
}

export function addPatient(profile: PatientProfile) {
  const patients = getPatients()
  patients.push(profile)
  try {
    localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients))
  } catch {}
  return patients
}

export function updatePatient(updated: PatientProfile) {
  const patients = getPatients()
  const idx = patients.findIndex((p) => p.id === updated.id)
  if (idx >= 0) patients[idx] = updated
  try {
    localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients))
  } catch {}
  return patients
}
