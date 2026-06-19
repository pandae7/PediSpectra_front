/**
 * Post-consultation messaging system.
 * localStorage-backed for demo — no real-time sync.
 */

export interface Message {
  id: string
  consultId: string
  from: 'patient' | 'doctor'
  fromName: string
  text: string
  timestamp: string
}

const MESSAGES_KEY = 'pedispectra-messages'

export function getMessages(consultId: string): Message[] {
  if (typeof window === 'undefined') return []
  try {
    const all = JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]') as Message[]
    return all.filter((m) => m.consultId === consultId).sort((a, b) => a.timestamp.localeCompare(b.timestamp))
  } catch {
    return []
  }
}

export function sendMessage(msg: Omit<Message, 'id' | 'timestamp'>): Message {
  const newMsg: Message = {
    ...msg,
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
  }
  try {
    const all = JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]') as Message[]
    all.push(newMsg)
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(all))
  } catch {}
  return newMsg
}

export function seedDemoMessages(consultId: string, doctorName: string, patientName: string) {
  const existing = getMessages(consultId)
  if (existing.length > 0) return // already seeded

  const demoMessages: Omit<Message, 'id' | 'timestamp'>[] = [
    { consultId, from: 'patient', fromName: patientName, text: 'Thank you doctor. Quick question — can I give the inhaler before or after meals?' },
    { consultId, from: 'doctor', fromName: doctorName, text: 'It can be given at any time — meals don\'t affect inhaler absorption. Just make sure to rinse mouth after the budesonide puff.' },
    { consultId, from: 'patient', fromName: patientName, text: 'Got it. Also, the cough seems a bit worse at night. Is that expected?' },
    { consultId, from: 'doctor', fromName: doctorName, text: 'Yes, that\'s typical with reactive airways — cold air at night triggers it. Keep the room slightly warm and elevate the head a bit. If it doesn\'t improve in 3-4 days, let me know.' },
  ]

  const baseTime = new Date('2025-06-22T10:00:00Z')
  demoMessages.forEach((msg, i) => {
    const time = new Date(baseTime.getTime() + i * 3600000) // 1 hour apart
    const full: Message = {
      ...msg,
      id: `msg-seed-${consultId}-${i}`,
      timestamp: time.toISOString(),
    }
    try {
      const all = JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]') as Message[]
      all.push(full)
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(all))
    } catch {}
  })
}
