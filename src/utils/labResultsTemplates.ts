// 🧪 Lab Results Templates - تقارير كاملة لكل التحاليل والفحوصات
// يدمج الـ findings من الحالة مع template كامل عشان يطلع تقرير احترافي

interface LabTemplate {
  name: string;
  category: string;
  generate: (finding: string) => string;
}

// 📋 دالة مساعدة: تستخرج القيم من النص المختصر
function extractValue(text: string, key: string): string | null {
  const regex = new RegExp(`${key}[:\s]*([^\n,]+)`, 'i');
  const match = text.match(regex);
  return match ? match[1].trim() : null;
}

// 🩸 CBC Template
function generateCBC(finding: string): string {
  const wbc = extractValue(finding, 'WBC') || extractValue(finding, 'White') || '12,500 /µL';
  const rbc = extractValue(finding, 'RBC') || extractValue(finding, 'Red') || '4.2 M/µL';
  const hb = extractValue(finding, 'Hb') || extractValue(finding, 'Hemoglobin') || '13.5 g/dL';
  const hct = extractValue(finding, 'Hct') || extractValue(finding, 'Hematocrit') || '40%';
  const mcv = extractValue(finding, 'MCV') || '88 fL';
  const mch = extractValue(finding, 'MCH') || '28 pg';
  const plt = extractValue(finding, 'PLT') || extractValue(finding, 'Platelets') || '250,000 /µL';
  
  return `📋 **CBC (Complete Blood Count)**

**White Blood Cells:**
• WBC: ${wbc} (Reference: 4,000-11,000 /µL)

**Red Blood Cells:**
• RBC: ${rbc} (Reference: 4.5-5.5 M/µL)
• Hemoglobin: ${hb} (Reference: 13.5-17.5 g/dL)
• Hematocrit: ${hct} (Reference: 41-50%)

**RBC Indices:**
• MCV: ${mcv} (Reference: 80-100 fL)
• MCH: ${mch} (Reference: 27-34 pg)

**Platelets:**
• Platelet Count: ${plt} (Reference: 150,000-400,000 /µL)

**Differential (if available):**
• Neutrophils: 65% (Reference: 40-75%)
• Lymphocytes: 25% (Reference: 20-45%)
• Monocytes: 6% (Reference: 2-10%)
• Eosinophils: 3% (Reference: 1-6%)
• Basophils: 1% (Reference: 0-2%)

**Clinical Correlation:** ${finding}`;
}

// 🧪 CMP Template
function generateCMP(finding: string): string {
  const na = extractValue(finding, 'Na') || extractValue(finding, 'Sodium') || '138 mmol/L';
  const k = extractValue(finding, 'K') || extractValue(finding, 'Potassium') || '4.2 mmol/L';
  const cl = extractValue(finding, 'Cl') || extractValue(finding, 'Chloride') || '102 mmol/L';
  const hco3 = extractValue(finding, 'HCO3') || extractValue(finding, 'Bicarbonate') || '24 mmol/L';
  const bun = extractValue(finding, 'BUN') || extractValue(finding, 'Urea') || '15 mg/dL';
  const cr = extractValue(finding, 'Cr') || extractValue(finding, 'Creatinine') || '1.0 mg/dL';
  const glu = extractValue(finding, 'Glucose') || extractValue(finding, 'Glu') || '110 mg/dL';
  const ca = extractValue(finding, 'Ca') || extractValue(finding, 'Calcium') || '9.5 mg/dL';
  const alb = extractValue(finding, 'Alb') || extractValue(finding, 'Albumin') || '4.0 g/dL';
  const tp = extractValue(finding, 'TP') || extractValue(finding, 'Total Protein') || '7.0 g/dL';
  const alt = extractValue(finding, 'ALT') || '30 U/L';
  const ast = extractValue(finding, 'AST') || '25 U/L';
  const alp = extractValue(finding, 'ALP') || extractValue(finding, 'Alk Phos') || '80 U/L';
  const tbil = extractValue(finding, 'T.Bil') || extractValue(finding, 'Bilirubin') || '0.8 mg/dL';

  return `📋 **CMP (Comprehensive Metabolic Panel)**

**Electrolytes:**
• Sodium (Na): ${na} (Reference: 135-145 mmol/L)
• Potassium (K): ${k} (Reference: 3.5-5.0 mmol/L)
• Chloride (Cl): ${cl} (Reference: 98-107 mmol/L)
• Bicarbonate (HCO₃): ${hco3} (Reference: 22-28 mmol/L)

**Renal Function:**
• BUN: ${bun} (Reference: 7-20 mg/dL)
• Creatinine: ${cr} (Reference: 0.6-1.2 mg/dL)
• eGFR: >60 mL/min/1.73m²

**Glucose:**
• Glucose: ${glu} (Reference: 70-100 mg/dL fasting)

**Liver Function:**
• ALT: ${alt} (Reference: 7-56 U/L)
• AST: ${ast} (Reference: 10-40 U/L)
• Alkaline Phosphatase: ${alp} (Reference: 44-147 U/L)
• Total Bilirubin: ${tbil} (Reference: 0.1-1.2 mg/dL)

**Proteins:**
• Total Protein: ${tp} (Reference: 6.0-8.3 g/dL)
• Albumin: ${alb} (Reference: 3.5-5.0 g/dL)
• Calcium: ${ca} (Reference: 8.5-10.5 mg/dL)

**Clinical Correlation:** ${finding}`;
}

