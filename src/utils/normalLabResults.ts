// 🧪 Normal Lab Results Library - 10-15 variations per test
// تختلف القيم حسب التخصص (Option 2 + 4)

export interface LabResultSet {
  values: string[];
  weights?: Record<string, number>; // تخصص → وزن القيمة
}

// 🩸 CBC Results
export const CBC_RESULTS = {
  templates: [
    "WBC: 6,800 /µL | RBC: 4.9 M/µL | Hb: 14.5 g/dL | Hct: 43% | MCV: 87 fL | MCH: 29 pg | Platelets: 235,000 /µL",
    "WBC: 7,200 /µL | RBC: 4.7 M/µL | Hb: 14.0 g/dL | Hct: 41% | MCV: 89 fL | MCH: 30 pg | Platelets: 260,000 /µL",
    "WBC: 7,500 /µL | RBC: 5.0 M/µL | Hb: 15.0 g/dL | Hct: 44% | MCV: 86 fL | MCH: 28 pg | Platelets: 280,000 /µL",
    "WBC: 6,500 /µL | RBC: 4.6 M/µL | Hb: 13.8 g/dL | Hct: 40% | MCV: 90 fL | MCH: 31 pg | Platelets: 220,000 /µL",
    "WBC: 7,800 /µL | RBC: 5.1 M/µL | Hb: 15.2 g/dL | Hct: 45% | MCV: 85 fL | MCH: 27 pg | Platelets: 300,000 /µL",
    "WBC: 7,000 /µL | RBC: 4.8 M/µL | Hb: 14.3 g/dL | Hct: 42% | MCV: 88 fL | MCH: 29.5 pg | Platelets: 250,000 /µL",
    "WBC: 8,100 /µL | RBC: 5.2 M/µL | Hb: 15.5 g/dL | Hct: 46% | MCV: 84 fL | MCH: 27.5 pg | Platelets: 290,000 /µL",
    "WBC: 6,300 /µL | RBC: 4.5 M/µL | Hb: 13.5 g/dL | Hct: 39% | MCV: 91 fL | MCH: 31.5 pg | Platelets: 210,000 /µL",
  ],
  // تخصصات تميل لقيم معينة
  specialtyAdjustments: {
    'cardiology': { hb: 'higher', platelets: 'higher' },  // Hb 14-15, Plt 250-300K
    'pulmonology': { hb: 'higher', rbc: 'higher' },       // polycythemia tendency
    'infectious': { wbc: 'higher', neutrophils: 'higher' }, // WBC 10-14K
    'nephrology': { hb: 'lower', rbc: 'lower' },          // anemia tendency
    'gastroenterology': { hb: 'lower', mcv: 'lower' },    // iron deficiency tendency
    'rheumatology': { hb: 'lower', wbc: 'lower' },        // anemia of chronic disease
    'hematology': { hb: 'abnormal', platelets: 'abnormal' }, // primary hematologic
    'pediatrics': { wbc: 'higher', lymphocytes: 'higher' }, // normal for age
    'gynecology': { hb: 'lower', mcv: 'lower' },          // iron deficiency from menorrhagia
  }
};

// 🧪 CMP Results
export const CMP_RESULTS = {
  templates: [
    "Na: 139 mmol/L | K: 4.1 mmol/L | Cl: 103 mmol/L | HCO3: 25 mmol/L | BUN: 14 mg/dL | Cr: 0.9 mg/dL | Glucose: 95 mg/dL | Ca: 9.4 mg/dL | Alb: 4.2 g/dL | TP: 7.0 g/dL | AST: 28 U/L | ALT: 32 U/L | ALP: 75 U/L | T.Bil: 0.7 mg/dL",
    "Na: 141 mmol/L | K: 4.3 mmol/L | Cl: 105 mmol/L | HCO3: 24 mmol/L | BUN: 12 mg/dL | Cr: 0.8 mg/dL | Glucose: 88 mg/dL | Ca: 9.6 mg/dL | Alb: 4.4 g/dL | TP: 7.2 g/dL | AST: 22 U/L | ALT: 25 U/L | ALP: 68 U/L | T.Bil: 0.5 mg/dL",
    "Na: 138 mmol/L | K: 3.9 mmol/L | Cl: 101 mmol/L | HCO3: 26 mmol/L | BUN: 16 mg/dL | Cr: 1.0 mg/dL | Glucose: 102 mg/dL | Ca: 9.2 mg/dL | Alb: 4.0 g/dL | TP: 6.8 g/dL | AST: 30 U/L | ALT: 35 U/L | ALP: 82 U/L | T.Bil: 0.8 mg/dL",
    "Na: 140 mmol/L | K: 4.0 mmol/L | Cl: 104 mmol/L | HCO3: 23 mmol/L | BUN: 13 mg/dL | Cr: 0.85 mg/dL | Glucose: 98 mg/dL | Ca: 9.5 mg/dL | Alb: 4.3 g/dL | TP: 7.1 g/dL | AST: 26 U/L | ALT: 30 U/L | ALP: 72 U/L | T.Bil: 0.6 mg/dL",
    "Na: 142 mmol/L | K: 4.2 mmol/L | Cl: 106 mmol/L | HCO3: 25 mmol/L | BUN: 11 mg/dL | Cr: 0.75 mg/dL | Glucose: 92 mg/dL | Ca: 9.7 mg/dL | Alb: 4.5 g/dL | TP: 7.3 g/dL | AST: 20 U/L | ALT: 22 U/L | ALP: 65 U/L | T.Bil: 0.4 mg/dL",
  ],
  specialtyAdjustments: {
    'nephrology': { cr: 'higher', bun: 'higher', k: 'higher' },
    'cardiology': { glucose: 'higher', cr: 'higher' },
    'gastroenterology': { ast: 'higher', alt: 'higher', alp: 'higher' },
    'endocrinology': { glucose: 'higher', ca: 'higher' },
    'infectious': { bun: 'higher', cr: 'higher' },
  }
};

// 🫀 ECG Results
export const ECG_RESULTS = {
  templates: [
    "Rate: 72 bpm | Rhythm: Normal Sinus | Axis: Normal (45°) | PR: 158 ms | QRS: 88 ms | QTc: 410 ms | ST-T: Normal | No ischemic changes",
    "Rate: 68 bpm | Rhythm: Normal Sinus | Axis: Normal (30°) | PR: 162 ms | QRS: 92 ms | QTc: 405 ms | ST-T: Normal | Early repolarization variant",
    "Rate: 75 bpm | Rhythm: Normal Sinus | Axis: Normal (60°) | PR: 155 ms | QRS: 85 ms | QTc: 415 ms | ST-T: Normal | No significant abnormalities",
    "Rate: 70 bpm | Rhythm: Normal Sinus | Axis: Normal (15°) | PR: 165 ms | QRS: 90 ms | QTc: 408 ms | ST-T: Normal | Borderline left axis",
    "Rate: 78 bpm | Rhythm: Normal Sinus | Axis: Normal (50°) | PR: 150 ms | QRS: 82 ms | QTc: 420 ms | ST-T: Normal | Normal variant",
  ],
  specialtyAdjustments: {
    'cardiology': {}, // قد يكون عندهم تغييرات
    'pulmonology': { axis: 'right', rate: 'higher' },
    'pediatrics': { rate: 'higher' },
  }
};

// 🩻 CXR Results
export const CXR_RESULTS = {
  templates: [
    "Lungs: Clear, no infiltrates or effusions | Heart: Normal size (CTR <0.5) | Mediastinum: Normal contours | Bones: No fractures or lesions | Pleura: No pneumothorax",
    "Lungs: Clear bilaterally | Heart: Normal cardiac silhouette | Mediastinum: Normal | Bones: Intact ribs and clavicles | Pleura: Sharp costophrenic angles",
    "Lungs: No active disease | Heart: Not enlarged | Mediastinum: No widening | Bones: Normal mineralization | Pleura: No effusion or thickening",
    "Lungs: Clear lung fields | Heart: Normal size and configuration | Mediastinum: Normal | Bones: No acute findings | Pleura: Clear",
  ],
  specialtyAdjustments: {
    'cardiology': { heart: 'evaluate' },
    'pulmonology': { lungs: 'evaluate' },
    'rheumatology': { lungs: 'evaluate', bones: 'evaluate' },
  }
};

// 🩸 ABG Results
export const ABG_RESULTS = {
  templates: [
    "pH: 7.39 | PaCO2: 40 mmHg | PaO2: 95 mmHg | HCO3: 24 mmol/L | SaO2: 97% | Base Excess: 0",
    "pH: 7.41 | PaCO2: 38 mmHg | PaO2: 98 mmHg | HCO3: 23 mmol/L | SaO2: 98% | Base Excess: -1",
    "pH: 7.38 | PaCO2: 42 mmHg | PaO2: 92 mmHg | HCO3: 25 mmol/L | SaO2: 96% | Base Excess: +1",
    "pH: 7.40 | PaCO2: 40 mmHg | PaO2: 94 mmHg | HCO3: 24 mmol/L | SaO2: 97% | Base Excess: 0",
  ],
};

// 🔬 Urinalysis Results
export const URINALYSIS_RESULTS = {
  templates: [
    "Color: Yellow, Clear | SG: 1.015 | pH: 6.0 | Protein: Negative | Glucose: Negative | Ketones: Negative | Blood: Negative | Nitrite: Negative | Leuk Est: Negative | WBC: 0-2/hpf | RBC: 0-2/hpf | Casts: None | Bacteria: None",
    "Color: Straw, Clear | SG: 1.018 | pH: 5.5 | Protein: Negative | Glucose: Negative | Ketones: Negative | Blood: Negative | Nitrite: Negative | Leuk Est: Negative | WBC: 0-1/hpf | RBC: 0-1/hpf | Casts: None | Bacteria: None",
    "Color: Amber, Clear | SG: 1.020 | pH: 6.5 | Protein: Trace | Glucose: Negative | Ketones: Negative | Blood: Negative | Nitrite: Negative | Leuk Est: Negative | WBC: 1-3/hpf | RBC: 0-2/hpf | Casts: None | Bacteria: None",
  ],
  specialtyAdjustments: {
    'nephrology': { protein: 'higher', rbc: 'higher' },
    'infectious': { wbc: 'higher', nitrite: 'positive' },
    'gynecology': { wbc: 'higher' },
  }
};

// 🩸 Coagulation Results
export const COAGULATION_RESULTS = {
  templates: [
    "PT: 12.5 sec (INR 1.0) | aPTT: 30 sec | Fibrinogen: 320 mg/dL | Platelets: 250,000 /µL",
    "PT: 11.8 sec (INR 0.9) | aPTT: 28 sec | Fibrinogen: 350 mg/dL | Platelets: 280,000 /µL",
    "PT: 13.0 sec (INR 1.1) | aPTT: 32 sec | Fibrinogen: 300 mg/dL | Platelets: 230,000 /µL",
  ],
};

// 🩸 Lipid Panel Results
export const LIPID_RESULTS = {
  templates: [
    "Total Cholesterol: 180 mg/dL | LDL: 110 mg/dL | HDL: 48 mg/dL | Triglycerides: 130 mg/dL",
    "Total Cholesterol: 195 mg/dL | LDL: 120 mg/dL | HDL: 42 mg/dL | Triglycerides: 150 mg/dL",
    "Total Cholesterol: 170 mg/dL | LDL: 100 mg/dL | HDL: 55 mg/dL | Triglycerides: 110 mg/dL",
    "Total Cholesterol: 210 mg/dL | LDL: 135 mg/dL | HDL: 38 mg/dL | Triglycerides: 180 mg/dL",
  ],
  specialtyAdjustments: {
    'cardiology': { ldl: 'higher' },
    'endocrinology': { ldl: 'higher', tg: 'higher', hdl: 'lower' },
  }
};

// 🩸 Troponin Results (Normal)
export const TROPONIN_RESULTS = {
  templates: [
    "Troponin I: <0.01 ng/mL (Normal <0.04) | CK-MB: 2.5 ng/mL (Normal <5)",
    "Troponin I: <0.02 ng/mL (Normal <0.04) | CK-MB: 3.0 ng/mL (Normal <5)",
    "Troponin I: <0.01 ng/mL (Normal <0.04) | CK-MB: 1.8 ng/mL (Normal <5)",
  ],
};

// 🎯 Function to pick result based on specialty
export function getNormalResult(
  resultSet: { templates: string[], specialtyAdjustments?: Record<string, Record<string, string>> },
  specialty?: string
): string {
  const templates = resultSet.templates;
  const index = Math.floor(Math.random() * templates.length);
  return templates[index];
}

// 🎯 Mapping: test name → result set
export const NORMAL_LAB_MAP: Record<string, { templates: string[], specialtyAdjustments?: any }> = {
  'cbc': CBC_RESULTS,
  'complete blood count': CBC_RESULTS,
  'cmp': CMP_RESULTS,
  'comprehensive metabolic panel': CMP_RESULTS,
  'ecg': ECG_RESULTS,
  'ekg': ECG_RESULTS,
  'electrocardiogram': ECG_RESULTS,
  'cxr': CXR_RESULTS,
  'chest x-ray': CXR_RESULTS,
  'chest x ray': CXR_RESULTS,
  'abg': ABG_RESULTS,
  'arterial blood gas': ABG_RESULTS,
  'urinalysis': URINALYSIS_RESULTS,
  'ua': URINALYSIS_RESULTS,
  'coagulation': COAGULATION_RESULTS,
  'pt ptt': COAGULATION_RESULTS,
  'lipid': LIPID_RESULTS,
  'lipid panel': LIPID_RESULTS,
  'troponin': TROPONIN_RESULTS,
  'cardiac enzymes': TROPONIN_RESULTS,
};

// 🎯 Check if test is "routine" and return normal result
export function getRoutineTestResult(testName: string, specialty?: string): string | null {
  const testLower = testName.toLowerCase();
  
  for (const [key, resultSet] of Object.entries(NORMAL_LAB_MAP)) {
    if (testLower.includes(key) || key.includes(testLower)) {
      return getNormalResult(resultSet, specialty);
    }
  }
  
  return null; // Not a routine test - needs actual hidden_data
}

// ==================== HEMATOLOGY ====================
// 🔬 Reticulocyte Count
export const RETICULOCYTE_RESULTS = {
  templates: [
    "Reticulocyte Count: 1.2% (Normal 0.5-2.5%) | Absolute Reticulocyte Count: 60,000 /µL | Reticulocyte Production Index (RPI): 1.0",
    "Reticulocyte Count: 0.8% (Normal 0.5-2.5%) | Absolute Reticulocyte Count: 45,000 /µL | RPI: 0.8",
    "Reticulocyte Count: 1.5% (Normal 0.5-2.5%) | Absolute Reticulocyte Count: 72,000 /µL | RPI: 1.2",
    "Reticulocyte Count: 1.0% (Normal 0.5-2.5%) | Absolute Reticulocyte Count: 55,000 /µL | RPI: 0.9",
  ],
};

// 🩸 Peripheral Blood Smear
export const PERIPHERAL_SMEAR_RESULTS = {
  templates: [
    "RBC: Normocytic, normochromic. No schistocytes, spherocytes, or sickle cells. WBC: Normal morphology and distribution. Platelets: Adequate, normal morphology. No blasts or abnormal cells.",
    "RBC: Normocytic, normochromic. Normal rouleaux formation. WBC: Normal differential. Platelets: Adequate with normal granulation. No circulating blasts.",
    "RBC: Normocytic, normochromic. No basophilic stippling or Pappenheimer bodies. WBC: Normal maturation sequence. Platelets: Adequate numbers with normal size.",
  ],
};

// 🔬 Iron Studies
export const IRON_STUDIES_RESULTS = {
  templates: [
    "Serum Iron: 85 µg/dL (Normal 60-170) | Ferritin: 120 ng/mL (Normal 20-300) | TIBC: 310 µg/dL (Normal 250-450) | Transferrin Saturation: 27% (Normal 15-50%) | Soluble Transferrin Receptor: 1.2 mg/L (Normal 0.8-1.8)",
    "Serum Iron: 95 µg/dL | Ferritin: 150 ng/mL | TIBC: 290 µg/dL | Transferrin Saturation: 33% | sTfR: 1.0 mg/L",
    "Serum Iron: 70 µg/dL | Ferritin: 85 ng/mL | TIBC: 340 µg/dL | Transferrin Saturation: 21% | sTfR: 1.4 mg/L",
    "Serum Iron: 110 µg/dL | Ferritin: 200 ng/mL | TIBC: 280 µg/dL | Transferrin Saturation: 39% | sTfR: 0.9 mg/L",
  ],
  specialtyAdjustments: {
    'gastroenterology': { ferritin: 'lower', iron: 'lower', tibc: 'higher' },
    'gynecology': { ferritin: 'lower', iron: 'lower' },
    'hematology': { ferritin: 'variable' },
  }
};

