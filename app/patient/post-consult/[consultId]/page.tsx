'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Download,
  FileText,
  Phone,
  Pill,
  Star,
  Stethoscope,
} from 'lucide-react'
import { getConsultations, getDoctors, initializeMockData, type Consultation, type DoctorProfile } from '@/lib/mock-data'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

export default function PatientPostConsultPage() {
  const params = useParams()
  const consultId = params.consultId as string
  const [consult, setConsult] = useState<Consultation | null>(null)
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null)

  useEffect(() => {
    initializeMockData()
    const consultations = getConsultations()
    const doctors = getDoctors()
    const found = consultations.find((c) => c.id === consultId)
    if (found) {
      setConsult(found)
      const doc = doctors.find((d) => d.id === found.doctorId)
      if (doc) setDoctor(doc)
    }
  }, [consultId])

  if (!consult || !doctor) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar showBack backHref="/patient/consultations" />
        <div className="flex items-center justify-center py-20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </div>
    )
  }

  // Mock post-consult data (in real app this comes from doctor's submission)
  const postConsultData = {
    diagnosis: 'Acute Viral Upper Respiratory Infection with reactive airway disease',
    prescription: [
      { name: 'Salbutamol Inhaler 100mcg', dosage: '2 puffs via spacer', frequency: 'SOS when wheezing', duration: 'As needed' },
      { name: 'Budesonide Inhaler 100mcg', dosage: '1 puff via spacer', frequency: 'Twice daily', duration: '4 weeks' },
      { name: 'Montelukast 4mg', dosage: '1 sachet', frequency: 'Once daily at bedtime', duration: '4 weeks' },
      { name: 'Paracetamol Syrup', dosage: '5ml', frequency: 'SOS for fever >100.4°F', duration: 'As needed' },
    ],
    instructions: [
      'Continue inhaler use even if child seems well — do not stop early',
      'Maintain peak flow diary and bring to follow-up',
      'Avoid cold air, dust, and smoke exposure',
      'Rinse mouth with water after budesonide use',
      'Ensure adequate fluid intake',
    ],
    followUp: 'Review in 2 weeks with peak flow readings. Earlier if symptoms worsen.',
    summary: 'Child presented with 4-day history of cough and mild fever. Examination findings consistent with reactive airway disease. Started on controller therapy with low-dose ICS. Prognosis is good with compliance.',
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar showBack backHref="/patient/consultations" />

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/15">
            <CheckCircle className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Consultation Complete</h1>
          <p className="mt-1 text-muted-foreground">
            with {doctor.name} · {doctor.subspeciality}
          </p>
          <p className="text-sm text-muted-foreground">
            {new Date(consult.date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* ⚠️ EMERGENCY ESCALATION — always shown */}
        <div className="mb-6 rounded-xl border-2 border-destructive/30 bg-destructive/5 p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 shrink-0 text-destructive" />
            <div>
              <h2 className="font-semibold text-destructive">Emergency Escalation</h2>
              <p className="mt-1 text-sm text-foreground">
                If any of the following occur, <strong>visit the nearest emergency department immediately</strong>:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-foreground">
                <li>• Child has difficulty breathing or lips turn blue</li>
                <li>• High fever (above 103°F) not responding to medication</li>
                <li>• Child becomes unusually drowsy or unresponsive</li>
                <li>• Severe dehydration (no urine for 8+ hours)</li>
                <li>• Any seizure or convulsion</li>
              </ul>
              <div className="mt-3 flex items-center gap-2 text-sm font-medium text-destructive">
                <Phone className="h-4 w-4" />
                Emergency: Call 108 or visit nearest hospital ER
              </div>
            </div>
          </div>
        </div>

        {/* Diagnosis */}
        <div className="mb-4 rounded-xl border border-border bg-card p-5">
          <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
            <Stethoscope className="h-4 w-4 text-primary" />
            Diagnosis
          </h2>
          <p className="text-sm text-foreground">{postConsultData.diagnosis}</p>
        </div>

        {/* Prescription */}
        <div className="mb-4 rounded-xl border border-border bg-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Pill className="h-4 w-4 text-primary" />
              Prescription
            </h2>
            <button className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground">
              <Download className="h-3.5 w-3.5" />
              Download
            </button>
          </div>
          <div className="space-y-3">
            {postConsultData.prescription.map((med, i) => (
              <div key={i} className="rounded-lg border border-border bg-background p-3">
                <p className="font-medium text-foreground">{i + 1}. {med.name}</p>
                <div className="mt-1 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                  <span>Dose: {med.dosage}</span>
                  <span>Freq: {med.frequency}</span>
                  <span>For: {med.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="mb-4 rounded-xl border border-border bg-card p-5">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
            <FileText className="h-4 w-4 text-primary" />
            Instructions
          </h2>
          <ul className="space-y-2">
            {postConsultData.instructions.map((inst, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                {inst}
              </li>
            ))}
          </ul>
        </div>

        {/* Follow-up */}
        <div className="mb-4 rounded-xl border border-border bg-card p-5">
          <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
            <Calendar className="h-4 w-4 text-primary" />
            Follow-up
          </h2>
          <p className="text-sm text-foreground">{postConsultData.followUp}</p>
        </div>

        {/* Summary */}
        <div className="mb-4 rounded-xl border border-border bg-card p-5">
          <h2 className="mb-2 text-sm font-semibold text-foreground">Doctor's Summary</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{postConsultData.summary}</p>
        </div>

        {/* Rate & Actions */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-3 text-sm font-semibold text-foreground">Rate your experience</h2>
          <div className="mb-4 flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-7 w-7 cursor-pointer text-border hover:fill-primary hover:text-primary" />
            ))}
          </div>
          <div className="flex gap-3">
            <a
              href={`/patient/messages/${consultId}`}
              className="flex-1 rounded-lg border border-primary bg-primary/10 py-2.5 text-center text-sm font-medium text-primary hover:bg-primary/20"
            >
              💬 Message Doctor
            </a>
            <a
              href="/patient/consultations"
              className="flex-1 rounded-lg border border-border py-2.5 text-center text-sm font-medium text-foreground hover:bg-muted"
            >
              Back to Consultations
            </a>
            <a
              href={`/booking/${consult.doctorId}`}
              className="flex-1 rounded-lg bg-primary py-2.5 text-center text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Book Follow-up
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
