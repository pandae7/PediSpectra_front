/**
 * Daily.co Video Room Integration
 * 
 * Creates and manages video rooms via Daily.co REST API.
 * Requires DAILY_API_KEY environment variable to be set on Vercel.
 * 
 * Free tier: 10,000 participant-minutes/month, no credit card required.
 * Sign up at https://www.daily.co/ → Dashboard → Developers → API Keys
 * 
 * NOTE: Room creation must happen server-side (API route) to keep the key secret.
 * The client only receives the room URL to embed the iframe.
 */

export interface VideoRoom {
  id: string
  name: string
  url: string
  createdAt: string
  consultationId: string
}

/**
 * Creates a Daily.co room via the server API route.
 * Call this from client code — it hits /api/video/create-room.
 */
export async function createVideoRoom(consultationId: string): Promise<VideoRoom | null> {
  try {
    const res = await fetch('/api/video/create-room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ consultationId }),
    })

    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

/**
 * Gets the Daily.co embed URL for a room.
 * This URL is used in the iframe src.
 */
export function getDailyEmbedUrl(roomUrl: string, userName: string): string {
  // Daily prebuilt appends user name as query param
  return `${roomUrl}?userName=${encodeURIComponent(userName)}`
}
