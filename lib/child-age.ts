import type { Child } from './patient-data'

const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000

export function parseISODate(iso: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!m) return null
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  return Number.isNaN(d.getTime()) ? null : d
}

export function localDateISO(d: Date = new Date()): string {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
}

// A date of birth is valid if it is a real date, not in the future, and within 25 years.
export function isValidDob(iso: string, today: Date = new Date()): boolean {
  const d = parseISODate(iso)
  if (!d) return false
  if (d.getTime() > today.getTime()) return false
  return (today.getTime() - d.getTime()) / MS_PER_YEAR <= 25
}

type AgeSource = Pick<Child, 'age' | 'dob'>

// Age in years (decimal) on the given date. Uses the date of birth when present,
// otherwise falls back to the whole-year age stored at signup (older profiles).
export function getAgeYears(child: AgeSource, on: Date = new Date()): number {
  if (child.dob) {
    const dob = parseISODate(child.dob)
    if (dob) return Math.max(0, Math.round(((on.getTime() - dob.getTime()) / MS_PER_YEAR) * 100) / 100)
  }
  return child.age
}

// Friendly age label: months for young children, years otherwise.
export function formatAge(child: AgeSource): string {
  if (child.dob && parseISODate(child.dob)) {
    const years = getAgeYears(child)
    const months = Math.floor(years * 12)
    if (months < 1) return 'Under 1 mo'
    if (months < 24) return months + ' mo'
    return Math.floor(years) + ' yrs'
  }
  return child.age + ' yrs'
}