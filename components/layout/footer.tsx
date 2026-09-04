'use client'

import { Home, Facebook, Twitter, Linkedin, Youtube } from 'lucide-react'

/**
 * Shared site footer for patient-facing pages.
 * Single source of truth -- rendered on the landing page, doctors listing,
 * doctor profile, and patient flow pages. Doctor entry points (Login / Join)
 * live here rather than in the primary patient navigation, consistent with a
 * separate-doctor-portal design.
 */
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
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                <Youtube className="h-4 w-4" />
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
