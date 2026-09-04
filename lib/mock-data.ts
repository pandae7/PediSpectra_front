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
  bio: string
  imageUrl?: string
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

export interface SubspecialityMeta {
  /** Must match a value in SUBSPECIALITIES */
  name: string
  /** Parent-friendly banner title */
  friendlyTitle: string
  /** One-line descriptor for the banner */
  descriptor: string
  /** Short list of what this specialist handles (for the editorial sidebar) */
  treats: string[]
  /** Emoji or short glyph used as the specialty icon */
  icon: string
  /** Public path to the cover image, e.g. /images/subspecialities/nephrology.png. Optional — when absent or the image fails to load, the UI shows a gradient fallback. */
  coverImage?: string
}

export const SUBSPECIALITY_META: Record<string, SubspecialityMeta> = {
  'General Pediatrics & Newborn Care': {
    name: 'General Pediatrics & Newborn Care',
    friendlyTitle: 'Everyday Child Health',
    descriptor: "Your child's first doctor for fevers, vaccines, growth, and newborn concerns.",
    treats: ['Fever, cold, cough, vomiting', 'Vaccination schedules', 'Weight and height checks', 'Newborn jaundice and feeding', '"Is this normal for my child?"'],
    icon: '👶',
  },
  'Pediatric Endocrinology': {
    name: 'Pediatric Endocrinology',
    friendlyTitle: 'Growth & Hormones',
    descriptor: "When your child isn't growing or developing the way others their age are.",
    treats: ['Short for age, slow growth', 'Early or delayed puberty', 'Irregular or absent periods', 'Thyroid problems, diabetes', 'Excess weight or body hair'],
    icon: '📏',
  },
  'Pediatric Pulmonology': {
    name: 'Pediatric Pulmonology',
    friendlyTitle: 'Breathing, Lungs & Sleep',
    descriptor: "For the child who is always coughing, wheezing, or snoring.",
    treats: ['Asthma, wheezing, breathlessness', 'Persistent cough, chest infections', 'Snoring and restless sleep', 'Noisy breathing in babies', 'Long-term lung follow-up'],
    icon: '🫁',
  },
  'Pediatric Neurology': {
    name: 'Pediatric Neurology',
    friendlyTitle: 'Brain, Nerves & Fits',
    descriptor: "When something affects the brain, nerves or muscles.",
    treats: ['Fits, seizures, staring spells', 'Headaches and migraines', 'Delayed sitting, walking, talking', 'Weak or floppy muscles', 'Loss of learnt skills'],
    icon: '🧠',
  },
  'Pediatric Cardiology': {
    name: 'Pediatric Cardiology',
    friendlyTitle: 'Heart Care',
    descriptor: "For heart murmurs, blue spells and chest complaints.",
    treats: ['Heart murmurs', 'Holes and congenital heart problems', 'Blue lips, poor feeding in babies', 'Chest pain, palpitations, fainting', 'Sports fitness clearance'],
    icon: '❤️',
  },
  'Pediatric Gastroenterology': {
    name: 'Pediatric Gastroenterology',
    friendlyTitle: 'Stomach, Liver & Digestion',
    descriptor: "For tummy problems that keep coming back.",
    treats: ['Recurrent stomach pain', 'Constipation and soiling', 'Long-standing loose motions', 'Reflux and spitting up in babies', 'Jaundice, liver problems'],
    icon: '🩺',
  },
  'Pediatric Nephrology': {
    name: 'Pediatric Nephrology',
    friendlyTitle: 'Kidney & Urine',
    descriptor: "For urine, swelling and kidney concerns.",
    treats: ['Repeated urine infections', 'Swelling of face, legs or body', 'Blood or protein in urine', 'Bedwetting beyond the usual age', 'High blood pressure, kidney stones'],
    icon: '💧',
    coverImage: '/images/subspecialities/nephrology.png',
  },
  'Pediatric Hematology-Oncology': {
    name: 'Pediatric Hematology-Oncology',
    friendlyTitle: 'Blood & Cancer Care',
    descriptor: "For low blood counts, bleeding problems and cancer care.",
    treats: ['Anaemia, low haemoglobin', 'Easy bruising, nosebleeds', 'Thalassemia, transfusion needs', 'Swollen glands that persist', 'Childhood cancer care and follow-up'],
    icon: '🩸',
  },
  'Pediatric Dermatology': {
    name: 'Pediatric Dermatology',
    friendlyTitle: 'Skin, Hair & Nails',
    descriptor: "For rashes and skin problems specific to children.",
    treats: ['Eczema, dry itchy skin', 'Birthmarks, moles, pigmentation', 'Hair loss, scalp problems', 'Warts, fungal infections, scabies', 'Acne and nappy rash'],
    icon: '🧴',
  },
  'Child & Teen Mental Health': {
    name: 'Child & Teen Mental Health',
    friendlyTitle: 'Mind & Emotions',
    descriptor: "Because emotional health matters as much as physical health.",
    treats: ['Anxiety, excessive fear, panic', 'Low mood, withdrawal', 'School refusal, exam stress', 'Sleep problems, nightmares', 'Screen and social media stress'],
    icon: '🧡',
  },
  'Adolescent Health': {
    name: 'Adolescent Health',
    friendlyTitle: 'Teen Clinic',
    descriptor: "A private, judgement-free space for 10 to 19 year olds.",
    treats: ['Delayed, painful or irregular periods', 'Body changes, height and weight', 'Acne, body image, self-esteem', 'PCOS, excess hair, weight gain', 'Confidential teen counselling'],
    icon: '🌱',
  },
  'Pediatric Nutrition': {
    name: 'Pediatric Nutrition',
    friendlyTitle: 'Nutrition & Diet',
    descriptor: "Because \"my child doesn't eat\" is a real medical problem.",
    treats: ['Fussy eating, refusing food', 'Underweight, poor weight gain', 'Overweight and obesity', 'Diet plans for allergy or diabetes', 'Weaning and first foods'],
    icon: '🥗',
  },
  'Pediatric Genetics': {
    name: 'Pediatric Genetics',
    friendlyTitle: 'Genetic & Metabolic Care',
    descriptor: "When a condition may run in the family or was present from birth.",
    treats: ['Unusual features or birth defects', 'Down syndrome, chromosomal conditions', 'Conditions affecting more than one child', 'Abnormal newborn screening', 'Counselling before next pregnancy'],
    icon: '🧬',
  },
  'Pediatric Intensive Care': {
    name: 'Pediatric Intensive Care',
    friendlyTitle: 'Critical Care & Emergencies',
    descriptor: "For children who have been very ill, and parents unsure how urgent it is.",
    treats: ['"Is this an emergency right now?"', 'Follow-up after ICU or ventilator', 'Tracheostomy, oxygen or tube care', 'Care planning for complex children', 'Danger signs to watch for'],
    icon: '🚑',
  },
  'Pediatric Rheumatology': {
    name: 'Pediatric Rheumatology',
    friendlyTitle: 'Joints & Autoimmune',
    descriptor: "When pain, swelling or fever comes from the body's own immune system.",
    treats: ['Joint pain or swelling for weeks', 'Morning stiffness, limping', 'Long-lasting fever with rash', 'Lupus, juvenile arthritis, vasculitis', 'Growing pains vs. real disease'],
    icon: '🦴',
  },
  'Pediatric Infectious Diseases': {
    name: 'Pediatric Infectious Diseases',
    friendlyTitle: 'Infections & Fevers',
    descriptor: "For infections that are severe, unusual or keep returning.",
    treats: ['Fever over a week with no cause', 'Repeated ear, chest or urine infections', 'TB, dengue, typhoid, malaria', 'Long antibiotic courses', 'Travel-related illness'],
    icon: '🦠',
  },
  'Pediatric Allergy & Immunology': {
    name: 'Pediatric Allergy & Immunology',
    friendlyTitle: 'Allergy & Immunity',
    descriptor: "For allergies, and the child who falls sick far too often.",
    treats: ['Sneezing, blocked nose, itchy eyes', 'Food allergy — milk, egg, nuts', 'Hives, skin allergy, swelling', 'Allergy testing and immunotherapy', 'Child unusually prone to infection'],
    icon: '🤧',
  },
  'Developmental Pediatrics': {
    name: 'Developmental Pediatrics',
    friendlyTitle: 'Development & Behaviour',
    descriptor: "For milestones, learning and behaviour.",
    treats: ['Not speaking on time, poor eye contact', 'Autism, ADHD, hyperactivity', 'Learning and school difficulties', 'Delayed milestones', 'Tantrums and behaviour concerns'],
    icon: '🧩',
  },
}