// 🫀 ECG Template
function generateECG(finding: string): string {
  const hr = extractValue(finding, 'HR') || extractValue(finding, 'Heart Rate') || '78 bpm';
  const rhythm = extractValue(finding, 'Rhythm') || 'Normal Sinus Rhythm';
  const axis = extractValue(finding, 'Axis') || 'Normal Axis (~45°)';
  const pr = extractValue(finding, 'PR') || '160 ms';
  const qrs = extractValue(finding, 'QRS') || '90 ms';
  const qtc = extractValue(finding, 'QTc') || '420 ms';
  const st = extractValue(finding, 'ST') || 'No ST elevation/depression';
  const t = extractValue(finding, 'T wave') || 'Normal T waves';

  return `🫀 **ECG (12-Lead Electrocardiogram)**

**Rhythm & Rate:**
• Rhythm: ${rhythm}
• Heart Rate: ${hr} (Reference: 60-100 bpm)
• Axis: ${axis}

**Intervals:**
• PR Interval: ${pr} (Reference: 120-200 ms)
• QRS Duration: ${qrs} (Reference: 60-100 ms)
• QTc Interval: ${qtc} (Reference: <440 ms male, <460 ms female)

**Morphology:**
• P Waves: Normal morphology
• QRS Complex: Normal progression
• ST Segment: ${st}
• T Waves: ${t}

**Interpretation:** ${finding}`;
}

// 🫀 Echo Template
function generateEcho(finding: string): string {
  const ef = extractValue(finding, 'EF') || extractValue(finding, 'Ejection Fraction') || '60%';
  const lv = extractValue(finding, 'LV') || 'Normal LV size and wall thickness';
  const rv = extractValue(finding, 'RV') || 'Normal RV size and function';
  const valves = extractValue(finding, 'Valves') || 'No significant valvular disease';
  const pericardial = extractValue(finding, 'Pericardial') || 'No pericardial effusion';

  return `🫀 **Transthoracic Echocardiogram (TTE)**

**Left Ventricle:**
• Ejection Fraction (EF): ${ef} (Reference: ≥55%)
• LV Size: ${lv}
• Wall Motion: No regional wall motion abnormalities

**Right Ventricle:**
• RV Size & Function: ${rv}
• TAPSE: 22 mm (Reference: >16 mm)

**Valves:**
• ${valves}
• Mitral Valve: Normal leaflets, no regurgitation/stenosis
• Aortic Valve: Trileaflet, normal opening
• Tricuspid Valve: Normal, trivial regurgitation
• Pulmonic Valve: Normal

**Pericardium:**
• ${pericardial}

**Doppler:**
• E/A Ratio: Normal
• Pulmonary Artery Pressure: Normal (<25 mmHg)

**Interpretation:** ${finding}`;
}

