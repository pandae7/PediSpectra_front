// Rule-based symptom -> subspecialty router (NO LLM / NO medical advice).
// Deterministic keyword matching only. Returns which pediatric specialist is
// most relevant to the described concern, to help a parent choose — it never
// diagnoses. Keywords seeded from Specialities.md "treats" lists (common ones).

export interface TriageSuggestion {
  subspeciality: string   // exact SUBSPECIALITIES name (for /doctors?subspeciality=)
  score: number
}

// Each subspecialty -> weighted keywords. Lowercase; matched as substrings on
// tokenized, lowercased input. Weights let strong signals (e.g. "seizure")
// outrank generic ones (e.g. "pain").
const KEYWORDS: Record<string, [string, number][]> = {
  'General Pediatrics & Newborn Care': [
    ['fever', 2], ['cold', 2], ['cough', 1], ['vomiting', 2], ['loose motion', 2], ['diarrhea', 2],
    ['vaccine', 3], ['vaccination', 3], ['immunization', 3], ['newborn', 3], ['jaundice', 2],
    ['feeding', 1], ['weight', 1], ['growth', 1], ['checkup', 2], ['is this normal', 2],
  ],
  'Pediatric Endocrinology': [
    ['short', 2], ['not growing', 3], ['growth', 2], ['puberty', 3], ['periods', 2], ['thyroid', 3],
    ['diabetes', 3], ['sugar', 2], ['hormone', 3], ['obesity', 2], ['overweight', 2], ['body hair', 2],
  ],
  'Pediatric Pulmonology': [
    ['asthma', 3], ['wheeze', 3], ['wheezing', 3], ['breathless', 3], ['breathing', 2], ['cough', 2],
    ['chest infection', 2], ['snoring', 3], ['snore', 2], ['noisy breathing', 2], ['lung', 2], ['sleep apnea', 3],
  ],
  'Pediatric Neurology': [
    ['seizure', 3], ['fits', 3], ['convulsion', 3], ['staring spell', 3], ['headache', 2], ['migraine', 2],
    ['delayed walking', 3], ['delayed talking', 3], ['floppy', 2], ['weak muscles', 2], ['loss of skills', 3], ['head size', 2],
  ],
  'Pediatric Cardiology': [
    ['heart', 3], ['murmur', 3], ['hole in heart', 3], ['blue lips', 3], ['palpitation', 2],
    ['chest pain', 2], ['fainting', 2], ['congenital heart', 3], ['cyanosis', 3],
  ],
  'Pediatric Gastroenterology': [
    ['stomach pain', 3], ['tummy', 2], ['abdominal pain', 3], ['constipation', 3], ['hard stool', 2],
    ['soiling', 2], ['loose motion', 2], ['reflux', 3], ['spitting up', 2], ['liver', 2], ['blood in stool', 3], ['not gaining weight', 2],
  ],
  'Pediatric Nephrology': [
    ['urine', 3], ['urinary infection', 3], ['uti', 3], ['burning urine', 3], ['swelling', 2], ['swollen', 2],
    ['blood in urine', 3], ['protein in urine', 3], ['bedwetting', 3], ['kidney', 3], ['high blood pressure', 2], ['kidney stone', 3],
  ],
  'Pediatric Hematology-Oncology': [
    ['anaemia', 3], ['anemia', 3], ['low haemoglobin', 3], ['pale', 2], ['bruising', 3], ['nosebleed', 2],
    ['bleeding gums', 2], ['thalassemia', 3], ['sickle cell', 3], ['transfusion', 2], ['swollen glands', 2], ['cancer', 3], ['tumor', 3], ['leukemia', 3],
  ],
  'Pediatric Dermatology': [
    ['rash', 3], ['eczema', 3], ['dry skin', 2], ['itchy skin', 2], ['birthmark', 2], ['mole', 2],
    ['hair loss', 2], ['wart', 2], ['fungal', 2], ['scabies', 2], ['acne', 2], ['nappy rash', 2], ['skin', 1],
  ],
  'Child & Teen Mental Health': [
    ['anxiety', 3], ['fear', 2], ['panic', 2], ['low mood', 3], ['depression', 3], ['withdrawn', 2],
    ['school refusal', 3], ['exam stress', 2], ['nightmare', 2], ['bullying', 3], ['screen addiction', 2], ['sad', 2], ['counselling', 2],
  ],
  'Adolescent Health': [
    ['teen', 2], ['adolescent', 3], ['period', 2], ['painful period', 3], ['irregular period', 3],
    ['body image', 2], ['self-esteem', 2], ['pcos', 3], ['puberty', 2],
  ],
  'Pediatric Nutrition': [
    ['fussy eating', 3], ['refusing food', 3], ['does not eat', 3], ["doesn't eat", 3], ['underweight', 3],
    ['poor weight gain', 3], ['obesity', 2], ['diet', 2], ['weaning', 3], ['first foods', 2], ['vitamin', 2], ['iron deficiency', 2],
  ],
  'Pediatric Genetics': [
    ['birth defect', 3], ['facial features', 2], ['down syndrome', 3], ['chromosomal', 3], ['genetic', 3],
    ['runs in family', 2], ['newborn screening', 3], ['metabolic', 3], ['inherited', 3],
  ],
  'Pediatric Intensive Care': [
    ['emergency', 3], ['icu', 3], ['ventilator', 3], ['tracheostomy', 3], ['oxygen', 2], ['feeding tube', 2],
    ['danger sign', 2], ['very ill', 3], ['critical', 3],
  ],
  'Pediatric Rheumatology': [
    ['joint pain', 3], ['joint swelling', 3], ['morning stiffness', 3], ['limping', 2], ['arthritis', 3],
    ['lupus', 3], ['vasculitis', 3], ['autoimmune', 3], ['growing pains', 2], ['fever with rash', 3],
  ],
  'Pediatric Infectious Diseases': [
    ['prolonged fever', 3], ['fever over a week', 3], ['repeated infection', 3], ['tuberculosis', 3], ['tb', 2],
    ['dengue', 3], ['typhoid', 3], ['malaria', 3], ['antibiotic', 2], ['travel illness', 2], ['infection', 1],
  ],
  'Pediatric Allergy & Immunology': [
    ['allergy', 3], ['sneezing', 2], ['blocked nose', 2], ['itchy eyes', 2], ['food allergy', 3], ['milk allergy', 3],
    ['egg allergy', 3], ['nut allergy', 3], ['hives', 3], ['swelling of lips', 3], ['allergy test', 2], ['immunodeficiency', 3], ['falls sick often', 2],
  ],
  'Developmental Pediatrics': [
    ['not speaking', 3], ['speech delay', 3], ['poor eye contact', 3], ['autism', 3], ['adhd', 3], ['hyperactive', 2],
    ['learning difficulty', 3], ['poor attention', 2], ['delayed milestone', 3], ['tantrum', 2], ['behaviour', 2], ['behavior', 2],
  ],
}

// Quick-pick chips surfaced in the UI (common, parent-friendly).
export const SYMPTOM_CHIPS = [
  'Fever', 'Cough or wheezing', 'Stomach pain', 'Skin rash', 'Not eating well',
  'Delayed milestones', 'Seizures or fits', 'Urine problem', 'Headache', 'Anxiety or low mood',
]

export function routeSymptoms(input: string): TriageSuggestion[] {
  const text = input.toLowerCase()
  const scores: Record<string, number> = {}
  for (const [sub, kws] of Object.entries(KEYWORDS)) {
    let s = 0
    for (const [kw, w] of kws) {
      if (text.includes(kw)) s += w
    }
    if (s > 0) scores[sub] = s
  }
  return Object.entries(scores)
    .map(([subspeciality, score]) => ({ subspeciality, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
}