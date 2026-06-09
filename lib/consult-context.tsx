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

type ConsultState = {
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
  const [safetyChecked, setSafetyChecked] = useState(false)
  const [redFlagsSelected, setRedFlagsSelected] = useState<string[]>([])
  const [intake, setIntake] = useState<ChildIntake>(EMPTY_INTAKE)
  const [phone, setPhone] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
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
  const completePayment = useCallback(() => setPaid(true), [])
  const endConsult = useCallback(() => setConsultEndedAt(Date.now()), [])

  const reset = useCallback(() => {
    setSafetyChecked(false)
    setRedFlagsSelected([])
    setIntake(EMPTY_INTAKE)
    setPhone('')
    setLoggedIn(false)
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
