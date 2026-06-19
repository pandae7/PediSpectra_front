'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  Image,
  Pill,
  Stethoscope,
  Thermometer,
  User,
  Video,
} from 'lucide-react'
import { useDoctor } from '@/lib/doctor-context'
import { Navbar } from '@/components/layout/navbar'

export default function ConsultationDetailPage() {
  const router = useRouter()
  const params = useParams()
  const consultId = params.consultId as string
  const { currentDoctor, consultations, isLoading } = useDoctor()

  useEffect(() => {
    if (!isLoading && !currentDoctor) router.push('/login/doctor')
  }, [currentDoctor, isLoading, router])

  if (isLoading || !currentDoctor) return null

  const consult = consultations.find((c) => c.id === consultId)

  if (!consult) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar showBack backHref="/doctor/dashboard" />
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">Consultation not found.</p>
        </div>
      </div>
    )
  }

  // Mock pre-consult data (in real app, this would come from patient's submission)
  const mockPreConsultData = {
    symptoms: 'Recurring fever since 4 days, mild cough at night, reduced appetite',
    duration: '4 days',
    medications: 'Paracetamol 250mg SOS, Cetirizine 5ml once daily',
    allergies: 'No known allergies',
    temperature: '101.2 F',
    weight: '14 kg',
    height: '95 cm',
    notes: 'Child gets cranky during video calls. Has been more tired than usual.',
    files: [
      { name: 'Previous prescription - Dr. Rao.pdf', type: 'pdf' },
      { name: 'Blood test report - June 2025.pdf', type: 'pdf' },
      { name: 'Rash on arm - photo.jpg', type: 'image' },
    ],
  }

  // Mock previous consultation history
  const mockHistory = [
    { date: '2025-05-10', doctor: 'Dr. Anitha Reddy', subspeciality: 'Pulmonology', summary: 'Mild wheezing. Prescribed salbutamol inhaler. Follow-up in 2 weeks.' },
    { date: '2025-03-22', doctor: 'Dr. Priya Sharma', subspeciality: 'Cardiology', summary: 'Routine cardiac checkup. Echo normal. No concerns.' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar showBack backHref="/doctor/dashboard" />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{consult.childName}</h1>
            <p className="text-muted-foreground">
              Parent: {consult.patientName} · {consult.subspeciality}
            </p>
            <div className="mt-2 flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1 text-foreground">
                <Calendar className="h-4 w-4 text-primary" />
                {new Date(consult.date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              <span className="flex items-center gap-1 text-foreground">
                <Clock className="h-4 w-4 text-primary" />
                {consult.time}
              </span>
              <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-medium text-primary capitalize">
                {consult.status}
              </span>
            </div>
          </div>
          {consult.status === 'upcoming' && (
            <a
              href={`/doctor/consult-room/${consult.id}`}
              className="flex h-11 items-center gap-2 rounded-xl bg-primary px-6 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Video className="h-5 w-5" />
              Join Call
            </a>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Pre-consult data */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground">
              <Stethoscope className="h-5 w-5 text-primary" />
              Pre-Consultation Info
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium uppercase text-muted-foreground">Current Symptoms</p>
                <p className="mt-1 text-sm text-foreground">{mockPreConsultData.symptoms}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">Duration</p>
                  <p className="mt-1 text-sm text-foreground">{mockPreConsultData.duration}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">Temperature</p>
                  <p className="mt-1 flex items-center gap-1 text-sm text-foreground">
                    <Thermometer className="h-3.5 w-3.5 text-primary" />
                    {mockPreConsultData.temperature}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">Weight</p>
                  <p className="mt-1 text-sm text-foreground">{mockPreConsultData.weight}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">Height</p>
                  <p className="mt-1 text-sm text-foreground">{mockPreConsultData.height}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-muted-foreground">Medications Given</p>
                <p className="mt-1 flex items-center gap-1 text-sm text-foreground">
                  <Pill className="h-3.5 w-3.5 text-primary" />
                  {mockPreConsultData.medications}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-muted-foreground">Allergies</p>
                <p className="mt-1 text-sm text-foreground">{mockPreConsultData.allergies}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-muted-foreground">Parent Notes</p>
                <p className="mt-1 text-sm italic text-muted-foreground">"{mockPreConsultData.notes}"</p>
              </div>
            </div>
          </div>

          {/* Uploaded files + History */}
          <div className="space-y-6">
            {/* Files */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground">
                <FileText className="h-5 w-5 text-primary" />
                Uploaded Documents
              </h2>
              <div className="space-y-2">
                {mockPreConsultData.files.map((file) => (
                  <div
                    key={file.name}
                    className="flex items-center gap-3 rounded-lg border border-border bg-background p-3"
                  >
                    {file.type === 'image' ? (
                      <Image className="h-5 w-5 text-primary" />
                    ) : (
                      <FileText className="h-5 w-5 text-primary" />
                    )}
                    <span className="flex-1 text-sm text-foreground">{file.name}</span>
                    <button className="text-xs text-primary hover:underline">View</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Previous consultation history */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground">
                <User className="h-5 w-5 text-primary" />
                Previous Consultations
              </h2>
              {mockHistory.length > 0 ? (
                <div className="space-y-3">
                  {mockHistory.map((h, i) => (
                    <div key={i} className="rounded-lg border border-border bg-background p-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground">{h.doctor}</p>
                        <p className="text-xs text-muted-foreground">{h.date}</p>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{h.subspeciality}</p>
                      <p className="mt-2 text-sm text-foreground">{h.summary}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No previous consultations on record.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