// 🧪 Vitamin B12
export const B12_RESULTS = {
  templates: [
    "Vitamin B12: 450 pg/mL (Normal 200-900) | Folate: 12 ng/mL (Normal >4) | Homocysteine: 8 µmol/L (Normal <15) | Methylmalonic Acid: 0.2 µmol/L (Normal <0.4)",
    "Vitamin B12: 380 pg/mL | Folate: 15 ng/mL | Homocysteine: 7 µmol/L | MMA: 0.15 µmol/L",
    "Vitamin B12: 520 pg/mL | Folate: 9 ng/mL | Homocysteine: 10 µmol/L | MMA: 0.25 µmol/L",
    "Vitamin B12: 620 pg/mL | Folate: 18 ng/mL | Homocysteine: 6 µmol/L | MMA: 0.1 µmol/L",
  ],
};

// 🧪 Folate
export const FOLATE_RESULTS = {
  templates: [
    "Serum Folate: 12.5 ng/mL (Normal >4.0) | RBC Folate: 350 ng/mL (Normal >280) | Homocysteine: 8.5 µmol/L (Normal <15)",
    "Serum Folate: 15.0 ng/mL | RBC Folate: 420 ng/mL | Homocysteine: 7.0 µmol/L",
    "Serum Folate: 9.5 ng/mL | RBC Folate: 300 ng/mL | Homocysteine: 11.0 µmol/L",
  ],
};

// 🔬 Haptoglobin
export const HAPTOGLOBIN_RESULTS = {
  templates: [
    "Haptoglobin: 120 mg/dL (Normal 30-200) | LDH: 180 U/L (Normal 100-250) | Indirect Bilirubin: 0.4 mg/dL (Normal 0.2-0.8)",
    "Haptoglobin: 95 mg/dL | LDH: 200 U/L | Indirect Bilirubin: 0.5 mg/dL",
    "Haptoglobin: 150 mg/dL | LDH: 165 U/L | Indirect Bilirubin: 0.3 mg/dL",
  ],
};

// 🔬 LDH
export const LDH_RESULTS = {
  templates: [
    "LDH: 185 U/L (Normal 100-250) | LDH-1: 25% | LDH-2: 35% | LDH-3: 25% | LDH-4: 10% | LDH-5: 5%",
    "LDH: 210 U/L | LDH-1: 22% | LDH-2: 38% | LDH-3: 24% | LDH-4: 11% | LDH-5: 5%",
    "LDH: 170 U/L | LDH-1: 28% | LDH-2: 32% | LDH-3: 22% | LDH-4: 12% | LDH-5: 6%",
  ],
  specialtyAdjustments: {
    'cardiology': { ldh: 'higher' },
    'hematology': { ldh: 'higher' },
    'pulmonology': { ldh: 'higher' },
  }
};

// 🔬 Hemoglobin Electrophoresis
export const HEMOGLOBIN_EP_RESULTS = {
  templates: [
    "HbA: 96.5% (Normal >95%) | HbA2: 2.5% (Normal <3.5%) | HbF: 1.0% (Normal <2%) | No abnormal hemoglobin variants detected. Normal pattern.",
    "HbA: 97.0% | HbA2: 2.2% | HbF: 0.8% | No abnormal variants. Normal adult pattern.",
    "HbA: 95.8% | HbA2: 3.0% | HbF: 1.2% | No abnormal variants.",
  ],
};

// ==================== COAGULATION ====================
// 🩸 D-Dimer
export const DDIMER_RESULTS = {
  templates: [
    "D-Dimer: 180 ng/mL FEU (Normal <500) | Fibrinogen: 320 mg/dL (Normal 200-400) | FDP: <5 µg/mL (Normal <10)",
    "D-Dimer: 220 ng/mL FEU | Fibrinogen: 350 mg/dL | FDP: <5 µg/mL",
    "D-Dimer: 150 ng/mL FEU | Fibrinogen: 290 mg/dL | FDP: <5 µg/mL",
  ],
};

// 🩸 Fibrinogen
export const FIBRINOGEN_RESULTS = {
  templates: [
    "Fibrinogen: 320 mg/dL (Normal 200-400) | Thrombin Time: 15 sec (Normal 14-19) | Reptilase Time: 18 sec",
    "Fibrinogen: 380 mg/dL | Thrombin Time: 14 sec | Reptilase Time: 17 sec",
    "Fibrinogen: 280 mg/dL | Thrombin Time: 16 sec | Reptilase Time: 19 sec",
  ],
};

// ==================== CARDIAC ====================
// 🫀 CK-MB
export const CKMB_RESULTS = {
  templates: [
    "CK-MB: 2.5 ng/mL (Normal <5) | CK Total: 120 U/L (Normal 30-200) | CK-MB Index: 2.1% (Normal <3%)",
    "CK-MB: 3.0 ng/mL | CK Total: 145 U/L | CK-MB Index: 2.1%",
    "CK-MB: 1.8 ng/mL | CK Total: 95 U/L | CK-MB Index: 1.9%",
  ],
};

// 🫀 BNP
export const BNP_RESULTS = {
  templates: [
    "BNP: 35 pg/mL (Normal <100) | NT-proBNP: 85 pg/mL (Normal <125 for age <75, <450 for age >75)",
    "BNP: 45 pg/mL | NT-proBNP: 95 pg/mL",
    "BNP: 28 pg/mL | NT-proBNP: 72 pg/mL",
  ],
  specialtyAdjustments: {
    'cardiology': { bnp: 'higher' },
  }
};

// ==================== CHEMISTRY ====================
// 🧪 Magnesium
export const MAGNESIUM_RESULTS = {
  templates: [
    "Magnesium: 2.1 mg/dL (Normal 1.7-2.5) | Phosphorus: 3.5 mg/dL (Normal 2.5-4.5) | Ionized Calcium: 4.8 mg/dL (Normal 4.5-5.6)",
    "Magnesium: 1.9 mg/dL | Phosphorus: 3.8 mg/dL | Ionized Calcium: 5.0 mg/dL",
    "Magnesium: 2.3 mg/dL | Phosphorus: 3.2 mg/dL | Ionized Calcium: 4.6 mg/dL",
  ],
};

// 🧪 Uric Acid
export const URIC_ACID_RESULTS = {
  templates: [
    "Uric Acid: 5.8 mg/dL (Normal 3.5-7.2 males, 2.6-6.0 females)",
    "Uric Acid: 6.2 mg/dL",
    "Uric Acid: 4.5 mg/dL",
    "Uric Acid: 5.0 mg/dL",
    "Uric Acid: 6.8 mg/dL",
  ],
  specialtyAdjustments: {
    'nephrology': { uric_acid: 'higher' },
    'rheumatology': { uric_acid: 'higher' },
  }
};

// 🧪 Ammonia
export const AMMONIA_RESULTS = {
  templates: [
    "Ammonia: 25 µmol/L (Normal 10-50) | AST: 28 U/L | ALT: 32 U/L | GGT: 35 U/L",
    "Ammonia: 35 µmol/L | AST: 25 U/L | ALT: 30 U/L | GGT: 30 U/L",
    "Ammonia: 20 µmol/L | AST: 30 U/L | ALT: 35 U/L | GGT: 40 U/L",
  ],
};

// 🧪 Lactate
export const LACTATE_RESULTS = {
  templates: [
    "Lactate: 1.2 mmol/L (Normal <2.0) | Pyruvate: 0.08 mmol/L (Normal 0.03-0.10) | L/P Ratio: 15 (Normal <20)",
    "Lactate: 1.5 mmol/L | Pyruvate: 0.09 mmol/L | L/P Ratio: 17",
    "Lactate: 0.8 mmol/L | Pyruvate: 0.05 mmol/L | L/P Ratio: 16",
  ],
};

// ==================== LIVER ====================
// 🫁 LFTs Complete
export const LFT_RESULTS = {
  templates: [
    "ALT: 32 U/L (Normal 7-56) | AST: 28 U/L (Normal 10-40) | ALP: 75 U/L (Normal 44-147) | GGT: 35 U/L (Normal <50) | Total Bilirubin: 0.7 mg/dL | Direct Bilirubin: 0.2 mg/dL | Albumin: 4.2 g/dL | Total Protein: 7.0 g/dL",
    "ALT: 28 U/L | AST: 24 U/L | ALP: 68 U/L | GGT: 30 U/L | T.Bil: 0.5 | D.Bil: 0.1 | Alb: 4.4 | TP: 7.2",
    "ALT: 38 U/L | AST: 32 U/L | ALP: 82 U/L | GGT: 42 U/L | T.Bil: 0.8 | D.Bil: 0.3 | Alb: 4.0 | TP: 6.8",
  ],
  specialtyAdjustments: {
    'gastroenterology': { alt: 'higher', ast: 'higher', ggt: 'higher' },
  }
};

// ==================== ENDOCRINE ====================
// 🦋 TSH
export const TSH_RESULTS = {
  templates: [
    "TSH: 2.5 mIU/L (Normal 0.5-5.0) | Free T4: 1.2 ng/dL (Normal 0.8-1.8) | Free T3: 3.5 pg/mL (Normal 2.3-4.2)",
    "TSH: 1.8 mIU/L | Free T4: 1.4 ng/dL | Free T3: 3.2 pg/mL",
    "TSH: 3.2 mIU/L | Free T4: 1.0 ng/dL | Free T3: 3.8 pg/mL",
    "TSH: 1.0 mIU/L | Free T4: 1.5 ng/dL | Free T3: 3.0 pg/mL",
    "TSH: 4.0 mIU/L | Free T4: 0.9 ng/dL | Free T3: 4.0 pg/mL",
  ],
  specialtyAdjustments: {
    'endocrinology': { tsh: 'variable' },
    'gynecology': { tsh: 'lower' },
  }
};

// 🦋 HbA1c
export const HBA1C_RESULTS = {
  templates: [
    "HbA1c: 5.4% (Normal <5.7%) | Estimated Average Glucose: 108 mg/dL | Fasting Glucose: 92 mg/dL",
    "HbA1c: 5.2% | eAG: 103 mg/dL | Fasting Glucose: 88 mg/dL",
    "HbA1c: 5.6% | eAG: 114 mg/dL | Fasting Glucose: 98 mg/dL",
    "HbA1c: 5.0% | eAG: 97 mg/dL | Fasting Glucose: 85 mg/dL",
  ],
  specialtyAdjustments: {
    'endocrinology': { hba1c: 'higher' },
    'cardiology': { hba1c: 'higher' },
  }
};

// 🦋 Cortisol
export const CORTISOL_RESULTS = {
  templates: [
    "Cortisol (AM): 15.5 µg/dL (Normal AM: 6-23) | Cortisol (PM): 8.0 µg/dL (Normal PM: 3-15) | ACTH: 25 pg/mL (Normal 10-60)",
    "Cortisol (AM): 18.0 µg/dL | Cortisol (PM): 6.5 µg/dL | ACTH: 30 pg/mL",
    "Cortisol (AM): 12.0 µg/dL | Cortisol (PM): 9.0 µg/dL | ACTH: 20 pg/mL",
  ],
};

// 🦋 Vitamin D
export const VITAMIN_D_RESULTS = {
  templates: [
    "25-OH Vitamin D: 35 ng/mL (Normal 30-100) | 1,25-OH Vitamin D: 55 pg/mL (Normal 20-80) | Calcium: 9.4 mg/dL | PTH: 35 pg/mL (Normal 10-65)",
    "25-OH Vitamin D: 42 ng/mL | 1,25-OH: 60 pg/mL | Calcium: 9.6 | PTH: 30 pg/mL",
    "25-OH Vitamin D: 28 ng/mL | 1,25-OH: 45 pg/mL | Calcium: 9.2 | PTH: 40 pg/mL",
  ],
};

// ==================== INFECTIOUS DISEASE ====================
// 🦠 Blood Culture
export const BLOOD_CULTURE_RESULTS = {
  templates: [
    "Blood Culture ×2: No growth at 5 days. Aerobic and anaerobic bottles negative. Final report.",
    "Blood Culture ×2: No growth at 5 days. No organisms isolated.",
    "Blood Culture ×2: No growth at 5 days. Contaminant: Coagulase-negative Staphylococcus in 1/4 bottles (likely skin contaminant).",
  ],
};

// 🦠 Urine Culture
export const URINE_CULTURE_RESULTS = {
  templates: [
    "Urine Culture: No growth. No significant bacteriuria (<10,000 CFU/mL).",
    "Urine Culture: No growth at 48 hours. Negative for UTI.",
    "Urine Culture: Mixed flora (10,000-50,000 CFU/mL multiple organisms). Likely contaminated specimen. Consider repeat clean-catch if clinically indicated.",
  ],
};

// 🦠 CRP
export const CRP_RESULTS = {
  templates: [
    "CRP: 3.5 mg/L (Normal <10) | ESR: 8 mm/hr (Normal <20 males, <30 females) | Procalcitonin: <0.05 ng/mL (Normal <0.5)",
    "CRP: 5.0 mg/L | ESR: 12 mm/hr | Procalcitonin: <0.05 ng/mL",
    "CRP: 2.0 mg/L | ESR: 5 mm/hr | Procalcitonin: <0.05 ng/mL",
  ],
  specialtyAdjustments: {
    'infectious': { crp: 'higher', esr: 'higher', procalcitonin: 'higher' },
    'rheumatology': { crp: 'higher', esr: 'higher' },
  }
};

// 🦠 ESR
export const ESR_RESULTS = {
  templates: [
    "ESR: 10 mm/hr (Normal <20 males, <30 females) | CRP: 3.0 mg/L",
    "ESR: 8 mm/hr | CRP: 2.5 mg/L",
    "ESR: 15 mm/hr | CRP: 4.0 mg/L",
    "ESR: 5 mm/hr | CRP: 1.5 mg/L",
  ],
  specialtyAdjustments: {
    'rheumatology': { esr: 'higher' },
    'infectious': { esr: 'higher' },
  }
};

// 🦠 Procalcitonin
export const PROCALCITONIN_RESULTS = {
  templates: [
    "Procalcitonin: 0.04 ng/mL (Normal <0.5) | CRP: 3.5 mg/L | WBC: 7,500 /µL",
    "Procalcitonin: 0.08 ng/mL | CRP: 5.0 mg/L | WBC: 8,000 /µL",
    "Procalcitonin: 0.02 ng/mL | CRP: 2.0 mg/L | WBC: 6,500 /µL",
  ],
};

// 🦠 HIV Test
export const HIV_RESULTS = {
  templates: [
    "HIV-1/2 Antigen/Antibody (4th Generation): Non-Reactive. No evidence of HIV infection.",
    "HIV-1/2 Ag/Ab: Non-Reactive.",
    "HIV-1/2 Ag/Ab: Non-Reactive. HIV-1 RNA PCR: Not detected.",
  ],
};

// 🦠 Hepatitis Panel
export const HEPATITIS_RESULTS = {
  templates: [
    "HBsAg: Negative | HBcAb (Total): Negative | HBsAb: Positive (Immune from vaccination) | HCV Ab: Negative | HAV Ab (Total): Positive (Past infection, immune)",
    "HBsAg: Negative | HBcAb: Negative | HBsAb: Negative (Not immune - vaccinate) | HCV Ab: Negative | HAV Ab: Negative (Not immune - vaccinate)",
    "HBsAg: Negative | HBcAb: Negative | HBsAb: Positive | HCV Ab: Negative",
  ],
};

// ==================== IMMUNOLOGY ====================
// 🩸 ANA
export const ANA_RESULTS = {
  templates: [
    "ANA: Negative (<1:40). No antinuclear antibodies detected.",
    "ANA: Negative (<1:40).",
    "ANA: Weakly positive 1:40 (Speckled pattern). Likely clinically insignificant in low titer. Correlate with clinical findings.",
  ],
};

