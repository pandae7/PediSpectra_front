'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeft, Calendar, Clock, MapPin, Share2, Star, Stethoscope } from 'lucide-react'
import { getDoctors, initializeMockData, type DoctorProfile } from '@/lib/mock-data'

export default function DoctorProfilePage() {
  const params = useParams()
  const doctorId = params.id as string
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    initializeMockData()
    const docs = getDoctors()
    const found = docs.find((d) => d.id === doctorId)
    if (found) setDoctor(found)
  }, [doctorId])

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      await navigator.share({ title: doctor?.name, url })
    } else {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!doctor) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Doctor not found.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <a
            href="/doctors"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            All Doctors
          </a>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <Share2 className="h-4 w-4" />
            {copied ? 'Link Copied!' : 'Share Profile'}
          </button>
        </div>

        {/* Profile header */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <span className="text-2xl font-bold">{doctor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-foreground">{doctor.name}</h1>
              <p className="mt-1 text-primary font-medium">{doctor.subspeciality}</p>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-sm sm:justify-start">
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="font-medium text-foreground">{doctor.rating}</span>
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Stethoscope className="h-4 w-4" />
                  {doctor.consultationCount} consultations
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {doctor.city}
                </span>
              </div>
            </div>
          </div>

          {/* Details grid */}
          <div className="mt-6 grid gap-4 border-t border-border pt-6 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-xs font-medium uppercase text-muted-foreground">Experience</p>
              <p className="mt-1 text-lg font-semibold text-foreground">{doctor.yearsExperience} years</p>
            </div>
            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-xs font-medium uppercase text-muted-foreground">Consultation Fee</p>
              <p className="mt-1 text-lg font-semibold text-foreground">₹{doctor.fee}</p>
            </div>
            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-xs font-medium uppercase text-muted-foreground">PG College</p>
              <p className="mt-1 font-medium text-foreground">{doctor.pgCollege}</p>
            </div>
            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-xs font-medium uppercase text-muted-foreground">Hospital</p>
              <p className="mt-1 font-medium text-foreground">{doctor.workingHospital}</p>
            </div>
          </div>

          {/* Languages */}
          {doctor.languages.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-medium uppercase text-muted-foreground">Languages</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {doctor.languages.map((lang) => (
                  <span key={lang} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Availability */}
          {doctor.availability.length > 0 && (
            <div className="mt-6 border-t border-border pt-6">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                <Calendar className="h-4 w-4 text-primary" />
                Available Slots
              </h2>
              <div className="flex flex-wrap gap-2">
                {doctor.availability.map((slot, i) => (
                  <span key={i} className="flex items-center gap-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs">
                    <Clock className="h-3 w-3 text-primary" />
                    {slot.day} {slot.time}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Book CTA */}
          <div className="mt-6 border-t border-border pt-6">
            <a
              href={`/booking/${doctor.id}`}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-primary font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Book Consultation — ₹{doctor.fee}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
