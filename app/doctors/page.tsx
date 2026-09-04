'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, Filter, MapPin, Search, Stethoscope } from 'lucide-react'
import { getDoctors, initializeMockData, SUBSPECIALITIES, type DoctorProfile } from '@/lib/mock-data'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { HeartRating } from '@/components/ui/heart-rating'
import { cn } from '@/lib/utils'

const CITIES = ['All Locations', 'Bangalore', 'Chennai', 'Hyderabad', 'Mumbai', 'Delhi', 'Mysuru', 'Hubli', 'Mangaluru', 'Pune', 'Kolkata', 'Kochi']

function DoctorCard({ doc }: { doc: DoctorProfile }) {
  const [imgFailed, setImgFailed] = useState(false)

  return (
    <a
      href={`/doctors/${doc.id}`}
      className="group rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="flex items-start gap-4">
        {doc.imageUrl && !imgFailed ? (
          <img
            src={doc.imageUrl}
            alt={doc.name}
            className="h-14 w-14 shrink-0 rounded-full object-cover"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <span className="text-lg font-bold">{doc.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
          </div>
        )}
        <div className="flex-1">
          <h3 className="font-semibold text-foreground group-hover:text-primary">{doc.name}</h3>
          <p className="text-sm text-muted-foreground">{doc.subspeciality}</p>
          <div className="mt-2 flex items-center gap-3 text-sm">
            <HeartRating value={doc.rating} showValue size="sm" />
            <span className="text-muted-foreground">{doc.yearsExperience} yrs</span>
            <span className="text-muted-foreground">₹{doc.fee}</span>
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {doc.city} · {doc.workingHospital}
          </div>
        </div>
      </div>
    </a>
  )
}

function DoctorsListContent() {
  const searchParams = useSearchParams()
  const subspecialityParam = searchParams.get('subspeciality') || ''

  const [doctors, setDoctors] = useState<DoctorProfile[]>([])
  const [selectedCity, setSelectedCity] = useState('All Locations')
  const [filterSubspeciality, setFilterSubspeciality] = useState(
    SUBSPECIALITIES.includes(subspecialityParam) ? subspecialityParam : ''
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  useEffect(() => {
    initializeMockData()
    setDoctors(getDoctors())
  }, [])

  const filtered = doctors.filter((doc) => {
    const matchCity = selectedCity === 'All Locations' || doc.city === selectedCity
    const matchSpec = !filterSubspeciality || doc.subspeciality === filterSubspeciality
    const matchSearch = !searchQuery.trim() ||
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.subspeciality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.workingHospital.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCity && matchSpec && matchSearch
  })

  return (
    <div className="min-h-screen bg-background">
      <Navbar showBack backHref="/" />

      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              {filterSubspeciality ? `${filterSubspeciality} Specialists` : 'Find a Doctor'}
            </h1>
            <p className="mt-1 text-muted-foreground">
              {filtered.length} doctor{filtered.length !== 1 ? 's' : ''} available
            </p>
          </div>
          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground lg:hidden"
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>

        {/* Search bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, subspeciality, or hospital..."
              className="h-11 w-full rounded-xl border border-border bg-card pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="flex gap-6">
          {/* LEFT SIDEBAR: Filters */}
          <aside className={cn(
            'w-64 shrink-0',
            showMobileFilters ? 'block' : 'hidden lg:block'
          )}>
            <div className="sticky top-24 space-y-6 rounded-xl border border-border bg-card p-4">
              {/* Location */}
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Location
                </h3>
                <div className="space-y-1">
                  {CITIES.map((city) => (
                    <button
                      key={city}
                      onClick={() => setSelectedCity(city)}
                      className={cn(
                        'w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors',
                        selectedCity === city
                          ? 'bg-primary/10 font-medium text-primary'
                          : 'text-foreground hover:bg-muted'
                      )}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subspeciality */}
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Subspeciality
                </h3>
                <div className="max-h-80 space-y-1 overflow-y-auto">
                  <button
                    onClick={() => setFilterSubspeciality('')}
                    className={cn(
                      'w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors',
                      !filterSubspeciality
                        ? 'bg-primary/10 font-medium text-primary'
                        : 'text-foreground hover:bg-muted'
                    )}
                  >
                    All Subspecialities
                  </button>
                  {SUBSPECIALITIES.map((spec) => (
                    <button
                      key={spec}
                      onClick={() => setFilterSubspeciality(spec)}
                      className={cn(
                        'w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors',
                        filterSubspeciality === spec
                          ? 'bg-primary/10 font-medium text-primary'
                          : 'text-foreground hover:bg-muted'
                      )}
                    >
                      {spec}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear filters */}
              {(selectedCity !== 'All Locations' || filterSubspeciality) && (
                <button
                  onClick={() => { setSelectedCity('All Locations'); setFilterSubspeciality('') }}
                  className="w-full rounded-lg border border-border py-2 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </aside>

          {/* RIGHT: Doctor cards */}
          <div className="flex-1">
            {/* Active filter pills */}
            {(selectedCity !== 'All Locations' || filterSubspeciality) && (
              <div className="mb-4 flex flex-wrap gap-2">
                {selectedCity !== 'All Locations' && (
                  <span className="flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
                    <MapPin className="h-3 w-3" />
                    {selectedCity}
                    <button onClick={() => setSelectedCity('All Locations')} className="ml-1">✕</button>
                  </span>
                )}
                {filterSubspeciality && (
                  <span className="flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
                    {filterSubspeciality}
                    <button onClick={() => setFilterSubspeciality('')} className="ml-1">✕</button>
                  </span>
                )}
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="rounded-xl border border-border bg-card p-8 text-center">
                <Stethoscope className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-lg font-medium text-foreground">No doctors found</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try a different location or subspeciality filter.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {filtered.map((doc) => (
                  <DoctorCard key={doc.id} doc={doc} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
      <Footer />
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