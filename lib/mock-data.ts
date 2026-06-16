/**
 * Mock Data — Pre-seeded doctors and subspecialities for demo.
 * On first load, seeds localStorage. New onboarded doctors are merged in for the session.
 */

export interface DoctorProfile {
  id: string
  name: string
  subspeciality: string
  yearsExperience: number
  pgCollege: string
  workingHospital: string
  fee: number
  rating: number
  consultationCount: number
  languages: string[]
  city: string
  availability: WeeklySlot[]
}

export interface WeeklySlot {
  day: string
  time: string
}

export interface Consultation {
  id: string
  doctorId: string
  patientName: string
  childName: string
  subspeciality: string
  date: string
  time: string
  status: 'upcoming' | 'in-progress' | 'completed' | 'cancelled'
  preConsultData?: Record<string, unknown>
  postConsultData?: Record<string, unknown>
}

export const SUBSPECIALITIES = [
  'Cardiology',
  'Neurology',
  'Pulmonology',
  'Gastroenterology',
  'Nephrology',
  'Endocrinology',
  'Hematology',
  'Oncology',
  'Rheumatology',
  'Infectious Diseases',
  'Allergy & Immunology',
  'Neonatology',
  'Developmental Pediatrics',
  'Pediatric Surgery',
  'Orthopedics',
  'Dermatology',
  'Ophthalmology',
  'ENT (Otolaryngology)',
]

export const SEED_DOCTORS: DoctorProfile[] = [
  {
    id: 'dr-001',
    name: 'Dr. Priya Sharma',
    subspeciality: 'Cardiology',
    yearsExperience: 12,
    pgCollege: 'AIIMS Delhi',
    workingHospital: 'Narayana Health',
    fee: 800,
    rating: 4.8,
    consultationCount: 245,
    languages: ['English', 'Hindi', 'Kannada'],
    city: 'Bangalore',
    availability: [
      { day: 'Monday', time: '09:00 AM' },
      { day: 'Monday', time: '09:30 AM' },
      { day: 'Monday', time: '10:00 AM' },
      { day: 'Wednesday', time: '02:00 PM' },
      { day: 'Wednesday', time: '02:30 PM' },
      { day: 'Friday', time: '11:00 AM' },
      { day: 'Friday', time: '11:30 AM' },
    ],
  },
  {
    id: 'dr-002',
    name: 'Dr. Rajesh Kumar',
    subspeciality: 'Neurology',
    yearsExperience: 15,
    pgCollege: 'CMC Vellore',
    workingHospital: 'Manipal Hospital',
    fee: 1000,
    rating: 4.9,
    consultationCount: 380,
    languages: ['English', 'Hindi', 'Tamil'],
    city: 'Chennai',
    availability: [
      { day: 'Tuesday', time: '10:00 AM' },
      { day: 'Tuesday', time: '10:30 AM' },
      { day: 'Thursday', time: '03:00 PM' },
      { day: 'Thursday', time: '03:30 PM' },
      { day: 'Saturday', time: '09:00 AM' },
      { day: 'Saturday', time: '09:30 AM' },
    ],
  },
  {
    id: 'dr-003',
    name: 'Dr. Anitha Reddy',
    subspeciality: 'Pulmonology',
    yearsExperience: 10,
    pgCollege: 'NIMHANS Bangalore',
    workingHospital: 'Apollo Hospital',
    fee: 750,
    rating: 4.7,
    consultationCount: 190,
    languages: ['English', 'Telugu', 'Kannada'],
    city: 'Hyderabad',
    availability: [
      { day: 'Monday', time: '04:00 PM' },
      { day: 'Monday', time: '04:30 PM' },
      { day: 'Wednesday', time: '09:00 AM' },
      { day: 'Wednesday', time: '09:30 AM' },
      { day: 'Friday', time: '02:00 PM' },
    ],
  },
  {
    id: 'dr-004',
    name: 'Dr. Sanjay Patel',
    subspeciality: 'Gastroenterology',
    yearsExperience: 8,
    pgCollege: 'KEM Mumbai',
    workingHospital: 'Fortis Hospital',
    fee: 900,
    rating: 4.6,
    consultationCount: 155,
    languages: ['English', 'Hindi', 'Gujarati'],
    city: 'Mumbai',
    availability: [
      { day: 'Tuesday', time: '11:00 AM' },
      { day: 'Tuesday', time: '11:30 AM' },
      { day: 'Thursday', time: '10:00 AM' },
      { day: 'Thursday', time: '10:30 AM' },
      { day: 'Saturday', time: '02:00 PM' },
    ],
  },
  {
    id: 'dr-005',
    name: 'Dr. Meera Nair',
    subspeciality: 'Endocrinology',
    yearsExperience: 14,
    pgCollege: 'JIPMER Puducherry',
    workingHospital: 'Aster CMI',
    fee: 850,
    rating: 4.8,
    consultationCount: 310,
    languages: ['English', 'Malayalam', 'Tamil'],
    city: 'Bangalore',
    availability: [
      { day: 'Monday', time: '10:00 AM' },
      { day: 'Monday', time: '10:30 AM' },
      { day: 'Wednesday', time: '11:00 AM' },
      { day: 'Wednesday', time: '11:30 AM' },
      { day: 'Friday', time: '09:00 AM' },
      { day: 'Friday', time: '09:30 AM' },
    ],
  },
  {
    id: 'dr-006',
    name: 'Dr. Vikram Singh',
    subspeciality: 'Nephrology',
    yearsExperience: 11,
    pgCollege: 'PGIMER Chandigarh',
    workingHospital: 'Max Hospital',
    fee: 950,
    rating: 4.5,
    consultationCount: 175,
    languages: ['English', 'Hindi', 'Punjabi'],
    city: 'Delhi',
    availability: [
      { day: 'Tuesday', time: '09:00 AM' },
      { day: 'Tuesday', time: '09:30 AM' },
      { day: 'Thursday', time: '04:00 PM' },
      { day: 'Thursday', time: '04:30 PM' },
    ],
  },
]