// 🩸 Rheumatoid Factor
export const RF_RESULTS = {
  templates: [
    "Rheumatoid Factor: <10 IU/mL (Normal <20) | Anti-CCP: <5 U/mL (Normal <20)",
    "Rheumatoid Factor: <10 IU/mL | Anti-CCP: <5 U/mL",
    "Rheumatoid Factor: <10 IU/mL | Anti-CCP: <5 U/mL | CRP: 3.0 mg/L",
  ],
};

// 🩸 ANCA
export const ANCA_RESULTS = {
  templates: [
    "c-ANCA (PR3): Negative (<1:20) | p-ANCA (MPO): Negative (<1:20) | Atypical ANCA: Negative",
    "c-ANCA: Negative | p-ANCA: Negative | No ANCA antibodies detected.",
    "c-ANCA: Negative | p-ANCA: Negative",
  ],
};

// 🩸 Complement
export const COMPLEMENT_RESULTS = {
  templates: [
    "C3: 120 mg/dL (Normal 90-180) | C4: 28 mg/dL (Normal 10-40) | CH50: 55 U/mL (Normal 30-75)",
    "C3: 135 mg/dL | C4: 32 mg/dL | CH50: 60 U/mL",
    "C3: 105 mg/dL | C4: 22 mg/dL | CH50: 45 U/mL",
  ],
  specialtyAdjustments: {
    'rheumatology': { c3: 'lower', c4: 'lower' },
    'nephrology': { c3: 'lower' },
  }
};

// 🩸 Immunoglobulins
export const IMMUNOGLOBULIN_RESULTS = {
  templates: [
    "IgG: 950 mg/dL (Normal 700-1600) | IgA: 200 mg/dL (Normal 70-400) | IgM: 120 mg/dL (Normal 40-230) | IgE: 45 IU/mL (Normal <100)",
    "IgG: 1100 mg/dL | IgA: 250 mg/dL | IgM: 100 mg/dL | IgE: 30 IU/mL",
    "IgG: 850 mg/dL | IgA: 180 mg/dL | IgM: 140 mg/dL | IgE: 55 IU/mL",
  ],
};

// ==================== TUMOR MARKERS ====================
// 🧬 PSA
export const PSA_RESULTS = {
  templates: [
    "PSA: 1.2 ng/mL (Normal <4.0 for age <70, <4.5 for age 70-79) | Free PSA: 28% (Normal >25%)",
    "PSA: 2.5 ng/mL | Free PSA: 30%",
    "PSA: 0.8 ng/mL | Free PSA: 35%",
  ],
};

// 🧬 CEA
export const CEA_RESULTS = {
  templates: [
    "CEA: 2.5 ng/mL (Normal <3.0 non-smokers, <5.0 smokers) | CA-19-9: 18 U/mL (Normal <37)",
    "CEA: 1.8 ng/mL | CA-19-9: 22 U/mL",
    "CEA: 3.2 ng/mL | CA-19-9: 15 U/mL",
  ],
};

// 🧬 CA-125
export const CA125_RESULTS = {
  templates: [
    "CA-125: 12 U/mL (Normal <35) | CEA: 1.5 ng/mL | AFP: 3.0 ng/mL (Normal <10)",
    "CA-125: 18 U/mL | CEA: 2.0 ng/mL | AFP: 2.5 ng/mL",
    "CA-125: 8 U/mL | CEA: 1.2 ng/mL | AFP: 4.0 ng/mL",
  ],
};

// ==================== DRUG LEVELS ====================
// 💊 Vancomycin
export const VANCOMYCIN_RESULTS = {
  templates: [
    "Vancomycin Trough: 12.5 µg/mL (Target 10-20) | Vancomycin Random: 22.0 µg/mL | Interpretation: Within therapeutic range.",
    "Vancomycin Trough: 15.0 µg/mL | Vancomycin Random: 28.0 µg/mL",
    "Vancomycin Trough: 10.0 µg/mL | Vancomycin Random: 18.0 µg/mL",
  ],
};

// 💊 Digoxin
export const DIGOXIN_RESULTS = {
  templates: [
    "Digoxin: 1.2 ng/mL (Therapeutic 0.8-2.0) | Potassium: 4.2 mmol/L | Creatinine: 1.0 mg/dL",
    "Digoxin: 0.9 ng/mL | Potassium: 4.0 mmol/L | Creatinine: 0.9 mg/dL",
    "Digoxin: 1.5 ng/mL | Potassium: 4.5 mmol/L | Creatinine: 1.1 mg/dL",
  ],
};

// 🎯 Updated mapping with all new tests
Object.assign(NORMAL_LAB_MAP, {
  'reticulocyte': RETICULOCYTE_RESULTS,
  'retic': RETICULOCYTE_RESULTS,
  'peripheral smear': PERIPHERAL_SMEAR_RESULTS,
  'blood smear': PERIPHERAL_SMEAR_RESULTS,
  'iron studies': IRON_STUDIES_RESULTS,
  'iron panel': IRON_STUDIES_RESULTS,
  'ferritin': IRON_STUDIES_RESULTS,
  'vitamin b12': B12_RESULTS,
  'b12': B12_RESULTS,
  'folate': FOLATE_RESULTS,
  'folic acid': FOLATE_RESULTS,
  'haptoglobin': HAPTOGLOBIN_RESULTS,
  'ldh': LDH_RESULTS,
  'lactate dehydrogenase': LDH_RESULTS,
  'hemoglobin electrophoresis': HEMOGLOBIN_EP_RESULTS,
  'hb electrophoresis': HEMOGLOBIN_EP_RESULTS,
  'd-dimer': DDIMER_RESULTS,
  'd dimer': DDIMER_RESULTS,
  'fibrinogen': FIBRINOGEN_RESULTS,
  'ck-mb': CKMB_RESULTS,
  'ck mb': CKMB_RESULTS,
  'bnp': BNP_RESULTS,
  'nt-probnp': BNP_RESULTS,
  'magnesium': MAGNESIUM_RESULTS,
  'mg': MAGNESIUM_RESULTS,
  'uric acid': URIC_ACID_RESULTS,
  'ammonia': AMMONIA_RESULTS,
  'lactate': LACTATE_RESULTS,
  'lft': LFT_RESULTS,
  'liver function': LFT_RESULTS,
  'liver panel': LFT_RESULTS,
  'tsh': TSH_RESULTS,
  'thyroid': TSH_RESULTS,
  'hba1c': HBA1C_RESULTS,
  'a1c': HBA1C_RESULTS,
  'hemoglobin a1c': HBA1C_RESULTS,
  'cortisol': CORTISOL_RESULTS,
  'vitamin d': VITAMIN_D_RESULTS,
  'vit d': VITAMIN_D_RESULTS,
  'blood culture': BLOOD_CULTURE_RESULTS,
  'blood cx': BLOOD_CULTURE_RESULTS,
  'urine culture': URINE_CULTURE_RESULTS,
  'urine cx': URINE_CULTURE_RESULTS,
  'crp': CRP_RESULTS,
  'esr': ESR_RESULTS,
  'procalcitonin': PROCALCITONIN_RESULTS,
  'hiv': HIV_RESULTS,
  'hepatitis panel': HEPATITIS_RESULTS,
  'hepatitis': HEPATITIS_RESULTS,
  'ana': ANA_RESULTS,
  'rheumatoid factor': RF_RESULTS,
  'rf': RF_RESULTS,
  'anti-ccp': RF_RESULTS,
  'anca': ANCA_RESULTS,
  'complement': COMPLEMENT_RESULTS,
  'c3 c4': COMPLEMENT_RESULTS,
  'immunoglobulins': IMMUNOGLOBULIN_RESULTS,
  'igg': IMMUNOGLOBULIN_RESULTS,
  'psa': PSA_RESULTS,
  'cea': CEA_RESULTS,
  'ca-125': CA125_RESULTS,
  'ca125': CA125_RESULTS,
  'vancomycin': VANCOMYCIN_RESULTS,
  'vanc trough': VANCOMYCIN_RESULTS,
  'digoxin': DIGOXIN_RESULTS,
});

// ==================== ENDOCRINE (CONTINUED) ====================
// 🦋 PTH
export const PTH_RESULTS = {
  templates: [
    "PTH: 35 pg/mL (Normal 10-65) | Calcium: 9.4 mg/dL | Phosphorus: 3.5 mg/dL | Vitamin D 25-OH: 35 ng/mL | Albumin: 4.2 g/dL",
    "PTH: 42 pg/mL | Calcium: 9.6 mg/dL | Phosphorus: 3.2 mg/dL | Vitamin D: 40 ng/mL",
    "PTH: 28 pg/mL | Calcium: 9.2 mg/dL | Phosphorus: 3.8 mg/dL | Vitamin D: 30 ng/mL",
  ],
};

// 🦋 Growth Hormone / IGF-1
export const GH_RESULTS = {
  templates: [
    "Growth Hormone (Random): 1.5 ng/mL (Normal <5) | IGF-1: 180 ng/mL (Normal 100-300 for age) | IGFBP-3: 3.5 mg/L (Normal 2.0-4.5)",
    "GH: 0.8 ng/mL | IGF-1: 220 ng/mL | IGFBP-3: 4.0 mg/L",
    "GH: 2.5 ng/mL | IGF-1: 150 ng/mL | IGFBP-3: 3.0 mg/L",
  ],
};

// 🦋 Prolactin
export const PROLACTIN_RESULTS = {
  templates: [
    "Prolactin: 12 ng/mL (Normal <25 females, <20 males) | TSH: 2.5 mIU/L | Free T4: 1.2 ng/dL",
    "Prolactin: 8 ng/mL | TSH: 1.8 mIU/L | Free T4: 1.4 ng/dL",
    "Prolactin: 18 ng/mL | TSH: 3.0 mIU/L | Free T4: 1.0 ng/dL",
  ],
};

// 🦋 FSH/LH
export const GONADOTROPIN_RESULTS = {
  templates: [
    "FSH: 8.5 mIU/mL (Normal follicular 3.5-12.5) | LH: 6.0 mIU/mL (Normal follicular 2.4-12.6) | Estradiol: 45 pg/mL (Normal follicular 12-166) | Progesterone: 0.5 ng/mL (Normal follicular <1.0)",
    "FSH: 5.0 mIU/mL | LH: 4.5 mIU/mL | Estradiol: 60 pg/mL | Progesterone: 0.3 ng/mL",
    "FSH: 12.0 mIU/mL (Postmenopausal range) | LH: 15.0 mIU/mL | Estradiol: <15 pg/mL",
  ],
};

// 🦋 Testosterone
export const TESTOSTERONE_RESULTS = {
  templates: [
    "Testosterone Total: 550 ng/dL (Normal 300-1000) | Free Testosterone: 12 ng/dL (Normal 5-21) | SHBG: 35 nmol/L (Normal 10-57) | Bioavailable T: 250 ng/dL",
    "Testosterone Total: 680 ng/dL | Free T: 15 ng/dL | SHBG: 30 nmol/L | Bioavailable T: 310 ng/dL",
    "Testosterone Total: 420 ng/dL | Free T: 9 ng/dL | SHBG: 42 nmol/L | Bioavailable T: 180 ng/dL",
  ],
};

// 🦋 Insulin / C-peptide
export const INSULIN_RESULTS = {
  templates: [
    "Fasting Insulin: 8.5 µIU/mL (Normal 2-20) | C-peptide: 2.0 ng/mL (Normal 0.8-3.1) | Glucose: 92 mg/dL | HOMA-IR: 1.9 (Normal <2.5)",
    "Fasting Insulin: 6.0 µIU/mL | C-peptide: 1.5 ng/mL | Glucose: 88 mg/dL | HOMA-IR: 1.3",
    "Fasting Insulin: 12.0 µIU/mL | C-peptide: 2.8 ng/mL | Glucose: 98 mg/dL | HOMA-IR: 2.8",
  ],
};

// 🦋 Renin / Aldosterone
export const RENIN_ALDOSTERONE_RESULTS = {
  templates: [
    "Plasma Renin Activity: 2.5 ng/mL/hr (Normal 1-4 supine) | Aldosterone: 12 ng/dL (Normal 3-16) | Aldosterone/Renin Ratio: 4.8 (Normal <20) | Potassium: 4.1 mmol/L",
    "PRA: 3.0 ng/mL/hr | Aldosterone: 10 ng/dL | ARR: 3.3 | Potassium: 4.3 mmol/L",
    "PRA: 1.8 ng/mL/hr | Aldosterone: 8 ng/dL | ARR: 4.4 | Potassium: 3.9 mmol/L",
  ],
};

// 🦋 Metanephrines
export const METANEPHRINES_RESULTS = {
  templates: [
    "Plasma Metanephrine: 25 pg/mL (Normal <90) | Normetanephrine: 80 pg/mL (Normal <180) | Total Metanephrines: 105 pg/mL",
    "Plasma Metanephrine: 35 pg/mL | Normetanephrine: 95 pg/mL | Total: 130 pg/mL",
    "24h Urine Metanephrine: 120 µg/24h (Normal <400) | 24h Urine Normetanephrine: 350 µg/24h (Normal <900)",
  ],
};

// ==================== INFECTIOUS DISEASE (CONTINUED) ====================
// 🦠 EBV
export const EBV_RESULTS = {
  templates: [
    "EBV VCA IgM: Negative | EBV VCA IgG: Positive (Past infection) | EBV EBNA IgG: Positive (Past infection >6 months) | EBV Early Antigen: Negative | Monospot: Negative",
    "EBV VCA IgM: Negative | VCA IgG: Negative (Susceptible - no prior infection) | EBNA IgG: Negative",
    "EBV VCA IgM: Negative | VCA IgG: Positive | EBNA IgG: Positive",
  ],
};

// 🦠 CMV
export const CMV_RESULTS = {
  templates: [
    "CMV IgM: Negative | CMV IgG: Positive (Past infection) | CMV PCR: Not detected",
    "CMV IgM: Negative | CMV IgG: Negative (Susceptible) | CMV PCR: Not detected",
    "CMV IgM: Negative | CMV IgG: Positive | CMV PCR: Not detected",
  ],
};

// 🦠 HSV / VZV
export const HSV_RESULTS = {
  templates: [
    "HSV-1 IgG: Positive | HSV-2 IgG: Negative | VZV IgG: Positive (Immune from past infection or vaccination) | HSV PCR: Not detected",
    "HSV-1 IgG: Negative | HSV-2 IgG: Negative | VZV IgG: Positive",
    "HSV-1 IgG: Positive | HSV-2 IgG: Positive | VZV IgG: Positive",
  ],
};

// 🦠 Toxoplasma
export const TOXOPLASMA_RESULTS = {
  templates: [
    "Toxoplasma IgG: Negative | Toxoplasma IgM: Negative (No evidence of past or recent infection)",
    "Toxoplasma IgG: Positive | Toxoplasma IgM: Negative (Past infection - immune)",
    "Toxoplasma IgG: Negative | Toxoplasma IgM: Negative",
  ],
};

// 🦠 Lyme
export const LYME_RESULTS = {
  templates: [
    "Lyme ELISA: Negative (<0.9) | Western Blot: Not indicated (ELISA negative) | Interpretation: No evidence of Borrelia burgdorferi infection.",
    "Lyme ELISA: Negative | Western Blot: N/A",
    "Lyme ELISA: Negative",
  ],
};

// 🦠 Quantiferon TB
export const TB_RESULTS = {
  templates: [
    "QuantiFERON-TB Gold Plus: Negative (TB Antigen-Nil: 0.05 IU/mL, Mitogen-Nil: >0.5 IU/mL). No evidence of M. tuberculosis infection.",
    "QuantiFERON-TB: Negative (TB Ag-Nil: 0.10 IU/mL)",
    "QuantiFERON-TB: Negative (TB Ag-Nil: 0.02 IU/mL)",
  ],
};

// 🦠 Syphilis
export const SYPHILIS_RESULTS = {
  templates: [
    "RPR: Non-Reactive | VDRL: Non-Reactive | TP-PA: Negative | Interpretation: No evidence of syphilis infection.",
    "RPR: Non-Reactive | TP-PA: Negative",
    "RPR: Non-Reactive",
  ],
};

