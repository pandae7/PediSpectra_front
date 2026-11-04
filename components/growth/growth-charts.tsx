'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { Child } from '@/lib/patient-data'
import {
  buildReferenceRows,
  referenceAt,
  estimatePercentile,
  type GrowthMetric,
  type ReferenceRow,
} from '@/lib/growth-data'

type ChartRow = ReferenceRow & { child?: number }

const METRICS: { metric: GrowthMetric; title: string; unit: string; key: 'weightKg' | 'heightCm' }[] = [
  { metric: 'weight', title: 'Weight for age', unit: 'kg', key: 'weightKg' },
  { metric: 'height', title: 'Height for age', unit: 'cm', key: 'heightCm' },
]

function buildRows(metric: GrowthMetric, key: 'weightKg' | 'heightCm', child: Child): ChartRow[] {
  const rows: ChartRow[] = buildReferenceRows(metric, child.sex)
  for (const m of child.measurements ?? []) {
    const v = m[key]
    if (v === undefined) continue
    const ref = referenceAt(metric, child.sex, m.ageYears)
    rows.push({
      age: Math.round(m.ageYears * 100) / 100,
      p3: ref[3],
      p15: ref[15],
      p50: ref[50],
      p85: ref[85],
      p97: ref[97],
      child: v,
    })
  }
  return rows.sort((a, b) => a.age - b.age)
}

function latestFor(child: Child, key: 'weightKg' | 'heightCm') {
  const list = (child.measurements ?? []).filter((m) => m[key] !== undefined)
  if (list.length === 0) return null
  return list.reduce((a, b) => (b.ageYears > a.ageYears || (b.ageYears === a.ageYears && b.date >= a.date) ? b : a))
}

const AXIS_TICK = { fill: 'var(--muted-foreground)', fontSize: 12 }

export function GrowthCharts({ child }: { child: Child }) {
  return (
    <div className="space-y-6">
      {METRICS.map(({ metric, title, unit, key }) => {
        const data = buildRows(metric, key, child)
        const latest = latestFor(child, key)
        const est = latest ? estimatePercentile(metric, child.sex, latest.ageYears, latest[key] as number) : null
        const hasPoints = (child.measurements ?? []).some((m) => m[key] !== undefined)

        return (
          <div key={metric} className="rounded-xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-foreground">{title}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Dashed lines show the 3rd, 15th, 50th, 85th and 97th percentile reference
                </p>
              </div>
              {latest && est && (
                <div className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-right">
                  <p className="text-sm font-semibold text-foreground">
                    {latest[key]} {unit}
                  </p>
                  <p className="text-xs text-muted-foreground">{est.text}</p>
                </div>
              )}
            </div>

            <div className="mt-4 h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="age"
                    type="number"
                    domain={[0, 18]}
                    ticks={[0, 2, 4, 6, 8, 10, 12, 14, 16, 18]}
                    tick={AXIS_TICK}
                    stroke="var(--border)"
                    label={{ value: 'Age (years)', position: 'insideBottom', offset: -4, fill: 'var(--muted-foreground)', fontSize: 12 }}
                  />
                  <YAxis tick={AXIS_TICK} stroke="var(--border)" width={44} unit={` ${unit}`} domain={['auto', 'auto']} />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                      color: 'var(--foreground)',
                      fontSize: 12,
                    }}
                    labelFormatter={(v) => `Age ${v} yrs`}
                  />
                  <Line dataKey="p97" name="97th" stroke="var(--muted-foreground)" strokeDasharray="4 4" strokeWidth={1} dot={false} isAnimationActive={false} />
                  <Line dataKey="p85" name="85th" stroke="var(--muted-foreground)" strokeDasharray="2 4" strokeWidth={1} strokeOpacity={0.7} dot={false} isAnimationActive={false} />
                  <Line dataKey="p50" name="50th" stroke="var(--muted-foreground)" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                  <Line dataKey="p15" name="15th" stroke="var(--muted-foreground)" strokeDasharray="2 4" strokeWidth={1} strokeOpacity={0.7} dot={false} isAnimationActive={false} />
                  <Line dataKey="p3" name="3rd" stroke="var(--muted-foreground)" strokeDasharray="4 4" strokeWidth={1} dot={false} isAnimationActive={false} />
                  <Line
                    dataKey="child"
                    name={child.name}
                    stroke="var(--primary)"
                    strokeWidth={3}
                    dot={{ r: 4, fill: 'var(--primary)' }}
                    activeDot={{ r: 6 }}
                    connectNulls
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {!hasPoints && (
              <p className="mt-2 text-center text-xs text-muted-foreground">
                No {metric} recorded yet for {child.name}.
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}