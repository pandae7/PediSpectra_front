'use client'

import { Home } from 'lucide-react'

/**
 * Shared site footer for patient-facing pages.
 * Single source of truth -- rendered on the landing page, doctors listing,
 * doctor profile, and patient flow pages. Doctor entry points (Login / Join)
 * live here rather than in the primary patient navigation, consistent with a
 * separate-doctor-portal design.
 *
 * Social brand marks are inline SVGs (currentColor) rather than lucide icons,
 * because lucide-react removed the standalone brand glyphs (Facebook/Twitter/
 * Linkedin/Youtube) in recent versions and importing them breaks the build.
 */

const SOCIAL_ICON_CLASS = 'h-4 w-4'

function FacebookMark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={SOCIAL_ICON_CLASS}>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.9 3.78-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.9h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z" />
    </svg>
  )
}

function TwitterMark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={SOCIAL_ICON_CLASS}>
      <path d="M18.9 2H22l-7.1 8.1L23 22h-6.6l-5.2-6.8L5.2 22H2l7.6-8.7L1.5 2h6.8l4.7 6.2L18.9 2Zm-1.15 18h1.7L7.3 3.7H5.5L17.75 20Z" />
    </svg>
  )
}

function LinkedinMark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={SOCIAL_ICON_CLASS}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.75v20.5C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.75V1.75C24 .78 23.2 0 22.22 0Z" />
    </svg>
  )
}

function YoutubeMark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={SOCIAL_ICON_CLASS}>
      <path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.24 3.6L9.6 15.6Z" />
    </svg>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Home className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">
                One Roof <span className="text-primary">Pediatrics</span>
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              All 18 pediatric subspecialties under one roof — evidence-based
              care, guided by current global standards.
            </p>
          </div>

          {/* For Doctors */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">For Doctors</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a href="/login/doctor" className="text-muted-foreground transition-colors hover:text-primary">
                  Doctor Login
                </a>
              </li>
              <li>
                <a href="/doctor/onboarding" className="text-muted-foreground transition-colors hover:text-primary">
                  Join as Doctor
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground transition-colors hover:text-primary">
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">About</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a href="#" className="text-muted-foreground transition-colors hover:text-primary">
                  Blogs
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground transition-colors hover:text-primary">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground transition-colors hover:text-primary">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Follow Us</h3>
            <div className="mt-4 flex gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                <FacebookMark />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                <TwitterMark />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                <LinkedinMark />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                <YoutubeMark />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          © 2025 One Roof Pediatrics. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