export function getSubspecialityMeta(name: string): SubspecialityMeta | undefined {
  return SUBSPECIALITY_META[name]
}

export const SUBSPECIALITIES = [
  'General Pediatrics & Newborn Care',
  'Pediatric Endocrinology',
  'Pediatric Pulmonology',
  'Pediatric Neurology',
  'Pediatric Cardiology',
  'Pediatric Gastroenterology',
  'Pediatric Nephrology',
  'Pediatric Hematology-Oncology',
  'Pediatric Dermatology',
  'Child & Teen Mental Health',
  'Adolescent Health',
  'Pediatric Nutrition',
  'Pediatric Genetics',
  'Pediatric Intensive Care',
  'Pediatric Rheumatology',
  'Pediatric Infectious Diseases',
  'Pediatric Allergy & Immunology',
  'Developmental Pediatrics',
]

export const SEED_DOCTORS: DoctorProfile[] = [
  // --- Pediatric Cardiology ---
  { id: 'dr-001', name: 'Dr. Priya Sharma', subspeciality: 'Pediatric Cardiology', yearsExperience: 12, pgCollege: 'AIIMS Delhi', workingHospital: 'Narayana Health', fee: 800, rating: 4.8, consultationCount: 245, languages: ['English', 'Hindi', 'Kannada'], city: 'Bangalore', bio: 'Specializes in congenital heart defects and pediatric arrhythmias. Known for her compassionate approach with anxious parents and thorough echocardiogram interpretations.', availability: [{ day: 'Monday', time: '09:00 AM' }, { day: 'Monday', time: '09:30 AM' }, { day: 'Wednesday', time: '02:00 PM' }, { day: 'Friday', time: '11:00 AM' }] },
  { id: 'dr-002', name: 'Dr. Arvind Mehta', subspeciality: 'Pediatric Cardiology', yearsExperience: 18, pgCollege: 'PGIMER Chandigarh', workingHospital: 'Fortis Hospital', fee: 1200, rating: 4.9, consultationCount: 420, languages: ['English', 'Hindi'], city: 'Delhi', bio: 'One of India\'s leading pediatric cardiologists with expertise in interventional catheterization. Published over 40 research papers on childhood cardiac conditions.', availability: [{ day: 'Tuesday', time: '10:00 AM' }, { day: 'Tuesday', time: '10:30 AM' }, { day: 'Thursday', time: '03:00 PM' }] },
  // --- Pediatric Neurology ---
  { id: 'dr-003', name: 'Dr. Rajesh Kumar', subspeciality: 'Pediatric Neurology', yearsExperience: 15, pgCollege: 'CMC Vellore', workingHospital: 'Manipal Hospital', fee: 1000, rating: 4.9, consultationCount: 380, languages: ['English', 'Hindi', 'Tamil'], city: 'Chennai', bio: 'Expert in childhood epilepsy and neurodevelopmental disorders. Pioneered video-EEG telemonitoring protocols for remote diagnosis of seizure disorders.', availability: [{ day: 'Tuesday', time: '10:00 AM' }, { day: 'Thursday', time: '03:00 PM' }, { day: 'Saturday', time: '09:00 AM' }] },
  { id: 'dr-004', name: 'Dr. Sunita Verma', subspeciality: 'Pediatric Neurology', yearsExperience: 10, pgCollege: 'NIMHANS Bangalore', workingHospital: 'Aster CMI', fee: 900, rating: 4.7, consultationCount: 210, languages: ['English', 'Hindi', 'Kannada'], city: 'Bangalore', bio: 'Focuses on pediatric headache disorders and movement abnormalities. Passionate about making complex neurological concepts accessible to parents.', availability: [{ day: 'Monday', time: '02:00 PM' }, { day: 'Wednesday', time: '10:00 AM' }, { day: 'Friday', time: '04:00 PM' }] },
  // --- Pediatric Pulmonology ---
  { id: 'dr-005', name: 'Dr. Anitha Reddy', subspeciality: 'Pediatric Pulmonology', yearsExperience: 10, pgCollege: 'NIMHANS Bangalore', workingHospital: 'Apollo Hospital', fee: 750, rating: 4.7, consultationCount: 190, languages: ['English', 'Telugu', 'Kannada'], city: 'Hyderabad', bio: 'Specializes in pediatric asthma management and chronic lung disease. Advocates for inhaler technique education and long-term action plans for wheezing children.', availability: [{ day: 'Monday', time: '04:00 PM' }, { day: 'Wednesday', time: '09:00 AM' }, { day: 'Friday', time: '02:00 PM' }] },
  { id: 'dr-006', name: 'Dr. Karthik Iyer', subspeciality: 'Pediatric Pulmonology', yearsExperience: 8, pgCollege: 'Kasturba Medical College', workingHospital: 'KMC Hospital', fee: 700, rating: 4.6, consultationCount: 145, languages: ['English', 'Kannada', 'Tulu'], city: 'Mangaluru', bio: 'Focused on sleep-disordered breathing and recurrent respiratory infections in children. Trained in flexible bronchoscopy for pediatric airways.', availability: [{ day: 'Tuesday', time: '09:00 AM' }, { day: 'Thursday', time: '11:00 AM' }, { day: 'Saturday', time: '10:00 AM' }] },
  // --- Pediatric Gastroenterology ---
  { id: 'dr-007', name: 'Dr. Sanjay Patel', subspeciality: 'Pediatric Gastroenterology', yearsExperience: 8, pgCollege: 'KEM Mumbai', workingHospital: 'Fortis Hospital', fee: 900, rating: 4.6, consultationCount: 155, languages: ['English', 'Hindi', 'Gujarati'], city: 'Mumbai', bio: 'Expert in childhood inflammatory bowel disease and functional abdominal pain. Believes in a holistic approach combining diet, lifestyle, and targeted therapy.', availability: [{ day: 'Tuesday', time: '11:00 AM' }, { day: 'Thursday', time: '10:00 AM' }, { day: 'Saturday', time: '02:00 PM' }] },
  { id: 'dr-008', name: 'Dr. Lakshmi Rao', subspeciality: 'Pediatric Gastroenterology', yearsExperience: 13, pgCollege: 'JIPMER Puducherry', workingHospital: 'Rainbow Hospital', fee: 850, rating: 4.8, consultationCount: 275, languages: ['English', 'Telugu', 'Hindi'], city: 'Hyderabad', bio: 'Specializes in pediatric liver diseases, celiac disease, and feeding difficulties in toddlers. Known for her patience with picky eaters and their worried parents.', availability: [{ day: 'Monday', time: '10:00 AM' }, { day: 'Wednesday', time: '03:00 PM' }, { day: 'Friday', time: '09:00 AM' }] },
  // --- Pediatric Nephrology ---
  { id: 'dr-009', name: 'Dr. Vikram Singh', subspeciality: 'Pediatric Nephrology', yearsExperience: 11, pgCollege: 'PGIMER Chandigarh', workingHospital: 'Max Hospital', fee: 950, rating: 4.5, consultationCount: 175, languages: ['English', 'Hindi', 'Punjabi'], city: 'Delhi', bio: 'Manages nephrotic syndrome, urinary tract infections, and childhood hypertension. Advocates for early screening in at-risk children to prevent kidney damage.', availability: [{ day: 'Tuesday', time: '09:00 AM' }, { day: 'Thursday', time: '04:00 PM' }] },
  { id: 'dr-010', name: 'Dr. Deepa Krishnan', subspeciality: 'Pediatric Nephrology', yearsExperience: 9, pgCollege: 'CMC Vellore', workingHospital: 'Apollo Hospital', fee: 800, rating: 4.7, consultationCount: 160, languages: ['English', 'Malayalam', 'Tamil'], city: 'Chennai', bio: 'Focused on glomerular diseases and dialysis care in children. Passionate about educating families on fluid and diet management for kidney health.', availability: [{ day: 'Monday', time: '11:00 AM' }, { day: 'Wednesday', time: '02:00 PM' }, { day: 'Friday', time: '10:00 AM' }] },
  // --- Pediatric Endocrinology ---
  { id: 'dr-011', name: 'Dr. Meera Nair', subspeciality: 'Pediatric Endocrinology', yearsExperience: 14, pgCollege: 'JIPMER Puducherry', workingHospital: 'Aster CMI', fee: 850, rating: 4.8, consultationCount: 310, languages: ['English', 'Malayalam', 'Tamil'], city: 'Bangalore', bio: 'Expert in Type 1 diabetes management, growth disorders, and thyroid conditions in children. Uses continuous glucose monitoring data for remote dose adjustments.', availability: [{ day: 'Monday', time: '10:00 AM' }, { day: 'Wednesday', time: '11:00 AM' }, { day: 'Friday', time: '09:00 AM' }] },
  { id: 'dr-012', name: 'Dr. Rohit Agarwal', subspeciality: 'Pediatric Endocrinology', yearsExperience: 7, pgCollege: 'AIIMS Delhi', workingHospital: 'Medanta Hospital', fee: 1000, rating: 4.6, consultationCount: 130, languages: ['English', 'Hindi'], city: 'Delhi', bio: 'Specializes in precocious puberty, adrenal disorders, and bone metabolism issues. Committed to helping families navigate complex hormonal conditions with clarity.', availability: [{ day: 'Tuesday', time: '02:00 PM' }, { day: 'Thursday', time: '09:00 AM' }, { day: 'Saturday', time: '11:00 AM' }] },
  // --- Pediatric Hematology-Oncology ---
  { id: 'dr-013', name: 'Dr. Pooja Deshmukh', subspeciality: 'Pediatric Hematology-Oncology', yearsExperience: 11, pgCollege: 'AIIMS Delhi', workingHospital: 'Tata Memorial', fee: 1100, rating: 4.8, consultationCount: 200, languages: ['English', 'Hindi', 'Marathi'], city: 'Mumbai', bio: 'Expert in thalassemia management and bleeding disorders. Works closely with families on transfusion protocols and iron chelation therapy.', availability: [{ day: 'Monday', time: '09:00 AM' }, { day: 'Wednesday', time: '10:00 AM' }, { day: 'Friday', time: '02:00 PM' }] },
  { id: 'dr-014', name: 'Dr. Naveen Joshi', subspeciality: 'Pediatric Hematology-Oncology', yearsExperience: 9, pgCollege: 'CMC Vellore', workingHospital: 'Narayana Health', fee: 900, rating: 4.6, consultationCount: 165, languages: ['English', 'Kannada', 'Hindi'], city: 'Bangalore', bio: 'Focused on pediatric anemia workups and coagulation disorders. Passionate about early diagnosis of rare blood conditions.', availability: [{ day: 'Tuesday', time: '11:00 AM' }, { day: 'Thursday', time: '03:00 PM' }] },
  { id: 'dr-015', name: 'Dr. Ritu Kapoor', subspeciality: 'Pediatric Hematology-Oncology', yearsExperience: 16, pgCollege: 'PGIMER Chandigarh', workingHospital: 'Tata Memorial', fee: 1500, rating: 4.9, consultationCount: 350, languages: ['English', 'Hindi'], city: 'Mumbai', bio: 'Renowned pediatric oncologist specializing in leukemia and solid tumors. Known for her empathetic communication during difficult diagnoses.', availability: [{ day: 'Monday', time: '10:00 AM' }, { day: 'Thursday', time: '02:00 PM' }] },
  { id: 'dr-016', name: 'Dr. Suresh Babu', subspeciality: 'Pediatric Hematology-Oncology', yearsExperience: 12, pgCollege: 'Kidwai Memorial', workingHospital: 'HCG Hospital', fee: 1200, rating: 4.7, consultationCount: 230, languages: ['English', 'Kannada', 'Telugu'], city: 'Bangalore', bio: 'Specializes in brain tumors and late-effects management in childhood cancer survivors. Advocates for psychosocial support alongside treatment.', availability: [{ day: 'Wednesday', time: '09:00 AM' }, { day: 'Friday', time: '11:00 AM' }] },
  // --- Pediatric Rheumatology ---
  { id: 'dr-017', name: 'Dr. Amita Chatterjee', subspeciality: 'Pediatric Rheumatology', yearsExperience: 13, pgCollege: 'AIIMS Delhi', workingHospital: 'AMRI Hospital', fee: 950, rating: 4.7, consultationCount: 185, languages: ['English', 'Hindi', 'Bengali'], city: 'Kolkata', bio: 'Expert in juvenile idiopathic arthritis and lupus in children. Combines medication management with physiotherapy guidance for optimal outcomes.', availability: [{ day: 'Tuesday', time: '10:00 AM' }, { day: 'Thursday', time: '04:00 PM' }, { day: 'Saturday', time: '09:00 AM' }] },
  { id: 'dr-018', name: 'Dr. Venkat Rao', subspeciality: 'Pediatric Rheumatology', yearsExperience: 10, pgCollege: 'NIMS Hyderabad', workingHospital: 'Care Hospital', fee: 800, rating: 4.5, consultationCount: 140, languages: ['English', 'Telugu', 'Hindi'], city: 'Hyderabad', bio: 'Focused on autoimmune conditions and vasculitis in children. Believes in shared decision-making with families for long-term treatment plans.', availability: [{ day: 'Monday', time: '03:00 PM' }, { day: 'Wednesday', time: '11:00 AM' }] },
  // --- Pediatric Infectious Diseases ---
  { id: 'dr-019', name: 'Dr. Farah Khan', subspeciality: 'Pediatric Infectious Diseases', yearsExperience: 14, pgCollege: 'CMC Vellore', workingHospital: 'Manipal Hospital', fee: 850, rating: 4.8, consultationCount: 290, languages: ['English', 'Hindi', 'Urdu'], city: 'Bangalore', bio: 'Expert in complex pediatric infections, tropical diseases, and immunocompromised host management. Provides evidence-based antibiotic stewardship guidance.', availability: [{ day: 'Monday', time: '10:00 AM' }, { day: 'Wednesday', time: '02:00 PM' }, { day: 'Friday', time: '09:00 AM' }] },
  { id: 'dr-020', name: 'Dr. Thomas Philip', subspeciality: 'Pediatric Infectious Diseases', yearsExperience: 11, pgCollege: 'JIPMER Puducherry', workingHospital: 'Amrita Hospital', fee: 900, rating: 4.6, consultationCount: 220, languages: ['English', 'Malayalam'], city: 'Kochi', bio: 'Specializes in vaccine-preventable diseases and HIV management in children. Active in community outreach for immunization awareness.', availability: [{ day: 'Tuesday', time: '09:00 AM' }, { day: 'Thursday', time: '10:00 AM' }] },
  // --- Pediatric Allergy & Immunology ---
  { id: 'dr-021', name: 'Dr. Neha Gupta', subspeciality: 'Pediatric Allergy & Immunology', yearsExperience: 9, pgCollege: 'AIIMS Delhi', workingHospital: 'Max Hospital', fee: 800, rating: 4.6, consultationCount: 170, languages: ['English', 'Hindi'], city: 'Delhi', bio: 'Specializes in food allergy diagnosis, desensitization protocols, and primary immunodeficiency evaluation. Helps families navigate allergen-free lifestyles.', availability: [{ day: 'Monday', time: '11:00 AM' }, { day: 'Wednesday', time: '04:00 PM' }, { day: 'Friday', time: '10:00 AM' }] },
  { id: 'dr-022', name: 'Dr. Ramya Srinivas', subspeciality: 'Pediatric Allergy & Immunology', yearsExperience: 7, pgCollege: 'St. Johns Bangalore', workingHospital: 'Columbia Asia', fee: 750, rating: 4.5, consultationCount: 120, languages: ['English', 'Kannada', 'Tamil'], city: 'Bangalore', bio: 'Focused on eczema management and allergic rhinitis in children. Uses patch testing and elimination diets to identify triggers.', availability: [{ day: 'Tuesday', time: '02:00 PM' }, { day: 'Thursday', time: '09:00 AM' }] },
  // --- Developmental Pediatrics ---
  { id: 'dr-025', name: 'Dr. Kavitha Mohan', subspeciality: 'Developmental Pediatrics', yearsExperience: 12, pgCollege: 'NIMHANS Bangalore', workingHospital: 'Manipal Hospital', fee: 900, rating: 4.8, consultationCount: 260, languages: ['English', 'Kannada', 'Hindi'], city: 'Bangalore', bio: 'Expert in autism spectrum disorders, ADHD, and learning disabilities. Designs individualized therapy plans combining OT, speech, and behavioral interventions.', availability: [{ day: 'Monday', time: '10:00 AM' }, { day: 'Wednesday', time: '10:00 AM' }, { day: 'Friday', time: '02:00 PM' }] },
  { id: 'dr-026', name: 'Dr. Ashwin Mathew', subspeciality: 'Developmental Pediatrics', yearsExperience: 8, pgCollege: 'CMC Vellore', workingHospital: 'Rainbow Hospital', fee: 850, rating: 4.6, consultationCount: 150, languages: ['English', 'Malayalam', 'Hindi'], city: 'Hyderabad', bio: 'Focused on speech and language delays, behavioral concerns, and school readiness assessments. Partners with schools for IEP planning.', availability: [{ day: 'Tuesday', time: '11:00 AM' }, { day: 'Thursday', time: '02:00 PM' }] },
  // --- Pediatric Dermatology ---
  { id: 'dr-031', name: 'Dr. Swati Jain', subspeciality: 'Pediatric Dermatology', yearsExperience: 8, pgCollege: 'St. Johns Bangalore', workingHospital: 'Sakra Hospital', fee: 700, rating: 4.5, consultationCount: 220, languages: ['English', 'Hindi', 'Kannada'], city: 'Bangalore', bio: 'Pediatric dermatologist treating eczema, birthmarks, and fungal infections. Uses teledermatology extensively — great at diagnosing from photos.', availability: [{ day: 'Monday', time: '11:00 AM' }, { day: 'Wednesday', time: '03:00 PM' }, { day: 'Friday', time: '10:00 AM' }] },
  { id: 'dr-032', name: 'Dr. Manoj Tiwari', subspeciality: 'Pediatric Dermatology', yearsExperience: 12, pgCollege: 'KEM Mumbai', workingHospital: 'Lilavati Hospital', fee: 850, rating: 4.7, consultationCount: 290, languages: ['English', 'Hindi', 'Marathi'], city: 'Mumbai', bio: 'Expert in childhood psoriasis, vitiligo, and hemangiomas. Combines topical therapy with lifestyle guidance for long-term skin health.', availability: [{ day: 'Tuesday', time: '09:00 AM' }, { day: 'Thursday', time: '11:00 AM' }, { day: 'Saturday', time: '10:00 AM' }] },
]

