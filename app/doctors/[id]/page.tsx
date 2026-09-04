'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Calendar, Check, Clock, GraduationCap, MapPin, MessageSquare, Share2 } from 'lucide-react'
import {
  getDoctors,
  getReviewsForDoctor,
  getSubspecialityMeta,
  initializeMockData,
  type DoctorProfile,
  type Review,
} from '@/lib/mock-data'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { HeartRating } from '@/components/ui/heart-rating'

export default function DoctorProfilePage() {
  const params = useParams()
  const doctorId = params.id as string
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)
  const [coverFailed, setCoverFailed] = useState(false)
  const [imgFailed, setImgFailed] = useState(false)

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

  const meta = getSubspecialityMeta(doctor.subspeciality)
  const showCoverImage = Boolean(meta?.coverImage) && !coverFailed
  const initials = doctor.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)

  return (
    <div className="min-h-screen bg-background">
      <Navbar showBack backHref="/doctors" backLabel="All Doctors" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* A) Cover banner */}
        <div className="relative mt-6 h-48 overflow-hidden rounded-xl border border-border sm:h-56">
          {/* Gradient fallback — always the base layer */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-primary/10 to-background" />

          {/* Cover image layer (when available and not failed) */}
          {showCoverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={meta!.coverImage}
              alt={meta!.friendlyTitle}
              className="absolute inset-0 h-full w-full object-cover"
              onError={() => setCoverFailed(true)}
            />
          )}

          {/* Scrim for text legibility over any background */}
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />

          {/* Share button — top right */}
          <button
            onClick={handleShare}
            className="absolute right-4 top-4 z-10 flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <Share2 className="h-4 w-4" />
            {copied ? 'Copied!' : 'Share'}
          </button>

          {/* Cover copy */}
          <div className="absolute inset-y-0 left-0 z-10 flex max-w-xl flex-col justify-center p-6 sm:p-8">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground">
              {meta?.icon && <span aria-hidden="true">{meta.icon}</span>}
              {doctor.subspeciality}
            </span>
            <h1 className="mt-3 text-2xl font-bold text-foreground sm:text-3xl">
              {meta?.friendlyTitle ?? doctor.subspeciality}
            </h1>
            {meta?.descriptor && (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{meta.descriptor}</p>
            )}
          </div>
        </div>

        {/* B) Sidebar + main */}
        <div className="mt-6 flex flex-col gap-6 pb-8 lg:flex-row">
          {/* Left sidebar */}
          <aside className="w-full shrink-0 lg:sticky lg:top-20 lg:h-fit lg:w-72">
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                What this specialist handles
              </h2>
              {meta?.treats && (
                <ul className="mt-3 space-y-2">
                  {meta.treats.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-4">
                <div className="flex items-center justify-between border-t border-border py-2 text-sm">
                  <span className="text-muted-foreground">Experience</span>
                  <span className="text-foreground">{doctor.yearsExperience} years</span>
                </div>
                <div className="flex items-center justify-between border-t border-border py-2 text-sm">
                  <span className="text-muted-foreground">Consultations</span>
                  <span className="text-foreground">{doctor.consultationCount}</span>
                </div>
                <div className="flex items-center justify-between border-t border-border py-2 text-sm">
                  <span className="text-muted-foreground">Rating</span>
                  <span className="text-foreground">
                    <HeartRating value={doctor.rating} showValue size="sm" />
                  </span>
                </div>
              </div>
            </div>
          </aside>

          {/* Right main */}
          <div className="flex-1 space-y-6">
            {/* 1) Doctor header card */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex flex-wrap items-center gap-5">
                {/* Avatar */}
                {doctor.imageUrl && !imgFailed ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={doctor.imageUrl}
                    alt={doctor.name}
                    className="h-20 w-20 shrink-0 rounded-full object-cover"
                    onError={() => setImgFailed(true)}
                  />
                ) : (
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                    {initials}
                  </div>
                )}

                {/* Identity */}
                <div className="min-w-0">
                  <h2 className="text-2xl font-bold text-foreground">{doctor.name}</h2>
                  <p className="font-medium text-primary">{doctor.subspeciality}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <HeartRating value={doctor.rating} showValue size="md" />
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {doctor.city}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <GraduationCap className="h-4 w-4" />
                      {doctor.pgCollege}
                    </span>
                  </div>
                </div>

                {/* Booking */}
                <div className="ml-auto text-right">
                  <p className="text-2xl font-bold text-primary">₹{doctor.fee}</p>
                  <p className="text-xs text-muted-foreground">Video · 15–30 min</p>
                  <a
                    href={`/booking/${doctor.id}`}
                    className="mt-3 inline-flex h-11 items-center rounded-xl bg-primary px-5 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    Book Appointment
                  </a>
                </div>
              </div>

              {doctor.bio && (
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{doctor.bio}</p>
              )}
            </div>

            {/* 2) Qualifications & Experience */}
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

            {/* 3) Weekly Availability */}
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

            {/* 4) Patient Reviews */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground">
                <MessageSquare className="h-5 w-5 text-primary" />
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
                        <HeartRating value={review.rating} size="sm" />
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
        </div>
      </div>
      <Footer />
    </div>
  )
}
