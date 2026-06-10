export type DoctorSlot = {
  id: string
  day: string
  date: string
  time: string
  label: string
}

export type ScheduledDoctor = {
  id: string
  name: string
  speciality: string
  qualification: string
  experienceYears: number
  languages: string[]
  rating: number
  consults: number
  fee: number
  initials: string
  avatarColor: string
  tags: string[]
  slots: DoctorSlot[]
}

export const SCHEDULED_DOCTORS: ScheduledDoctor[] = [
  {
    id: 'dr-kavya-pulmo',
    name: 'Dr. Kavya Menon',
    speciality: 'Pediatric Pulmonology',
    qualification: 'MD Pediatrics, Fellowship Pediatric Pulmonology',
    experienceYears: 11,
    languages: ['English', 'Hindi', 'Telugu'],
    rating: 4.9,
    consults: 6200,
    fee: 900,
    initials: 'KM',
    avatarColor: '#2f9e83',
    tags: ['Wheezing', 'Asthma', 'Chronic cough'],
    slots: [
      { id: 'pulmo-km-1', day: 'Today', date: '10 Jun', time: '6:30 PM', label: 'Earliest' },
      { id: 'pulmo-km-2', day: 'Tomorrow', date: '11 Jun', time: '10:00 AM', label: 'Morning' },
      { id: 'pulmo-km-3', day: 'Tomorrow', date: '11 Jun', time: '7:15 PM', label: 'Evening' },
    ],
  },
  {
    id: 'dr-rohan-pulmo',
    name: 'Dr. Rohan Iyer',
    speciality: 'Pediatric Pulmonology',
    qualification: 'DNB Pediatrics, Pediatric Respiratory Medicine',
    experienceYears: 8,
    languages: ['English', 'Hindi', 'Kannada'],
    rating: 4.8,
    consults: 3900,
    fee: 800,
    initials: 'RI',
    avatarColor: '#3fb27f',
    tags: ['Asthma follow-up', 'Allergic cough', 'Nebulization guidance'],
    slots: [
      { id: 'pulmo-ri-1', day: 'Tomorrow', date: '11 Jun', time: '12:30 PM', label: 'Noon' },
      { id: 'pulmo-ri-2', day: 'Fri', date: '12 Jun', time: '5:00 PM', label: 'Evening' },
    ],
  },
  {
    id: 'dr-nisha-neuro',
    name: 'Dr. Nisha Varma',
    speciality: 'Pediatric Neurology',
    qualification: 'DM Pediatric Neurology',
    experienceYears: 14,
    languages: ['English', 'Hindi', 'Telugu'],
    rating: 4.9,
    consults: 7100,
    fee: 1000,
    initials: 'NV',
    avatarColor: '#5ab8a3',
    tags: ['Seizures', 'Headache', 'Development review'],
    slots: [
      { id: 'neuro-nv-1', day: 'Tomorrow', date: '11 Jun', time: '4:00 PM', label: 'Earliest' },
      { id: 'neuro-nv-2', day: 'Fri', date: '12 Jun', time: '11:30 AM', label: 'Morning' },
    ],
  },
  {
    id: 'dr-aman-gastro',
    name: 'Dr. Aman Shah',
    speciality: 'Pediatric Gastroenterology',
    qualification: 'DM Pediatric Gastroenterology',
    experienceYears: 10,
    languages: ['English', 'Hindi'],
    rating: 4.8,
    consults: 4500,
    fee: 950,
    initials: 'AS',
    avatarColor: '#2f9e83',
    tags: ['Feeding', 'Constipation', 'Abdominal pain'],
    slots: [
      { id: 'gastro-as-1', day: 'Today', date: '10 Jun', time: '8:00 PM', label: 'Earliest' },
      { id: 'gastro-as-2', day: 'Tomorrow', date: '11 Jun', time: '1:00 PM', label: 'Afternoon' },
    ],
  },
  {
    id: 'dr-leela-derm',
    name: 'Dr. Leela Rao',
    speciality: 'Pediatric Dermatology',
    qualification: 'MD Dermatology, Pediatric Skin Clinic',
    experienceYears: 12,
    languages: ['English', 'Hindi', 'Telugu'],
    rating: 4.9,
    consults: 5300,
    fee: 850,
    initials: 'LR',
    avatarColor: '#3fb27f',
    tags: ['Rashes', 'Eczema', 'Hives'],
    slots: [
      { id: 'derm-lr-1', day: 'Tomorrow', date: '11 Jun', time: '9:30 AM', label: 'Morning' },
      { id: 'derm-lr-2', day: 'Fri', date: '12 Jun', time: '6:00 PM', label: 'Evening' },
    ],
  },
  {
    id: 'dr-isha-cardio',
    name: 'Dr. Isha Kapoor',
    speciality: 'Pediatric Cardiology',
    qualification: 'FNB Pediatric Cardiology',
    experienceYears: 13,
    languages: ['English', 'Hindi'],
    rating: 4.9,
    consults: 5800,
    fee: 1000,
    initials: 'IK',
    avatarColor: '#5ab8a3',
    tags: ['Murmur', 'Chest pain', 'Palpitations'],
    slots: [
      { id: 'cardio-ik-1', day: 'Tomorrow', date: '11 Jun', time: '3:30 PM', label: 'Earliest' },
      { id: 'cardio-ik-2', day: 'Fri', date: '12 Jun', time: '10:30 AM', label: 'Morning' },
    ],
  },
  {
    id: 'dr-meera-general',
    name: 'Dr. Meera Nair',
    speciality: 'General Pediatrics',
    qualification: 'MD Pediatrics',
    experienceYears: 12,
    languages: ['English', 'Hindi', 'Malayalam'],
    rating: 4.9,
    consults: 8200,
    fee: 700,
    initials: 'MN',
    avatarColor: '#2f9e83',
    tags: ['Fever', 'Cough', 'First review'],
    slots: [
      { id: 'general-mn-1', day: 'Today', date: '10 Jun', time: '5:45 PM', label: 'Earliest' },
      { id: 'general-mn-2', day: 'Today', date: '10 Jun', time: '9:15 PM', label: 'Evening' },
      { id: 'general-mn-3', day: 'Tomorrow', date: '11 Jun', time: '9:00 AM', label: 'Morning' },
    ],
  },
  {
    id: 'dr-sana-infectious',
    name: 'Dr. Sana Qureshi',
    speciality: 'Pediatric Infectious Disease',
    qualification: 'Fellowship Pediatric Infectious Disease',
    experienceYears: 9,
    languages: ['English', 'Hindi', 'Urdu'],
    rating: 4.8,
    consults: 3600,
    fee: 950,
    initials: 'SQ',
    avatarColor: '#3fb27f',
    tags: ['Recurrent fever', 'Infections', 'Travel fever'],
    slots: [
      { id: 'inf-sq-1', day: 'Fri', date: '12 Jun', time: '12:00 PM', label: 'Earliest' },
      { id: 'inf-sq-2', day: 'Sat', date: '13 Jun', time: '4:30 PM', label: 'Afternoon' },
    ],
  },
]

export function getDoctorsForSpeciality(speciality: string | null): ScheduledDoctor[] {
  if (!speciality) return []
  return SCHEDULED_DOCTORS.filter((doctor) => doctor.speciality === speciality)
}
