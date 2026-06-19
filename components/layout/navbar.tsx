'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Home, Menu, X } from 'lucide-react'
import { ThemeSelector } from '@/components/ui/theme-selector'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface NavbarProps {
  showBack?: boolean
  backHref?: string
  backLabel?: string
}

export function Navbar({ showBack = false, backHref, backLabel = 'Back' }: NavbarProps) {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleBack = () => {
    if (backHref) {
      router.push(backHref)
    } else {
      router.back()
    }
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
          <a href="/login/doctor" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Doctor Login
          </a>
          <a
            href="/doctor/onboarding"
            className="rounded-lg bg-primary px-3.5 py-1.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Join as Doctor
          </a>
        </div>

        {/* Right: Theme + Mobile menu */}
        <div className="flex items-center gap-2">
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
            <a href="/login/doctor" className="rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted">
              Doctor Login
            </a>
            <a href="/doctor/onboarding" className="rounded-lg bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground">
              Join as Doctor
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