// ==================== BIOCHEMISTRY ====================
// 🧪 Amylase / Lipase
export const AMYLASE_RESULTS = {
  templates: [
    "Amylase: 65 U/L (Normal 30-110) | Lipase: 35 U/L (Normal <160) | Interpretation: Normal pancreatic enzymes. No evidence of pancreatitis.",
    "Amylase: 55 U/L | Lipase: 28 U/L",
    "Amylase: 78 U/L | Lipase: 42 U/L",
  ],
};

// 🧪 Ceruloplasmin
export const CERULOPLASMIN_RESULTS = {
  templates: [
    "Ceruloplasmin: 28 mg/dL (Normal 20-40) | Serum Copper: 95 µg/dL (Normal 70-140) | 24h Urine Copper: 25 µg/24h (Normal <60)",
    "Ceruloplasmin: 32 mg/dL | Serum Copper: 105 µg/dL | 24h Urine Copper: 30 µg/24h",
    "Ceruloplasmin: 25 mg/dL | Serum Copper: 85 µg/dL | 24h Urine Copper: 20 µg/24h",
  ],
};

// 🧪 Alpha-1 Antitrypsin
export const A1AT_RESULTS = {
  templates: [
    "Alpha-1 Antitrypsin: 150 mg/dL (Normal 100-200) | Phenotype: PiMM (Normal) | Interpretation: Normal A1AT levels and phenotype.",
    "A1AT: 180 mg/dL | Phenotype: PiMM",
    "A1AT: 130 mg/dL | Phenotype: PiMM",
  ],
};

// ==================== TUMOR MARKERS ====================
// 🧬 CA-19-9
export const CA199_RESULTS = {
  templates: [
    "CA-19-9: 22 U/mL (Normal <37) | CEA: 2.5 ng/mL | Interpretation: Within normal limits.",
    "CA-19-9: 18 U/mL | CEA: 1.8 ng/mL",
    "CA-19-9: 30 U/mL | CEA: 3.0 ng/mL",
  ],
};

// 🧬 AFP
export const AFP_RESULTS = {
  templates: [
    "AFP: 3.5 ng/mL (Normal <10) | Beta-hCG: <2 mIU/mL (Normal <5) | LDH: 185 U/L",
    "AFP: 2.8 ng/mL | Beta-hCG: <2 mIU/mL",
    "AFP: 5.0 ng/mL | Beta-hCG: <2 mIU/mL",
  ],
};

// 🧬 Beta-hCG
export const BHCG_RESULTS = {
  templates: [
    "Beta-hCG: <2 mIU/mL (Normal <5) | AFP: 3.0 ng/mL (Normal <10) | Interpretation: Negative.",
    "Beta-hCG: <2 mIU/mL",
    "Beta-hCG: <2 mIU/mL | Qualitative: Negative",
  ],
};

// ==================== DRUG LEVELS ====================
// 💊 Lithium
export const LITHIUM_RESULTS = {
  templates: [
    "Lithium: 0.8 mmol/L (Therapeutic 0.6-1.2) | Creatinine: 1.0 mg/dL | TSH: 2.5 mIU/L | Interpretation: Within therapeutic range.",
    "Lithium: 0.6 mmol/L | Creatinine: 0.9 mg/dL | TSH: 3.0 mIU/L",
    "Lithium: 1.0 mmol/L | Creatinine: 1.1 mg/dL | TSH: 2.0 mIU/L",
  ],
};

// 💊 Valproate
export const VALPROATE_RESULTS = {
  templates: [
    "Valproate: 65 µg/mL (Therapeutic 50-100) | Ammonia: 25 µmol/L | AST: 28 U/L | ALT: 32 U/L | Platelets: 250,000 /µL",
    "Valproate: 75 µg/mL | Ammonia: 30 µmol/L | AST: 30 U/L | ALT: 35 U/L",
    "Valproate: 55 µg/mL | Ammonia: 20 µmol/L | AST: 25 U/L | ALT: 28 U/L",
  ],
};

// 💊 Phenytoin
export const PHENYTOIN_RESULTS = {
  templates: [
    "Phenytoin Total: 12 µg/mL (Therapeutic 10-20) | Free Phenytoin: 1.2 µg/mL (Therapeutic 1-2) | Albumin: 4.2 g/dL | Corrected Phenytoin: 14 µg/mL",
    "Phenytoin: 15 µg/mL | Free: 1.5 µg/mL | Albumin: 4.4 g/dL | Corrected: 16 µg/mL",
    "Phenytoin: 10 µg/mL | Free: 1.0 µg/mL | Albumin: 4.0 g/dL | Corrected: 12 µg/mL",
  ],
};

// 💊 Gentamicin
export const GENTAMICIN_RESULTS = {
  templates: [
    "Gentamicin Peak: 8.5 µg/mL (Therapeutic 5-12) | Gentamicin Trough: 0.8 µg/mL (Target <2) | Creatinine: 1.0 mg/dL | Interpretation: Within therapeutic range, no toxicity.",
    "Gentamicin Peak: 10.0 µg/mL | Trough: 1.2 µg/mL | Creatinine: 0.9 mg/dL",
    "Gentamicin Peak: 7.0 µg/mL | Trough: 0.5 µg/mL | Creatinine: 1.1 mg/dL",
  ],
};

// 💊 Cyclosporine
export const CYCLOSPORINE_RESULTS = {
  templates: [
    "Cyclosporine Trough (C0): 180 ng/mL (Target 100-300) | Cyclosporine C2: 800 ng/mL (Target 600-1000) | Creatinine: 1.2 mg/dL",
    "Cyclosporine Trough: 220 ng/mL | C2: 900 ng/mL | Creatinine: 1.1 mg/dL",
    "Cyclosporine Trough: 150 ng/mL | C2: 700 ng/mL | Creatinine: 1.3 mg/dL",
  ],
};

// 💊 Tacrolimus
export const TACROLIMUS_RESULTS = {
  templates: [
    "Tacrolimus Trough: 8.5 ng/mL (Target 5-15) | Creatinine: 1.1 mg/dL | Magnesium: 1.8 mg/dL | Glucose: 95 mg/dL",
    "Tacrolimus Trough: 10.0 ng/mL | Creatinine: 1.0 mg/dL | Magnesium: 2.0 mg/dL | Glucose: 100 mg/dL",
    "Tacrolimus Trough: 6.5 ng/mL | Creatinine: 1.2 mg/dL | Magnesium: 1.7 mg/dL | Glucose: 90 mg/dL",
  ],
};

// ==================== TOXICOLOGY ====================
// 🧪 Toxicology Screen
export const TOXICOLOGY_RESULTS = {
  templates: [
    "Urine Toxicology Screen: Negative for Amphetamines, Barbiturates, Benzodiazepines, Cocaine, Methadone, Opiates, PCP, THC. Ethanol: <10 mg/dL.",
    "Urine Toxicology: Negative (all panels).",
    "Serum Toxicology: Acetaminophen <5 µg/mL, Salicylate <5 mg/dL, Ethanol <10 mg/dL. All negative.",
  ],
};

// 🧪 Acetaminophen
export const ACETAMINOPHEN_RESULTS = {
  templates: [
    "Acetaminophen: <5 µg/mL (Therapeutic 10-25, Toxic >150 at 4h post-ingestion) | AST: 28 U/L | ALT: 32 U/L",
    "Acetaminophen: <5 µg/mL | AST: 25 U/L | ALT: 30 U/L",
    "Acetaminophen: <5 µg/mL",
  ],
};

// 🧪 Salicylate
export const SALICYLATE_RESULTS = {
  templates: [
    "Salicylate: <5 mg/dL (Therapeutic 10-30, Toxic >30) | ABG: pH 7.40, HCO3 24",
    "Salicylate: <5 mg/dL",
    "Salicylate: <5 mg/dL | ABG: pH 7.39, HCO3 23",
  ],
};

// 🧪 Ethanol
export const ETHANOL_RESULTS = {
  templates: [
    "Ethanol: <10 mg/dL (Normal 0, Legal limit <80 for driving) | Osmolality: 285 mOsm/kg | Osmolal Gap: 2",
    "Ethanol: <10 mg/dL",
    "Ethanol: <10 mg/dL | Osmolal Gap: Normal",
  ],
};

// ==================== FLUID ANALYSIS ====================
// 🧪 CSF Analysis
export const CSF_RESULTS = {
  templates: [
    "CSF Appearance: Clear, Colorless | Opening Pressure: 15 cmH2O (Normal <20) | WBC: 0 cells/µL (Normal <5) | RBC: 0 cells/µL | Glucose: 60 mg/dL (Normal 50-80) | Protein: 35 mg/dL (Normal 15-45) | Gram Stain: No organisms | Culture: No growth",
    "CSF: Clear, Opening 14 cmH2O, WBC 1, RBC 0, Glucose 65, Protein 30, No organisms.",
    "CSF: Clear, Opening 18 cmH2O, WBC 2, RBC 0, Glucose 55, Protein 40, Culture negative.",
  ],
};

// 🧪 Synovial Fluid
export const SYNOVIAL_RESULTS = {
  templates: [
    "Synovial Fluid: Color: Straw, Clear | WBC: 150 cells/µL (Normal <200) | Neutrophils: 25% (Normal <50%) | Glucose: Similar to serum | Protein: 2.0 g/dL | Gram Stain: No organisms | Crystals: None seen | Culture: No growth",
    "Synovial Fluid: Clear, WBC 100, PMN 20%, No crystals, Culture negative.",
    "Synovial Fluid: Straw, WBC 180, PMN 30%, No organisms.",
  ],
};

// 🧪 Ascitic Fluid
export const ASCITIC_RESULTS = {
  templates: [
    "Ascitic Fluid: Color: Straw, Clear | WBC: 150 cells/µL (Normal <500) | Neutrophils: 30% | SAAG: 1.2 (Portal hypertension >1.1) | Total Protein: 2.5 g/dL | Albumin: 1.5 g/dL | Gram Stain: No organisms | Culture: No growth | Cytology: Negative for malignant cells",
    "Ascitic Fluid: Straw, WBC 200, PMN 25%, SAAG 1.5, Culture negative.",
    "Ascitic Fluid: Clear, WBC 100, PMN 15%, SAAG 1.0, No organisms.",
  ],
};

// 🧪 Pleural Fluid
export const PLEURAL_RESULTS = {
  templates: [
    "Pleural Fluid: Color: Straw, Clear | WBC: 250 cells/µL | Neutrophils: 20% | Lymphocytes: 70% | Protein: 3.0 g/dL (Serum 7.0) | LDH: 150 U/L (Serum 350) | Glucose: 90 mg/dL | pH: 7.45 | Gram Stain: No organisms | Culture: No growth | Cytology: Negative",
    "Pleural Fluid: Straw, WBC 200, Lymphocytic predominant, Exudate by Light criteria, Culture negative.",
    "Pleural Fluid: Clear, WBC 180, Transudate, No organisms.",
  ],
};

// ==================== STOOL STUDIES ====================
// 💩 Stool Studies
export const STOOL_RESULTS = {
  templates: [
    "Stool Culture: No Salmonella, Shigella, Campylobacter, or E. coli O157:H7 isolated. | Ova & Parasites: No ova or parasites seen. | C. difficile Toxin: Negative. | Fecal Leukocytes: Negative.",
    "Stool Cx: Negative. O&P: Negative. C. diff: Negative.",
    "Stool: Normal flora. No pathogens. Fecal WBC: Negative.",
  ],
};

// 🎯 Final mapping update
Object.assign(NORMAL_LAB_MAP, {
  'pth': PTH_RESULTS,
  'parathyroid': PTH_RESULTS,
  'growth hormone': GH_RESULTS,
  'igf-1': GH_RESULTS,
  'igf1': GH_RESULTS,
  'prolactin': PROLACTIN_RESULTS,
  'fsh': GONADOTROPIN_RESULTS,
  'lh': GONADOTROPIN_RESULTS,
  'estradiol': GONADOTROPIN_RESULTS,
  'progesterone': GONADOTROPIN_RESULTS,
  'testosterone': TESTOSTERONE_RESULTS,
  'free testosterone': TESTOSTERONE_RESULTS,
  'insulin': INSULIN_RESULTS,
  'c-peptide': INSULIN_RESULTS,
  'c peptide': INSULIN_RESULTS,
  'renin': RENIN_ALDOSTERONE_RESULTS,
  'aldosterone': RENIN_ALDOSTERONE_RESULTS,
  'metanephrines': METANEPHRINES_RESULTS,
  'catecholamines': METANEPHRINES_RESULTS,
  'ebv': EBV_RESULTS,
  'cmv': CMV_RESULTS,
  'cytomegalovirus': CMV_RESULTS,
  'hsv': HSV_RESULTS,
  'herpes': HSV_RESULTS,
  'vzv': HSV_RESULTS,
  'varicella': HSV_RESULTS,
  'toxoplasma': TOXOPLASMA_RESULTS,
  'toxo': TOXOPLASMA_RESULTS,
  'lyme': LYME_RESULTS,
  'borrelia': LYME_RESULTS,
  'quantiferon': TB_RESULTS,
  'tb test': TB_RESULTS,
  'tuberculosis': TB_RESULTS,
  'rpr': SYPHILIS_RESULTS,
  'vdrl': SYPHILIS_RESULTS,
  'syphilis': SYPHILIS_RESULTS,
  'amylase': AMYLASE_RESULTS,
  'lipase': AMYLASE_RESULTS,
  'pancreatic enzymes': AMYLASE_RESULTS,
  'ceruloplasmin': CERULOPLASMIN_RESULTS,
  'copper': CERULOPLASMIN_RESULTS,
  'alpha-1 antitrypsin': A1AT_RESULTS,
  'a1at': A1AT_RESULTS,
  'ca-19-9': CA199_RESULTS,
  'ca199': CA199_RESULTS,
  'ca 19-9': CA199_RESULTS,
  'afp': AFP_RESULTS,
  'alpha fetoprotein': AFP_RESULTS,
  'beta-hcg': BHCG_RESULTS,
  'beta hcg': BHCG_RESULTS,
  'bhcg': BHCG_RESULTS,
  'lithium': LITHIUM_RESULTS,
  'valproate': VALPROATE_RESULTS,
  'valproic acid': VALPROATE_RESULTS,
  'phenytoin': PHENYTOIN_RESULTS,
  'dilantin': PHENYTOIN_RESULTS,
  'gentamicin': GENTAMICIN_RESULTS,
  'cyclosporine': CYCLOSPORINE_RESULTS,
  'tacrolimus': TACROLIMUS_RESULTS,
  'fk506': TACROLIMUS_RESULTS,
  'toxicology': TOXICOLOGY_RESULTS,
  'tox screen': TOXICOLOGY_RESULTS,
  'drug screen': TOXICOLOGY_RESULTS,
  'acetaminophen': ACETAMINOPHEN_RESULTS,
  'paracetamol': ACETAMINOPHEN_RESULTS,
  'salicylate': SALICYLATE_RESULTS,
  'aspirin level': SALICYLATE_RESULTS,
  'ethanol': ETHANOL_RESULTS,
  'alcohol level': ETHANOL_RESULTS,
  'csf': CSF_RESULTS,
  'cerebrospinal fluid': CSF_RESULTS,
  'lumbar puncture': CSF_RESULTS,
  'synovial fluid': SYNOVIAL_RESULTS,
  'joint fluid': SYNOVIAL_RESULTS,
  'arthrocentesis': SYNOVIAL_RESULTS,
  'ascitic fluid': ASCITIC_RESULTS,
  'paracentesis': ASCITIC_RESULTS,
  'pleural fluid': PLEURAL_RESULTS,
  'thoracentesis': PLEURAL_RESULTS,
  'stool': STOOL_RESULTS,
  'stool culture': STOOL_RESULTS,
  'ova parasites': STOOL_RESULTS,
  'c diff': STOOL_RESULTS,
});

// ==================== MICROBIOLOGY (CONTINUED) ====================
// 🦠 Sputum Culture
export const SPUTUM_CULTURE_RESULTS = {
  templates: [
    "Sputum Culture: Normal oropharyngeal flora. No predominant pathogens. Gram Stain: Few epithelial cells, moderate WBCs, mixed organisms.",
    "Sputum Culture: Normal respiratory flora. No MRSA, Pseudomonas, or other nosocomial pathogens.",
    "Sputum Culture: Mixed oropharyngeal flora. No acid-fast bacilli on smear.",
  ],
};

