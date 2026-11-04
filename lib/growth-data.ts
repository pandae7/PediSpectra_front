// Growth reference data for the DEMO.
//
// IMPORTANT: these curves are ILLUSTRATIVE approximations built from rounded
// median values and a simple spread model. They are NOT official WHO data and
// must not be used clinically. Replace with the official WHO LMS tables before
// any real use.

export type GrowthMetric = 'weight' | 'height'
export type GrowthSex = 'Male' | 'Female' | 'Other'

export const PERCENTILES = [3, 15, 50, 85, 97] as const
export type ReferenceBands = Record<3 | 15 | 50 | 85 | 97, number>

// Median values at ages 0..18 (years).
const MEDIANS: Record<GrowthMetric, Record<'Male' | 'Female', number[]>> = {
  weight: {
    Male: [3.3, 9.6, 12.2, 14.3, 16.3, 18.3, 20.5, 22.9, 25.4, 28.1, 31.2, 35.3, 40.5, 45.3, 51.0, 56.5, 61.0, 64.5, 67.0],
    Female: [3.2, 8.9, 11.5, 13.9, 16.1, 18.2, 20.2, 22.4, 25.0, 28.2, 31.9, 36.9, 41.5, 45.8, 49.4, 52.0, 53.7, 54.7, 55.7],
  },
  height: {
    Male: [49.9, 75.7, 87.1, 96.1, 103.3, 110.0, 116.0, 121.7, 127.3, 132.6, 137.8, 143.1, 149.1, 156.0, 163.2, 169.0, 172.9, 175.2, 176.5],
    Female: [49.1, 74.0, 85.7, 94.9, 102.7, 109.4, 115.1, 120.8, 126.6, 132.5, 138.6, 144.8, 151.2, 156.7, 159.8, 161.7, 162.5, 162.9, 163.1],
  },
}

// Multipliers applied to the median to get the 3rd/15th/50th/85th/97th bands.
const WEIGHT_YOUNG = [0.84, 0.92, 1, 1.09, 1.17]
const WEIGHT_OLD = [0.78, 0.88, 1, 1.15, 1.32]
const HEIGHT_SPREAD = [0.94, 0.97, 1, 1.03, 1.06]

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}
function clamp(n: number, lo: number, hi: number) {
  return Math.min(Math.max(n, lo), hi)
}
function round1(n: number) {
  return Math.round(n * 10) / 10
}

function medianFor(metric: GrowthMetric, sex: 'Male' | 'Female', age: number): number {
  const arr = MEDIANS[metric][sex]
  const a = clamp(age, 0, 18)
  const lo = Math.floor(a)
  const hi = Math.min(lo + 1, 18)
  return lerp(arr[lo], arr[hi], a - lo)
}

function medianAt(metric: GrowthMetric, sex: GrowthSex, age: number): number {
  if (sex === 'Other') {
    return (medianFor(metric, 'Male', age) + medianFor(metric, 'Female', age)) / 2
  }
  return medianFor(metric, sex, age)
}

function multipliers(metric: GrowthMetric, age: number): number[] {
  if (metric === 'height') return HEIGHT_SPREAD
  const t = clamp((age - 5) / 7, 0, 1)
  return WEIGHT_YOUNG.map((y, i) => lerp(y, WEIGHT_OLD[i], t))
}

export function referenceAt(metric: GrowthMetric, sex: GrowthSex, age: number): ReferenceBands {
  const m = medianAt(metric, sex, age)
  const k = multipliers(metric, age)
  return {
    3: round1(m * k[0]),
    15: round1(m * k[1]),
    50: round1(m * k[2]),
    85: round1(m * k[3]),
    97: round1(m * k[4]),
  }
}

export interface ReferenceRow {
  age: number
  p3: number
  p15: number
  p50: number
  p85: number
  p97: number
}

export function buildReferenceRows(metric: GrowthMetric, sex: GrowthSex): ReferenceRow[] {
  return Array.from({ length: 19 }, (_, age) => {
    const r = referenceAt(metric, sex, age)
    return { age, p3: r[3], p15: r[15], p50: r[50], p85: r[85], p97: r[97] }
  })
}

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

export interface PercentileEstimate {
  approx: number
  text: string
}

// Rough position of a value between the reference bands at the given age.
export function estimatePercentile(
  metric: GrowthMetric,
  sex: GrowthSex,
  ageYears: number,
  value: number
): PercentileEstimate {
  const ref = referenceAt(metric, sex, ageYears)
  const pts = PERCENTILES.map((p) => ({ p, v: ref[p] }))
  if (value <= pts[0].v) return { approx: 3, text: 'below the 3rd percentile' }
  if (value >= pts[4].v) return { approx: 97, text: 'above the 97th percentile' }
  for (let i = 0; i < 4; i++) {
    if (value <= pts[i + 1].v) {
      const t = (value - pts[i].v) / (pts[i + 1].v - pts[i].v)
      const p = Math.round(lerp(pts[i].p, pts[i + 1].p, t))
      return { approx: p, text: `around the ${ordinal(p)} percentile` }
    }
  }
  return { approx: 50, text: 'around the 50th percentile' }
}