import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/video/create-room
 * Creates a Daily.co video room for a consultation.
 * 
 * Requires DAILY_API_KEY env variable on Vercel.
 * If not set, returns a mock room URL for demo purposes.
 */
export async function POST(req: NextRequest) {
  const { consultationId } = await req.json()

  const apiKey = process.env.DAILY_API_KEY

  // If no API key, return a demo/mock room
  if (!apiKey) {
    return NextResponse.json({
      id: `room-${consultationId}`,
      name: `pedispectra-${consultationId}`,
      url: `https://pedispectra.daily.co/pedispectra-${consultationId}`,
      createdAt: new Date().toISOString(),
      consultationId,
      mock: true,
    })
  }

  try {
    const res = await fetch('https://api.daily.co/v1/rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        name: `pedispectra-${consultationId}-${Date.now()}`,
        properties: {
          exp: Math.floor(Date.now() / 1000) + 3600, // expires in 1 hour
          enable_chat: true,
          enable_screenshare: true,
          max_participants: 4,
        },
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      return NextResponse.json({ error: 'Failed to create room', details: err }, { status: 500 })
    }

    const room = await res.json()

    return NextResponse.json({
      id: room.id,
      name: room.name,
      url: room.url,
      createdAt: room.created_at,
      consultationId,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Daily.co API unreachable' }, { status: 500 })
  }
}
