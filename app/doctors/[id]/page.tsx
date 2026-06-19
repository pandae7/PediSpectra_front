'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Calendar, Clock, GraduationCap, Hospital, MapPin, Share2, Star, Stethoscope, Award } from 'lucide-react'
import { getDoctors, getReviewsForDoctor, initializeMockData, type DoctorProfile, type Review } from '@/lib/mock-data'
import { Navbar } from '@/components/layout/navbar'
import { cn } from '@/lib/utils'

export default function DoctorProfilePage() {
  const params = useParams()
  const doctorId = params.id as string
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initializeMockData()
    const docs = getDoctors()
    const found = docs.find((d) => d.id === doctorId)
    if (found) {
      setDoctor(found)
      setReviews(getReviewsForDoctor(doctorId))
    }
    setLoading(false)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar showBack backHref="/doctors" backLabel="All Doctors" />
        <div className="flex items-center justify-center py-20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </div>
    )
  }

  if (!doctor) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Doctor not found.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar showBack backHref="/doctors" backLabel="All Doctors" />

      {/* Hero banner */}
      <div className="bg-gradient-to-r from-primary/15 via-primary/5 to-background px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            {/* Avatar */}
            <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-4 border-background bg-primary/10 text-primary shadow-lg sm:h-32 sm:w-32">
              <span className="text-4xl font-bold">{doctor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
            </div>
            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{doctor.name}</h1>
              <p className="mt-1 text-lg font-medium text-primary">{doctor.subspeciality}</p>
              {doctor.bio && (
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{doctor.bio}</p>
              )}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm sm:justify-start">
                <span className="flex items-center gap-1.5 rounded-full bg-card border border-border px-3 py-1">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="font-semibold text-foreground">{doctor.rating}</span>
                </span>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Award className="h-4 w-4" />
                  {doctor.yearsExperience} years experience
                </span>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {doctor.city}
                </span>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Stethoscope className="h-4 w-4" />
                  {doctor.consultationCount} consultations
                </span>
              </div>
            </div>
            {/* Share */}
            <button
              onClick={handleShare}
              className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <Share2 className="h-4 w-4" />
              {copied ? 'Copied!' : 'Share'}
            </button>
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Left column — details */}
          <div className="flex-1 space-y-6">
            {/* Qualifications */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground">
                <GraduationCap className="h-5 w-5 text-primary" />
                Qualifications & Experience
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-background p-4">
                  <p className="text-xs font-medium uppercase text-muted-foreground">Postgraduate College</p>
                  <p className="mt-1 font-medium text-foreground">{doctor.pgCollege}</p>
                </div>
                <div className="rounded-lg bg-background p-4">
                  <p className="text-xs font-medium uppercase text-muted-foreground">Working Hospital</p>
                  <p className="mt-1 font-medium text-foreground">{doctor.workingHospital}</p>
                </div>
                <div className="rounded-lg bg-background p-4">
                  <p className="text-xs font-medium uppercase text-muted-foreground">Experience</p>
                  <p className="mt-1 font-medium text-foreground">{doctor.yearsExperience} years</p>
                </div>
                <div className="rounded-lg bg-background p-4">
                  <p className="text-xs font-medium uppercase text-muted-foreground">Languages</p>
                  <p className="mt-1 font-medium text-foreground">{doctor.languages.join(', ')}</p>
                </div>
              </div>
            </div>

            {/* Availability */}
            {doctor.availability.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground">
                  <Calendar className="h-5 w-5 text-primary" />
                  Weekly Availability
                </h2>
                <div className="flex flex-wrap gap-2">
                  {doctor.availability.map((slot, i) => (
                    <span key={i} className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-sm">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      <span className="font-medium text-foreground">{slot.day}</span>
                      <span className="text-muted-foreground">{slot.time}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground">
                <Star className="h-5 w-5 text-primary" />
                Patient Reviews ({reviews.length})
              </h2>
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="rounded-lg border border-border bg-background p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                            {review.reviewerName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{review.reviewerName}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(review.date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                'h-3.5 w-3.5',
                                i < review.rating ? 'fill-primary text-primary' : 'text-border'
                              )}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed text-foreground">{review.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No reviews yet for this doctor.</p>
              )}
            </div>
          </div>

          {/* Right column — booking widget (sticky) */}
          <div className="lg:w-80">
            <div className="sticky top-20 rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-base font-semibold text-foreground">Book Consultation</h3>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Consultation Fee</span>
                  <span className="text-xl font-bold text-primary">₹{doctor.fee}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Mode</span>
                  <span className="text-foreground">Video Consultation</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="text-foreground">15-30 min</span>
                </div>
              </div>
              <a
                href={`/booking/${doctor.id}`}
                className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-primary font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Book Appointment
              </a>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Instant confirmation · No cancellation fee
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
