/**
 * Mock Data — Pre-seeded doctors and subspecialities for demo.
 * 2-3 doctors per subspeciality, multiple consultations.
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

export interface Review {
  id: string
  doctorId: string
  rating: number
  text: string
  reviewerName: string
  date: string
}

export const SUBSPECIALITIES = [
  'Cardiology', 'Neurology', 'Pulmonology', 'Gastroenterology',
  'Nephrology', 'Endocrinology', 'Hematology', 'Oncology',
  'Rheumatology', 'Infectious Diseases', 'Allergy & Immunology',
  'Neonatology', 'Developmental Pediatrics', 'Pediatric Surgery',
  'Orthopedics', 'Dermatology', 'Ophthalmology', 'ENT (Otolaryngology)',
]

export const SEED_DOCTORS: DoctorProfile[] = [
  // --- Cardiology ---
  { id: 'dr-001', name: 'Dr. Priya Sharma', subspeciality: 'Cardiology', yearsExperience: 12, pgCollege: 'AIIMS Delhi', workingHospital: 'Narayana Health', fee: 800, rating: 4.8, consultationCount: 245, languages: ['English', 'Hindi', 'Kannada'], city: 'Bangalore', availability: [{ day: 'Monday', time: '09:00 AM' }, { day: 'Monday', time: '09:30 AM' }, { day: 'Wednesday', time: '02:00 PM' }, { day: 'Friday', time: '11:00 AM' }] },
  { id: 'dr-002', name: 'Dr. Arvind Mehta', subspeciality: 'Cardiology', yearsExperience: 18, pgCollege: 'PGIMER Chandigarh', workingHospital: 'Fortis Hospital', fee: 1200, rating: 4.9, consultationCount: 420, languages: ['English', 'Hindi'], city: 'Delhi', availability: [{ day: 'Tuesday', time: '10:00 AM' }, { day: 'Tuesday', time: '10:30 AM' }, { day: 'Thursday', time: '03:00 PM' }] },
  // --- Neurology ---
  { id: 'dr-003', name: 'Dr. Rajesh Kumar', subspeciality: 'Neurology', yearsExperience: 15, pgCollege: 'CMC Vellore', workingHospital: 'Manipal Hospital', fee: 1000, rating: 4.9, consultationCount: 380, languages: ['English', 'Hindi', 'Tamil'], city: 'Chennai', availability: [{ day: 'Tuesday', time: '10:00 AM' }, { day: 'Thursday', time: '03:00 PM' }, { day: 'Saturday', time: '09:00 AM' }] },
  { id: 'dr-004', name: 'Dr. Sunita Verma', subspeciality: 'Neurology', yearsExperience: 10, pgCollege: 'NIMHANS Bangalore', workingHospital: 'Aster CMI', fee: 900, rating: 4.7, consultationCount: 210, languages: ['English', 'Hindi', 'Kannada'], city: 'Bangalore', availability: [{ day: 'Monday', time: '02:00 PM' }, { day: 'Wednesday', time: '10:00 AM' }, { day: 'Friday', time: '04:00 PM' }] },
  // --- Pulmonology ---
  { id: 'dr-005', name: 'Dr. Anitha Reddy', subspeciality: 'Pulmonology', yearsExperience: 10, pgCollege: 'NIMHANS Bangalore', workingHospital: 'Apollo Hospital', fee: 750, rating: 4.7, consultationCount: 190, languages: ['English', 'Telugu', 'Kannada'], city: 'Hyderabad', availability: [{ day: 'Monday', time: '04:00 PM' }, { day: 'Wednesday', time: '09:00 AM' }, { day: 'Friday', time: '02:00 PM' }] },
  { id: 'dr-006', name: 'Dr. Karthik Iyer', subspeciality: 'Pulmonology', yearsExperience: 8, pgCollege: 'Kasturba Medical College', workingHospital: 'KMC Hospital', fee: 700, rating: 4.6, consultationCount: 145, languages: ['English', 'Kannada', 'Tulu'], city: 'Mangaluru', availability: [{ day: 'Tuesday', time: '09:00 AM' }, { day: 'Thursday', time: '11:00 AM' }, { day: 'Saturday', time: '10:00 AM' }] },
  // --- Gastroenterology ---
  { id: 'dr-007', name: 'Dr. Sanjay Patel', subspeciality: 'Gastroenterology', yearsExperience: 8, pgCollege: 'KEM Mumbai', workingHospital: 'Fortis Hospital', fee: 900, rating: 4.6, consultationCount: 155, languages: ['English', 'Hindi', 'Gujarati'], city: 'Mumbai', availability: [{ day: 'Tuesday', time: '11:00 AM' }, { day: 'Thursday', time: '10:00 AM' }, { day: 'Saturday', time: '02:00 PM' }] },
  { id: 'dr-008', name: 'Dr. Lakshmi Rao', subspeciality: 'Gastroenterology', yearsExperience: 13, pgCollege: 'JIPMER Puducherry', workingHospital: 'Rainbow Hospital', fee: 850, rating: 4.8, consultationCount: 275, languages: ['English', 'Telugu', 'Hindi'], city: 'Hyderabad', availability: [{ day: 'Monday', time: '10:00 AM' }, { day: 'Wednesday', time: '03:00 PM' }, { day: 'Friday', time: '09:00 AM' }] },
  // --- Nephrology ---
  { id: 'dr-009', name: 'Dr. Vikram Singh', subspeciality: 'Nephrology', yearsExperience: 11, pgCollege: 'PGIMER Chandigarh', workingHospital: 'Max Hospital', fee: 950, rating: 4.5, consultationCount: 175, languages: ['English', 'Hindi', 'Punjabi'], city: 'Delhi', availability: [{ day: 'Tuesday', time: '09:00 AM' }, { day: 'Thursday', time: '04:00 PM' }] },
  { id: 'dr-010', name: 'Dr. Deepa Krishnan', subspeciality: 'Nephrology', yearsExperience: 9, pgCollege: 'CMC Vellore', workingHospital: 'Apollo Hospital', fee: 800, rating: 4.7, consultationCount: 160, languages: ['English', 'Malayalam', 'Tamil'], city: 'Chennai', availability: [{ day: 'Monday', time: '11:00 AM' }, { day: 'Wednesday', time: '02:00 PM' }, { day: 'Friday', time: '10:00 AM' }] },
  // --- Endocrinology ---
  { id: 'dr-011', name: 'Dr. Meera Nair', subspeciality: 'Endocrinology', yearsExperience: 14, pgCollege: 'JIPMER Puducherry', workingHospital: 'Aster CMI', fee: 850, rating: 4.8, consultationCount: 310, languages: ['English', 'Malayalam', 'Tamil'], city: 'Bangalore', availability: [{ day: 'Monday', time: '10:00 AM' }, { day: 'Wednesday', time: '11:00 AM' }, { day: 'Friday', time: '09:00 AM' }] },
  { id: 'dr-012', name: 'Dr. Rohit Agarwal', subspeciality: 'Endocrinology', yearsExperience: 7, pgCollege: 'AIIMS Delhi', workingHospital: 'Medanta Hospital', fee: 1000, rating: 4.6, consultationCount: 130, languages: ['English', 'Hindi'], city: 'Delhi', availability: [{ day: 'Tuesday', time: '02:00 PM' }, { day: 'Thursday', time: '09:00 AM' }, { day: 'Saturday', time: '11:00 AM' }] },
  // --- Hematology ---
  { id: 'dr-013', name: 'Dr. Pooja Deshmukh', subspeciality: 'Hematology', yearsExperience: 11, pgCollege: 'AIIMS Delhi', workingHospital: 'Tata Memorial', fee: 1100, rating: 4.8, consultationCount: 200, languages: ['English', 'Hindi', 'Marathi'], city: 'Mumbai', availability: [{ day: 'Monday', time: '09:00 AM' }, { day: 'Wednesday', time: '10:00 AM' }, { day: 'Friday', time: '02:00 PM' }] },
  { id: 'dr-014', name: 'Dr. Naveen Joshi', subspeciality: 'Hematology', yearsExperience: 9, pgCollege: 'CMC Vellore', workingHospital: 'Narayana Health', fee: 900, rating: 4.6, consultationCount: 165, languages: ['English', 'Kannada', 'Hindi'], city: 'Bangalore', availability: [{ day: 'Tuesday', time: '11:00 AM' }, { day: 'Thursday', time: '03:00 PM' }] },
  // --- Oncology ---
  { id: 'dr-015', name: 'Dr. Ritu Kapoor', subspeciality: 'Oncology', yearsExperience: 16, pgCollege: 'PGIMER Chandigarh', workingHospital: 'Tata Memorial', fee: 1500, rating: 4.9, consultationCount: 350, languages: ['English', 'Hindi'], city: 'Mumbai', availability: [{ day: 'Monday', time: '10:00 AM' }, { day: 'Thursday', time: '02:00 PM' }] },
  { id: 'dr-016', name: 'Dr. Suresh Babu', subspeciality: 'Oncology', yearsExperience: 12, pgCollege: 'Kidwai Memorial', workingHospital: 'HCG Hospital', fee: 1200, rating: 4.7, consultationCount: 230, languages: ['English', 'Kannada', 'Telugu'], city: 'Bangalore', availability: [{ day: 'Wednesday', time: '09:00 AM' }, { day: 'Friday', time: '11:00 AM' }] },
  // --- Rheumatology ---
  { id: 'dr-017', name: 'Dr. Amita Chatterjee', subspeciality: 'Rheumatology', yearsExperience: 13, pgCollege: 'AIIMS Delhi', workingHospital: 'AMRI Hospital', fee: 950, rating: 4.7, consultationCount: 185, languages: ['English', 'Hindi', 'Bengali'], city: 'Kolkata', availability: [{ day: 'Tuesday', time: '10:00 AM' }, { day: 'Thursday', time: '04:00 PM' }, { day: 'Saturday', time: '09:00 AM' }] },
  { id: 'dr-018', name: 'Dr. Venkat Rao', subspeciality: 'Rheumatology', yearsExperience: 10, pgCollege: 'NIMS Hyderabad', workingHospital: 'Care Hospital', fee: 800, rating: 4.5, consultationCount: 140, languages: ['English', 'Telugu', 'Hindi'], city: 'Hyderabad', availability: [{ day: 'Monday', time: '03:00 PM' }, { day: 'Wednesday', time: '11:00 AM' }] },
  // --- Infectious Diseases ---
  { id: 'dr-019', name: 'Dr. Farah Khan', subspeciality: 'Infectious Diseases', yearsExperience: 14, pgCollege: 'CMC Vellore', workingHospital: 'Manipal Hospital', fee: 850, rating: 4.8, consultationCount: 290, languages: ['English', 'Hindi', 'Urdu'], city: 'Bangalore', availability: [{ day: 'Monday', time: '10:00 AM' }, { day: 'Wednesday', time: '02:00 PM' }, { day: 'Friday', time: '09:00 AM' }] },
  { id: 'dr-020', name: 'Dr. Thomas Philip', subspeciality: 'Infectious Diseases', yearsExperience: 11, pgCollege: 'JIPMER Puducherry', workingHospital: 'Amrita Hospital', fee: 900, rating: 4.6, consultationCount: 220, languages: ['English', 'Malayalam'], city: 'Kochi', availability: [{ day: 'Tuesday', time: '09:00 AM' }, { day: 'Thursday', time: '10:00 AM' }] },
  // --- Allergy & Immunology ---
  { id: 'dr-021', name: 'Dr. Neha Gupta', subspeciality: 'Allergy & Immunology', yearsExperience: 9, pgCollege: 'AIIMS Delhi', workingHospital: 'Max Hospital', fee: 800, rating: 4.6, consultationCount: 170, languages: ['English', 'Hindi'], city: 'Delhi', availability: [{ day: 'Monday', time: '11:00 AM' }, { day: 'Wednesday', time: '04:00 PM' }, { day: 'Friday', time: '10:00 AM' }] },
  { id: 'dr-022', name: 'Dr. Ramya Srinivas', subspeciality: 'Allergy & Immunology', yearsExperience: 7, pgCollege: 'St. Johns Bangalore', workingHospital: 'Columbia Asia', fee: 750, rating: 4.5, consultationCount: 120, languages: ['English', 'Kannada', 'Tamil'], city: 'Bangalore', availability: [{ day: 'Tuesday', time: '02:00 PM' }, { day: 'Thursday', time: '09:00 AM' }] },
  // --- Neonatology ---
  { id: 'dr-023', name: 'Dr. Arun Prakash', subspeciality: 'Neonatology', yearsExperience: 16, pgCollege: 'CMC Vellore', workingHospital: 'Cloudnine Hospital', fee: 1000, rating: 4.9, consultationCount: 400, languages: ['English', 'Tamil', 'Hindi'], city: 'Chennai', availability: [{ day: 'Monday', time: '08:00 AM' }, { day: 'Wednesday', time: '08:00 AM' }, { day: 'Friday', time: '08:00 AM' }] },
  { id: 'dr-024', name: 'Dr. Sneha Kulkarni', subspeciality: 'Neonatology', yearsExperience: 10, pgCollege: 'KEM Mumbai', workingHospital: 'Surya Hospital', fee: 950, rating: 4.7, consultationCount: 280, languages: ['English', 'Hindi', 'Marathi'], city: 'Mumbai', availability: [{ day: 'Tuesday', time: '08:30 AM' }, { day: 'Thursday', time: '08:30 AM' }, { day: 'Saturday', time: '09:00 AM' }] },
  // --- Developmental Pediatrics ---
  { id: 'dr-025', name: 'Dr. Kavitha Mohan', subspeciality: 'Developmental Pediatrics', yearsExperience: 12, pgCollege: 'NIMHANS Bangalore', workingHospital: 'Manipal Hospital', fee: 900, rating: 4.8, consultationCount: 260, languages: ['English', 'Kannada', 'Hindi'], city: 'Bangalore', availability: [{ day: 'Monday', time: '10:00 AM' }, { day: 'Wednesday', time: '10:00 AM' }, { day: 'Friday', time: '02:00 PM' }] },
  { id: 'dr-026', name: 'Dr. Ashwin Mathew', subspeciality: 'Developmental Pediatrics', yearsExperience: 8, pgCollege: 'CMC Vellore', workingHospital: 'Rainbow Hospital', fee: 850, rating: 4.6, consultationCount: 150, languages: ['English', 'Malayalam', 'Hindi'], city: 'Hyderabad', availability: [{ day: 'Tuesday', time: '11:00 AM' }, { day: 'Thursday', time: '02:00 PM' }] },
  // --- Pediatric Surgery ---
  { id: 'dr-027', name: 'Dr. Mohan Das', subspeciality: 'Pediatric Surgery', yearsExperience: 20, pgCollege: 'AIIMS Delhi', workingHospital: 'AIIMS Delhi', fee: 1300, rating: 4.9, consultationCount: 500, languages: ['English', 'Hindi'], city: 'Delhi', availability: [{ day: 'Monday', time: '02:00 PM' }, { day: 'Thursday', time: '10:00 AM' }] },
  { id: 'dr-028', name: 'Dr. Divya Hegde', subspeciality: 'Pediatric Surgery', yearsExperience: 11, pgCollege: 'Kasturba Medical College', workingHospital: 'Manipal Hospital', fee: 1000, rating: 4.7, consultationCount: 195, languages: ['English', 'Kannada', 'Tulu'], city: 'Mangaluru', availability: [{ day: 'Wednesday', time: '09:00 AM' }, { day: 'Friday', time: '11:00 AM' }, { day: 'Saturday', time: '10:00 AM' }] },
  // --- Orthopedics ---
  { id: 'dr-029', name: 'Dr. Ajay Bhat', subspeciality: 'Orthopedics', yearsExperience: 14, pgCollege: 'AIIMS Delhi', workingHospital: 'Fortis Hospital', fee: 1000, rating: 4.7, consultationCount: 310, languages: ['English', 'Hindi', 'Kannada'], city: 'Bangalore', availability: [{ day: 'Monday', time: '09:00 AM' }, { day: 'Wednesday', time: '11:00 AM' }, { day: 'Friday', time: '03:00 PM' }] },
  { id: 'dr-030', name: 'Dr. Pallavi Sen', subspeciality: 'Orthopedics', yearsExperience: 9, pgCollege: 'PGIMER Chandigarh', workingHospital: 'Kokilaben Hospital', fee: 950, rating: 4.6, consultationCount: 180, languages: ['English', 'Hindi', 'Bengali'], city: 'Mumbai', availability: [{ day: 'Tuesday', time: '10:00 AM' }, { day: 'Thursday', time: '02:00 PM' }] },
  // --- Dermatology ---
  { id: 'dr-031', name: 'Dr. Swati Jain', subspeciality: 'Dermatology', yearsExperience: 8, pgCollege: 'St. Johns Bangalore', workingHospital: 'Sakra Hospital', fee: 700, rating: 4.5, consultationCount: 220, languages: ['English', 'Hindi', 'Kannada'], city: 'Bangalore', availability: [{ day: 'Monday', time: '11:00 AM' }, { day: 'Wednesday', time: '03:00 PM' }, { day: 'Friday', time: '10:00 AM' }] },
  { id: 'dr-032', name: 'Dr. Manoj Tiwari', subspeciality: 'Dermatology', yearsExperience: 12, pgCollege: 'KEM Mumbai', workingHospital: 'Lilavati Hospital', fee: 850, rating: 4.7, consultationCount: 290, languages: ['English', 'Hindi', 'Marathi'], city: 'Mumbai', availability: [{ day: 'Tuesday', time: '09:00 AM' }, { day: 'Thursday', time: '11:00 AM' }, { day: 'Saturday', time: '10:00 AM' }] },
  // --- Ophthalmology ---
  { id: 'dr-033', name: 'Dr. Rekha Pillai', subspeciality: 'Ophthalmology', yearsExperience: 15, pgCollege: 'Sankara Nethralaya', workingHospital: 'Aravind Eye Hospital', fee: 800, rating: 4.8, consultationCount: 350, languages: ['English', 'Tamil', 'Malayalam'], city: 'Chennai', availability: [{ day: 'Monday', time: '09:00 AM' }, { day: 'Wednesday', time: '09:00 AM' }, { day: 'Friday', time: '09:00 AM' }] },
  { id: 'dr-034', name: 'Dr. Sameer Dixit', subspeciality: 'Ophthalmology', yearsExperience: 10, pgCollege: 'AIIMS Delhi', workingHospital: 'Centre for Sight', fee: 900, rating: 4.6, consultationCount: 200, languages: ['English', 'Hindi'], city: 'Delhi', availability: [{ day: 'Tuesday', time: '10:00 AM' }, { day: 'Thursday', time: '03:00 PM' }] },
  // --- ENT ---
  { id: 'dr-035', name: 'Dr. Girish Nayak', subspeciality: 'ENT (Otolaryngology)', yearsExperience: 13, pgCollege: 'Kasturba Medical College', workingHospital: 'Manipal Hospital', fee: 850, rating: 4.7, consultationCount: 270, languages: ['English', 'Kannada', 'Hindi'], city: 'Bangalore', availability: [{ day: 'Monday', time: '02:00 PM' }, { day: 'Wednesday', time: '10:00 AM' }, { day: 'Friday', time: '11:00 AM' }] },
  { id: 'dr-036', name: 'Dr. Isha Malhotra', subspeciality: 'ENT (Otolaryngology)', yearsExperience: 8, pgCollege: 'PGIMER Chandigarh', workingHospital: 'Medanta Hospital', fee: 900, rating: 4.5, consultationCount: 155, languages: ['English', 'Hindi', 'Punjabi'], city: 'Delhi', availability: [{ day: 'Tuesday', time: '11:00 AM' }, { day: 'Thursday', time: '09:00 AM' }, { day: 'Saturday', time: '10:00 AM' }] },
]

export const SEED_CONSULTATIONS: Consultation[] = [
  // --- Upcoming (5) ---
  { id: 'consult-001', doctorId: 'dr-001', patientName: 'Ramesh Gupta', childName: 'Arjun', subspeciality: 'Cardiology', date: '2025-07-15', time: '09:00 AM', status: 'upcoming' },
  { id: 'consult-002', doctorId: 'dr-003', patientName: 'Kavitha Rao', childName: 'Sneha', subspeciality: 'Neurology', date: '2025-07-16', time: '10:00 AM', status: 'upcoming' },
  { id: 'consult-003', doctorId: 'dr-005', patientName: 'Suresh Iyer', childName: 'Aditya', subspeciality: 'Pulmonology', date: '2025-07-17', time: '04:00 PM', status: 'upcoming' },
  { id: 'consult-004', doctorId: 'dr-011', patientName: 'Anita Das', childName: 'Riya', subspeciality: 'Endocrinology', date: '2025-07-18', time: '10:00 AM', status: 'upcoming' },
  { id: 'consult-005', doctorId: 'dr-019', patientName: 'Mohammed Farooq', childName: 'Zain', subspeciality: 'Infectious Diseases', date: '2025-07-19', time: '10:00 AM', status: 'upcoming' },
  // --- Completed (3) ---
  { id: 'consult-006', doctorId: 'dr-001', patientName: 'Deepak Nair', childName: 'Aarav', subspeciality: 'Cardiology', date: '2025-06-20', time: '09:00 AM', status: 'completed', postConsultData: { remarks: 'Chief Complaints:\nHeart murmur detected during routine checkup\n\nDiagnosis:\nInnocent murmur — no intervention needed\n\nFollow-up:\nReview echocardiogram in 6 months', completedAt: '2025-06-20T10:00:00Z' } },
  { id: 'consult-007', doctorId: 'dr-003', patientName: 'Preethi Menon', childName: 'Aditi', subspeciality: 'Neurology', date: '2025-06-18', time: '10:00 AM', status: 'completed', postConsultData: { remarks: 'Chief Complaints:\nRecurrent headaches and dizziness\n\nDiagnosis:\nMigraine without aura\n\nTreatment Plan:\nRx: Ibuprofen 200mg SOS, maintain headache diary\n\nFollow-up:\nReview in 4 weeks', completedAt: '2025-06-18T11:00:00Z' } },
  { id: 'consult-008', doctorId: 'dr-005', patientName: 'Suresh Iyer', childName: 'Aditya', subspeciality: 'Pulmonology', date: '2025-06-10', time: '04:00 PM', status: 'completed', postConsultData: { remarks: 'Chief Complaints:\nChronic cough and wheezing at night\n\nDiagnosis:\nBronchial asthma — mild persistent\n\nTreatment Plan:\nRx: Salbutamol inhaler PRN, Budesonide 100mcg BD\n\nFollow-up:\nReview in 2 weeks with peak flow diary', completedAt: '2025-06-10T17:00:00Z' } },
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
  } catch {}
}

export function getDoctors(): DoctorProfile[] {
  if (typeof window === 'undefined') return SEED_DOCTORS
  try {
    const stored = localStorage.getItem(DOCTORS_KEY)
    return stored ? JSON.parse(stored) : SEED_DOCTORS
  } catch { return SEED_DOCTORS }
}

export function addDoctor(doctor: DoctorProfile) {
  const doctors = getDoctors()
  doctors.push(doctor)
  try { localStorage.setItem(DOCTORS_KEY, JSON.stringify(doctors)) } catch {}
  return doctors
}

export function getConsultations(): Consultation[] {
  if (typeof window === 'undefined') return SEED_CONSULTATIONS
  try {
    const stored = localStorage.getItem(CONSULTATIONS_KEY)
    return stored ? JSON.parse(stored) : SEED_CONSULTATIONS
  } catch { return SEED_CONSULTATIONS }
}

export function updateConsultation(updated: Consultation) {
  const consultations = getConsultations()
  const idx = consultations.findIndex((c) => c.id === updated.id)
  if (idx >= 0) consultations[idx] = updated
  try { localStorage.setItem(CONSULTATIONS_KEY, JSON.stringify(consultations)) } catch {}
  return consultations
}

export function addConsultation(consultation: Consultation) {
  const consultations = getConsultations()
  consultations.push(consultation)
  try { localStorage.setItem(CONSULTATIONS_KEY, JSON.stringify(consultations)) } catch {}
  return consultations
}

export const SEED_REVIEWS: Review[] = [
  // Dr. Priya Sharma (dr-001) - Cardiology
  { id: 'rev-001', doctorId: 'dr-001', rating: 5, text: 'Dr. Priya was incredibly thorough with my son\'s heart murmur evaluation. She explained everything clearly and made us feel at ease. Highly recommend!', reviewerName: 'Anita M.', date: '2025-06-10' },
  { id: 'rev-002', doctorId: 'dr-001', rating: 5, text: 'Excellent doctor. Took time to answer all our questions about our daughter\'s ECG results. Very patient and kind.', reviewerName: 'Ravi K.', date: '2025-05-28' },
  { id: 'rev-003', doctorId: 'dr-001', rating: 4, text: 'Good consultation. The video quality was smooth. Only wish the slot was a bit longer for follow-up questions.', reviewerName: 'Meghna S.', date: '2025-05-15' },
  // Dr. Rajesh Kumar (dr-003) - Neurology
  { id: 'rev-004', doctorId: 'dr-003', rating: 5, text: 'Dr. Rajesh diagnosed my daughter\'s seizure condition that other doctors missed. Absolute lifesaver. His expertise is unmatched.', reviewerName: 'Preethi M.', date: '2025-06-18' },
  { id: 'rev-005', doctorId: 'dr-003', rating: 5, text: 'We consulted for our son\'s recurring headaches. Dr. Kumar was meticulous, ordered the right tests, and the treatment worked perfectly.', reviewerName: 'Sunil R.', date: '2025-06-02' },
  { id: 'rev-006', doctorId: 'dr-003', rating: 4, text: 'Very knowledgeable doctor. Gave us a clear treatment plan for epilepsy management. Would consult again.', reviewerName: 'Divya P.', date: '2025-05-20' },
  // Dr. Anitha Reddy (dr-005) - Pulmonology
  { id: 'rev-007', doctorId: 'dr-005', rating: 5, text: 'My son\'s asthma is finally under control thanks to Dr. Anitha. She created a perfect inhaler plan and followed up proactively.', reviewerName: 'Suresh I.', date: '2025-06-10' },
  { id: 'rev-008', doctorId: 'dr-005', rating: 4, text: 'Good experience. Doctor was attentive and explained the nebulization technique clearly over video.', reviewerName: 'Pooja N.', date: '2025-05-25' },
  // Dr. Sanjay Patel (dr-007) - Gastroenterology
  { id: 'rev-009', doctorId: 'dr-007', rating: 5, text: 'Our child had chronic stomach pain for months. Dr. Patel identified it as lactose intolerance in the first consultation itself. Brilliant!', reviewerName: 'Neha G.', date: '2025-06-12' },
  { id: 'rev-010', doctorId: 'dr-007', rating: 4, text: 'Very patient and understanding. Gave detailed dietary recommendations for my daughter\'s reflux issue.', reviewerName: 'Vikash T.', date: '2025-05-30' },
  // Dr. Meera Nair (dr-011) - Endocrinology
  { id: 'rev-011', doctorId: 'dr-011', rating: 5, text: 'Dr. Meera has been managing my son\'s Type 1 diabetes for a year now. She is always available and adjusts insulin doses promptly.', reviewerName: 'Anita D.', date: '2025-06-15' },
  { id: 'rev-012', doctorId: 'dr-011', rating: 5, text: 'Consulted for growth concerns. Dr. Nair ordered the right hormone tests and reassured us that our daughter is on track. Very calming presence.', reviewerName: 'Lakshmi V.', date: '2025-06-01' },
  // Dr. Farah Khan (dr-019) - Infectious Diseases
  { id: 'rev-013', doctorId: 'dr-019', rating: 5, text: 'Dr. Farah diagnosed a rare tropical infection that our local pediatrician couldn\'t figure out. The video consult saved us a trip to Bangalore.', reviewerName: 'Mohammed F.', date: '2025-06-08' },
  { id: 'rev-014', doctorId: 'dr-019', rating: 4, text: 'Very thorough history-taking. Gave proper antibiotic guidance and when to escalate to emergency.', reviewerName: 'Reshma B.', date: '2025-05-22' },
  // Dr. Kavitha Mohan (dr-025) - Developmental Pediatrics
  { id: 'rev-015', doctorId: 'dr-025', rating: 5, text: 'Dr. Kavitha helped us understand our son\'s ADHD diagnosis. She gave practical strategies for school and home. Life-changing consultation.', reviewerName: 'Deepa K.', date: '2025-06-14' },
  { id: 'rev-016', doctorId: 'dr-025', rating: 5, text: 'We were worried about speech delay. Dr. Mohan assessed thoroughly and connected us with the right therapist. So grateful.', reviewerName: 'Arun P.', date: '2025-05-28' },
]

const REVIEWS_KEY = 'pedispectra-reviews'

export function getReviews(): Review[] {
  if (typeof window === 'undefined') return SEED_REVIEWS
  try {
    const stored = localStorage.getItem(REVIEWS_KEY)
    return stored ? JSON.parse(stored) : SEED_REVIEWS
  } catch { return SEED_REVIEWS }
}

export function getReviewsForDoctor(doctorId: string): Review[] {
  return getReviews().filter((r) => r.doctorId === doctorId).sort((a, b) => b.date.localeCompare(a.date))
}
