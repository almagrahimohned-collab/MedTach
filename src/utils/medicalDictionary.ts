export interface MedicalTest {
  id: string;
  name: string;
  category: 'labs' | 'imaging' | 'examination' | 'history';
  abbreviations: string[];
  commonMisspellings: string[];
}

export const medicalTests: MedicalTest[] = [
  {
    id: 'cbc',
    name: 'Complete Blood Count',
    category: 'labs',
    abbreviations: ['CBC', 'FBC', 'blood count', 'full blood count', 'c.b.c', 'c b c'],
    commonMisspellings: ['cb', 'ccb', 'cbc test', 'blod count', 'blod test'],
  },
  {
    id: 'lft',
    name: 'Liver Function Test',
    category: 'labs',
    abbreviations: ['LFT', 'liver function', 'liver panel', 'hepatic panel', 'l.f.t'],
    commonMisspellings: ['lft test', 'liver funtion', 'livr test', 'lf'],
  },
  {
    id: 'abg',
    name: 'Arterial Blood Gas',
    category: 'labs',
    abbreviations: ['ABG', 'blood gas', 'arterial gas', 'a.b.g'],
    commonMisspellings: ['abg test', 'abl', 'artrial blood'],
  },
  {
    id: 'cmp',
    name: 'Complete Metabolic Panel',
    category: 'labs',
    abbreviations: ['CMP', 'metabolic panel', 'chemistry panel', 'c.m.p'],
    commonMisspellings: ['cmp test', 'metabolic pannel', 'chem panel'],
  },
  {
    id: 'bmp',
    name: 'Basic Metabolic Panel',
    category: 'labs',
    abbreviations: ['BMP', 'basic metabolic', 'b.m.p'],
    commonMisspellings: ['bmp test', 'basic metbolic'],
  },
  {
    id: 'troponin',
    name: 'Cardiac Troponin',
    category: 'labs',
    abbreviations: ['troponin', 'trop', 'trop i', 'trop t', 'hs troponin'],
    commonMisspellings: ['troponn', 'troponin test', 'troponine'],
  },
  {
    id: 'ck_mb',
    name: 'Creatine Kinase-MB',
    category: 'labs',
    abbreviations: ['CK-MB', 'CK MB', 'creatine kinase', 'c.k.m.b'],
    commonMisspellings: ['ckmb', 'creatin kinase'],
  },
  {
    id: 'bnp',
    name: 'B-Type Natriuretic Peptide',
    category: 'labs',
    abbreviations: ['BNP', 'nt probnp', 'probnp', 'b.n.p'],
    commonMisspellings: ['bnp test', 'b type peptide'],
  },
  {
    id: 'crp',
    name: 'C-Reactive Protein',
    category: 'labs',
    abbreviations: ['CRP', 'c reactive', 'c.r.p'],
    commonMisspellings: ['crp test', 'c reative protein'],
  },
  {
    id: 'esr',
    name: 'Erythrocyte Sedimentation Rate',
    category: 'labs',
    abbreviations: ['ESR', 'sed rate', 'sedimentation rate', 'e.s.r'],
    commonMisspellings: ['esr test', 'sed rate test'],
  },
  {
    id: 'tft',
    name: 'Thyroid Function Test',
    category: 'labs',
    abbreviations: ['TFT', 'thyroid panel', 'tsh', 't4', 't3', 't.f.t'],
    commonMisspellings: ['tft test', 'thyriod test', 'thyroid'],
  },
  {
    id: 'hba1c',
    name: 'Glycated Hemoglobin',
    category: 'labs',
    abbreviations: ['HbA1c', 'A1C', 'glycated hemoglobin', 'hba1c'],
    commonMisspellings: ['hba1c test', 'hb1ac', 'a1c test'],
  },
  {
    id: 'lipid',
    name: 'Lipid Profile',
    category: 'labs',
    abbreviations: ['lipid panel', 'lipid profile', 'cholesterol', 'ldl', 'hdl'],
    commonMisspellings: ['lipid test', 'lipids', 'cholestrol'],
  },
  {
    id: 'coag',
    name: 'Coagulation Profile',
    category: 'labs',
    abbreviations: ['PT', 'PTT', 'INR', 'coagulation', 'coag panel'],
    commonMisspellings: ['coag test', 'pt test', 'ptt test'],
  },
  {
    id: 'ua',
    name: 'Urinalysis',
    category: 'labs',
    abbreviations: ['UA', 'urinalysis', 'urine analysis', 'urine test', 'u.a'],
    commonMisspellings: ['urine', 'urinalisys', 'urine anlysis'],
  },
  {
    id: 'ecg',
    name: 'Electrocardiogram',
    category: 'imaging',
    abbreviations: ['ECG', 'EKG', 'electrocardiogram', 'e.c.g', 'e.k.g'],
    commonMisspellings: ['ecg test', 'ekg test', 'electrocardiograph'],
  },
  {
    id: 'cxr',
    name: 'Chest X-Ray',
    category: 'imaging',
    abbreviations: ['CXR', 'chest xray', 'chest x ray', 'c.x.r'],
    commonMisspellings: ['cxr test', 'xrey', 'chest x-ray', 'x ray chest'],
  },
  {
    id: 'ct_head',
    name: 'CT Head (Non-Contrast)',
    category: 'imaging',
    abbreviations: ['CT head', 'CT brain', 'head CT', 'c.t head'],
    commonMisspellings: ['ct head test', 'ct scan head', 'brain ct'],
  },
  {
    id: 'ct_chest',
    name: 'CT Chest',
    category: 'imaging',
    abbreviations: ['CT chest', 'chest CT', 'c.t chest'],
    commonMisspellings: ['ct chest test', 'chest ct scan'],
  },
  {
    id: 'mri',
    name: 'Magnetic Resonance Imaging',
    category: 'imaging',
    abbreviations: ['MRI', 'm.r.i'],
    commonMisspellings: ['mri scan', 'mri test'],
  },
  {
    id: 'echo',
    name: 'Echocardiogram',
    category: 'imaging',
    abbreviations: ['Echo', 'TTE', 'echocardiogram', 'cardiac echo'],
    commonMisspellings: ['echo test', 'echocardiograph', 'ecocardiogram'],
  },
  {
    id: 'us_abd',
    name: 'Ultrasound Abdomen',
    category: 'imaging',
    abbreviations: ['US abdomen', 'abdominal US', 'ultrasound abdomen'],
    commonMisspellings: ['us test', 'abdominal ultrasound'],
  },
];

