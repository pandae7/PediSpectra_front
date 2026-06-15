'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  FLOW_STEPS,
  STEP_ROUTES,
  useConsult,
  type FlowStep,
} from '@/lib/consult-context'

/**
 * Guards a step route. If the user deep-links to a step they haven't unlocked
 * yet (e.g. opens /payment on a fresh in-memory session), redirect them to the
 * earliest unmet step. Returns whether the route is allowed to render.
 */
export function useStepGuard(step: FlowStep): boolean {
  const router = useRouter()
  const { flowMode, highestUnlockedStep } = useConsult()

  const unlocked = highestUnlockedStep()
  const unlockedIndex = FLOW_STEPS.indexOf(unlocked)
  const stepIndex = FLOW_STEPS.indexOf(step)
  const allowed = flowMode === 'normal' && step === 'login' ? true : stepIndex <= unlockedIndex

  useEffect(() => {
    if (!allowed) {
      router.replace(STEP_ROUTES[unlocked])
    }
  }, [allowed, unlocked, router])

  return allowed
}