export const SEED_CONSULTATIONS: Consultation[] = [
  {
    id: 'consult-001',
    doctorId: 'dr-001',
    patientName: 'Ramesh Gupta',
    childName: 'Arjun',
    subspeciality: 'Cardiology',
    date: '2025-07-01',
    time: '09:00 AM',
    status: 'upcoming',
  },
  {
    id: 'consult-002',
    doctorId: 'dr-002',
    patientName: 'Kavitha Rao',
    childName: 'Sneha',
    subspeciality: 'Neurology',
    date: '2025-07-02',
    time: '10:00 AM',
    status: 'upcoming',
  },
  {
    id: 'consult-003',
    doctorId: 'dr-003',
    patientName: 'Suresh Iyer',
    childName: 'Aditya',
    subspeciality: 'Pulmonology',
    date: '2025-06-15',
    time: '04:00 PM',
    status: 'completed',
    postConsultData: { remarks: 'Continue nebulization. Follow up in 2 weeks.' },
  },
]

const STORAGE_KEY = 'pedispectra-mock-data-initialized'
const DOCTORS_KEY = 'pedispectra-doctors'
const CONSULTATIONS_KEY = 'pedispectra-consultations'

export function initializeMockData() {
  if (typeof window === 'undefined') return

  try {
    const initialized = localStorage.getItem(STORAGE_KEY)
    if (!initialized) {
      localStorage.setItem(DOCTORS_KEY, JSON.stringify(SEED_DOCTORS))
      localStorage.setItem(CONSULTATIONS_KEY, JSON.stringify(SEED_CONSULTATIONS))
      localStorage.setItem(STORAGE_KEY, 'true')
    }
  } catch {
    // localStorage unavailable
  }
}

export function getDoctors(): DoctorProfile[] {
  if (typeof window === 'undefined') return SEED_DOCTORS
  try {
    const stored = localStorage.getItem(DOCTORS_KEY)
    return stored ? JSON.parse(stored) : SEED_DOCTORS
  } catch {
    return SEED_DOCTORS
  }
}

export function addDoctor(doctor: DoctorProfile) {
  const doctors = getDoctors()
  doctors.push(doctor)
  try {
    localStorage.setItem(DOCTORS_KEY, JSON.stringify(doctors))
  } catch {
    // silent
  }
  return doctors
}

export function getConsultations(): Consultation[] {
  if (typeof window === 'undefined') return SEED_CONSULTATIONS
  try {
    const stored = localStorage.getItem(CONSULTATIONS_KEY)
    return stored ? JSON.parse(stored) : SEED_CONSULTATIONS
  } catch {
    return SEED_CONSULTATIONS
  }
}

export function updateConsultation(updated: Consultation) {
  const consultations = getConsultations()
  const idx = consultations.findIndex((c) => c.id === updated.id)
  if (idx >= 0) consultations[idx] = updated
  try {
    localStorage.setItem(CONSULTATIONS_KEY, JSON.stringify(consultations))
  } catch {
    // silent
  }
  return consultations
}

export function addConsultation(consultation: Consultation) {
  const consultations = getConsultations()
  consultations.push(consultation)
  try {
    localStorage.setItem(CONSULTATIONS_KEY, JSON.stringify(consultations))
  } catch {
    // silent
  }
  return consultations
}
