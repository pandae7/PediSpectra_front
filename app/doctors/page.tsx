'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, MapPin, Star, Stethoscope } from 'lucide-react'
import { getDoctors, initializeMockData, type DoctorProfile } from '@/lib/mock-data'

const CITIES = ['All Locations', 'Bangalore', 'Chennai', 'Hyderabad', 'Mumbai', 'Delhi', 'Mysuru', 'Hubli', 'Mangaluru', 'Pune', 'Kolkata']

function DoctorsListContent() {
  const searchParams = useSearchParams()
  const subspecialityParam = searchParams.get('subspeciality') || ''

  const [doctors, setDoctors] = useState<DoctorProfile[]>([])
  const [selectedCity, setSelectedCity] = useState('All Locations')
  const [filterSubspeciality, setFilterSubspeciality] = useState(subspecialityParam)

  useEffect(() => {
    initializeMockData()
    setDoctors(getDoctors())
  }, [])

  const filtered = doctors.filter((doc) => {
    const matchCity = selectedCity === 'All Locations' || doc.city === selectedCity
    const matchSpec = !filterSubspeciality || doc.subspeciality === filterSubspeciality
    return matchCity && matchSpec
  })

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <a
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </a>

        <h1 className="mb-2 text-2xl font-bold text-foreground sm:text-3xl">
          {filterSubspeciality ? `${filterSubspeciality} Specialists` : 'All Doctors'}
        </h1>
        <p className="mb-6 text-muted-foreground">
          {filtered.length} doctor{filtered.length !== 1 ? 's' : ''} available
        </p>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-3">
          {/* Location filter */}
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
            <MapPin className="h-4 w-4 text-primary" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-transparent text-sm text-foreground focus:outline-none"
            >
              {CITIES.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Subspeciality filter */}
          {filterSubspeciality && (
            <button
              onClick={() => setFilterSubspeciality('')}
              className="flex items-center gap-1 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-primary"
            >
              {filterSubspeciality}
              <span className="ml-1 text-xs">✕</span>
            </button>
          )}
        </div>

        {/* Doctor cards */}
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <Stethoscope className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-medium text-foreground">No doctors found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try selecting "All Locations" or a different subspeciality.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map((doc) => (
              <a
                key={doc.id}
                href={`/doctors/${doc.id}`}
                className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="text-lg font-bold">{doc.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary">{doc.name}</h3>
                    <p className="text-sm text-muted-foreground">{doc.subspeciality}</p>
                    <div className="mt-2 flex items-center gap-3 text-sm">
                      <span className="flex items-center gap-1 text-foreground">
                        <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                        {doc.rating}
                      </span>
                      <span className="text-muted-foreground">{doc.yearsExperience} yrs exp</span>
                      <span className="text-muted-foreground">₹{doc.fee}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {doc.city}
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function DoctorsListPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-background"><p className="text-muted-foreground">Loading...</p></div>}>
      <DoctorsListContent />
    </Suspense>
  )
}