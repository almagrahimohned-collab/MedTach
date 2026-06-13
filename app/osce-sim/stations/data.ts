export interface OSCEStation {
  id: string;
  title: string;
  type: 'history' | 'examination' | 'diagnosis' | 'communication' | 'procedure';
  timeLimit: number;
  patientName: string;
  patientAge: number;
  patientGender: string;
  scenario: string;
  task: string;
  hiddenData: Record<string, string>;
  examinationOptions?: ExaminationOption[];
  correctDiagnosis?: string;
  maxScore: number;
}

export interface ExaminationOption {
  id: string;
  name: string;
  category: string;
  finding: string;
  scoreWeight: number;
  isCorrect: boolean;
}

export const SAMPLE_STATIONS: OSCEStation[] = [
  // المحطة 1: History Taking - Heart Failure
  {
    id: 'osce_001',
    title: 'Fatigue & Dyspnea',
    type: 'history',
    timeLimit: 5,
    patientName: 'Mr. Ahmed Hassan',
    patientAge: 65,
    patientGender: 'male',
    scenario: 'A 65-year-old man presents with progressive fatigue and shortness of breath over 3 months.',
    task: 'Take a focused history. Ask about onset, duration, associated symptoms, past medical history, medications, and family history.',
    hiddenData: {
      chief_complaint: 'I feel tired all the time and can\'t catch my breath, especially when walking.',
      onset: 'It started about 3 months ago and has been getting worse.',
      associated_symptoms: 'I also have swelling in my legs, especially in the evening. I wake up at night feeling like I can\'t breathe.',
      past_medical: 'I have high blood pressure and had a heart attack 5 years ago.',
      medications: 'I take lisinopril and aspirin, but I don\'t always remember.',
      family_history: 'My father died of heart failure at 70.',
      social: 'I don\'t smoke anymore. I quit 10 years ago.',
      sleep: 'I need 3 pillows to sleep comfortably.',
    },
    correctDiagnosis: 'Acute decompensated heart failure',
    maxScore: 25,
  },

  // المحطة 2: Physical Examination - Mitral Regurgitation
  {
    id: 'osce_002',
    title: 'Cardiac Examination',
    type: 'examination',
    timeLimit: 5,
    patientName: 'Mrs. Sara Ali',
    patientAge: 45,
    patientGender: 'female',
    scenario: 'A 45-year-old woman with known mitral valve prolapse presents for follow-up.',
    task: 'Perform a focused cardiovascular examination. Document your findings.',
    hiddenData: {},
    examinationOptions: [
      { id: 'general', name: 'General Appearance', category: 'inspection', finding: 'Well-nourished, no dyspnea at rest', scoreWeight: 1, isCorrect: true },
      { id: 'hands', name: 'Examine Hands', category: 'inspection', finding: 'No clubbing, no cyanosis, warm', scoreWeight: 1, isCorrect: true },
      { id: 'jvp', name: 'Measure JVP', category: 'inspection', finding: 'JVP elevated at 7cm', scoreWeight: 2, isCorrect: true },
      { id: 'apex', name: 'Palpate Apex Beat', category: 'palpation', finding: 'Apex displaced to 6th ICS, anterior axillary line, hyperdynamic', scoreWeight: 2, isCorrect: true },
      { id: 'thrills', name: 'Check for Thrills', category: 'palpation', finding: 'Systolic thrill at apex', scoreWeight: 2, isCorrect: true },
      { id: 'aortic', name: 'Auscultate Aortic Area', category: 'auscultation', finding: 'S1 normal, S2 normal, no murmur', scoreWeight: 1, isCorrect: true },
      { id: 'pulmonic', name: 'Auscultate Pulmonic Area', category: 'auscultation', finding: 'S1 normal, S2 normal, no murmur', scoreWeight: 1, isCorrect: true },
      { id: 'tricuspid', name: 'Auscultate Tricuspid Area', category: 'auscultation', finding: 'S1 normal, S2 normal, no murmur', scoreWeight: 1, isCorrect: true },
      { id: 'mitral', name: 'Auscultate Mitral Area', category: 'auscultation', finding: 'Holosystolic murmur grade 4/6, radiating to axilla, S3 present', scoreWeight: 3, isCorrect: true },
      { id: 'edema', name: 'Check Pedal Edema', category: 'extremities', finding: 'Mild bilateral pitting edema', scoreWeight: 1, isCorrect: true },
    ],
    correctDiagnosis: 'Severe Mitral Regurgitation',
    maxScore: 25,
  },

  // المحطة 3: Diagnosis - Pneumonia
  {
    id: 'osce_003',
    title: 'Fever & Cough',
    type: 'diagnosis',
    timeLimit: 4,
    patientName: 'Mr. Karim Mahmoud',
    patientAge: 25,
    patientGender: 'male',
    scenario: 'A 25-year-old man presents with fever, productive cough, and right-sided chest pain for 5 days.',
    task: 'Based on the provided history and CXR findings, make a diagnosis and create a management plan.',
    hiddenData: {
      vitals: 'Temp: 39°C, HR: 105, RR: 24, BP: 120/75, SpO2: 92%',
      cxr: 'Right lower lobe consolidation with air bronchograms',
      labs: 'WBC: 16,500, Neutrophils: 85%, CRP: 145',
      history: '5 days of green sputum, fever, right-sided pleuritic pain. Previously healthy, non-smoker.',
    },
    correctDiagnosis: 'Community-Acquired Pneumonia (Right Lower Lobe)',
    maxScore: 25,
  },

  // المحطة 4: Communication - Breaking Bad News
  {
    id: 'osce_004',
    title: 'Breaking Bad News',
    type: 'communication',
    timeLimit: 5,
    patientName: 'Mrs. Fatima Zahra',
    patientAge: 52,
    patientGender: 'female',
    scenario: 'Mrs. Fatima just had a breast biopsy. The result shows invasive ductal carcinoma. She is anxious and waiting for results.',
    task: 'Explain the diagnosis to the patient using the SPIKES protocol. Show empathy and answer her questions.',
    hiddenData: {
      diagnosis: 'Invasive Ductal Carcinoma, Stage II',
      prognosis: 'Good prognosis with treatment. 5-year survival >85%',
      next_steps: 'Referral to oncology, surgical consultation, discuss chemotherapy options',
      patient_mood: 'Anxious, tearful, accompanied by husband',
    },
    maxScore: 25,
  },

  // المحطة 5: Procedure - ABG Sampling
  {
    id: 'osce_005',
    title: 'ABG Sampling',
    type: 'procedure',
    timeLimit: 4,
    patientName: 'Mr. Omar Saeed',
    patientAge: 55,
    patientGender: 'male',
    scenario: 'A 55-year-old man with COPD exacerbation needs an ABG to assess respiratory status.',
    task: 'Perform arterial blood gas sampling in the correct order.',
    hiddenData: {},
    correctDiagnosis: 'ABG: pH 7.32, PaCO2 58, PaO2 55, HCO3 30',
    maxScore: 25,
  },
];
