'use client'
import { useEffect, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useDoctor } from '@/lib/doctor-context'
import { isDoctorApproved } from '@/lib/mock-data'

/**
 * Doctors who are not yet approved can only see the wait room.
 * Onboarding is public so a new doctor can register.
 */
export default function DoctorLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { currentDoctor, isLoading } = useDoctor()

  const isOnboarding = pathname.startsWith('/doctor/onboarding')
  const isWaitRoom = pathname.startsWith('/doctor/waiting-room')
  const blocked = !!currentDoctor && !isDoctorApproved(currentDoctor) && !isWaitRoom && !isOnboarding

  useEffect(() => {
    if (isLoading || isOnboarding) return
    if (!currentDoctor) {
      router.replace('/login/doctor')
    } else if (blocked) {
      router.replace('/doctor/waiting-room')
    }
  }, [isLoading, isOnboarding, currentDoctor, blocked, router])

  if (isOnboarding) return <>{children}</>
  if (isLoading || !currentDoctor || blocked) return null
  return <>{children}</>
}
