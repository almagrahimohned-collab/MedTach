// ============================================
// Clinical Ontology — Normalized Diagnosis Names
// ============================================

export interface DiagnosisEntry {
  canonical: string;
  synonyms: string[];
  category: string;
  specialty: string;
  icd10?: string;
}

export const CLINICAL_ONTOLOGY: Record<string, DiagnosisEntry> = {
  'myocardial infarction': {
    canonical: 'Myocardial Infarction',
    synonyms: ['mi', 'stemi', 'nstemi', 'heart attack', 'acute mi', 'acute coronary syndrome', 'coronary occlusion'],
    category: 'Cardiovascular',
    specialty: 'cardiology',
    icd10: 'I21'
  },
  'pulmonary embolism': {
    canonical: 'Pulmonary Embolism',
    synonyms: ['pe', 'lung clot', 'pulmonary embolus', 'massive pe', 'submassive pe', 'pulmonary thromboembolism'],
    category: 'Respiratory',
    specialty: 'pulmonology',
    icd10: 'I26'
  },
  'pneumonia': {
    canonical: 'Pneumonia',
    synonyms: ['pna', 'lung infection', 'chest infection', 'cap', 'hap', 'vap', 'bronchopneumonia', 'lobar pneumonia', 'community acquired pneumonia'],
    category: 'Respiratory',
    specialty: 'pulmonology',
    icd10: 'J18'
  },
  'heart failure': {
    canonical: 'Heart Failure',
    synonyms: ['chf', 'ccf', 'cardiac failure', 'left ventricular failure', 'lvf', 'right heart failure', 'congestive heart failure', 'acute decompensated heart failure'],
    category: 'Cardiovascular',
    specialty: 'cardiology',
    icd10: 'I50'
  },
  'aortic dissection': {
    canonical: 'Aortic Dissection',
    synonyms: ['dissecting aneurysm', 'type a dissection', 'type b dissection', 'stanford type a', 'stanford type b', 'aortic tear'],
    category: 'Cardiovascular',
    specialty: 'cardiology',
    icd10: 'I71'
  },
  'pneumothorax': {
    canonical: 'Pneumothorax',
    synonyms: ['ptx', 'collapsed lung', 'tension pneumothorax', 'spontaneous pneumothorax', 'traumatic pneumothorax'],
    category: 'Respiratory',
    specialty: 'pulmonology',
    icd10: 'J93'
  },
  'atrial fibrillation': {
    canonical: 'Atrial Fibrillation',
    synonyms: ['af', 'afib', 'arrhythmia', 'irregular heartbeat', 'paroxysmal af', 'persistent af', 'permanent af'],
    category: 'Cardiovascular',
    specialty: 'cardiology',
    icd10: 'I48'
  },
  'pericarditis': {
    canonical: 'Pericarditis',
    synonyms: ['pericardial inflammation', 'inflamed pericardium', 'acute pericarditis', 'pericardial effusion'],
    category: 'Cardiovascular',
    specialty: 'cardiology',
    icd10: 'I30'
  },
  'copd exacerbation': {
    canonical: 'COPD Exacerbation',
    synonyms: ['copd', 'chronic obstructive pulmonary disease', 'emphysema', 'chronic bronchitis exacerbation'],
    category: 'Respiratory',
    specialty: 'pulmonology',
    icd10: 'J44'
  },
  'asthma': {
    canonical: 'Asthma',
    synonyms: ['asthma attack', 'bronchospasm', 'wheezing', 'reactive airway disease', 'status asthmaticus'],
    category: 'Respiratory',
    specialty: 'pulmonology',
    icd10: 'J45'
  },
};

// Match submitted diagnosis to canonical name
export function matchDiagnosis(submitted: string): string | null {
  const normalized = submitted.toLowerCase().trim();
  
  for (const [canonical, entry] of Object.entries(CLINICAL_ONTOLOGY)) {
    if (normalized === canonical) return canonical;
    if (entry.synonyms.some(s => normalized.includes(s) || s.includes(normalized))) {
      return canonical;
    }
  }
  
  return null;
}

// Check if two diagnoses match (with ontology)
export function diagnosesMatch(submitted: string, correct: string): boolean {
  const matchedSubmitted = matchDiagnosis(submitted);
  const matchedCorrect = matchDiagnosis(correct);
  
  if (matchedSubmitted && matchedCorrect) {
    return matchedSubmitted === matchedCorrect;
  }
  
  // Fallback to direct comparison
  return submitted.toLowerCase().includes(correct.toLowerCase()) ||
         correct.toLowerCase().includes(submitted.toLowerCase());
}
