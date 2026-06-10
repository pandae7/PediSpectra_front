'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Doctor } from '@/lib/mock-data'

// The ordered steps of the flow. Each maps to a route.
export const FLOW_STEPS = [
  'landing',
  'safety',
  'intake',
  'login',
  'payment',
  'waiting',
  'summary',
] as const

export type FlowStep = (typeof FLOW_STEPS)[number]

export const STEP_ROUTES: Record<FlowStep, string> = {
  landing: '/',
  safety: '/safety',
  intake: '/intake',
  login: '/login',
  payment: '/payment',
  waiting: '/waiting',
  summary: '/summary',
}

export type ChildIntake = {
  childName: string
  ageValue: string
  ageUnit: 'years' | 'months'
  sex: string
  weightKg: string
  relation: string
  symptoms: string
  duration: string
  temperature: string
}

export type FlowMode = 'urgent' | 'normal'

export type LanguageCode = 'en' | 'hi' | 'te'

export type ChildProfile = {
  id: string
  name: string
  ageValue: string
  ageUnit: 'years' | 'months'
  sex: string
}

export type ParentProfile = {
  name: string
  email: string
  city: string
}

export type BookedSlot = {
  doctorId: string
  slotId: string
  speciality: string
}

export type PreConsultHandoff = {
  conditionUpdate: string
  temperature: string
  weightKg: string
  heightCm: string
  medicinesGiven: string
  allergies: string
  previousConditions: string
  parentNote: string
  selectedDocuments: string[]
  consentToShare: boolean
}

const EMPTY_PRE_CONSULT: PreConsultHandoff = {
  conditionUpdate: '',
  temperature: '',
  weightKg: '',
  heightCm: '',
  medicinesGiven: '',
  allergies: '',
  previousConditions: '',
  parentNote: '',
  selectedDocuments: [],
  consentToShare: false,
}

const EMPTY_INTAKE: ChildIntake = {
  childName: '',
  ageValue: '',
  ageUnit: 'years',
  sex: '',
  weightKg: '',
  relation: '',
  symptoms: '',
  duration: '',
  temperature: '',
}

const EMPTY_PARENT_PROFILE: ParentProfile = {
  name: '',
  email: '',
  city: '',
}

type ConsultState = {
  // entry flow
  flowMode: FlowMode
  setFlowMode: (mode: FlowMode) => void
  language: LanguageCode | null
  setLanguage: (language: LanguageCode) => void

  // safety triage
  safetyChecked: boolean
  redFlagsSelected: string[]
  setRedFlags: (ids: string[]) => void
  completeSafety: (cleared: boolean) => void

  // intake
  intake: ChildIntake
  updateIntake: (patch: Partial<ChildIntake>) => void
  intakeComplete: boolean

  // auth
  phone: string
  setPhone: (phone: string) => void
  loggedIn: boolean
  verifyOtp: () => void

  // parent / child profiles for normal flow
  parentProfile: ParentProfile
  updateParentProfile: (patch: Partial<ParentProfile>) => void
  childProfiles: ChildProfile[]
  setChildProfiles: (children: ChildProfile[]) => void
  selectedChildId: string | null
  setSelectedChildId: (id: string) => void
  normalProfileComplete: boolean

  // scheduled consult
  recommendedSpeciality: string | null
  setRecommendedSpeciality: (speciality: string | null) => void
  bookedSlot: BookedSlot | null
  setBookedSlot: (slot: BookedSlot | null) => void
  preConsultHandoff: PreConsultHandoff
  updatePreConsultHandoff: (patch: Partial<PreConsultHandoff>) => void
  preConsultReady: boolean

  // payment / matching
  planId: string | null
  setPlanId: (id: string) => void
  paid: boolean
  completePayment: () => void
  matchedDoctor: Doctor | null
  setMatchedDoctor: (doctor: Doctor) => void

  // consult
  consultEndedAt: number | null
  endConsult: () => void

  // helpers
  highestUnlockedStep: () => FlowStep
  reset: () => void
}

const ConsultContext = createContext<ConsultState | null>(null)

