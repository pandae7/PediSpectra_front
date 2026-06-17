'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  Camera,
  CameraOff,
  FileText,
  Mic,
  MicOff,
  Monitor,
  Pen,
  Phone,
  Save,
  Users,
} from 'lucide-react'
import { useDoctor } from '@/lib/doctor-context'
import { Whiteboard } from '@/components/consultation/whiteboard'
import { cn } from '@/lib/utils'

interface DoctorNotes {
  chiefComplaints: string
  historyOfPresentIllness: string
  diagnosis: string
  treatmentPlan: string
  followUp: string
  summary: string
}

export default function DoctorConsultRoomPage() {
  const router = useRouter()
  const params = useParams()
  const consultId = params.consultId as string
  const { currentDoctor, consultations, completeConsultation, isLoading } = useDoctor()

  const [micOn, setMicOn] = useState(true)
  const [cameraOn, setCameraOn] = useState(true)
  const [activePanel, setActivePanel] = useState<'notes' | 'whiteboard'>('notes')
  const [timer, setTimer] = useState(0)
  const [notesSaved, setNotesSaved] = useState(false)

  const [notes, setNotes] = useState<DoctorNotes>({
    chiefComplaints: '',
    historyOfPresentIllness: '',
    diagnosis: '',
    treatmentPlan: '',
    followUp: '',
    summary: '',
  })

  const consult = consultations.find((c) => c.id === consultId)

  useEffect(() => {
    if (!isLoading && !currentDoctor) router.push('/login/doctor')
  }, [currentDoctor, isLoading, router])

  // Timer
  useEffect(() => {
    const interval = setInterval(() => setTimer((t) => t + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  // Auto-save notes to localStorage
  useEffect(() => {
    const timeout = setTimeout(() => {
      try {
        localStorage.setItem(`pedispectra-notes-${consultId}`, JSON.stringify(notes))
      } catch {}
    }, 1000)
    return () => clearTimeout(timeout)
  }, [notes, consultId])

  // Load saved notes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`pedispectra-notes-${consultId}`)
      if (saved) setNotes(JSON.parse(saved))
    } catch {}
  }, [consultId])

  if (isLoading || !currentDoctor || !consult) return null

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleEndCall = () => {
    // Save notes as post-consult data
    const fullRemarks = [
      notes.chiefComplaints && `Chief Complaints: ${notes.chiefComplaints}`,
      notes.historyOfPresentIllness && `History: ${notes.historyOfPresentIllness}`,
      notes.diagnosis && `Diagnosis: ${notes.diagnosis}`,
      notes.treatmentPlan && `Treatment Plan: ${notes.treatmentPlan}`,
      notes.followUp && `Follow-up: ${notes.followUp}`,
      notes.summary && `Summary: ${notes.summary}`,
    ].filter(Boolean).join('\n\n')

    if (fullRemarks) {
      completeConsultation(consultId, fullRemarks)
    }
    router.push(`/doctor/post-consult/${consultId}`)
  }

  const handleSaveNotes = () => {
    try {
      localStorage.setItem(`pedispectra-notes-${consultId}`, JSON.stringify(notes))
      setNotesSaved(true)
      setTimeout(() => setNotesSaved(false), 2000)
    } catch {}
  }

  // Mock pre-consult data from patient
  const preConsultData = consult.preConsultData as Record<string, unknown> | undefined
  const patientFiles = [
    { name: 'Previous prescription.pdf', type: 'pdf' },
    { name: 'Lab report.pdf', type: 'pdf' },
    { name: 'Symptom photo.jpg', type: 'image' },
  ]

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-sm font-semibold text-foreground">
              {consult.childName} — {consult.subspeciality}
            </p>
            <p className="text-xs text-muted-foreground">Parent: {consult.patientName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">
            ● Live — {formatTime(timer)}
          </span>
        </div>
      </header>

      {/* Main layout: Video | Notes | Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT: Video / Whiteboard (60%) */}
        <div className="flex w-[60%] flex-col border-r border-border">
          <div className="relative flex-1 bg-muted/10">
            {activePanel === 'whiteboard' ? (
              <Whiteboard />
            ) : (
              <>
                {/* Mock video area */}
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-4xl font-bold text-primary">
                        {consult.childName.charAt(0)}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">
                      Patient video feed
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Daily.co integration ready — add API key to enable live video
                    </p>
                  </div>
                </div>

                {/* Self-view */}
                <div className="absolute bottom-4 right-4 h-28 w-40 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
                  <div className="flex h-full w-full items-center justify-center">
                    {cameraOn ? (
                      <span className="text-xs text-muted-foreground">You</span>
                    ) : (
                      <CameraOff className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Controls bar */}
          <div className="flex items-center justify-center gap-3 border-t border-border bg-card px-4 py-2.5">
            <button
              onClick={() => setMicOn(!micOn)}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full transition-colors',
                micOn ? 'bg-muted text-foreground hover:bg-muted/80' : 'bg-destructive text-white'
              )}
              title={micOn ? 'Mute' : 'Unmute'}
            >
              {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setCameraOn(!cameraOn)}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full transition-colors',
                cameraOn ? 'bg-muted text-foreground hover:bg-muted/80' : 'bg-destructive text-white'
              )}
              title={cameraOn ? 'Camera off' : 'Camera on'}
            >
              {cameraOn ? <Camera className="h-4 w-4" /> : <CameraOff className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setActivePanel(activePanel === 'whiteboard' ? 'notes' : 'whiteboard')}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full transition-colors',
                activePanel === 'whiteboard'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground hover:bg-muted/80'
              )}
              title="Whiteboard"
            >
              <Pen className="h-4 w-4" />
            </button>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground hover:bg-muted/80"
              title="Screen share"
            >
              <Monitor className="h-4 w-4" />
            </button>
            <button
              onClick={handleEndCall}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive text-white"
              title="End call"
            >
              <Phone className="h-4 w-4 rotate-[135deg]" />
            </button>
          </div>
        </div>

        {/* CENTER: Doctor Notes (25%) */}
        <div className="flex w-[25%] flex-col border-r border-border">
          <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
            <h2 className="text-sm font-semibold text-foreground">Doctor Notes</h2>
            <button
              onClick={handleSaveNotes}
              className="flex items-center gap-1 rounded px-2 py-1 text-xs text-primary hover:bg-primary/10"
            >
              <Save className="h-3 w-3" />
              {notesSaved ? 'Saved!' : 'Save'}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            <div className="space-y-3">
              <NoteField
                label="Chief Complaints"
                value={notes.chiefComplaints}
                onChange={(v) => setNotes({ ...notes, chiefComplaints: v })}
                placeholder="Fever since 3 days, cough..."
              />
              <NoteField
                label="History of Present Illness"
                value={notes.historyOfPresentIllness}
                onChange={(v) => setNotes({ ...notes, historyOfPresentIllness: v })}
                placeholder="Started with mild fever, progressed to..."
              />
              <NoteField
                label="Diagnosis"
                value={notes.diagnosis}
                onChange={(v) => setNotes({ ...notes, diagnosis: v })}
                placeholder="Acute bronchitis / URTI..."
              />
              <NoteField
                label="Treatment Plan"
                value={notes.treatmentPlan}
                onChange={(v) => setNotes({ ...notes, treatmentPlan: v })}
                placeholder="Rx: Amoxicillin 250mg TID x 5 days..."
              />
              <NoteField
                label="Follow-up"
                value={notes.followUp}
                onChange={(v) => setNotes({ ...notes, followUp: v })}
                placeholder="Review in 5 days, if fever persists..."
              />
              <NoteField
                label="Summary"
                value={notes.summary}
                onChange={(v) => setNotes({ ...notes, summary: v })}
                placeholder="Brief summary for patient report..."
              />
            </div>
          </div>

          <div className="border-t border-border p-3">
            <p className="text-xs text-muted-foreground">
              Notes are auto-saved and will be included in the final consultation report.
            </p>
          </div>
        </div>

        {/* RIGHT: Participants + Patient Files (15%) */}
        <div className="flex w-[15%] min-w-[180px] flex-col">
          {/* Participants */}
          <div className="border-b border-border p-3">
            <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              Participants
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-xs text-foreground">{currentDoctor.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-xs text-foreground">{consult.patientName}</span>
              </div>
            </div>
          </div>

          {/* Patient files */}
          <div className="flex-1 overflow-y-auto p-3">
            <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase text-muted-foreground">
              <FileText className="h-3.5 w-3.5" />
              Patient Files
            </h3>
            <div className="space-y-2">
              {patientFiles.map((file) => (
                <div
                  key={file.name}
                  className="cursor-pointer rounded-lg border border-border bg-background p-2 text-xs text-foreground hover:border-primary/50"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-primary" />
                    <span className="truncate">{file.name}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pre-consult summary */}
            {preConsultData && (
              <div className="mt-4">
                <h3 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                  Pre-Consult Info
                </h3>
                <div className="rounded-lg border border-border bg-background p-2 text-xs text-muted-foreground">
                  <p>Symptoms and details submitted by parent before the call.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function NoteField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted-foreground">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={2}
        className="w-full resize-none rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
      />
    </div>
  )
}