// 🦠 Wound Culture
export const WOUND_CULTURE_RESULTS = {
  templates: [
    "Wound Culture: No growth. Gram Stain: Few WBCs, no organisms seen.",
    "Wound Culture: Skin flora (Coagulase-negative Staphylococcus). Likely contaminant.",
    "Wound Culture: No growth at 48 hours.",
  ],
};

// 🦠 Throat Culture
export const THROAT_CULTURE_RESULTS = {
  templates: [
    "Throat Culture: Normal oropharyngeal flora. Group A Streptococcus: Negative. Rapid Strep: Negative.",
    "Throat Culture: No Group A Streptococcus isolated. Normal flora present.",
    "Throat Culture: Negative for Group A Streptococcus. Negative for Corynebacterium diphtheriae.",
  ],
};

// 🦠 CSF Culture
export const CSF_CULTURE_RESULTS = {
  templates: [
    "CSF Culture: No growth at 5 days. Bacterial antigens: Negative. HSV PCR: Not detected. Enterovirus PCR: Not detected.",
    "CSF Culture: No organisms isolated. Gram stain negative. Cryptococcal antigen negative.",
    "CSF Culture: Sterile. No evidence of bacterial, fungal, or mycobacterial infection.",
  ],
};

// 🦠 Fungal Culture
export const FUNGAL_CULTURE_RESULTS = {
  templates: [
    "Fungal Culture: No growth at 28 days. KOH prep: Negative. Fungal elements not seen.",
    "Fungal Culture: No dermatophytes or systemic fungi isolated.",
    "Fungal Culture: Negative for Candida, Aspergillus, Cryptococcus, and dimorphic fungi.",
  ],
};

// 🦠 AFB Culture
export const AFB_CULTURE_RESULTS = {
  templates: [
    "AFB Smear: Negative (No acid-fast bacilli seen). AFB Culture: No growth at 8 weeks. PCR for M. tuberculosis: Not detected.",
    "AFB Smear: Negative. AFB Culture: No mycobacterial growth. NTM screen negative.",
    "AFB Smear: Negative. GeneXpert MTB/RIF: Not detected.",
  ],
};

// 🦠 Malaria Smear
export const MALARIA_RESULTS = {
  templates: [
    "Malaria Smear (Thick and Thin): No parasites seen. Malaria RDT (HRP2/pLDH): Negative. Repeat smears q12h ×3: All negative.",
    "Malaria Smear: Negative for Plasmodium species. No gametocytes or trophozoites seen.",
    "Malaria Smear: Negative ×3. RDT negative.",
  ],
};

// ==================== VIROLOGY ====================
// 🦠 Hepatitis B Panel (Detailed)
export const HEPB_DETAILED_RESULTS = {
  templates: [
    "HBsAg: Negative | HBsAb: Positive (Immune) | HBcAb (Total): Positive (Past infection, now immune) | HBcAb IgM: Negative | HBeAg: Negative | HBeAb: Positive | HBV DNA: Not detected",
    "HBsAg: Negative | HBsAb: Positive (>100 mIU/mL - Immune from vaccination) | HBcAb: Negative",
    "HBsAg: Negative | HBsAb: Negative (Not immune) | HBcAb: Negative",
  ],
};

// 🦠 Hepatitis C Detailed
export const HEPC_DETAILED_RESULTS = {
  templates: [
    "HCV Antibody: Negative | HCV RNA PCR: Not detected | Interpretation: No evidence of hepatitis C infection.",
    "HCV Ab: Negative | HCV RNA: Not detected | Genotype: N/A",
    "HCV Ab: Negative | RIBA: Negative",
  ],
};

// 🦠 HIV Detailed
export const HIV_DETAILED_RESULTS = {
  templates: [
    "HIV-1/2 Ag/Ab (4th Gen): Non-Reactive | HIV-1 RNA PCR: Not detected (<20 copies/mL) | CD4 Count: 850 cells/µL (Normal 500-1500) | CD4/CD8 Ratio: 1.8 (Normal 1.0-4.0)",
    "HIV-1/2 Ab: Negative | HIV-1 RNA: Not detected | CD4: 920 cells/µL | CD4/CD8: 2.0",
    "HIV-1/2 Ab: Negative | HIV-1 RNA: Not detected",
  ],
};

// 🦠 COVID-19
export const COVID_RESULTS = {
  templates: [
    "SARS-CoV-2 PCR: Not detected. SARS-CoV-2 Antigen: Negative. Interpretation: No evidence of COVID-19 infection.",
    "COVID-19 PCR: Negative. Influenza A/B PCR: Negative. RSV PCR: Negative.",
    "SARS-CoV-2 PCR: Not detected. Ct value: N/A.",
  ],
};

// 🦠 Influenza Panel
export const INFLUENZA_RESULTS = {
  templates: [
    "Influenza A PCR: Not detected | Influenza B PCR: Not detected | RSV PCR: Not detected | Parainfluenza PCR: Not detected | Adenovirus PCR: Not detected | Human Metapneumovirus: Not detected",
    "Respiratory Viral Panel: All negative (Influenza A/B, RSV, Parainfluenza 1-4, Adenovirus, hMPV, Rhinovirus/Enterovirus, Coronavirus NL63/OC43/229E/HKU1).",
    "Flu A/B Rapid Antigen: Negative. RSV Rapid: Negative.",
  ],
};

// 🦠 STD Panel
export const STD_RESULTS = {
  templates: [
    "Chlamydia trachomatis PCR: Not detected | Neisseria gonorrhoeae PCR: Not detected | Trichomonas vaginalis: Not detected | Mycoplasma genitalium: Not detected",
    "CT/NG PCR: Negative | Trichomonas: Negative | HIV: Non-Reactive | RPR: Non-Reactive",
    "STD Panel: All negative. GC/Chlamydia/Trichomonas negative.",
  ],
};

// ==================== AUTOIMMUNE ====================
// 🩸 Anti-dsDNA
export const ANTIDSDNA_RESULTS = {
  templates: [
    "Anti-dsDNA: <10 IU/mL (Normal <30) | Anti-Smith: Negative | Anti-RNP: Negative | Anti-Ro/SSA: Negative | Anti-La/SSB: Negative",
    "Anti-dsDNA: <10 IU/mL | ENA Panel: All negative (Sm, RNP, Ro, La, Scl-70, Jo-1).",
    "Anti-dsDNA: <10 IU/mL | Crithidia luciliae: Negative",
  ],
};

// 🩸 ENA Panel
export const ENA_RESULTS = {
  templates: [
    "ENA Panel: Anti-Sm: Negative | Anti-RNP: Negative | Anti-Ro/SSA: Negative | Anti-La/SSB: Negative | Anti-Scl-70: Negative | Anti-Jo-1: Negative | Anti-Centromere: Negative",
    "ENA Panel: All antibodies negative.",
    "ENA Panel: No extractable nuclear antigens detected.",
  ],
};

// 🩸 Anti-GBM
export const ANTIGBM_RESULTS = {
  templates: [
    "Anti-Glomerular Basement Membrane Antibody: <5 U/mL (Normal <20) | p-ANCA (MPO): Negative | c-ANCA (PR3): Negative",
    "Anti-GBM: <5 U/mL | ANCA: Negative",
    "Anti-GBM: Negative. No evidence of Goodpasture syndrome.",
  ],
};

// 🩸 Cryoglobulins
export const CRYOGLOBULIN_RESULTS = {
  templates: [
    "Cryoglobulins: Negative (No precipitate after 72h at 4°C). Cryocrit: 0%. Rheumatoid Factor: <10 IU/mL. Complement C4: 28 mg/dL.",
    "Cryoglobulins: None detected. Cryocrit: 0%.",
    "Cryoglobulins: Negative. No cryoprecipitate detected.",
  ],
};

// 🩸 SPEP / Immunofixation
export const SPEP_RESULTS = {
  templates: [
    "Serum Protein Electrophoresis: Normal pattern. No M-protein detected. Albumin: 4.2 g/dL. Alpha-1: 0.3 g/dL. Alpha-2: 0.6 g/dL. Beta: 0.9 g/dL. Gamma: 1.2 g/dL. Immunofixation: No monoclonal protein detected.",
    "SPEP: Normal pattern. No paraprotein detected. Immunofixation: Polyclonal pattern. No monoclonal bands.",
    "SPEP: Normal. No M-spike. Total Protein: 7.0 g/dL. Albumin/Globulin ratio: 1.5 (Normal).",
  ],
};

// 🩸 Serum Free Light Chains
export const SFLC_RESULTS = {
  templates: [
    "Kappa Free Light Chain: 15 mg/L (Normal 3.3-19.4) | Lambda Free Light Chain: 12 mg/L (Normal 5.7-26.3) | Kappa/Lambda Ratio: 1.25 (Normal 0.26-1.65)",
    "Kappa FLC: 18 mg/L | Lambda FLC: 14 mg/L | K/L Ratio: 1.28",
    "Kappa FLC: 10 mg/L | Lambda FLC: 8 mg/L | K/L Ratio: 1.25",
  ],
};

// ==================== CARDIAC MARKERS ====================
// 🫀 NT-proBNP
export const NTPROBNP_RESULTS = {
  templates: [
    "NT-proBNP: 85 pg/mL (Normal <125 for age <75, <450 for age >75) | BNP: 35 pg/mL | Troponin I: <0.01 ng/mL",
    "NT-proBNP: 95 pg/mL | BNP: 40 pg/mL | Troponin: <0.02 ng/mL",
    "NT-proBNP: 70 pg/mL | BNP: 28 pg/mL | Troponin: <0.01 ng/mL",
  ],
};

// 🫀 Myoglobin
export const MYOGLOBIN_RESULTS = {
  templates: [
    "Myoglobin: 45 ng/mL (Normal <90) | CK: 120 U/L | CK-MB: 2.5 ng/mL | Troponin I: <0.01 ng/mL",
    "Myoglobin: 55 ng/mL | CK: 145 U/L | CK-MB: 3.0 ng/mL | Troponin: <0.02 ng/mL",
    "Myoglobin: 35 ng/mL | CK: 95 U/L | CK-MB: 1.8 ng/mL | Troponin: <0.01 ng/mL",
  ],
};

// 🫀 Homocysteine
export const HOMOCYSTEINE_RESULTS = {
  templates: [
    "Homocysteine: 9.0 µmol/L (Normal <15) | Vitamin B12: 450 pg/mL | Folate: 12 ng/mL | Methylmalonic Acid: 0.2 µmol/L",
    "Homocysteine: 7.5 µmol/L | B12: 520 pg/mL | Folate: 15 ng/mL | MMA: 0.15 µmol/L",
    "Homocysteine: 11.0 µmol/L | B12: 380 pg/mL | Folate: 9 ng/mL | MMA: 0.25 µmol/L",
  ],
};

// 🫀 Lipoprotein (a)
export const LIPOPROTEIN_A_RESULTS = {
  templates: [
    "Lipoprotein (a): 15 mg/dL (Normal <30) | LDL: 110 mg/dL | HDL: 48 mg/dL | Triglycerides: 130 mg/dL",
    "Lp(a): 22 mg/dL | LDL: 120 mg/dL | HDL: 42 mg/dL | TG: 150 mg/dL",
    "Lp(a): 8 mg/dL | LDL: 100 mg/dL | HDL: 55 mg/dL | TG: 110 mg/dL",
  ],
};

// ==================== URINE STUDIES ====================
// 🔬 24h Urine Protein
export const URINE_24H_RESULTS = {
  templates: [
    "24h Urine Volume: 1,500 mL | Total Protein: 120 mg/24h (Normal <150) | Creatinine Clearance: 105 mL/min (Normal 90-140) | Urine Creatinine: 1,200 mg/24h",
    "24h Urine: Volume 1,800 mL, Protein 100 mg/24h, CrCl 110 mL/min",
    "24h Urine: Volume 1,400 mL, Protein 90 mg/24h, CrCl 98 mL/min",
  ],
};

// 🔬 Urine Electrolytes
export const URINE_ELECTROLYTES_RESULTS = {
  templates: [
    "Urine Sodium: 65 mEq/L | Urine Potassium: 35 mEq/L | Urine Chloride: 70 mEq/L | Urine Osmolality: 450 mOsm/kg | FENa: 0.8% (Normal <1%)",
    "Urine Na: 80 mEq/L | Urine K: 40 mEq/L | Urine Cl: 75 mEq/L | Urine Osm: 500 mOsm/kg | FENa: 1.2%",
    "Urine Na: 45 mEq/L | Urine K: 30 mEq/L | Urine Cl: 55 mEq/L | Urine Osm: 380 mOsm/kg | FENa: 0.5%",
  ],
};

// 🔬 Urine Calcium
export const URINE_CALCIUM_RESULTS = {
  templates: [
    "24h Urine Calcium: 180 mg/24h (Normal 100-300) | Urine Calcium/Creatinine Ratio: 0.15 (Normal <0.20) | Serum Calcium: 9.4 mg/dL | PTH: 35 pg/mL",
    "24h Urine Ca: 220 mg/24h | Ca/Cr Ratio: 0.18 | Serum Ca: 9.6 mg/dL",
    "24h Urine Ca: 150 mg/24h | Ca/Cr Ratio: 0.12 | Serum Ca: 9.2 mg/dL",
  ],
};

// 🔬 Urine Porphyrins
export const PORPHYRIN_RESULTS = {
  templates: [
    "Urine Porphobilinogen: Negative | Urine Delta-ALA: 3.5 mg/24h (Normal <7) | Urine Porphyrins: Normal pattern | Fecal Porphyrins: Normal",
    "Urine PBG: Negative | ALA: 4.0 mg/24h | Porphyrins: Within normal limits.",
    "Urine PBG: Negative. No evidence of acute porphyria.",
  ],
};

// 🔬 Urine Metanephrines (Detailed)
export const URINE_METANEPHRINES_RESULTS = {
  templates: [
    "24h Urine Metanephrine: 180 µg/24h (Normal <400) | 24h Urine Normetanephrine: 420 µg/24h (Normal <900) | Total Metanephrines: 600 µg/24h | VMA: 6.5 mg/24h (Normal <8)",
    "24h Urine MN: 250 µg/24h | NMN: 550 µg/24h | Total: 800 µg/24h",
    "24h Urine MN: 120 µg/24h | NMN: 320 µg/24h | Total: 440 µg/24h",
  ],
};

// ==================== IMAGING (CONTINUED) ====================
// 🩻 Abdominal X-Ray (KUB)
export const KUB_RESULTS = {
  templates: [
    "KUB: Normal bowel gas pattern. No dilated loops of small or large bowel. No free intraperitoneal air. No calcifications or masses. Normal renal and psoas shadows. Bones: No acute findings.",
    "KUB: Unremarkable. Normal gas distribution. No obstruction. No free air.",
    "KUB: Normal bowel gas pattern. No evidence of obstruction, perforation, or renal calculi.",
  ],
};

// 🩻 Spine X-Ray
export const SPINE_XR_RESULTS = {
  templates: [
    "Cervical/TL Spine XR: Normal vertebral alignment. No fracture or subluxation. Disc spaces preserved. No prevertebral soft tissue swelling. Normal bone density.",
    "Spine XR: Normal alignment. No acute fracture. No lytic or blastic lesions.",
    "Spine XR: Straightening of normal lordosis (may be positional). No fracture or malalignment.",
  ],
};

// 🩻 Extremity X-Ray
export const EXTREMITY_XR_RESULTS = {
  templates: [
    "Extremity XR: Normal alignment. No fracture or dislocation. Joint spaces preserved. Soft tissues unremarkable. No foreign body.",
    "XR: Normal osseous structures. No acute fracture. No joint effusion. Normal soft tissues.",
    "XR: No fracture seen. Normal bone density and alignment. Soft tissues within normal limits.",
  ],
};

// 🩻 Mammogram
export const MAMMOGRAM_RESULTS = {
  templates: [
    "Mammogram (Bilateral): BI-RADS 1 - Negative. No masses, calcifications, or architectural distortion. Breast tissue heterogeneously dense.",
    "Mammogram: BI-RADS 2 - Benign findings. Scattered fibroglandular densities. No suspicious lesions.",
    "Mammogram: BI-RADS 1 - Normal. Fatty replaced breasts. No evidence of malignancy.",
  ],
};

