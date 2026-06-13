import { ActionStatus, SeverityLevel, VitalSigns, PatientOutcomeCriteria } from '../types';

export interface CaseTemplate {
  complaint: string;
  diagnosis: string;
  severity: SeverityLevel;
  correctTriage: 1 | 2 | 3 | 4 | 5;
  differentials: string[];
  actions: Partial<{ id: string; name: string; timeCost: number; resultTime: number; category: string; status: ActionStatus; result: string; resourceRequired?: string; resourceTime?: number }>[];
  harmfulActions: string[];
  vitals: VitalSigns;
  outcomeCriteria: PatientOutcomeCriteria;
  survivalScores: Record<string, number>;
  xpReward: number;
}

export const CASE_TEMPLATES: Record<string, CaseTemplate[]> = {
  critical: [
    {
      complaint: 'Crushing chest pain radiating to left arm for 2h, diaphoretic',
      diagnosis: 'Anteroseptal STEMI', severity: 5, correctTriage: 1,
      differentials: ['Unstable Angina', 'Aortic Dissection', 'Pericarditis', 'GERD'],
      harmfulActions: ['thrombolysis', 'nsaids'],
      actions: [
        { id: 'history', name: 'History & Exam', timeCost: 3, resultTime: 0, category: 'clinical', status: 'available', result: 'Crushing substernal pain 8/10. Diaphoretic. Lungs clear.' },
        { id: 'ecg', name: '12-Lead ECG', timeCost: 5, resultTime: 0, category: 'investigation', status: 'available', result: 'STE 4mm V1-V4. Reciprocal STD II/III/aVF. STEMI.' },
        { id: 'aspirin', name: 'Aspirin 300mg PO', timeCost: 2, resultTime: 0, category: 'treatment', status: 'available', result: 'Antiplatelet. Mortality ↓23%.' },
        { id: 'heparin', name: 'UFH IV', timeCost: 5, resultTime: 0, category: 'treatment', status: 'available', result: '60u/kg bolus + 12u/kg/hr infusion.' },
        { id: 'cath_lab', name: 'Primary PCI', timeCost: 8, resultTime: 25, category: 'treatment', status: 'available', result: 'D2B 52min. DES LAD. TIMI 3.', resourceRequired: 'cathLab', resourceTime: 45 },
      ],
      vitals: { hr: 110, sbp: 155, dbp: 95, rr: 22, spo2: 94, temp: 37.1, gcs: 15 },
      outcomeCriteria: { requiredForSurvival: [], requiredForStability: ['ecg', 'aspirin', 'heparin', 'cath_lab'], timeExtensionActions: ['aspirin', 'heparin'] },
      survivalScores: { ecg: 15, aspirin: 20, heparin: 15, cath_lab: 45, history: 5 },
      xpReward: 200,
    },
    {
      complaint: 'Sudden tearing pain between shoulder blades, BP 210/110 RA, 165/95 LA',
      diagnosis: 'Type A Aortic Dissection', severity: 5, correctTriage: 1,
      differentials: ['STEMI', 'Massive PE', 'Esophageal Rupture', 'Acute Pericarditis'],
      harmfulActions: ['aspirin', 'heparin', 'thrombolysis', 'cath_lab'],
      actions: [
        { id: 'history', name: 'History & Exam', timeCost: 3, resultTime: 0, category: 'clinical', status: 'available', result: 'Tearing pain. BP diff 45mmHg. Pulse deficit L radial.' },
        { id: 'ecg', name: '12-Lead ECG', timeCost: 5, resultTime: 0, category: 'investigation', status: 'available', result: 'Sinus tach. LVH strain. No STE. NOT STEMI.' },
        { id: 'cxr', name: 'Chest X-Ray', timeCost: 8, resultTime: 10, category: 'imaging', status: 'available', result: 'Widened mediastinum 8.5cm. Loss aortic knob.' },
        { id: 'bp_control', name: 'Esmolol + Nicardipine IV', timeCost: 6, resultTime: 8, category: 'treatment', status: 'available', result: 'BP 120/75. Shear stress reduced.' },
        { id: 'ct_angio', name: 'CT Angiography', timeCost: 12, resultTime: 15, category: 'imaging', status: 'available', result: 'Type A dissection. Tamponade.', resourceRequired: 'ct', resourceTime: 25 },
        { id: 'surgery', name: 'Emergency CT Surgery', timeCost: 8, resultTime: 30, category: 'treatment', status: 'available', result: 'Ascending aorta repair.' },
      ],
      vitals: { hr: 98, sbp: 210, dbp: 110, rr: 20, spo2: 96, temp: 37.0, gcs: 15 },
      outcomeCriteria: { requiredForSurvival: [], requiredForStability: ['ecg', 'bp_control', 'surgery'], timeExtensionActions: ['bp_control'] },
      survivalScores: { ecg: 10, bp_control: 25, surgery: 50, ct_angio: 10, history: 5 },
      xpReward: 350,
    },
    {
      complaint: 'Sudden dyspnea, pleuritic pain, near-syncope, post-hip surgery 10d ago',
      diagnosis: 'Massive Pulmonary Embolism', severity: 5, correctTriage: 1,
      differentials: ['STEMI', 'Pneumothorax', 'Cardiac Tamponade', 'Pneumonia'],
      harmfulActions: ['aspirin', 'cath_lab', 'heparin'],
      actions: [
        { id: 'history', name: 'History & Exam', timeCost: 3, resultTime: 0, category: 'clinical', status: 'available', result: 'Sudden dyspnea. Hip replacement 10d ago. Calf swollen.' },
        { id: 'ecg', name: '12-Lead ECG', timeCost: 5, resultTime: 0, category: 'investigation', status: 'available', result: 'Sinus tach 125. S1Q3T3. Right axis. IRBBB.' },
        { id: 'echo', name: 'Bedside Echo', timeCost: 8, resultTime: 3, category: 'imaging', status: 'available', result: 'Dilated RV. McConnell sign. PAP 60mmHg.' },
        { id: 'thrombolysis', name: 'tPA for Massive PE', timeCost: 10, resultTime: 20, category: 'treatment', status: 'available', result: 'tPA 100mg. BP 110/70. SpO2 92%.' },
      ],
      vitals: { hr: 125, sbp: 88, dbp: 55, rr: 30, spo2: 85, temp: 37.2, gcs: 14 },
      outcomeCriteria: { requiredForSurvival: [], requiredForStability: ['ecg', 'echo', 'thrombolysis'], timeExtensionActions: ['thrombolysis'] },
      survivalScores: { ecg: 15, echo: 15, thrombolysis: 60, history: 5 },
      xpReward: 300,
    },
    {
      complaint: 'BP 72/40, confused, febrile 39.5°C, Foley catheter ×2 weeks',
      diagnosis: 'Septic Shock - CAUTI', severity: 5, correctTriage: 1,
      differentials: ['Cardiogenic Shock', 'Hypovolemic Shock', 'Adrenal Crisis', 'Anaphylaxis'],
      harmfulActions: [],
      actions: [
        { id: 'history', name: 'History & Exam', timeCost: 3, resultTime: 0, category: 'clinical', status: 'available', result: 'Fever, rigors. TURP 2wk ago. Warm extremities.' },
        { id: 'lactate', name: 'Lactate', timeCost: 3, resultTime: 10, category: 'lab', status: 'available', result: 'Lactate 5.8 (<2.0). Tissue hypoperfusion.' },
        { id: 'cultures', name: 'Blood/Urine Cultures', timeCost: 5, resultTime: 0, category: 'lab', status: 'available', result: 'Cultures drawn pre-antibiotics.' },
        { id: 'fluids', name: 'IV Crystalloid 30mL/kg', timeCost: 12, resultTime: 40, category: 'treatment', status: 'available', result: '2.5L LR. MAP 52→58.' },
        { id: 'vasopressors', name: 'Norepinephrine IV', timeCost: 10, resultTime: 10, category: 'treatment', status: 'available', result: 'Norepi 0.1mcg/kg/min. MAP 68.' },
        { id: 'antibiotics', name: 'IV Pip-Tazo 4.5g', timeCost: 6, resultTime: 90, category: 'treatment', status: 'available', result: 'Abx within 45min.' },
        { id: 'source', name: 'Remove Foley Catheter', timeCost: 8, resultTime: 20, category: 'treatment', status: 'available', result: 'Source controlled.' },
      ],
      vitals: { hr: 118, sbp: 72, dbp: 40, rr: 32, spo2: 94, temp: 39.5, gcs: 13 },
      outcomeCriteria: { requiredForSurvival: [], requiredForStability: ['lactate', 'fluids', 'vasopressors', 'antibiotics', 'source'], timeExtensionActions: ['fluids', 'vasopressors', 'antibiotics'] },
      survivalScores: { lactate: 5, cultures: 5, fluids: 30, vasopressors: 25, antibiotics: 25, source: 10, history: 5 },
      xpReward: 350,
    },
  ],
  urgent: [
    {
      complaint: 'Fever 39.5°C, productive cough, pleuritic pain ×2d',
      diagnosis: 'Severe CAP', severity: 3, correctTriage: 2,
      differentials: ['Bronchitis', 'PE', 'TB', 'Lung Abscess'],
      harmfulActions: [],
      actions: [
        { id: 'history', name: 'History & Exam', timeCost: 3, resultTime: 0, category: 'clinical', status: 'available', result: 'Fever, rigors, rusty sputum. Crackles RLL.' },
        { id: 'cxr', name: 'Chest X-Ray', timeCost: 8, resultTime: 10, category: 'imaging', status: 'available', result: 'RLL consolidation with air bronchograms.' },
        { id: 'o2', name: 'O2 to SpO2 >94%', timeCost: 3, resultTime: 3, category: 'treatment', status: 'available', result: 'SpO2 95% on 4L NC.' },
        { id: 'antibiotics', name: 'Ceftriaxone + Azithromycin', timeCost: 6, resultTime: 90, category: 'treatment', status: 'available', result: 'Abx within 2h.' },
      ],
      vitals: { hr: 112, sbp: 100, dbp: 65, rr: 30, spo2: 89, temp: 39.5, gcs: 15 },
      outcomeCriteria: { requiredForSurvival: [], requiredForStability: ['cxr', 'antibiotics', 'o2'], timeExtensionActions: ['antibiotics', 'o2'] },
      survivalScores: { cxr: 15, antibiotics: 50, o2: 20, history: 5 },
      xpReward: 150,
    },
    {
      complaint: 'Severe dyspnea ×2h, COPD on O2, purulent sputum',
      diagnosis: 'COPD Exacerbation with RF', severity: 4, correctTriage: 2,
      differentials: ['Pneumonia', 'Pulmonary Edema', 'PE', 'Pneumothorax'],
      harmfulActions: [],
      actions: [
        { id: 'history', name: 'History & Exam', timeCost: 3, resultTime: 0, category: 'clinical', status: 'available', result: 'Accessory muscles. 2-3 word sentences. Diffuse wheeze.' },
        { id: 'abg', name: 'ABG', timeCost: 6, resultTime: 8, category: 'lab', status: 'available', result: 'pH 7.22, pCO2 82, pO2 48. Acute-on-chronic RF.' },
        { id: 'niv', name: 'BiPAP', timeCost: 10, resultTime: 20, category: 'treatment', status: 'available', result: 'IPAP 16/EPAP 6. pH 7.31. SpO2 93%.' },
        { id: 'bronchodilators', name: 'Nebulizers', timeCost: 6, resultTime: 10, category: 'treatment', status: 'available', result: 'PEFR 80→140 L/min.' },
        { id: 'steroids', name: 'IV Methylprednisolone', timeCost: 3, resultTime: 45, category: 'treatment', status: 'available', result: 'Systemic steroid. ↓failure 50%.' },
      ],
      vitals: { hr: 115, sbp: 140, dbp: 85, rr: 34, spo2: 82, temp: 38.8, gcs: 15 },
      outcomeCriteria: { requiredForSurvival: [], requiredForStability: ['abg', 'niv', 'bronchodilators', 'steroids'], timeExtensionActions: ['niv', 'bronchodilators'] },
      survivalScores: { abg: 10, niv: 40, bronchodilators: 25, steroids: 15, history: 5 },
      xpReward: 200,
    },
  ],
  stable: [
    {
      complaint: 'Mild chest pain, reproducible with palpation, normal vitals',
      diagnosis: 'Costochondritis', severity: 1, correctTriage: 4,
      differentials: ['Stable Angina', 'GERD', 'Anxiety', 'Rib Fracture'],
      harmfulActions: ['cath_lab', 'thrombolysis', 'heparin'],
      actions: [
        { id: 'history', name: 'History & Exam', timeCost: 3, resultTime: 0, category: 'clinical', status: 'available', result: 'Tender 3rd-4th costochondral junction. Reproducible. No risk factors.' },
        { id: 'nsaids', name: 'Ibuprofen 400mg', timeCost: 2, resultTime: 20, category: 'treatment', status: 'available', result: 'Pain resolved completely.' },
      ],
      vitals: { hr: 72, sbp: 125, dbp: 80, rr: 16, spo2: 99, temp: 37.0, gcs: 15 },
      outcomeCriteria: { requiredForSurvival: [], requiredForStability: ['history'], timeExtensionActions: [] },
      survivalScores: { history: 50, nsaids: 20 },
      xpReward: 50,
    },
  ],
};

export function getCaseTemplate(priority: string, diagnosis: string): CaseTemplate | undefined {
  const templates = CASE_TEMPLATES[priority];
  if (!templates) return undefined;
  return templates.find(t => t.diagnosis === diagnosis);
}
