'use client'

import { useEffect, useState, useCallback } from 'react'
import { Newspaper } from 'lucide-react'
import { getNews, type NewsArticle } from '@/lib/mock-data'

// Center-focus news carousel for the landing page.
// Three cards visible: the center one large, the flanking ones smaller and faded.
// Auto-advances on a timer; whichever card rotates to the center grows.
// Clicking a side card rotates it to center; clicking the center card opens
// its (placeholder) /news/[id] page. Pauses while hovered.

const ROTATE_MS = 5000

export function NewsCarousel() {
  const articles = getNews()
  const n = articles.length
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  const go = useCallback((i: number) => setActive(((i % n) + n) % n), [n])

  useEffect(() => {
    if (paused || n <= 1) return
    const t = setInterval(() => setActive((a) => (a + 1) % n), ROTATE_MS)
    return () => clearInterval(t)
  }, [paused, n])

  // relative position of card i to the active one, wrapped to [-n/2, n/2]
  const offsetOf = (i: number) => {
    let d = i - active
    if (d > n / 2) d -= n
    if (d < -n / 2) d += n
    return d
  }

  return (
    <section className="overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold text-foreground sm:text-4xl">
          From One Roof Pediatrics
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
          Recognition, doctor stories, and guidance for parents
        </p>

        <div
          className="relative mt-12 flex h-[420px] items-center justify-center"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {articles.map((a, i) => {
            const d = offsetOf(i)
            const abs = Math.abs(d)
            if (abs > 1) {
              // keep off-stage cards mounted but hidden for smooth transitions
              return (
                <div key={a.id} className="pointer-events-none absolute opacity-0" aria-hidden="true" />
              )
            }
            const isCenter = d === 0
            const translate = d * 58 // percent
            const scale = isCenter ? 1 : 0.8
            const z = isCenter ? 30 : 10
            const opacity = isCenter ? 1 : 0.55
            return (
              <article
                key={a.id}
                onClick={() => (isCenter ? (window.location.href = `/news/${a.id}`) : go(i))}
                className="absolute w-[300px] cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-lg transition-all duration-500 ease-out sm:w-[380px]"
                style={{
                  transform: `translateX(${translate}%) scale(${scale})`,
                  zIndex: z,
                  opacity,
                }}
              >
                <div className="relative h-48 w-full overflow-hidden bg-neutral-900">
                  {a.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={a.image} alt={a.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-neutral-900">
                      <Newspaper className="h-10 w-10 text-primary/70" />
                    </div>
                  )}
                  <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    {a.category}
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-xs text-muted-foreground">
                    {new Date(a.date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  <h3 className="mt-1 line-clamp-2 font-semibold text-foreground">{a.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{a.summary}</p>
                </div>
              </article>
            )
          })}
        </div>

        {/* Dots */}
        <div className="mt-6 flex justify-center gap-2">
          {articles.map((a, i) => (
            <button
              key={a.id}
              onClick={() => go(i)}
              aria-label={`Show article ${i + 1}`}
              className={
                'h-2 rounded-full transition-all ' +
                (i === active ? 'w-6 bg-primary' : 'w-2 bg-border hover:bg-muted-foreground')
              }
            />
          ))}
        </div>
      </div>
    </section>
  )
}