export function ConsultProvider({ children }: { children: ReactNode }) {
  const [flowMode, setFlowMode] = useState<FlowMode>('urgent')
  const [language, setLanguage] = useState<LanguageCode | null>(null)
  const [safetyChecked, setSafetyChecked] = useState(false)
  const [redFlagsSelected, setRedFlagsSelected] = useState<string[]>([])
  const [intake, setIntake] = useState<ChildIntake>(EMPTY_INTAKE)
  const [phone, setPhone] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [parentProfile, setParentProfile] = useState<ParentProfile>(EMPTY_PARENT_PROFILE)
  const [childProfiles, setChildProfiles] = useState<ChildProfile[]>([])
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null)
  const [recommendedSpeciality, setRecommendedSpeciality] = useState<string | null>(null)
  const [bookedSlot, setBookedSlot] = useState<BookedSlot | null>(null)
  const [preConsultHandoff, setPreConsultHandoff] = useState<PreConsultHandoff>(EMPTY_PRE_CONSULT)
  const [planId, setPlanId] = useState<string | null>(null)
  const [paid, setPaid] = useState(false)
  const [matchedDoctor, setMatchedDoctor] = useState<Doctor | null>(null)
  const [consultEndedAt, setConsultEndedAt] = useState<number | null>(null)

  const setRedFlags = useCallback((ids: string[]) => setRedFlagsSelected(ids), [])

  const completeSafety = useCallback((cleared: boolean) => {
    setSafetyChecked(cleared)
  }, [])

  const updateIntake = useCallback(
    (patch: Partial<ChildIntake>) => setIntake((prev) => ({ ...prev, ...patch })),
    [],
  )

  const intakeComplete = useMemo(
    () =>
      intake.childName.trim().length > 0 &&
      intake.ageValue.trim().length > 0 &&
      intake.sex.trim().length > 0 &&
      intake.symptoms.trim().length > 0,
    [intake],
  )

  const verifyOtp = useCallback(() => setLoggedIn(true), [])
  const updateParentProfile = useCallback(
    (patch: Partial<ParentProfile>) => setParentProfile((prev) => ({ ...prev, ...patch })),
    [],
  )
  const completePayment = useCallback(() => setPaid(true), [])
  const endConsult = useCallback(() => setConsultEndedAt(Date.now()), [])
  const updatePreConsultHandoff = useCallback(
    (patch: Partial<PreConsultHandoff>) =>
      setPreConsultHandoff((prev) => ({ ...prev, ...patch })),
    [],
  )

  const normalProfileComplete = useMemo(
    () =>
      parentProfile.name.trim().length > 0 &&
      childProfiles.some(
        (child) =>
          child.name.trim().length > 0 &&
          child.ageValue.trim().length > 0 &&
          child.sex.trim().length > 0,
      ),
    [parentProfile.name, childProfiles],
  )

  const preConsultReady = useMemo(
    () =>
      preConsultHandoff.conditionUpdate.trim().length > 0 &&
      preConsultHandoff.consentToShare,
    [preConsultHandoff.conditionUpdate, preConsultHandoff.consentToShare],
  )

  const reset = useCallback(() => {
    setFlowMode('urgent')
    setLanguage(null)
    setSafetyChecked(false)
    setRedFlagsSelected([])
    setIntake(EMPTY_INTAKE)
    setPhone('')
    setLoggedIn(false)
    setParentProfile(EMPTY_PARENT_PROFILE)
    setChildProfiles([])
    setSelectedChildId(null)
    setRecommendedSpeciality(null)
    setBookedSlot(null)
    setPreConsultHandoff(EMPTY_PRE_CONSULT)
    setPlanId(null)
    setPaid(false)
    setMatchedDoctor(null)
    setConsultEndedAt(null)
  }, [])

  // The earliest step the user is allowed to be on, based on completed state.
  // Route guards use this to redirect users who deep-link past their progress.
  const highestUnlockedStep = useCallback((): FlowStep => {
    if (!safetyChecked) return 'safety'
    if (!intakeComplete) return 'intake'
    if (!loggedIn) return 'login'
    if (!paid) return 'payment'
    if (consultEndedAt === null) return 'waiting'
    return 'summary'
  }, [safetyChecked, intakeComplete, loggedIn, paid, consultEndedAt])

  const value: ConsultState = {
    flowMode,
    setFlowMode,
    language,
    setLanguage,
    safetyChecked,
    redFlagsSelected,
    setRedFlags,
    completeSafety,
    intake,
    updateIntake,
    intakeComplete,
    phone,
    setPhone,
    loggedIn,
    verifyOtp,
    parentProfile,
    updateParentProfile,
    childProfiles,
    setChildProfiles,
    selectedChildId,
    setSelectedChildId,
    normalProfileComplete,
    recommendedSpeciality,
    setRecommendedSpeciality,
    bookedSlot,
    setBookedSlot,
    preConsultHandoff,
    updatePreConsultHandoff,
    preConsultReady,
    planId,
    setPlanId,
    paid,
    completePayment,
    matchedDoctor,
    setMatchedDoctor,
    consultEndedAt,
    endConsult,
    highestUnlockedStep,
    reset,
  }

  return <ConsultContext.Provider value={value}>{children}</ConsultContext.Provider>
}

export function useConsult() {
  const ctx = useContext(ConsultContext)
  if (!ctx) throw new Error('useConsult must be used within ConsultProvider')
  return ctx
}