export const nonMedicalPatterns = [
  /weather/i,
  /football/i,
  /soccer/i,
  /politics/i,
  /trump/i,
  /movie/i,
  /music/i,
  /game/i,
  /food/i,
  /restaurant/i,
  /travel/i,
  /vacation/i,
  /^(hi|hello|hey|what's up|sup|yo)$/i,
  /^(how are you|what are you doing)$/i,
  /^(thank you|thanks|thx)$/i,
  /^(bye|goodbye|see you)$/i,
];

export function findTest(input: string): MedicalTest | null {
  const normalized = input.trim().toLowerCase();

  for (const test of medicalTests) {
    const allVariations = [
      ...test.abbreviations,
      ...test.commonMisspellings,
    ].map(v => v.toLowerCase());

    if (allVariations.includes(normalized)) {
      return test;
    }

    if (normalized.includes(test.name.toLowerCase())) {
      return test;
    }
  }

  return null;
}

export function correctSpelling(input: string): string | null {
  const normalized = input.trim().toLowerCase();

  for (const test of medicalTests) {
    for (const misspelling of test.commonMisspellings) {
      if (normalized === misspelling.toLowerCase()) {
        return test.name;
      }
    }
  }

  return null;
}

export function isNonMedical(input: string): boolean {
  const normalized = input.trim().toLowerCase();

  if (normalized.length < 3) return false;
  if (normalized.length > 500) return true;

  for (const pattern of nonMedicalPatterns) {
    if (pattern.test(normalized)) {
      return true;
    }
  }

  return false;
}

export function getTestCategory(testId: string): string {
  const test = medicalTests.find(t => t.id === testId);
  return test?.category || 'labs';
}

export const rejectionMessages: Record<string, string> = {
  non_medical: 'Doctor, please maintain professional focus on the clinical assessment. How can I assist with the patient?',
  too_short: 'Please provide more details about your clinical inquiry.',
  too_long: 'Please keep your clinical questions concise and focused on the patient assessment.',
  greeting: 'Welcome, Doctor. Please proceed with your clinical assessment of the patient.',
  thanks: 'You are welcome, Doctor. Shall we continue with the patient evaluation?',
  goodbye: 'The patient still needs your assessment, Doctor. Please complete your diagnosis.',
};