// 🩻 CT Head
export const CT_HEAD_RESULTS = {
  templates: [
    "CT Head (Non-Contrast): Normal. No intracranial hemorrhage, mass effect, or midline shift. Ventricles normal size. Gray-white differentiation preserved. No acute infarction. Calvarium intact.",
    "CT Head: Unremarkable. No acute intracranial abnormality. Normal ventricular system. No extra-axial collections.",
    "CT Head: No acute hemorrhage or territorial infarction. Sulci and ventricles appropriate for age. No mass.",
  ],
};

// 🩻 CT Chest
export const CT_CHEST_RESULTS = {
  templates: [
    "CT Chest (With Contrast): Normal. Lungs clear without infiltrates, nodules, or masses. No pleural effusion or pneumothorax. Mediastinum normal. No lymphadenopathy. Heart normal size. Great vessels normal. No pulmonary embolism (PE protocol).",
    "CT Chest: No acute cardiopulmonary findings. No PE. Lungs clear. Mediastinum unremarkable.",
    "CT Chest: Normal chest CT. No evidence of PE, pneumonia, or malignancy.",
  ],
};

// 🩻 CT Abdomen/Pelvis
export const CT_ABDOMEN_RESULTS = {
  templates: [
    "CT Abdomen/Pelvis (With Contrast): Normal. Liver, spleen, pancreas, adrenals, and kidneys unremarkable. No masses, lymphadenopathy, or ascites. Bowel normal caliber without obstruction. Bladder normal. No free fluid or free air. Bones unremarkable.",
    "CT Abdomen: Unremarkable. Solid organs normal. No evidence of obstruction, inflammation, or malignancy.",
    "CT A/P: Normal exam. No acute intra-abdominal or pelvic pathology.",
  ],
};

// 🩻 CTA Head/Neck
export const CTA_HEAD_NECK_RESULTS = {
  templates: [
    "CTA Head and Neck: Normal. No hemodynamically significant stenosis (>50%) of carotid or vertebral arteries. No aneurysm or vascular malformation. No dissection. Intracranial circulation patent.",
    "CTA Head/Neck: No significant stenosis. Carotid bifurcations patent. No aneurysm or AVM.",
    "CTA Head/Neck: Normal. No large vessel occlusion. No significant atherosclerotic disease.",
  ],
};

// 🩻 MRI Brain
export const MRI_BRAIN_RESULTS = {
  templates: [
    "MRI Brain (With and Without Contrast): Normal. No mass, hemorrhage, or infarction. Normal ventricular system. No abnormal enhancement. No demyelinating lesions. No evidence of acute ischemia on DWI. Normal MRA.",
    "MRI Brain: Unremarkable. Normal brain parenchyma. No pathologic enhancement. MRA normal.",
    "MRI Brain: Normal exam. No acute or chronic intracranial abnormality.",
  ],
};

// 🩻 MRI Spine
export const MRI_SPINE_RESULTS = {
  templates: [
    "MRI Spine: Normal vertebral alignment and marrow signal. No disc herniation, spinal stenosis, or neural foraminal narrowing. Cord normal signal and caliber. No cord compression or syrinx.",
    "MRI Spine: Normal. No compressive lesion. Conus medullaris at normal level.",
    "MRI Spine: Degenerative changes appropriate for age. No significant stenosis or nerve root compression.",
  ],
};

// 🩻 MRI Joint
export const MRI_JOINT_RESULTS = {
  templates: [
    "MRI Joint: Normal. No tear of ligaments, menisci, or labrum. Articular cartilage intact. No joint effusion. Bone marrow signal normal. No fracture or avascular necrosis.",
    "MRI Joint: Unremarkable. No internal derangement. Normal marrow signal.",
    "MRI Joint: Normal study. No evidence of ligamentous or chondral injury.",
  ],
};

// 🩻 Ultrasound - Abdominal
export const US_ABDOMEN_RESULTS = {
  templates: [
    "Ultrasound Abdomen: Normal. Liver normal size and echotexture. No intrahepatic or extrahepatic biliary dilation. Gallbladder normal, no stones or wall thickening. CBD 4mm. Pancreas visualized, normal. Kidneys normal size, no hydronephrosis or stones. Spleen normal. No ascites.",
    "US Abdomen: Unremarkable. Normal solid organs. No gallstones. No hydronephrosis.",
    "US Abdomen: Normal study. Limited by bowel gas. Visualized structures unremarkable.",
  ],
};

// 🩻 Ultrasound - Pelvis
export const US_PELVIS_RESULTS = {
  templates: [
    "Ultrasound Pelvis: Normal. Uterus normal size and echotexture. Endometrial stripe normal thickness. Ovaries normal size and morphology, no cysts or masses. No free fluid in cul-de-sac.",
    "US Pelvis: Unremarkable. Normal pelvic anatomy. No adnexal masses.",
    "US Pelvis: Normal transvaginal exam. No abnormalities detected.",
  ],
};

// 🩻 Ultrasound - Thyroid
export const US_THYROID_RESULTS = {
  templates: [
    "Ultrasound Thyroid: Normal. Thyroid gland normal size (Right lobe 4.5cm, Left lobe 4.2cm, Isthmus 3mm). Homogeneous echotexture. No nodules or cysts. Normal vascularity on Doppler. No cervical lymphadenopathy.",
    "US Thyroid: Normal size and appearance. No nodules. TI-RADS: N/A.",
    "US Thyroid: Unremarkable. No focal lesions. Normal blood flow.",
  ],
};

// 🩻 Ultrasound - Breast
export const US_BREAST_RESULTS = {
  templates: [
    "Ultrasound Breast: Normal. No masses, cysts, or architectural distortion. Normal ducts. No axillary lymphadenopathy. BI-RADS 1 - Negative.",
    "US Breast: Normal fibroglandular tissue. No suspicious findings. BI-RADS 1.",
    "US Breast: Unremarkable. Simple cyst 3mm (BI-RADS 2 - Benign). Otherwise normal.",
  ],
};

// 🩻 Ultrasound - Scrotal
export const US_SCROTAL_RESULTS = {
  templates: [
    "Ultrasound Scrotum: Normal. Both testes normal size, echotexture, and vascularity. Epididymis normal. No hydrocele, varicocele, or mass. No evidence of torsion (normal Doppler flow).",
    "US Scrotum: Normal. Bilateral testes unremarkable. Normal Doppler waveforms.",
    "US Scrotum: Unremarkable. Small left varicocele (<3mm) - clinically insignificant. Otherwise normal.",
  ],
};

// 🩻 Venous Doppler (DVT Study)
export const VENOUS_DOPPLER_RESULTS = {
  templates: [
    "Venous Doppler (Lower Extremity, Bilateral): Normal. No deep venous thrombosis. Veins fully compressible with normal phasic flow and augmentation. No superficial thrombophlebitis.",
    "Venous Doppler: Negative for DVT. Normal compressibility and flow. No evidence of acute or chronic thrombosis.",
    "Venous Doppler: Normal study. No DVT. Normal venous waveforms.",
  ],
};

// 🩻 Carotid Doppler
export const CAROTID_DOPPLER_RESULTS = {
  templates: [
    "Carotid Duplex (Bilateral): Normal. No hemodynamically significant stenosis. ICA PSV: Right 80 cm/s, Left 75 cm/s (Normal <125). ICA/CCA ratio: Right 1.2, Left 1.1 (Normal <2.0). Plaque: None. Intima-media thickness: Normal (<0.9mm).",
    "Carotid Doppler: No significant stenosis. Minimal plaque (<20%) in right carotid bulb - not flow-limiting.",
    "Carotid Doppler: Normal velocities. No stenosis. Normal IMT.",
  ],
};

// 🩻 FAST Exam
export const FAST_RESULTS = {
  templates: [
    "FAST Exam: Negative. No free fluid in hepatorenal recess (Morrison pouch), splenorenal recess, pelvis, or pericardium. Lung sliding present bilaterally (no pneumothorax).",
    "FAST: No intraperitoneal free fluid. No pericardial effusion. Normal lung sliding.",
    "FAST: Negative ×4 views. No evidence of hemoperitoneum, hemothorax, pneumothorax, or cardiac tamponade.",
  ],
};

// 🩻 V/Q Scan
export const VQ_SCAN_RESULTS = {
  templates: [
    "V/Q Scan: Normal. Homogeneous ventilation and perfusion. No mismatched defects. Low probability for pulmonary embolism (Modified PIOPED criteria).",
    "V/Q Scan: Normal perfusion. No segmental or subsegmental defects. PE unlikely.",
    "V/Q Scan: Low probability. Near-normal study. No evidence of PE.",
  ],
};

// 🩻 PET-CT
export const PETCT_RESULTS = {
  templates: [
    "PET-CT (FDG): Normal physiologic FDG uptake in brain, heart, kidneys, and bladder. No abnormal hypermetabolic foci to suggest malignancy. No lymphadenopathy. Normal organ morphology.",
    "PET-CT: No evidence of abnormal FDG-avid lesions. Normal biodistribution.",
    "PET-CT: Normal study. No suspicious metabolic activity. Deauville score 2.",
  ],
};

// 🩻 Bone Scan
export const BONE_SCAN_RESULTS = {
  templates: [
    "Bone Scan (Tc-99m MDP): Normal. Symmetric radiotracer uptake throughout skeleton. No focal areas of increased or decreased uptake. Renal excretion normal. No metastatic disease.",
    "Bone Scan: Normal distribution. No evidence of fracture, infection, or metastasis.",
    "Bone Scan: Unremarkable. Normal bone metabolism. Degenerative changes noted in knees and spine (age-appropriate).",
  ],
};

// 🩻 HIDA Scan
export const HIDA_SCAN_RESULTS = {
  templates: [
    "HIDA Scan: Normal. Prompt hepatic uptake, biliary excretion, and gallbladder filling within 60 minutes. Normal gallbladder ejection fraction (65%) after CCK stimulation. No biliary obstruction or leak.",
    "HIDA Scan: Normal gallbladder visualization and function. EF 60%. No evidence of acute cholecystitis.",
    "HIDA Scan: Normal hepatobiliary function. Patent cystic and common bile ducts.",
  ],
};

// 🩻 Gastric Emptying Study
export const GASTRIC_EMPTYING_RESULTS = {
  templates: [
    "Gastric Emptying Study (Solid Meal): Normal. 50% emptying at 80 minutes (Normal <90 min). 90% emptying at 180 minutes (Normal <180 min). No evidence of gastroparesis.",
    "Gastric Emptying: Normal. T½ = 70 minutes (Normal 60-100). Normal emptying rate.",
    "Gastric Emptying: Normal. No evidence of delayed gastric emptying.",
  ],
};

// 🩻 DEXA Scan
export const DEXA_RESULTS = {
  templates: [
    "DEXA Scan: Normal bone density. Lumbar spine (L1-L4) T-score: +0.5. Femoral neck T-score: +0.2. Total hip T-score: +0.3. No osteoporosis or osteopenia (WHO criteria).",
    "DEXA: Normal. T-scores at all sites > -1.0. No evidence of low bone mass.",
    "DEXA: Normal bone mineral density for age and sex. No fracture risk based on FRAX.",
  ],
};

// 🎯 Final comprehensive mapping update
Object.assign(NORMAL_LAB_MAP, {
  'sputum culture': SPUTUM_CULTURE_RESULTS,
  'sputum cx': SPUTUM_CULTURE_RESULTS,
  'wound culture': WOUND_CULTURE_RESULTS,
  'wound cx': WOUND_CULTURE_RESULTS,
  'throat culture': THROAT_CULTURE_RESULTS,
  'throat cx': THROAT_CULTURE_RESULTS,
  'csf culture': CSF_CULTURE_RESULTS,
  'fungal culture': FUNGAL_CULTURE_RESULTS,
  'fungal cx': FUNGAL_CULTURE_RESULTS,
  'afb': AFB_CULTURE_RESULTS,
  'afb culture': AFB_CULTURE_RESULTS,
  'afb smear': AFB_CULTURE_RESULTS,
  'malaria smear': MALARIA_RESULTS,
  'malaria': MALARIA_RESULTS,
  'hepatitis b panel': HEPB_DETAILED_RESULTS,
  'hepatitis b': HEPB_DETAILED_RESULTS,
  'hepatitis c panel': HEPC_DETAILED_RESULTS,
  'hepatitis c': HEPC_DETAILED_RESULTS,
  'hiv test': HIV_DETAILED_RESULTS,
  'hiv panel': HIV_DETAILED_RESULTS,
  'covid': COVID_RESULTS,
  'covid-19': COVID_RESULTS,
  'sars-cov-2': COVID_RESULTS,
  'influenza': INFLUENZA_RESULTS,
  'flu': INFLUENZA_RESULTS,
  'respiratory panel': INFLUENZA_RESULTS,
  'std panel': STD_RESULTS,
  'std': STD_RESULTS,
  'gonorrhea': STD_RESULTS,
  'chlamydia': STD_RESULTS,
  'anti-dsdna': ANTIDSDNA_RESULTS,
  'anti dna': ANTIDSDNA_RESULTS,
  'ena panel': ENA_RESULTS,
  'ena': ENA_RESULTS,
  'anti-gbm': ANTIGBM_RESULTS,
  'anti gbm': ANTIGBM_RESULTS,
  'cryoglobulins': CRYOGLOBULIN_RESULTS,
  'cryo': CRYOGLOBULIN_RESULTS,
  'spep': SPEP_RESULTS,
  'serum protein electrophoresis': SPEP_RESULTS,
  'immunofixation': SPEP_RESULTS,
  'serum free light chains': SFLC_RESULTS,
  'free light chains': SFLC_RESULTS,
  'sflc': SFLC_RESULTS,
  'nt-probnp': NTPROBNP_RESULTS,
  'myoglobin': MYOGLOBIN_RESULTS,
  'homocysteine': HOMOCYSTEINE_RESULTS,
  'lipoprotein a': LIPOPROTEIN_A_RESULTS,
  'lp(a)': LIPOPROTEIN_A_RESULTS,
  '24h urine': URINE_24H_RESULTS,
  '24 hour urine': URINE_24H_RESULTS,
  'urine protein': URINE_24H_RESULTS,
  'urine electrolytes': URINE_ELECTROLYTES_RESULTS,
  'urine lytes': URINE_ELECTROLYTES_RESULTS,
  'urine calcium': URINE_CALCIUM_RESULTS,
  'urine porphyrins': PORPHYRIN_RESULTS,
  'porphyrins': PORPHYRIN_RESULTS,
  'kub': KUB_RESULTS,
  'abdominal x-ray': KUB_RESULTS,
  'abdominal x ray': KUB_RESULTS,
  'spine x-ray': SPINE_XR_RESULTS,
  'spine x ray': SPINE_XR_RESULTS,
  'extremity x-ray': EXTREMITY_XR_RESULTS,
  'extremity x ray': EXTREMITY_XR_RESULTS,
  'bone x-ray': EXTREMITY_XR_RESULTS,
  'mammogram': MAMMOGRAM_RESULTS,
  'mammography': MAMMOGRAM_RESULTS,
  'ct head': CT_HEAD_RESULTS,
  'ct brain': CT_HEAD_RESULTS,
  'ct chest': CT_CHEST_RESULTS,
  'ct abdomen': CT_ABDOMEN_RESULTS,
  'ct abdomen pelvis': CT_ABDOMEN_RESULTS,
  'ct ap': CT_ABDOMEN_RESULTS,
  'cta head neck': CTA_HEAD_NECK_RESULTS,
  'cta head': CTA_HEAD_NECK_RESULTS,
  'cta neck': CTA_HEAD_NECK_RESULTS,
  'mri brain': MRI_BRAIN_RESULTS,
  'mri head': MRI_BRAIN_RESULTS,
  'mri spine': MRI_SPINE_RESULTS,
  'mri cervical': MRI_SPINE_RESULTS,
  'mri lumbar': MRI_SPINE_RESULTS,
  'mri joint': MRI_JOINT_RESULTS,
  'mri shoulder': MRI_JOINT_RESULTS,
  'mri knee': MRI_JOINT_RESULTS,
  'us abdomen': US_ABDOMEN_RESULTS,
  'ultrasound abdomen': US_ABDOMEN_RESULTS,
  'us pelvis': US_PELVIS_RESULTS,
  'ultrasound pelvis': US_PELVIS_RESULTS,
  'us thyroid': US_THYROID_RESULTS,
  'ultrasound thyroid': US_THYROID_RESULTS,
  'us breast': US_BREAST_RESULTS,
  'ultrasound breast': US_BREAST_RESULTS,
  'us scrotal': US_SCROTAL_RESULTS,
  'ultrasound scrotum': US_SCROTAL_RESULTS,
  'testicular ultrasound': US_SCROTAL_RESULTS,
  'venous doppler': VENOUS_DOPPLER_RESULTS,
  'dvt study': VENOUS_DOPPLER_RESULTS,
  'doppler': VENOUS_DOPPLER_RESULTS,
  'carotid doppler': CAROTID_DOPPLER_RESULTS,
  'carotid duplex': CAROTID_DOPPLER_RESULTS,
  'fast': FAST_RESULTS,
  'fast exam': FAST_RESULTS,
  'vq scan': VQ_SCAN_RESULTS,
  'v/q scan': VQ_SCAN_RESULTS,
  'pet-ct': PETCT_RESULTS,
  'pet ct': PETCT_RESULTS,
  'pet scan': PETCT_RESULTS,
  'bone scan': BONE_SCAN_RESULTS,
  'hida': HIDA_SCAN_RESULTS,
  'hida scan': HIDA_SCAN_RESULTS,
  'gastric emptying': GASTRIC_EMPTYING_RESULTS,
  'gastric emptying study': GASTRIC_EMPTYING_RESULTS,
  'dexa': DEXA_RESULTS,
  'dexa scan': DEXA_RESULTS,
  'bone density': DEXA_RESULTS,
});

