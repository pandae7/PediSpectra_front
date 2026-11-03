'use client'

import { useEffect, useState, useCallback } from 'react'
import { Newspaper } from 'lucide-react'
import { getNews } from '@/lib/mock-data'

// Center-focus news carousel for the landing page.
// Portrait "poster" cards: center one large, flanking ones smaller and faded.
// Auto-advances on a timer; whichever card rotates to the center grows.
// Clicking a side card rotates it to center; clicking the center card opens
// its (placeholder) /news/[id] page. Pauses while hovered.
// Section background uses theme tokens only, so it adapts to every theme.

const ROTATE_MS = 3500

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

  const offsetOf = (i: number) => {
    let d = i - active
    if (d > n / 2) d -= n
    if (d < -n / 2) d += n
    return d
  }

  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      {/* Theme-adaptive background: soft radial glow + faint dot grid, all from
          theme tokens so it blends with dark-teal, light-sage and earthy-warm. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(60% 55% at 50% 0%, color-mix(in oklab, var(--primary) 18%, transparent), transparent 70%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.25]"
        style={{
          backgroundImage:
            'radial-gradient(color-mix(in oklab, var(--muted-foreground) 45%, transparent) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
          maskImage: 'radial-gradient(70% 70% at 50% 40%, black, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(70% 70% at 50% 40%, black, transparent 80%)',
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold text-foreground sm:text-4xl">
          From One Roof Pediatrics
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
          Recognition, doctor stories, and guidance for parents
        </p>

        <div
          className="relative mt-12 flex h-[560px] items-center justify-center"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {articles.map((a, i) => {
            const d = offsetOf(i)
            const abs = Math.abs(d)
            if (abs > 1) {
              return <div key={a.id} className="pointer-events-none absolute opacity-0" aria-hidden="true" />
            }
            const isCenter = d === 0
            const translate = d * 72 // percent — wider gap for portrait cards
            const scale = isCenter ? 1 : 0.82
            const z = isCenter ? 30 : 10
            const opacity = isCenter ? 1 : 0.5
            return (
              <article
                key={a.id}
                onClick={() => (isCenter ? (window.location.href = `/news/${a.id}`) : go(i))}
                className="absolute w-[260px] cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-xl transition-all duration-500 ease-out sm:w-[300px]"
                style={{
                  transform: `translateX(${translate}%) scale(${scale})`,
                  zIndex: z,
                  opacity,
                }}
              >
                {/* Portrait image area (3:4) so tall photos fit cleanly */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-900">
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
                <div className="p-4">
                  <p className="text-xs text-muted-foreground">
                    {new Date(a.date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-foreground">{a.title}</h3>
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{a.summary}</p>
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