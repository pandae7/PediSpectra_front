'use client'

// Continuous "doctors from" hospital strip for the landing page.
// Text-based names (no trademarked logos) sourced from the demo doctor roster.
// Three rows scroll in alternating directions for a dynamic trust strip.
// Each row renders its list twice so the CSS translateX(-50%) loop is seamless.

const ROWS: string[][] = [
  ['Narayana Health', 'Fortis Hospital', 'Manipal Hospital', 'Aster CMI', 'Apollo Hospital', 'Max Hospital'],
  ['Medanta Hospital', 'Tata Memorial', 'Rainbow Hospital', 'KMC Hospital', 'Lilavati Hospital', 'Sakra Hospital'],
  ['HCG Hospital', 'AMRI Hospital', 'Care Hospital', 'Amrita Hospital', 'Columbia Asia'],
]

function Pill({ name }: { name: string }) {
  return (
    <span className="mx-3 inline-flex shrink-0 items-center rounded-full border border-border bg-card px-5 py-2 text-sm font-medium text-muted-foreground">
      {name}
    </span>
  )
}

export function HospitalsMarquee() {
  return (
    <section className="border-y border-border bg-background py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="mb-6 text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Our specialists practise at India&apos;s leading hospitals
        </p>
      </div>
      <div className="flex flex-col gap-4 overflow-hidden">
        {ROWS.map((row, i) => (
          <div key={i} className="group relative flex overflow-hidden">
            <div
              className={
                (i % 2 === 1 ? 'animate-marquee-right' : 'animate-marquee-left') +
                ' flex w-max group-hover:[animation-play-state:paused]'
              }
            >
              {[...row, ...row].map((name, j) => (
                <Pill key={`${i}-${j}`} name={name} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}