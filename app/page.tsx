'use client'

import { useState, useEffect } from 'react'
import {
  Activity,
  Baby,
  Brain,
  Droplets,
  Eye,
  Heart,
  HeartPulse,
  Microscope,
  Moon,
  Pill,
  Search,
  Shield,
  Stethoscope,
  Sun,
  Syringe,
  Users,
  Video,
  Zap,
} from 'lucide-react'

const SUBSPECIALITIES = [
  { name: 'Cardiology', description: 'Heart defects, murmurs, arrhythmias, and cardiac conditions in children', icon: Heart },
  { name: 'Neurology', description: 'Seizures, epilepsy, developmental delays, headaches, and neurological disorders', icon: Brain },
  { name: 'Pulmonology', description: 'Asthma, chronic cough, breathing difficulties, and lung diseases', icon: Activity },
  { name: 'Gastroenterology', description: 'Digestive issues, chronic abdominal pain, liver diseases, and feeding problems', icon: Pill },
  { name: 'Nephrology', description: 'Kidney diseases, urinary infections, nephrotic syndrome, and hypertension', icon: Droplets },
  { name: 'Endocrinology', description: 'Diabetes, growth disorders, thyroid problems, and hormonal imbalances', icon: Zap },
  { name: 'Hematology', description: 'Anemia, bleeding disorders, thalassemia, and blood-related conditions', icon: HeartPulse },
  { name: 'Oncology', description: 'Childhood cancers, leukemia, tumors, and long-term follow-up care', icon: Microscope },
  { name: 'Rheumatology', description: 'Juvenile arthritis, autoimmune disorders, and inflammatory conditions', icon: Shield },
  { name: 'Infectious Diseases', description: 'Complex infections, tropical diseases, immunodeficiency, and vaccine guidance', icon: Syringe },
  { name: 'Allergy & Immunology', description: 'Food allergies, eczema, immunodeficiencies, and allergic reactions', icon: Shield },
  { name: 'Neonatology', description: 'Premature baby care, NICU follow-up, and newborn complications', icon: Baby },
  { name: 'Developmental Pediatrics', description: 'Autism, ADHD, speech delays, learning disabilities, and behavioral concerns', icon: Brain },
  { name: 'Pediatric Surgery', description: 'Hernias, undescended testes, congenital anomalies, and surgical consultations', icon: Stethoscope },
  { name: 'Orthopedics', description: 'Fractures, limping, flat feet, scoliosis, and musculoskeletal problems', icon: Activity },
  { name: 'Dermatology', description: 'Eczema, birthmarks, skin infections, hair loss, and pediatric skin conditions', icon: Eye },
  { name: 'Ophthalmology', description: 'Squinting, vision problems, eye infections, and congenital eye conditions', icon: Eye },
  { name: 'ENT (Otolaryngology)', description: 'Ear infections, tonsillitis, hearing loss, snoring, and airway problems', icon: Stethoscope },
]

