'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  Camera,
  CameraOff,
  Mic,
  MicOff,
  Phone,
  MessageCircle,
  Send,
} from 'lucide-react'
import { getConsultations, getDoctors, initializeMockData, type Consultation, type DoctorProfile } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

function PatientConsultRoomContent() {
  const router = useRouter()
  const params = useParams()
  const consultId = params.consultId as string

  const [consult, setConsult] = useState<Consultation | null>(null)
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null)
  const [micOn, setMicOn] = useState(true)
  const [cameraOn, setCameraOn] = useState(true)
  const [showChat, setShowChat] = useState(false)
  const [timer, setTimer] = useState(0)
  const [roomUrl, setRoomUrl] = useState<string | null>(null)
  const [videoLoading, setVideoLoading] = useState(true)
  const [videoError, setVideoError] = useState<string | null>(null)
  const [chatMsg, setChatMsg] = useState('')
  const [messages, setMessages] = useState<{ from: string; text: string }[]>([
    { from: 'System', text: 'You are connected. The doctor will join shortly.' },
  ])

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

  // Timer
  useEffect(() => {
    const interval = setInterval(() => setTimer((t) => t + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  // Create or load Daily.co room
  useEffect(() => {
    async function loadRoom() {
      try {
        const storedUrl = localStorage.getItem(`pedispectra-room-${consultId}`)
        if (storedUrl) {
          setRoomUrl(storedUrl)
          setVideoLoading(false)
          return
        }

        const res = await fetch('/api/video/create-room', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ consultationId: consultId }),
        })

        if (!res.ok) {
          setVideoError('Could not connect to video room.')
          setVideoLoading(false)
          return
        }

        const data = await res.json()
        if (data.mock) {
          setVideoError('Video service not configured.')
          setVideoLoading(false)
          return
        }

        setRoomUrl(data.url)
        localStorage.setItem(`pedispectra-room-${consultId}`, data.url)
        setVideoLoading(false)
      } catch {
        setVideoError('Failed to connect to video service.')
        setVideoLoading(false)
      }
    }

    if (consult) loadRoom()
  }, [consult, consultId])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleEndCall = () => {
    router.push('/patient/consultations')
  }

  const sendMessage = () => {
    if (!chatMsg.trim()) return
    setMessages([...messages, { from: 'You', text: chatMsg }])
    setChatMsg('')
  }

  if (!consult || !doctor) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading consultation...</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-4 py-2">
        <div>
          <p className="text-sm font-semibold text-foreground">
            Consultation with {doctor.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {doctor.subspeciality} · {consult.childName}
          </p>
        </div>
        <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">
          ● Live — {formatTime(timer)}
        </span>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Video area */}
        <div className="flex flex-1 flex-col">
          <div className="relative flex-1 bg-muted/10">
            {videoLoading ? (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <p className="mt-3 text-sm text-muted-foreground">Connecting to video...</p>
                </div>
              </div>
            ) : roomUrl ? (
              <iframe
                src={`${roomUrl}?t=Patient&showLeaveButton=false&showFullscreenButton=true`}
                allow="camera; microphone; fullscreen; display-capture"
                className="h-full w-full border-0"
                title="Video consultation"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center max-w-sm">
                  <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-4xl font-bold text-primary">
                      {doctor.name.split(' ').pop()?.charAt(0)}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {videoError || 'Waiting for video connection...'}
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-3 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 border-t border-border bg-card px-4 py-3">
            <button
              onClick={() => setMicOn(!micOn)}
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-full transition-colors',
                micOn ? 'bg-muted text-foreground hover:bg-muted/80' : 'bg-destructive text-white'
              )}
              title={micOn ? 'Mute' : 'Unmute'}
            >
              {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setCameraOn(!cameraOn)}
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-full transition-colors',
                cameraOn ? 'bg-muted text-foreground hover:bg-muted/80' : 'bg-destructive text-white'
              )}
              title={cameraOn ? 'Camera off' : 'Camera on'}
            >
              {cameraOn ? <Camera className="h-5 w-5" /> : <CameraOff className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setShowChat(!showChat)}
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-full transition-colors',
                showChat ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-muted/80'
              )}
              title="Chat"
            >
              <MessageCircle className="h-5 w-5" />
            </button>
            <button
              onClick={handleEndCall}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive text-white"
              title="End call"
            >
              <Phone className="h-5 w-5 rotate-[135deg]" />
            </button>
          </div>
        </div>

        {/* Chat sidebar */}
        {showChat && (
          <div className="flex w-80 flex-col border-l border-border bg-card">
            <div className="border-b border-border px-4 py-3">
              <p className="text-sm font-medium text-foreground">Chat</p>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              {messages.map((msg, i) => (
                <div key={i} className="mb-3">
                  <p className="text-xs font-medium text-primary">{msg.from}</p>
                  <p className="text-sm text-foreground">{msg.text}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2 border-t border-border p-3">
              <input
                type="text"
                value={chatMsg}
                onChange={(e) => setChatMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="h-9 flex-1 rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button
                onClick={sendMessage}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function PatientConsultRoomPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-background"><p className="text-muted-foreground">Loading...</p></div>}>
      <PatientConsultRoomContent />
    </Suspense>
  )
}