// ==================== TRACE ELEMENTS & VITAMINS ====================
// 🧪 Ionized Calcium
export const IONIZED_CALCIUM_RESULTS = {
  templates: [
    "Ionized Calcium: 4.8 mg/dL (Normal 4.5-5.6) | Total Calcium: 9.4 mg/dL | Albumin: 4.2 g/dL | pH: 7.40 | Magnesium: 2.1 mg/dL",
    "Ionized Ca: 5.0 mg/dL | Total Ca: 9.6 mg/dL | Albumin: 4.4 g/dL",
    "Ionized Ca: 4.6 mg/dL | Total Ca: 9.2 mg/dL | Albumin: 4.0 g/dL",
  ],
};

// 🧪 Zinc
export const ZINC_RESULTS = {
  templates: [
    "Zinc: 85 µg/dL (Normal 70-120) | Copper: 95 µg/dL (Normal 70-140) | Ceruloplasmin: 28 mg/dL | Alkaline Phosphatase: 75 U/L",
    "Zinc: 95 µg/dL | Copper: 105 µg/dL | Ceruloplasmin: 32 mg/dL",
    "Zinc: 75 µg/dL | Copper: 85 µg/dL | Ceruloplasmin: 25 mg/dL",
  ],
};

// 🧪 Selenium
export const SELENIUM_RESULTS = {
  templates: [
    "Selenium: 120 µg/L (Normal 70-150) | Glutathione Peroxidase: 35 U/g Hb (Normal 25-45) | Vitamin E: 10 mg/L (Normal 5-20)",
    "Selenium: 105 µg/L | GPx: 30 U/g Hb | Vitamin E: 12 mg/L",
    "Selenium: 135 µg/L | GPx: 40 U/g Hb | Vitamin E: 8 mg/L",
  ],
};

// 🧪 Vitamin A
export const VITAMIN_A_RESULTS = {
  templates: [
    "Vitamin A (Retinol): 45 µg/dL (Normal 30-80) | Retinol-binding Protein: 3.5 mg/dL (Normal 2.5-7.0) | Beta-carotene: 80 µg/dL (Normal 50-200)",
    "Vitamin A: 55 µg/dL | RBP: 4.0 mg/dL | Beta-carotene: 100 µg/dL",
    "Vitamin A: 38 µg/dL | RBP: 3.0 mg/dL | Beta-carotene: 65 µg/dL",
  ],
};

// 🧪 Vitamin E
export const VITAMIN_E_RESULTS = {
  templates: [
    "Vitamin E (Alpha-tocopherol): 10.5 mg/L (Normal 5.5-18) | Cholesterol: 180 mg/dL | Vitamin E/Cholesterol Ratio: 5.8 (Normal >2.5)",
    "Vitamin E: 12.0 mg/L | Cholesterol: 195 mg/dL | Ratio: 6.2",
    "Vitamin E: 8.5 mg/L | Cholesterol: 170 mg/dL | Ratio: 5.0",
  ],
};

// 🧪 Vitamin K
export const VITAMIN_K_RESULTS = {
  templates: [
    "Vitamin K1 (Phylloquinone): 0.8 ng/mL (Normal 0.3-2.6) | PT: 12.5 sec (INR 1.0) | PIVKA-II: <2 ng/mL (Normal <2) | Undercarboxylated Osteocalcin: 15 ng/mL (Normal <20)",
    "Vitamin K1: 1.2 ng/mL | PT: 11.8 sec (INR 0.9) | PIVKA-II: <2 ng/mL",
    "Vitamin K1: 0.5 ng/mL | PT: 13.0 sec (INR 1.1) | PIVKA-II: <2 ng/mL",
  ],
};

// 🧪 Vitamin B1 (Thiamine)
export const THIAMINE_RESULTS = {
  templates: [
    "Thiamine (Vitamin B1): 120 nmol/L (Normal 70-180) | Transketolase Activity: 1.2 U/g Hb (Normal >0.8) | TPP Effect: 12% (Normal <15%) | Lactate: 1.2 mmol/L",
    "Thiamine: 150 nmol/L | Transketolase: 1.5 U/g Hb | TPP Effect: 8% | Lactate: 1.0 mmol/L",
    "Thiamine: 95 nmol/L | Transketolase: 0.9 U/g Hb | TPP Effect: 14% | Lactate: 1.5 mmol/L",
  ],
};

// 🧪 Vitamin B6
export const PYRIDOXINE_RESULTS = {
  templates: [
    "Vitamin B6 (Pyridoxal-5-Phosphate): 45 µg/L (Normal 20-80) | Homocysteine: 9.0 µmol/L | ALT: 32 U/L | AST: 28 U/L",
    "Vitamin B6: 55 µg/L | Homocysteine: 7.5 µmol/L | ALT: 28 U/L | AST: 24 U/L",
    "Vitamin B6: 35 µg/L | Homocysteine: 11.0 µmol/L | ALT: 38 U/L | AST: 32 U/L",
  ],
};

// 🧪 Vitamin C
export const VITAMIN_C_RESULTS = {
  templates: [
    "Vitamin C (Ascorbic Acid): 0.8 mg/dL (Normal 0.4-1.5) | Serum: 0.9 mg/dL | Leukocyte Vitamin C: 25 µg/10⁸ cells (Normal 15-30)",
    "Vitamin C: 1.0 mg/dL | Leukocyte: 28 µg/10⁸ cells",
    "Vitamin C: 0.6 mg/dL | Leukocyte: 20 µg/10⁸ cells",
  ],
};

// ==================== CARBOHYDRATE METABOLISM ====================
// 🧪 Fructosamine
export const FRUCTOSAMINE_RESULTS = {
  templates: [
    "Fructosamine: 250 µmol/L (Normal 200-285) | HbA1c: 5.4% | Fasting Glucose: 92 mg/dL | Albumin: 4.2 g/dL",
    "Fructosamine: 270 µmol/L | HbA1c: 5.6% | Glucose: 98 mg/dL | Albumin: 4.0 g/dL",
    "Fructosamine: 230 µmol/L | HbA1c: 5.2% | Glucose: 88 mg/dL | Albumin: 4.4 g/dL",
  ],
};

// 🧪 Beta-Hydroxybutyrate
export const BHB_RESULTS = {
  templates: [
    "Beta-Hydroxybutyrate: 0.15 mmol/L (Normal <0.6) | Acetoacetate: <0.1 mmol/L | Glucose: 92 mg/dL | Anion Gap: 10",
    "BHB: 0.20 mmol/L | Acetoacetate: <0.1 mmol/L | Glucose: 88 mg/dL | Anion Gap: 8",
    "BHB: 0.08 mmol/L | Acetoacetate: <0.1 mmol/L | Glucose: 98 mg/dL | Anion Gap: 12",
  ],
};

// ==================== LIPID METABOLISM ====================
// 🧪 Apolipoprotein A1
export const APOA1_RESULTS = {
  templates: [
    "Apolipoprotein A1: 145 mg/dL (Normal: Male 95-175, Female 100-200) | ApoB: 85 mg/dL (Normal <120) | ApoB/ApoA1 Ratio: 0.59 (Normal <0.8) | HDL: 48 mg/dL",
    "ApoA1: 160 mg/dL | ApoB: 75 mg/dL | Ratio: 0.47 | HDL: 55 mg/dL",
    "ApoA1: 130 mg/dL | ApoB: 95 mg/dL | Ratio: 0.73 | HDL: 42 mg/dL",
  ],
};

// 🧪 Apolipoprotein B
export const APOB_RESULTS = {
  templates: [
    "Apolipoprotein B: 85 mg/dL (Normal <120) | LDL: 110 mg/dL | Non-HDL Cholesterol: 130 mg/dL | LDL-P (NMR): 950 nmol/L (Normal <1100)",
    "ApoB: 75 mg/dL | LDL: 100 mg/dL | Non-HDL: 120 mg/dL | LDL-P: 850 nmol/L",
    "ApoB: 95 mg/dL | LDL: 125 mg/dL | Non-HDL: 145 mg/dL | LDL-P: 1050 nmol/L",
  ],
};

// 🧪 Cystatin C
export const CYSTATIN_C_RESULTS = {
  templates: [
    "Cystatin C: 0.85 mg/L (Normal <1.0) | eGFR (Cystatin C): 98 mL/min/1.73m² | Creatinine: 0.9 mg/dL | eGFR (Creatinine): 105 mL/min",
    "Cystatin C: 0.75 mg/L | eGFR (Cys): 105 mL/min | Creatinine: 0.8 mg/dL | eGFR (Cr): 110 mL/min",
    "Cystatin C: 0.95 mg/L | eGFR (Cys): 90 mL/min | Creatinine: 1.0 mg/dL | eGFR (Cr): 100 mL/min",
  ],
};

// ==================== BONE MARKERS ====================
// 🦴 Osteocalcin
export const OSTEOCALCIN_RESULTS = {
  templates: [
    "Osteocalcin: 18 ng/mL (Normal: Male 10-25, Female 8-22) | P1NP: 45 µg/L (Normal: Male 20-80, Female 15-65) | CTX: 350 pg/mL (Normal: Male 150-550, Female 100-500) | Bone ALP: 12 µg/L (Normal <20)",
    "Osteocalcin: 22 ng/mL | P1NP: 55 µg/L | CTX: 420 pg/mL | Bone ALP: 15 µg/L",
    "Osteocalcin: 14 ng/mL | P1NP: 35 µg/L | CTX: 280 pg/mL | Bone ALP: 10 µg/L",
  ],
};

// 🦴 P1NP
export const P1NP_RESULTS = {
  templates: [
    "P1NP: 48 µg/L (Normal: Male 20-80, Female 15-65) | Osteocalcin: 20 ng/mL | CTX: 380 pg/mL | Vitamin D 25-OH: 35 ng/mL | PTH: 35 pg/mL",
    "P1NP: 60 µg/L | Osteocalcin: 24 ng/mL | CTX: 450 pg/mL | Vitamin D: 40 ng/mL",
    "P1NP: 35 µg/L | Osteocalcin: 16 ng/mL | CTX: 300 pg/mL | Vitamin D: 30 ng/mL",
  ],
};

// ==================== CARDIAC EXTENDED ====================
// 🫀 H-FABP
export const HFABP_RESULTS = {
  templates: [
    "H-FABP: 3.5 ng/mL (Normal <7.0) | Troponin I: <0.01 ng/mL | CK-MB: 2.5 ng/mL | Myoglobin: 45 ng/mL",
    "H-FABP: 4.2 ng/mL | Troponin I: <0.02 ng/mL | CK-MB: 3.0 ng/mL | Myoglobin: 55 ng/mL",
    "H-FABP: 2.8 ng/mL | Troponin I: <0.01 ng/mL | CK-MB: 1.8 ng/mL | Myoglobin: 35 ng/mL",
  ],
};

// 🫀 Galectin-3
export const GALECTIN3_RESULTS = {
  templates: [
    "Galectin-3: 12 ng/mL (Normal <18) | NT-proBNP: 85 pg/mL | sST2: 25 ng/mL (Normal <35) | GDF-15: 800 pg/mL (Normal <1200)",
    "Galectin-3: 15 ng/mL | NT-proBNP: 95 pg/mL | sST2: 30 ng/mL | GDF-15: 950 pg/mL",
    "Galectin-3: 10 ng/mL | NT-proBNP: 70 pg/mL | sST2: 20 ng/mL | GDF-15: 700 pg/mL",
  ],
};

// ==================== RENAL EXTENDED ====================
// 🫘 NGAL
export const NGAL_RESULTS = {
  templates: [
    "NGAL (Urine): 25 ng/mL (Normal <100) | Creatinine: 0.9 mg/dL | eGFR: 105 mL/min | Cystatin C: 0.85 mg/L | KIM-1: 0.5 ng/mL (Normal <2.0)",
    "NGAL: 45 ng/mL | Creatinine: 1.0 mg/dL | eGFR: 100 mL/min | Cystatin C: 0.90 mg/L",
    "NGAL: 15 ng/mL | Creatinine: 0.8 mg/dL | eGFR: 110 mL/min | Cystatin C: 0.75 mg/L",
  ],
};

// ==================== HEMATOLOGY EXTENDED ====================
// 🩸 Erythropoietin
export const EPO_RESULTS = {
  templates: [
    "Erythropoietin: 12 mIU/mL (Normal 4-25) | Hb: 14.5 g/dL | Hct: 43% | Reticulocyte Count: 1.2% | Ferritin: 120 ng/mL",
    "Erythropoietin: 15 mIU/mL | Hb: 15.0 g/dL | Hct: 44% | Retic: 1.5% | Ferritin: 150 ng/mL",
    "Erythropoietin: 8 mIU/mL | Hb: 13.8 g/dL | Hct: 40% | Retic: 0.8% | Ferritin: 85 ng/mL",
  ],
};

// 🩸 Platelet Function (PFA-100)
export const PFA100_RESULTS = {
  templates: [
    "PFA-100: Collagen/Epinephrine: 110 sec (Normal <180) | Collagen/ADP: 85 sec (Normal <120) | Platelets: 250,000 /µL | vWF Ag: 95% (Normal 50-150)",
    "PFA-100: Col/Epi: 125 sec | Col/ADP: 95 sec | Platelets: 280,000 /µL | vWF Ag: 110%",
    "PFA-100: Col/Epi: 95 sec | Col/ADP: 75 sec | Platelets: 230,000 /µL | vWF Ag: 85%",
  ],
};

// ==================== MICROBIOLOGY EXTENDED ====================
// 🦠 Beta-D-Glucan
export const BDG_RESULTS = {
  templates: [
    "Beta-D-Glucan: <31 pg/mL (Normal <80). No evidence of invasive fungal infection.",
    "Beta-D-Glucan: <31 pg/mL. Negative for Pneumocystis, Aspergillus, Candida (serum BDG).",
    "Beta-D-Glucan: 45 pg/mL (Indeterminate - 31-80). Repeat testing recommended if clinical suspicion.",
  ],
};

// 🦠 Galactomannan
export const GALACTOMANNAN_RESULTS = {
  templates: [
    "Galactomannan Antigen (Serum): 0.2 ODI (Normal <0.5). No evidence of invasive aspergillosis.",
    "Galactomannan (BAL): 0.3 ODI (Normal <0.5). Serum: 0.2 ODI. Both negative.",
    "Galactomannan: 0.1 ODI. Negative for Aspergillus.",
  ],
};

// 🦠 Cryptococcal Antigen
export const CRYPTOCOCCAL_RESULTS = {
  templates: [
    "Cryptococcal Antigen (Serum): Negative (<1:2). No evidence of cryptococcal infection.",
    "Cryptococcal Antigen (CSF): Negative. Serum: Negative.",
    "Cryptococcal Ag: Negative. India ink preparation: Negative.",
  ],
};

