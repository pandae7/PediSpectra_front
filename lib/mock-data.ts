// Mock data + realistic copy for the pediatric teleconsultation prototype.

export type RedFlag = {
  id: string
  label: string
  description: string
}

// Critical red flags — selecting any of these blocks the online flow.
export const RED_FLAGS: RedFlag[] = [
  {
    id: 'breathing',
    label: 'Severe breathing difficulty',
    description: 'Gasping, ribs pulling in, or unable to speak/feed',
  },
  {
    id: 'seizure',
    label: 'Seizure or fit',
    description: 'Ongoing or repeated convulsions',
  },
  {
    id: 'unconscious',
    label: 'Unconscious or very hard to wake',
    description: 'Floppy, unresponsive, or extreme drowsiness',
  },
  {
    id: 'blue-lips',
    label: 'Blue lips, face or tongue',
    description: 'Bluish or grey colour around the mouth',
  },
  {
    id: 'poisoning',
    label: 'Swallowed something harmful',
    description: 'Medicine, chemical, battery, or unknown substance',
  },
  {
    id: 'injury',
    label: 'Major injury or heavy bleeding',
    description: 'Fall, head injury, or bleeding that won\u2019t stop',
  },
  {
    id: 'dehydration',
    label: 'Severe dehydration',
    description: 'No urine 8+ hrs, no tears, sunken eyes, very sleepy',
  },
]

export type Doctor = {
  id: string
  name: string
  qualification: string
  // 'general' pediatricians staff the urgent on-call pool.
  // 'specialist' doctors are referral/scheduled only — never auto-assigned for urgent consults.
  role: 'general' | 'specialist'
  experienceYears: number
  languages: string[]
  rating: number
  consults: number
  avatarColor: string
  initials: string
}

// The on-call general pediatrician pool. An urgent request is broadcast to this
// pool and assigned to whoever ACCEPTS first — we never pre-assign a named doctor.
export const ONCALL_POOL: Doctor[] = [
  {
    id: 'dr-meera',
    name: 'Dr. Meera Nair',
    qualification: 'MD Pediatrics · General',
    role: 'general',
    experienceYears: 12,
    languages: ['English', 'Hindi', 'Malayalam'],
    rating: 4.9,
    consults: 8200,
    avatarColor: '#2f9e83',
    initials: 'MN',
  },
  {
    id: 'dr-arjun',
    name: 'Dr. Arjun Rao',
    qualification: 'DNB Pediatrics · General',
    role: 'general',
    experienceYears: 9,
    languages: ['English', 'Hindi', 'Kannada'],
    rating: 4.8,
    consults: 5400,
    avatarColor: '#3fb27f',
    initials: 'AR',
  },
  {
    id: 'dr-fatima',
    name: 'Dr. Fatima Sheikh',
    qualification: 'MD Pediatrics · General',
    role: 'general',
    experienceYears: 15,
    languages: ['English', 'Hindi', 'Urdu'],
    rating: 4.9,
    consults: 11000,
    avatarColor: '#5ab8a3',
    initials: 'FS',
  },
]

// Kept for type/back-compat references; urgent flow uses ONCALL_POOL.
export const DOCTORS = ONCALL_POOL

// Number of pediatricians currently on call (mock live figure).
export const ONCALL_COUNT = ONCALL_POOL.length

export type ConsultPlan = {
  id: string
  name: string
  price: number
  description: string
  eta: string
}

export const PLANS: ConsultPlan[] = [
  {
    id: 'urgent',
    name: 'Urgent video consult',
    price: 499,
    description: 'Connect with the next available pediatrician',
    eta: 'Avg. wait under 5 min',
  },
  {
    id: 'priority',
    name: 'Priority consult',
    price: 799,
    description: 'Skip the queue, first in line',
    eta: 'Avg. wait under 2 min',
  },
]

export const RELATION_OPTIONS = ['Mother', 'Father', 'Guardian', 'Other'] as const
export const SEX_OPTIONS = ['Male', 'Female', 'Other'] as const

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}