export default function LandingPage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('pedispectra-theme')
    if (saved === 'light') {
      setTheme('light')
    } else if (!saved) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('pedispectra-theme', newTheme)
    if (newTheme === 'light') {
      document.documentElement.classList.add('light')
    } else {
      document.documentElement.classList.remove('light')
    }
  }

  const filteredSpecialities = searchQuery.trim().length > 0
    ? SUBSPECIALITIES.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : SUBSPECIALITIES

  return (
    <div className="min-h-screen bg-background">
      {/* ===== NAVBAR ===== */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Stethoscope className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Pedi<span className="text-primary">Spectra</span>
            </span>
          </div>

          {/* Nav links — desktop */}
          <div className="hidden items-center gap-6 md:flex">
            <a href="#subspecialities" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Subspecialities
            </a>
            <a href="#about" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              About the Team
            </a>
            <a href="/login/patient" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Patient Login
            </a>
            <a href="/login/doctor" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Doctor Login
            </a>
            <a
              href="/doctor/onboarding"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Join as Doctor
            </a>
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>

          {/* Mobile nav */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <a
              href="/login/patient"
              className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
            >
              Login
            </a>
          </div>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden px-4 pb-16 pt-20 sm:px-6 sm:pb-24 sm:pt-32 lg:px-8">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
            <Video className="h-4 w-4" />
            Video consultations with top subspecialists
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            All 18 Pediatric Subspecialties.{' '}
            <span className="text-primary">One Platform.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Expert pediatric care, accessible to everyone. Connect your child with the right
            specialist — from cardiology to neurology — through a single video consultation platform.
          </p>

          {/* CTA buttons */}
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="/login/patient"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Users className="h-5 w-5" />
              Book a Consultation
            </a>
            <a
              href="/doctor/onboarding"
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-border bg-secondary px-8 text-base font-semibold text-foreground transition-colors hover:bg-accent"
            >
              <Stethoscope className="h-5 w-5" />
              Onboard as Doctor
            </a>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-16 grid max-w-lg grid-cols-3 gap-8">
            <div>
              <p className="text-3xl font-bold text-primary">18</p>
              <p className="mt-1 text-sm text-muted-foreground">Subspecialities</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">50+</p>
              <p className="mt-1 text-sm text-muted-foreground">Specialist Doctors</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">0</p>
              <p className="mt-1 text-sm text-muted-foreground">Downloads Needed</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="border-t border-border bg-card px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold text-foreground sm:text-4xl">
            How it works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
            From concern to consultation in three simple steps
          </p>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              {
                step: '1',
                title: 'Choose a Specialist',
                desc: 'Browse 18 pediatric subspecialities or let our triage guide you to the right one based on symptoms.',
              },
              {
                step: '2',
                title: 'Book a Slot',
                desc: 'Pick a doctor, check their availability, and confirm your consultation time instantly.',
              },
              {
                step: '3',
                title: 'Video Consult',
                desc: 'Join from your browser — no app download. Get prescriptions and follow-up plans digitally.',
              },
            ].map((item) => (
              <div key={item.step} className="rounded-2xl border border-border bg-background p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-xl font-bold text-primary">
                  {item.step}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SEARCH + SUBSPECIALITIES ===== */}
      <section id="subspecialities" className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold text-foreground sm:text-4xl">
            18 Pediatric Subspecialities
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
            Every specialist your child might need — under one roof
          </p>

          {/* Search bar */}
          <div className="mx-auto mt-8 max-w-xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by subspeciality, doctor, or symptoms..."
                className="h-12 w-full rounded-xl border border-border bg-card pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            {searchQuery.trim().length > 0 && (
              <p className="mt-2 text-sm text-muted-foreground">
                Showing {filteredSpecialities.length} of 18 subspecialities
              </p>
            )}
          </div>

          {/* Subspeciality cards */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSpecialities.map((spec) => {
              const Icon = spec.icon
              return (
                <div
                  key={spec.name}
                  className="group cursor-pointer rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{spec.name}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {spec.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {filteredSpecialities.length === 0 && (
            <div className="mt-10 text-center">
              <p className="text-muted-foreground">No matching subspecialities found.</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try different keywords or{' '}
                <button onClick={() => setSearchQuery('')} className="text-primary underline">
                  browse all
                </button>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ===== ABOUT THE TEAM ===== */}
      <section id="about" className="border-t border-border bg-card px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-bold text-foreground sm:text-4xl">
            Built by Subspecialists
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
            PediSpectra is founded by practicing pediatric subspecialists who understand that finding the
            right expert for your child shouldn't be a challenge.
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              {
                role: 'Founder & CEO',
                specialty: 'Pediatric Pulmonologist',
                desc: 'Clinical network anchor. Driving platform vision and doctor onboarding.',
              },
              {
                role: 'Co-founder & CMO',
                specialty: 'Pediatric Endocrinologist',
                desc: 'Medical quality oversight. Designing clinical protocols and safety frameworks.',
              },
              {
                role: 'Co-founder & COO',
                specialty: 'Pediatric Intensivist',
                desc: 'Emergency triage logic. Building operational systems and escalation protocols.',
              },
            ].map((member) => (
              <div
                key={member.role}
                className="rounded-xl border border-border bg-background p-6 text-center"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Stethoscope className="h-7 w-7" />
                </div>
                <h3 className="mt-4 font-semibold text-foreground">{member.role}</h3>
                <p className="mt-1 text-sm font-medium text-primary">{member.specialty}</p>
                <p className="mt-2 text-sm text-muted-foreground">{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-border px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
              <Stethoscope className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground">PediSpectra</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 PediSpectra. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <a href="/login/patient" className="hover:text-foreground">Patient Login</a>
            <a href="/login/doctor" className="hover:text-foreground">Doctor Login</a>
            <a href="/doctor/onboarding" className="hover:text-foreground">Join as Doctor</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