// 🩻 CXR Template
function generateCXR(finding: string): string {
  return `🩻 **Chest X-Ray (PA & Lateral)**

**Technical:** Adequate inspiration, no rotation

**Lungs & Pleura:**
• Lung Fields: Clear
• Pulmonary Vasculature: Normal
• Pleural Spaces: No effusion or pneumothorax

**Cardiac Silhouette:**
• Heart Size: Normal (Cardiothoracic ratio <0.5)
• Mediastinum: Normal contours, no widening

**Bones & Soft Tissues:**
• Ribs & Clavicles: Intact, no lesions
• Soft Tissues: Normal

**Lines & Tubes:** None

**Impression:** ${finding}`;
}

// 🧠 CT Head Template
function generateCTHead(finding: string): string {
  return `🧠 **CT Head (Non-Contrast)**

**Parenchyma:**
• Gray-White Matter Differentiation: Preserved
• No intracranial hemorrhage
• No mass effect or midline shift
• No acute territorial infarction

**Ventricles & CSF Spaces:**
• Ventricular System: Normal size and configuration
• Basal Cisterns: Patent
• Sulci: Age-appropriate, no effacement

**Bone & Soft Tissue:**
• Calvarium: Intact, no fractures
• Scalp: Normal

**Impression:** ${finding}`;
}

// 🩸 ABG Template
function generateABG(finding: string): string {
  const ph = extractValue(finding, 'pH') || '7.40';
  const pco2 = extractValue(finding, 'PaCO2') || extractValue(finding, 'pCO2') || '40 mmHg';
  const po2 = extractValue(finding, 'PaO2') || extractValue(finding, 'pO2') || '95 mmHg';
  const hco3 = extractValue(finding, 'HCO3') || '24 mmol/L';
  const o2sat = extractValue(finding, 'O2Sat') || extractValue(finding, 'SaO2') || '97%';

  return `🩸 **Arterial Blood Gas (ABG)**

**Acid-Base Status:**
• pH: ${ph} (Reference: 7.35-7.45)
• PaCO₂: ${pco2} (Reference: 35-45 mmHg)
• HCO₃: ${hco3} (Reference: 22-26 mmol/L)

**Oxygenation:**
• PaO₂: ${po2} (Reference: 80-100 mmHg)
• SaO₂: ${o2sat} (Reference: 95-100%)

**Interpretation:** ${finding}`;
}

// 🩸 Troponin Template
function generateTroponin(finding: string): string {
  const trop = extractValue(finding, 'Troponin') || extractValue(finding, 'Trop') || '0.05 ng/mL';
  const ck = extractValue(finding, 'CK-MB') || extractValue(finding, 'CK') || '3.5 ng/mL';

  return `🩸 **Cardiac Biomarkers**

**Troponin I (High-Sensitivity):**
• 0h: ${trop} (Reference: <0.04 ng/mL)
• 3h: Pending (if ordered as serial)

**CK-MB:**
• ${ck} (Reference: <5 ng/mL)

**Interpretation:** ${finding}`;
}

// 🩸 Coagulation Profile Template
function generateCoagulation(finding: string): string {
  const pt = extractValue(finding, 'PT') || '12.5 sec';
  const inr = extractValue(finding, 'INR') || '1.0';
  const ptt = extractValue(finding, 'PTT') || extractValue(finding, 'aPTT') || '30 sec';

  return `🩸 **Coagulation Profile**

**Prothrombin Time (PT):** ${pt} (Reference: 11-13.5 sec)
**INR:** ${inr} (Reference: 0.8-1.2)
**aPTT:** ${ptt} (Reference: 25-35 sec)

**Interpretation:** ${finding}`;
}

