'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  ArrowLeft,
  Camera,
  CameraOff,
  Mic,
  MicOff,
  Pen,
  Phone,
  Send,
} from 'lucide-react'
import { useDoctor } from '@/lib/doctor-context'
import { cn } from '@/lib/utils'

export default function DoctorConsultRoomPage() {
  const router = useRouter()
  const params = useParams()
  const consultId = params.consultId as string
  const { currentDoctor, consultations, completeConsultation } = useDoctor()

  const [micOn, setMicOn] = useState(true)
  const [cameraOn, setCameraOn] = useState(true)
  const [showWhiteboard, setShowWhiteboard] = useState(false)
  const [timer, setTimer] = useState(0)
  const [chatMsg, setChatMsg] = useState('')
  const [messages, setMessages] = useState<{ from: string; text: string }[]>([
    { from: 'System', text: 'Consultation started. Patient is connected.' },
  ])

  const consult = consultations.find((c) => c.id === consultId)

  useEffect(() => {
    if (!currentDoctor) router.push('/login/doctor')
  }, [currentDoctor, router])

  // Timer
  useEffect(() => {
    const interval = setInterval(() => setTimer((t) => t + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  if (!currentDoctor || !consult) return null

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleEndCall = () => {
    router.push(`/doctor/post-consult/${consultId}`)
  }

  const sendMessage = () => {
    if (!chatMsg.trim()) return
    setMessages([...messages, { from: currentDoctor.name, text: chatMsg }])
    setChatMsg('')
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/doctor/consultations')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {consult.childName} — {consult.subspeciality}
            </p>
            <p className="text-xs text-muted-foreground">Parent: {consult.patientName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">
            {formatTime(timer)}
          </span>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Video area */}
        <div className="flex flex-1 flex-col">
          <div className="relative flex flex-1 items-center justify-center bg-muted/20">
            {/* Mock patient video */}
            <div className="flex h-full w-full items-center justify-center">
              <div className="text-center">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-3xl font-bold text-primary">
                    {consult.childName.charAt(0)}
                  </span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">Patient video feed</p>
              </div>
            </div>

            {/* Self-view */}
            <div className="absolute bottom-4 right-4 h-32 w-44 overflow-hidden rounded-lg border border-border bg-card">
              <div className="flex h-full w-full items-center justify-center">
                {cameraOn ? (
                  <span className="text-xs text-muted-foreground">Your camera</span>
                ) : (
                  <CameraOff className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 border-t border-border bg-card px-4 py-3">
            <button
              onClick={() => setMicOn(!micOn)}
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-full transition-colors',
                micOn ? 'bg-muted text-foreground hover:bg-muted/80' : 'bg-destructive text-white'
              )}
            >
              {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setCameraOn(!cameraOn)}
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-full transition-colors',
                cameraOn ? 'bg-muted text-foreground hover:bg-muted/80' : 'bg-destructive text-white'
              )}
            >
              {cameraOn ? <Camera className="h-5 w-5" /> : <CameraOff className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setShowWhiteboard(!showWhiteboard)}
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-full transition-colors',
                showWhiteboard ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-muted/80'
              )}
            >
              <Pen className="h-5 w-5" />
            </button>
            <button
              onClick={handleEndCall}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive text-white"
            >
              <Phone className="h-5 w-5 rotate-[135deg]" />
            </button>
          </div>
        </div>

        {/* Sidebar: Chat or Whiteboard */}
        <div className="hidden w-80 flex-col border-l border-border bg-card md:flex">
          {showWhiteboard ? (
            <div className="flex flex-1 flex-col">
              <div className="border-b border-border px-4 py-3">
                <p className="text-sm font-medium text-foreground">Whiteboard</p>
              </div>
              <div className="flex-1 bg-white">
                {/* Placeholder for canvas — will implement full whiteboard later */}
                <div className="flex h-full items-center justify-center text-sm text-gray-400">
                  Drawing canvas — coming soon
                </div>
              </div>
              <div className="flex gap-2 border-t border-border p-3">
                <button className="rounded bg-muted px-3 py-1.5 text-xs text-foreground">Clear</button>
                <button className="rounded bg-muted px-3 py-1.5 text-xs text-foreground">Undo</button>
              </div>
            </div>
          ) : (
            <div className="flex flex-1 flex-col">
              <div className="border-b border-border px-4 py-3">
                <p className="text-sm font-medium text-foreground">Chat</p>
              </div>
              <div className="flex-1 overflow-y-auto p-3">
                {messages.map((msg, i) => (
                  <div key={i} className="mb-2">
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
    </div>
  )
}
