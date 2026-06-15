export type SymptomCategory =
  | 'breathing'
  | 'seizure-development'
  | 'stomach-feeding'
  | 'skin-allergy'
  | 'heart'
  | 'fever-infection'

export type SymptomDuration = 'today' | 'few-days' | 'recurrent'

export type UrgencyLevel = 'comfortable' | 'soon' | 'urgent'

export type MatchInput = {
  category: SymptomCategory
  duration: SymptomDuration
  urgency: UrgencyLevel
}

export type SpecialityMatch = {
  speciality: string
  score: number
  label: string
  reason: string
  nextStep: string
}

const CATEGORY_MATCHES: Record<SymptomCategory, SpecialityMatch[]> = {
  breathing: [
    {
      speciality: 'Pediatric Pulmonology',
      score: 94,
      label: 'Recommended specialist',
      reason: 'Wheezing, cough, asthma-like symptoms, and breathing concerns fit pediatric pulmonology best.',
      nextStep: 'Book a pulmonology slot if available.',
    },
    {
      speciality: 'General Pediatrics',
      score: 78,
      label: 'Good first review',
      reason: 'A general pediatrician can assess severity and start first-line care when a pulmonologist is not available.',
      nextStep: 'Use this if you need a sooner appointment.',
    },
  ],
  'seizure-development': [
    {
      speciality: 'Pediatric Neurology',
      score: 95,
      label: 'Recommended specialist',
      reason: 'Seizures, repeated fits, headaches, delayed milestones, or developmental concerns need neurology review.',
      nextStep: 'Book pediatric neurology unless this is an active emergency.',
    },
    {
      speciality: 'Developmental Pediatrics',
      score: 82,
      label: 'Good alternative',
      reason: 'Development, behavior, speech, and learning concerns may need developmental pediatric assessment.',
      nextStep: 'Use this for non-urgent developmental concerns.',
    },
  ],
  'stomach-feeding': [
    {
      speciality: 'Pediatric Gastroenterology',
      score: 92,
      label: 'Recommended specialist',
      reason: 'Feeding difficulty, vomiting, constipation, abdominal pain, and poor weight gain fit gastroenterology.',
      nextStep: 'Book gastroenterology for recurring or persistent symptoms.',
    },
    {
      speciality: 'General Pediatrics',
      score: 76,
      label: 'Good first review',
      reason: 'A general pediatrician can review common stomach or feeding symptoms and escalate if needed.',
      nextStep: 'Use this for mild or first-time symptoms.',
    },
  ],
  'skin-allergy': [
    {
      speciality: 'Pediatric Dermatology',
      score: 90,
      label: 'Recommended specialist',
      reason: 'Rashes, eczema, hives, skin infection, or recurring allergy-like skin symptoms fit dermatology.',
      nextStep: 'Book dermatology if the rash is persistent or recurring.',
    },
    {
      speciality: 'General Pediatrics',
      score: 74,
      label: 'Good first review',
      reason: 'A general pediatrician can review common rashes and identify if specialist care is needed.',
      nextStep: 'Use this if specialist slots are not available soon.',
    },
  ],
  heart: [
    {
      speciality: 'Pediatric Cardiology',
      score: 93,
      label: 'Recommended specialist',
      reason: 'Chest pain, palpitations, fainting, murmur, or known heart condition should be reviewed by cardiology.',
      nextStep: 'Book pediatric cardiology for a planned specialist review.',
    },
    {
      speciality: 'General Pediatrics',
      score: 70,
      label: 'Initial screening',
      reason: 'A general pediatrician can screen non-urgent symptoms and guide urgency if cardiology is delayed.',
      nextStep: 'Use this for mild, non-urgent concerns only.',
    },
  ],
  'fever-infection': [
    {
      speciality: 'General Pediatrics',
      score: 88,
      label: 'Recommended first review',
      reason: 'Most fever, cough, cold, throat pain, and common infections are best reviewed first by general pediatrics.',
      nextStep: 'Book a general pediatric consult first.',
    },
    {
      speciality: 'Pediatric Infectious Disease',
      score: 74,
      label: 'Specialist if recurrent',
      reason: 'Repeated infections, long fever patterns, or complex infection history may need infectious disease review.',
      nextStep: 'Use this if fever is recurrent, prolonged, or referred by a pediatrician.',
    },
  ],
}

export function getSpecialityMatches(input: MatchInput): SpecialityMatch[] {
  const base = CATEGORY_MATCHES[input.category].map((match) => ({ ...match }))

  return base
    .map((match) => {
      let score = match.score

      if (input.urgency === 'urgent' && match.speciality === 'General Pediatrics') score += 8
      if (input.duration === 'recurrent' && match.label.includes('specialist')) score += 4
      if (input.duration === 'today' && match.speciality === 'General Pediatrics') score += 3

      return { ...match, score: Math.min(score, 99) }
    })
    .sort((a, b) => b.score - a.score)
}

export const SYMPTOM_OPTIONS: { id: SymptomCategory; label: string; examples: string }[] = [
  { id: 'breathing', label: 'Cough, wheezing, breathing', examples: 'Wheezing, asthma, repeated cough' },
  { id: 'seizure-development', label: 'Seizure, headache, development', examples: 'Fits, milestones, speech, behavior' },
  { id: 'stomach-feeding', label: 'Stomach, feeding, weight', examples: 'Vomiting, constipation, poor weight gain' },
  { id: 'skin-allergy', label: 'Skin rash or allergy', examples: 'Rashes, eczema, hives, itching' },
  { id: 'heart', label: 'Heart-related concern', examples: 'Chest pain, murmur, fainting' },
  { id: 'fever-infection', label: 'Fever or infection', examples: 'Fever, cold, throat pain, repeated infections' },
]

export const DURATION_OPTIONS: { id: SymptomDuration; label: string; helper: string }[] = [
  { id: 'today', label: 'Started today', helper: 'New symptom or first episode' },
  { id: 'few-days', label: 'Few days', helper: 'Not improving or worrying you' },
  { id: 'recurrent', label: 'Keeps coming back', helper: 'Repeated episodes or ongoing concern' },
]

export const URGENCY_OPTIONS: { id: UrgencyLevel; label: string; helper: string }[] = [
  { id: 'comfortable', label: 'Can wait for a slot', helper: 'Scheduled specialist visit is okay' },
  { id: 'soon', label: 'Need soon', helper: 'Prefer today or tomorrow' },
  { id: 'urgent', label: 'Worried right now', helper: 'May need urgent pediatric review' },
]