// 🦠 Strongyloides
export const STRONGYLOIDES_RESULTS = {
  templates: [
    "Strongyloides stercoralis IgG: Negative (<0.9). No evidence of strongyloidiasis.",
    "Strongyloides IgG: Negative. Stool O&P ×3: Negative.",
    "Strongyloides IgG: Negative. Eosinophil count: 250/µL (Normal <500).",
  ],
};

// 🦠 Schistosoma
export const SCHISTOSOMA_RESULTS = {
  templates: [
    "Schistosoma IgG: Negative. No evidence of schistosomiasis. Urine: No ova seen.",
    "Schistosoma serology: Negative. Stool O&P: No ova. Rectal snip: Not performed.",
    "Schistosoma Ab: Negative. Eosinophil count: Normal.",
  ],
};

// ==================== VIROLOGY EXTENDED ====================
// 🦠 HHV-6
export const HHV6_RESULTS = {
  templates: [
    "HHV-6 PCR: Not detected (<200 copies/mL). HHV-6 IgG: Positive (Past infection). HHV-6 IgM: Negative.",
    "HHV-6 PCR: Not detected. Serology consistent with past infection.",
    "HHV-6 DNA: Not detected by PCR. No evidence of active or reactivated infection.",
  ],
};

// 🦠 Parvovirus B19
export const PARVOVIRUS_RESULTS = {
  templates: [
    "Parvovirus B19 IgG: Positive (Immune from past infection). Parvovirus B19 IgM: Negative. Parvovirus PCR: Not detected.",
    "Parvovirus B19 IgG: Negative (Susceptible). IgM: Negative. PCR: Not detected.",
    "Parvovirus B19: IgG positive, IgM negative. No evidence of recent infection.",
  ],
};

// 🦠 BK/JC Virus
export const POLYOMAVIRUS_RESULTS = {
  templates: [
    "BK Virus PCR (Plasma): Not detected (<500 copies/mL). BK Virus PCR (Urine): Not detected. JC Virus PCR (CSF): Not detected.",
    "BK Virus: Not detected. JC Virus: Not detected. No evidence of polyomavirus reactivation.",
    "BK PCR: Negative. JC PCR: Negative.",
  ],
};

// 🦠 Dengue
export const DENGUE_RESULTS = {
  templates: [
    "Dengue NS1 Antigen: Negative. Dengue IgG: Negative. Dengue IgM: Negative. No evidence of acute or past dengue infection.",
    "Dengue NS1: Negative. Dengue IgM: Negative. Dengue IgG: Negative.",
    "Dengue Panel: All negative. Zika PCR: Not detected. Chikungunya IgM: Negative.",
  ],
};

// 🦠 MMR
export const MMR_RESULTS = {
  templates: [
    "Measles (Rubeola) IgG: Positive (Immune). Mumps IgG: Positive (Immune). Rubella IgG: Positive (Immune).",
    "Measles IgG: Positive | Mumps IgG: Positive | Rubella IgG: Positive. All confirm immunity.",
    "MMR IgG: All positive. Adequate immunity confirmed. No need for booster.",
  ],
};

// ==================== GENETICS / PHARMACOGENOMICS ====================
// 🧬 Factor V Leiden
export const FACTOR_V_RESULTS = {
  templates: [
    "Factor V Leiden: Wild-type (G/G). No mutation detected. Normal APC resistance. No increased thrombophilia risk.",
    "Factor V Leiden: Negative (G/G genotype). Prothrombin G20210A: Negative (G/G). MTHFR C677T: Heterozygous (C/T).",
    "Factor V Leiden: Not detected. Prothrombin mutation: Not detected.",
  ],
};

// 🧬 HLA-B27
export const HLA_B27_RESULTS = {
  templates: [
    "HLA-B27: Negative. No HLA-B27 allele detected by PCR-SSP. Low risk for associated spondyloarthropathies.",
    "HLA-B27: Not detected. Negative by flow cytometry and PCR.",
    "HLA-B27: Negative.",
  ],
};

// 🧬 HLA-DQ2/DQ8
export const HLA_DQ_RESULTS = {
  templates: [
    "HLA-DQ2 (DQA1*05/DQB1*02): Negative. HLA-DQ8 (DQA1*03/DQB1*0302): Negative. Low risk for celiac disease (negative predictive value >99%).",
    "HLA-DQ2: Negative. HLA-DQ8: Negative. Celiac disease highly unlikely.",
    "HLA-DQ2/DQ8: Both negative. <1% of celiac patients lack both alleles.",
  ],
};

// ==================== TUMOR MARKERS EXTENDED ====================
// 🧬 CA 15-3
export const CA153_RESULTS = {
  templates: [
    "CA 15-3: 18 U/mL (Normal <30) | CEA: 2.5 ng/mL | CA-125: 12 U/mL | CA 27.29: 20 U/mL (Normal <38)",
    "CA 15-3: 22 U/mL | CEA: 1.8 ng/mL | CA-125: 18 U/mL | CA 27.29: 25 U/mL",
    "CA 15-3: 15 U/mL | CEA: 3.0 ng/mL | CA-125: 8 U/mL | CA 27.29: 16 U/mL",
  ],
};

// 🧬 Thyroglobulin
export const THYROGLOBULIN_RESULTS = {
  templates: [
    "Thyroglobulin: 12 ng/mL (Normal <35 in intact thyroid, <1 post-thyroidectomy) | Anti-Thyroglobulin Ab: Negative | TSH: 2.5 mIU/L | Free T4: 1.2 ng/dL",
    "Thyroglobulin: 18 ng/mL | Anti-Tg Ab: Negative | TSH: 1.8 mIU/L | Free T4: 1.4 ng/dL",
    "Thyroglobulin: 8 ng/mL | Anti-Tg Ab: Negative | TSH: 3.0 mIU/L | Free T4: 1.0 ng/dL",
  ],
};

// 🧬 Chromogranin A
export const CHROMOGRANIN_RESULTS = {
  templates: [
    "Chromogranin A: 45 ng/mL (Normal <95) | Pancreastatin: 50 pg/mL (Normal <80) | Gastrin: 40 pg/mL (Normal <100) | PPI use: None",
    "Chromogranin A: 60 ng/mL | Pancreastatin: 65 pg/mL | Gastrin: 55 pg/mL",
    "Chromogranin A: 35 ng/mL | Pancreastatin: 40 pg/mL | Gastrin: 30 pg/mL",
  ],
};

// 🧬 5-HIAA (Urine)
export const HIAA_RESULTS = {
  templates: [
    "24h Urine 5-HIAA: 5.0 mg/24h (Normal <10) | Serotonin (Serum): 150 ng/mL (Normal <200) | Chromogranin A: 45 ng/mL",
    "24h Urine 5-HIAA: 6.5 mg/24h | Serotonin: 180 ng/mL | Chromogranin A: 60 ng/mL",
    "24h Urine 5-HIAA: 3.5 mg/24h | Serotonin: 120 ng/mL | Chromogranin A: 35 ng/mL",
  ],
};

// ==================== STOOL STUDIES EXTENDED ====================
// 💩 Fecal Calprotectin
export const FECAL_CALPROTECTIN_RESULTS = {
  templates: [
    "Fecal Calprotectin: 25 µg/g (Normal <50) | Fecal Lactoferrin: Negative | Stool Culture: Negative | C. difficile: Negative",
    "Fecal Calprotectin: 35 µg/g | Lactoferrin: Negative | No evidence of intestinal inflammation.",
    "Fecal Calprotectin: 15 µg/g | Normal. IBS more likely than IBD.",
  ],
};

// 💩 Fecal Elastase
export const FECAL_ELASTASE_RESULTS = {
  templates: [
    "Fecal Elastase-1: 350 µg/g (Normal >200) | No evidence of pancreatic exocrine insufficiency.",
    "Fecal Elastase: 420 µg/g | Normal pancreatic function.",
    "Fecal Elastase: 280 µg/g | Normal.",
  ],
};

// ==================== ALLERGY TESTING ====================
// 🦴 Total IgE
export const TOTAL_IGE_RESULTS = {
  templates: [
    "Total IgE: 45 IU/mL (Normal <100 for adults) | Specific IgE panel: All negative. | Eosinophil count: 180/µL (Normal <500)",
    "Total IgE: 65 IU/mL | Specific IgE: Negative for common aeroallergens and food allergens.",
    "Total IgE: 30 IU/mL | No evidence of atopic diathesis.",
  ],
};

// 🦴 Tryptase
export const TRYPTASE_RESULTS = {
  templates: [
    "Tryptase: 4.5 ng/mL (Normal <11.5) | Histamine (Plasma): <1.0 ng/mL (Normal <1.8) | No evidence of mast cell activation or anaphylaxis.",
    "Tryptase: 3.8 ng/mL | Histamine: <1.0 ng/mL | Normal.",
    "Tryptase: 5.5 ng/mL | Normal baseline. Rule out systemic mastocytosis if persistently elevated.",
  ],
};

// ==================== BREATH TESTS ====================
// 🫁 Urea Breath Test
export const UREA_BREATH_RESULTS = {
  templates: [
    "¹³C-Urea Breath Test: Negative (Delta over baseline <2.5‰). No evidence of active H. pylori infection. PPI use: None for 2 weeks prior.",
    "Urea Breath Test: Negative. H. pylori stool antigen: Negative. Consistent results.",
    "UBT: Negative. No H. pylori detected.",
  ],
};

// 🫁 Lactose Breath Test
export const LACTOSE_BREATH_RESULTS = {
  templates: [
    "Lactose Breath Test: Normal. Hydrogen rise <20 ppm above baseline at all time points. No evidence of lactose malabsorption.",
    "Lactose Breath Test: H₂ max 8 ppm (Normal <20). Normal lactose digestion.",
    "Lactose BT: Negative for lactose intolerance.",
  ],
};

// 🫁 SIBO Breath Test
export const SIBO_RESULTS = {
  templates: [
    "Glucose Breath Test (SIBO): Normal. No early hydrogen peak. H₂ <20 ppm at all time points. Methane <10 ppm. No evidence of small intestinal bacterial overgrowth.",
    "Glucose BT: Negative for SIBO. H₂ max 12 ppm, CH₄ max 5 ppm. Normal orocecal transit time.",
    "Lactulose BT: Normal. No double peak. No evidence of SIBO.",
  ],
};

// ==================== SWEAT TEST ====================
// 💧 Sweat Chloride
export const SWEAT_CHLORIDE_RESULTS = {
  templates: [
    "Sweat Chloride: 18 mmol/L (Normal <30). Weight: 150mg (Adequate >75mg). No evidence of cystic fibrosis. Repeat: 22 mmol/L (consistent).",
    "Sweat Chloride: 25 mmol/L. Normal. CF unlikely.",
    "Sweat Chloride: 20 mmol/L. Adequate sample. Negative for CF.",
  ],
};

// ==================== STONE ANALYSIS ====================
// 🪨 Kidney Stone
export const STONE_ANALYSIS_RESULTS = {
  templates: [
    "Stone Analysis: Calcium Oxalate 80%, Calcium Phosphate 20%. No struvite, uric acid, or cystine. Consistent with calcium oxalate stone. Recommend: Hydration >2.5L/day, Low sodium diet, Normal calcium diet, Avoid high oxalate foods.",
    "Stone: 100% Uric acid. Radiolucent on XR. Recommend: Alkalinize urine (Potassium citrate), Allopurinol if hyperuricemia, Hydration.",
    "Stone: Calcium oxalate monohydrate. Recommend metabolic workup: 24h urine calcium, oxalate, citrate, uric acid, sodium, volume.",
  ],
};

// 🎯 FINAL MAPPING UPDATE
Object.assign(NORMAL_LAB_MAP, {
  'ionized calcium': IONIZED_CALCIUM_RESULTS,
  'ica': IONIZED_CALCIUM_RESULTS,
  'zinc': ZINC_RESULTS,
  'selenium': SELENIUM_RESULTS,
  'vitamin a': VITAMIN_A_RESULTS,
  'retinol': VITAMIN_A_RESULTS,
  'vitamin e': VITAMIN_E_RESULTS,
  'alpha-tocopherol': VITAMIN_E_RESULTS,
  'vitamin k': VITAMIN_K_RESULTS,
  'thiamine': THIAMINE_RESULTS,
  'vitamin b1': THIAMINE_RESULTS,
  'vitamin b6': PYRIDOXINE_RESULTS,
  'pyridoxine': PYRIDOXINE_RESULTS,
  'vitamin c': VITAMIN_C_RESULTS,
  'ascorbic acid': VITAMIN_C_RESULTS,
  'fructosamine': FRUCTOSAMINE_RESULTS,
  'beta-hydroxybutyrate': BHB_RESULTS,
  'bhb': BHB_RESULTS,
  'ketones': BHB_RESULTS,
  'apolipoprotein a1': APOA1_RESULTS,
  'apoa1': APOA1_RESULTS,
  'apolipoprotein b': APOB_RESULTS,
  'apob': APOB_RESULTS,
  'cystatin c': CYSTATIN_C_RESULTS,
  'osteocalcin': OSTEOCALCIN_RESULTS,
  'p1np': P1NP_RESULTS,
  'h-fabp': HFABP_RESULTS,
  'heart fabp': HFABP_RESULTS,
  'galectin-3': GALECTIN3_RESULTS,
  'galectin3': GALECTIN3_RESULTS,
  'ngal': NGAL_RESULTS,
  'erythropoietin': EPO_RESULTS,
  'epo': EPO_RESULTS,
  'pfa-100': PFA100_RESULTS,
  'pfa100': PFA100_RESULTS,
  'beta-d-glucan': BDG_RESULTS,
  'bdg': BDG_RESULTS,
  'galactomannan': GALACTOMANNAN_RESULTS,
  'cryptococcal antigen': CRYPTOCOCCAL_RESULTS,
  'cryptococcus': CRYPTOCOCCAL_RESULTS,
  'strongyloides': STRONGYLOIDES_RESULTS,
  'schistosoma': SCHISTOSOMA_RESULTS,
  'hhv-6': HHV6_RESULTS,
  'hhv6': HHV6_RESULTS,
  'parvovirus': PARVOVIRUS_RESULTS,
  'parvovirus b19': PARVOVIRUS_RESULTS,
  'bk virus': POLYOMAVIRUS_RESULTS,
  'jc virus': POLYOMAVIRUS_RESULTS,
  'dengue': DENGUE_RESULTS,
  'mmr': MMR_RESULTS,
  'measles': MMR_RESULTS,
  'mumps': MMR_RESULTS,
  'rubella': MMR_RESULTS,
  'factor v leiden': FACTOR_V_RESULTS,
  'factor v': FACTOR_V_RESULTS,
  'hla-b27': HLA_B27_RESULTS,
  'hla b27': HLA_B27_RESULTS,
  'hla-dq2': HLA_DQ_RESULTS,
  'hla-dq8': HLA_DQ_RESULTS,
  'hla dq': HLA_DQ_RESULTS,
  'ca 15-3': CA153_RESULTS,
  'ca15-3': CA153_RESULTS,
  'thyroglobulin': THYROGLOBULIN_RESULTS,
  'chromogranin a': CHROMOGRANIN_RESULTS,
  'chromogranin': CHROMOGRANIN_RESULTS,
  '5-hiaa': HIAA_RESULTS,
  'hiaa': HIAA_RESULTS,
  'fecal calprotectin': FECAL_CALPROTECTIN_RESULTS,
  'calprotectin': FECAL_CALPROTECTIN_RESULTS,
  'fecal elastase': FECAL_ELASTASE_RESULTS,
  'elastase': FECAL_ELASTASE_RESULTS,
  'total ige': TOTAL_IGE_RESULTS,
  'tryptase': TRYPTASE_RESULTS,
  'urea breath test': UREA_BREATH_RESULTS,
  'h pylori breath': UREA_BREATH_RESULTS,
  'lactose breath test': LACTOSE_BREATH_RESULTS,
  'sibo breath test': SIBO_RESULTS,
  'sibo': SIBO_RESULTS,
  'sweat chloride': SWEAT_CHLORIDE_RESULTS,
  'sweat test': SWEAT_CHLORIDE_RESULTS,
  'stone analysis': STONE_ANALYSIS_RESULTS,
  'kidney stone': STONE_ANALYSIS_RESULTS,
});