export const SEED_CONSULTATIONS: Consultation[] = [
  // --- Upcoming (5) ---
  { id: 'consult-001', doctorId: 'dr-001', patientName: 'Ramesh Gupta', childName: 'Arjun', subspeciality: 'Pediatric Cardiology', date: '2025-07-15', time: '09:00 AM', status: 'upcoming' },
  { id: 'consult-002', doctorId: 'dr-003', patientName: 'Kavitha Rao', childName: 'Sneha', subspeciality: 'Pediatric Neurology', date: '2025-07-16', time: '10:00 AM', status: 'upcoming' },
  { id: 'consult-003', doctorId: 'dr-005', patientName: 'Suresh Iyer', childName: 'Aditya', subspeciality: 'Pediatric Pulmonology', date: '2025-07-17', time: '04:00 PM', status: 'upcoming' },
  { id: 'consult-004', doctorId: 'dr-011', patientName: 'Anita Das', childName: 'Riya', subspeciality: 'Pediatric Endocrinology', date: '2025-07-18', time: '10:00 AM', status: 'upcoming' },
  { id: 'consult-005', doctorId: 'dr-019', patientName: 'Mohammed Farooq', childName: 'Zain', subspeciality: 'Pediatric Infectious Diseases', date: '2025-07-19', time: '10:00 AM', status: 'upcoming' },
  // --- Completed (3) ---
  { id: 'consult-006', doctorId: 'dr-001', patientName: 'Deepak Nair', childName: 'Aarav', subspeciality: 'Pediatric Cardiology', date: '2025-06-20', time: '09:00 AM', status: 'completed', postConsultData: { remarks: 'Chief Complaints:\nHeart murmur detected during routine checkup\n\nDiagnosis:\nInnocent murmur — no intervention needed\n\nFollow-up:\nReview echocardiogram in 6 months', completedAt: '2025-06-20T10:00:00Z' } },
  { id: 'consult-007', doctorId: 'dr-003', patientName: 'Preethi Menon', childName: 'Aditi', subspeciality: 'Pediatric Neurology', date: '2025-06-18', time: '10:00 AM', status: 'completed', postConsultData: { remarks: 'Chief Complaints:\nRecurrent headaches and dizziness\n\nDiagnosis:\nMigraine without aura\n\nTreatment Plan:\nRx: Ibuprofen 200mg SOS, maintain headache diary\n\nFollow-up:\nReview in 4 weeks', completedAt: '2025-06-18T11:00:00Z' } },
  { id: 'consult-008', doctorId: 'dr-005', patientName: 'Suresh Iyer', childName: 'Aditya', subspeciality: 'Pediatric Pulmonology', date: '2025-06-10', time: '04:00 PM', status: 'completed', postConsultData: { remarks: 'Chief Complaints:\nChronic cough and wheezing at night\n\nDiagnosis:\nBronchial asthma — mild persistent\n\nTreatment Plan:\nRx: Salbutamol inhaler PRN, Budesonide 100mcg BD\n\nFollow-up:\nReview in 2 weeks with peak flow diary', completedAt: '2025-06-10T17:00:00Z' } },
]

const STORAGE_KEY = 'pedispectra-mock-data-initialized-v2'
const DOCTORS_KEY = 'pedispectra-doctors'
const CONSULTATIONS_KEY = 'pedispectra-consultations'

export function initializeMockData() {
  if (typeof window === 'undefined') return
  try {
    const initialized = localStorage.getItem(STORAGE_KEY)
    if (!initialized) {
      localStorage.setItem(DOCTORS_KEY, JSON.stringify(SEED_DOCTORS))
      localStorage.setItem(CONSULTATIONS_KEY, JSON.stringify(SEED_CONSULTATIONS))
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(SEED_REVIEWS))
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