// 🔬 Urinalysis Template
function generateUrinalysis(finding: string): string {
  return `🔬 **Urinalysis**

**Gross:** Yellow, Clear
**Specific Gravity:** 1.015 (Reference: 1.005-1.030)
**pH:** 6.0 (Reference: 5.0-8.0)

**Dipstick:**
• Protein: Negative
• Glucose: Negative
• Ketones: Negative
• Blood: Negative
• Nitrite: Negative
• Leukocyte Esterase: Negative

**Microscopic:**
• WBC: 0-2/hpf (Reference: 0-5)
• RBC: 0-2/hpf (Reference: 0-2)
• Casts: None
• Bacteria: None

**Interpretation:** ${finding}`;
}

// 🦴 X-Ray Template (General)
function generateXRay(finding: string, bodyPart: string): string {
  return `🦴 **${bodyPart} X-Ray**

**Technical:** Adequate views, penetration, and positioning

**Bones:** Normal alignment, no fractures or dislocations
**Joint Spaces:** Preserved, no effusion
**Soft Tissues:** Normal, no swelling or foreign body

**Impression:** ${finding}`;
}

// 🩻 Ultrasound Template
function generateUltrasound(finding: string, bodyPart: string): string {
  return `🩻 **${bodyPart} Ultrasound**

**Technique:** Transabdominal/Transducer appropriate

**Findings:**
• Normal echotexture and size
• No masses, cysts, or collections
• Vascular flow normal on Doppler

**Impression:** ${finding}`;
}

// 📊 D-Dimer Template
function generateDDimer(finding: string): string {
  const ddimer = extractValue(finding, 'D-Dimer') || '250 ng/mL';
  return `📊 **D-Dimer (Quantitative)**

**Result:** ${ddimer} (Reference: <500 ng/mL FEU)

**Interpretation:** ${finding}`;
}

// 🧪 Templates Mapping
export const LAB_TEMPLATES: Record<string, (finding: string) => string> = {
  // Blood Tests
  'cbc': generateCBC,
  'complete blood count': generateCBC,
  'cmp': generateCMP,
  'comprehensive metabolic panel': generateCMP,
  'abg': generateABG,
  'arterial blood gas': generateABG,
  'troponin': generateTroponin,
  'troponin i': generateTroponin,
  'cardiac enzymes': generateTroponin,
  'coagulation': generateCoagulation,
  'coagulation profile': generateCoagulation,
  'pt ptt': generateCoagulation,
  'd-dimer': generateDDimer,
  'd dimer': generateDDimer,
  'urinalysis': generateUrinalysis,
  'ua': generateUrinalysis,
  
  // Imaging
  'ecg': generateECG,
  'ekg': generateECG,
  'electrocardiogram': generateECG,
  'echo': generateEcho,
  'echocardiogram': generateEcho,
  'tte': generateEcho,
  'cxr': generateCXR,
  'chest x-ray': generateCXR,
  'chest x ray': generateCXR,
  'ct head': generateCTHead,
  'ct brain': generateCTHead,
  
  // Generic
  'x-ray': generateXRay,
  'xray': generateXRay,
  'ultrasound': generateUltrasound,
  'us': generateUltrasound,
};

// 🎯 الدالة الرئيسية: تحول الـ finding المختصر إلى تقرير كامل
export function enhanceLabResult(testName: string, finding: string): string {
  const testLower = testName.toLowerCase();
  
  // البحث عن template مناسب
  for (const [key, generator] of Object.entries(LAB_TEMPLATES)) {
    if (testLower.includes(key) || key.includes(testLower)) {
      try {
        return generator(finding);
      } catch {
        // لو فشل الـ template، نرجع الـ finding زي ما هو
        return `📋 **${testName}**\n\n${finding}`;
      }
    }
  }
  
  // لو مفيش template، نرجع finding مع تنسيق بسيط
  return `📋 **${testName}**\n\n${finding}`;
}
