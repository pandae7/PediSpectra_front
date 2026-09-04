'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Activity,
  Baby,
  Brain,
  Clock,
  Droplets,
  Eye,
  Heart,
  HeartHandshake,
  HeartPulse,
  Home,
  MapPin,
  Microscope,
  Pill,
  Salad,
  Search,
  Shield,
  ShieldCheck,
  Stethoscope,
  Syringe,
  Users,
  Zap,
} from 'lucide-react'
import { ThemeSelector } from '@/components/ui/theme-selector'
import { LanguageSelector } from '@/components/ui/language-selector'
import { cn } from '@/lib/utils'

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

// "What Parents Can Expect" — benefit-first cards, distinct from the clinical
// subspeciality list below. Written in parent language (see Specialities.md),
// each backed by a real photo. Cards without an image yet fall back to an
// icon-on-gradient placeholder so the section still reads fine before all
// 6 photos are sourced.
const BENEFITS = [
  {
    title: '24/7 Emergency Guidance',
    desc: "Not sure if it's urgent? Reach a pediatrician any time of night for guidance on whether to head to the ER or wait it out.",
    icon: Clock,
    image: '/images/benefit-247-care.jpg',
    link: null,
  },
  {
    title: 'Growth & Development Tracking',
    desc: 'Watch your child\u2019s height, weight and milestones plotted against WHO growth standards \u2014 visible to you and your doctor at every visit.',
    icon: Activity,
    image: '/images/benefit-growth-tracking.jpg',
    link: { href: '/doctors?subspeciality=Endocrinology', label: 'See a sample' },
  },
  {
    title: 'Nutrition & Diet Help',
    desc: '"My child doesn\u2019t eat" is a real concern. Get diet plans for fussy eating, allergies, weight gain, and healthy first foods.',
    icon: Salad,
    image: '/images/benefit-nutrition.jpg',
    link: null,
  },
  {
    title: 'Child & Teen Mental Health',
    desc: 'Anxiety, school stress, low mood, or screen struggles \u2014 confidential counselling for your child and guidance for you.',
    icon: HeartHandshake,
    image: '/images/benefit-mental-health.jpg',
    link: null,
  },
  {
    title: 'Confidential Adolescent Care',
    desc: 'A private, judgement-free space for 10\u201319 year olds to talk about periods, body changes, and growing up \u2014 without a parent in the room.',
    icon: ShieldCheck,
    image: '/images/benefit-teen-counselling.jpg',
    link: null,
  },
  {
    title: 'Postpartum & New Mother Counselling',
    desc: 'Because a healthy mother is what a healthy baby needs \u2014 breastfeeding support, postnatal mood care, and confidence with a first baby, no judgement.',
    icon: Baby,
    image: '/images/benefit-new-mother.jpg',
    link: null,
  },
]

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [heroLoaded, setHeroLoaded] = useState(false)
  const [benefitsVisible, setBenefitsVisible] = useState(false)
  const benefitsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setHeroLoaded(true)
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const el = benefitsRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setBenefitsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const filteredSpecialities = searchQuery.trim().length > 0
    ? SUBSPECIALITIES.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : SUBSPECIALITIES

  return (
    <div className="min-h-screen bg-background">
      {/* ===== HERO SECTION (full-bleed video, floating header on top) ===== */}
      <section className="relative isolate flex h-[92vh] min-h-[640px] w-full items-center overflow-hidden text-white">
        {/* Video background */}
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/videos/hero-consult.mp4"
          poster="/images/hero-consult.jpg"
          autoPlay
          muted
          loop
          playsInline
        />
        {/* Legibility overlay — darkens video so white text/header stay readable
            in both themes without depending on the video's own contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

        {/* ===== FLOATING HEADER (fixed so it stays on top through the whole page) =====
            Mobile (<768px): spans full width, flush with the top edge (no inset —
            floating pill spacing feels cramped on small viewports and eats tap-target room).
            Desktop (md+, 768px+): inset from left 10% / right 10% ("floats" as a pill
            within the viewport), with a small top margin and rounded corners once inset. */}
        <nav
          className={cn(
            'fixed inset-x-0 top-0 z-50 transition-all duration-300',
            scrolled
              // Scrolled: behaves like a normal full-width sticky header — the
              // floating "pill" treatment only makes sense hovering over the
              // hero video, not over regular page content underneath it.
              ? 'bg-background/80 backdrop-blur-md border-b border-border'
              // Not scrolled: floats as an inset pill over the hero video (desktop only).
              : 'bg-transparent md:inset-x-[10%] md:top-4 md:rounded-2xl md:bg-black/10 md:backdrop-blur-sm md:border md:border-white/15'
          )}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Home className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className={cn('text-xl font-bold', scrolled ? 'text-foreground' : 'text-white')}>
                One Roof <span className="text-primary">Pediatrics</span>
              </span>
            </div>

            {/* Nav links — desktop */}
            <div className="hidden items-center gap-6 md:flex">
              <a
                href="/doctors"
                className={cn('text-sm transition-colors hover:text-primary', scrolled ? 'text-muted-foreground' : 'text-white/85')}
              >
                Doctors
              </a>
              <a
                href="#subspecialities"
                className={cn('text-sm transition-colors hover:text-primary', scrolled ? 'text-muted-foreground' : 'text-white/85')}
              >
                Subspecialities
              </a>
              <a
                href="#about"
                className={cn('text-sm transition-colors hover:text-primary', scrolled ? 'text-muted-foreground' : 'text-white/85')}
              >
                About the Team
              </a>
              <a
                href="/patient/consultations"
                className={cn('text-sm transition-colors hover:text-primary', scrolled ? 'text-muted-foreground' : 'text-white/85')}
              >
                My Consultations
              </a>
              <a
                href="/login/doctor"
                className={cn('text-sm transition-colors hover:text-primary', scrolled ? 'text-muted-foreground' : 'text-white/85')}
              >
                Doctor Login
              </a>
              <a
                href="/doctor/onboarding"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Join as Doctor
              </a>
              {/* Language dropdown */}
              <LanguageSelector />
              {/* Theme dropdown */}
              <ThemeSelector />
            </div>

            {/* Mobile nav */}
            <div className="flex items-center gap-2 md:hidden">
              <LanguageSelector />
              <ThemeSelector />
              <a
                href="/doctors"
                className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
              >
                Book
              </a>
            </div>
          </div>
        </nav>

        {/* Hero content, animated in on load */}
        <div className="relative z-10 mx-auto w-full max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1
            className={cn(
              'text-4xl font-bold leading-tight tracking-tight text-white drop-shadow-sm sm:text-5xl lg:text-6xl transition-all duration-700 ease-out',
              heroLoaded ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            )}
          >
            No more waiting, wondering, or{' '}
            <span className="text-primary">guessing.</span>
          </h1>

          <p
            className={cn(
              'mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/85 sm:text-xl transition-all duration-700 ease-out delay-150',
              heroLoaded ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            )}
          >
            Know exactly which specialist your child needs. All 18 pediatric subspecialties
            under one roof — practicing evidence-based medicine, guided by current global standards.
          </p>

          {/* CTA buttons */}
          <div
            className={cn(
              'mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center transition-all duration-700 ease-out delay-200',
              heroLoaded ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            )}
          >
            <a
              href="/doctors"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Users className="h-5 w-5" />
              Book a Consultation
            </a>
            <a
              href="/doctor/onboarding"
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-8 text-base font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <Stethoscope className="h-5 w-5" />
              Onboard as Doctor
            </a>
          </div>

          {/* Stats */}
          <div
            className={cn(
              'mx-auto mt-16 grid max-w-lg grid-cols-3 gap-8 transition-all duration-700 ease-out delay-300',
              heroLoaded ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            )}
          >
            <div>
              <p className="text-3xl font-bold text-primary">18</p>
              <p className="mt-1 text-sm text-white/70">Subspecialities</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">50+</p>
              <p className="mt-1 text-sm text-white/70">Specialist Doctors</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">0</p>
              <p className="mt-1 text-sm text-white/70">Downloads Needed</p>
            </div>
          </div>
        </div>

      </section>

      {/* ===== WHAT PARENTS CAN EXPECT ===== */}
      <section ref={benefitsRef} className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold text-foreground sm:text-4xl">
            What Parents Can Expect
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
            Beyond a single consultation — support for everything that comes with raising a healthy child
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((benefit, i) => {
              const Icon = benefit.icon
              return (
                <div
                  key={benefit.title}
                  className={cn(
                    'group overflow-hidden rounded-2xl border border-border bg-card transition-all duration-500 ease-out hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5',
                    benefitsVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                  )}
                  style={{ transitionDelay: benefitsVisible ? `${i * 80}ms` : '0ms' }}
                >
                  {/* Image (or gradient+icon placeholder until sourced) */}
                  <div className="relative h-44 w-full overflow-hidden">
                    {benefit.image ? (
                      <img
                        src={benefit.image}
                        alt={benefit.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/15 via-secondary to-primary/5">
                        <Icon className="h-10 w-10 text-primary/60" />
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-5 w-5 shrink-0 text-primary" />
                      <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                    </div>
                    <div className="mt-2 h-px w-10 bg-primary/40" />
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {benefit.desc}
                    </p>
                    {benefit.link && (
                      <a
                        href={benefit.link.href}
                        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                      >
                        {benefit.link.label} →
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
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
            <div className="flex gap-2">
              {/* Location dropdown */}
              <div className="flex items-center gap-1 rounded-xl border border-border bg-card px-3">
                <MapPin className="h-4 w-4 text-primary" />
                {/* Note: the dropdown's own option list is rendered natively by the
                    browser and can't be fully re-themed with CSS. `color-scheme`
                    tells the browser to render that native popup using a light or
                    dark palette (matching --select-scheme, set per theme in
                    globals.css) instead of always defaulting to light. */}
                <select
                  className="h-12 bg-transparent text-sm text-foreground focus:outline-none"
                  style={{ colorScheme: 'var(--select-scheme)' }}
                >
                  <option>All Locations</option>
                  <option>Bangalore</option>
                  <option>Chennai</option>
                  <option>Hyderabad</option>
                  <option>Mumbai</option>
                  <option>Delhi</option>
                  <option>Mysuru</option>
                  <option>Hubli</option>
                  <option>Mangaluru</option>
                  <option>Pune</option>
                  <option>Kolkata</option>
                </select>
              </div>
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search doctor, subspeciality, hospital, or describe symptoms..."
                  className="h-12 w-full rounded-xl border border-border bg-card pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
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
                <a
                  key={spec.name}
                  href={`/doctors?subspeciality=${encodeURIComponent(spec.name)}`}
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
                </a>
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
            One Roof Pediatrics is founded by practicing pediatric subspecialists who understand that finding the
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
              <Home className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground">One Roof Pediatrics</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 One Roof Pediatrics. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <a href="/doctors" className="hover:text-foreground">Find a Doctor</a>
            <a href="/patient/consultations" className="hover:text-foreground">My Consultations</a>
            <a href="/login/doctor" className="hover:text-foreground">Doctor Login</a>
            <a href="/doctor/onboarding" className="hover:text-foreground">Join as Doctor</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
