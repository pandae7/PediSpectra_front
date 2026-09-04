'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, ChevronDown, Home, LogOut, Menu, User, X } from 'lucide-react'
import { ThemeSelector } from '@/components/ui/theme-selector'
import { LanguageSelector } from '@/components/ui/language-selector'
import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { usePatient } from '@/lib/patient-context'

interface NavbarProps {
  showBack?: boolean
  backHref?: string
  backLabel?: string
}

export function Navbar({ showBack = false, backHref, backLabel = 'Back' }: NavbarProps) {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const { currentPatient, logout } = usePatient()

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleBack = () => {
    if (backHref) {
      router.push(backHref)
    } else {
      router.back()
    }
  }

  const handleSignOut = () => {
    logout()
    setProfileOpen(false)
    router.push('/')
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Left: Back button or Logo */}
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={handleBack}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground"
              aria-label={backLabel}
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}
          <a href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Home className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">
              One Roof <span className="text-primary">Pediatrics</span>
            </span>
          </a>
        </div>

        {/* Center: Desktop nav links */}
        <div className="hidden items-center gap-5 md:flex">
          <a href="/doctors" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Doctors
          </a>
          <a href="/patient/consultations" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            My Consultations
          </a>
        </div>

        {/* Right: Patient profile/login + Theme + Mobile menu */}
        <div className="flex items-center gap-2">
          {currentPatient ? (
            <div ref={profileRef} className="relative hidden md:block">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className={cn(
                  'flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-sm text-muted-foreground transition-colors hover:text-foreground',
                  profileOpen && 'border-primary text-foreground'
                )}
                aria-label="Account menu"
                aria-expanded={profileOpen}
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{currentPatient.parentName.split(' ')[0]}</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-border bg-card p-2 shadow-xl">
                  <a
                    href="/patient/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-accent"
                  >
                    <User className="h-4 w-4" />
                    My Profile
                  </a>
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-accent"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <a
              href="/login/patient"
              className="hidden h-9 items-center gap-2 rounded-lg border border-border px-3 text-sm text-muted-foreground transition-colors hover:text-foreground md:flex"
            >
              <User className="h-4 w-4" />
              Login
            </a>
          )}

          <LanguageSelector />
          <ThemeSelector />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground md:hidden"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <a href="/doctors" className="rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted">
              Find a Doctor
            </a>
            <a href="/patient/consultations" className="rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted">
              My Consultations
            </a>

            <div className="mt-1 border-t border-border pt-3">
              {currentPatient ? (
                <>
                  <a href="/patient/profile" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted">
                    <User className="h-4 w-4" />
                    My Profile ({currentPatient.parentName.split(' ')[0]})
                  </a>
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-foreground hover:bg-muted"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <a href="/login/patient" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted">
                  <User className="h-4 w-4" />
                  Login
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
