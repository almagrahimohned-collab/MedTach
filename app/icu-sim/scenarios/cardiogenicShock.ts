import { Scenario } from './types';

export const cardiogenicShockScenario: Scenario = {
  id: 'cardiogenic_shock',
  title: 'Cardiogenic Shock',
  patient: {
    name: 'Mr. Khalid Al-Otaibi',
    age: 58,
    gender: 'male',
    weight: 85,
    bed: 'ICU-2',
  },
  diagnosis: 'Anterior STEMI → Cardiogenic Shock',
  description: '58M post-PCI, hypotensive with cold extremities and pulmonary congestion. Manage cardiogenic shock.',
  difficulty: 'Hard',
  durationMinutes: 360,
  initialStatus: 'critical',

  initialVitals: {
    hr: 115,
    bp: { systolic: 78, diastolic: 48 },
    spo2: 88,
    rr: 26,
    temp: 36.4,
    cvp: 16,
    lactate: 4.8,
    urineOutput: 8,
    gcs: 14,
    etco2: 22,
    ph: 7.28,
    pao2: 62,
    paco2: 38,
    hco3: 18,
    baseExcess: -8,
  },

  goals: [
    'MAP > 65 mmHg',
    'Cardiac Index > 2.2 L/min/m²',
    'Lactate < 2.0 mmol/L',
    'Urine Output > 30 mL/hr',
    'SpO2 > 92%',
  ],

  winConditions: {
    mapAbove: 65,
    lactateBelow: 2.0,
    spo2Above: 92,
    urineOutputAbove: 30,
  },

  loseConditions: {
    mapBelow: 25,
    spo2Below: 35,
    lactateAbove: 10,
  },

  hiddenLabs: {
    cbc: 'WBC: 12,000\nHb: 14.5 g/dL\nPLT: 220,000',
    abg: 'pH: 7.28 | PaO2: 62 | PaCO2: 38\nHCO3: 18 | BE: -8',
    cmp: 'Na: 136 | K: 4.8 | Cl: 100\nBUN: 32 | Cr: 1.7 | Glucose: 160',
    troponin: 'Troponin I: 45 ng/mL (Peak)',
    bnp: 'BNP: 2800 pg/mL (Severely elevated)',
    cxr: 'Pulmonary edema, enlarged cardiac silhouette',
    echo: 'EF: 25%, Severe hypokinesis anterior wall\nModerate MR',
    ecg: 'ST elevation V1-V4, Q waves anterior leads',
    lactate_serial: '4.8 → 5.2 → worsening',
  },

  timedEvents: [
    { simTime: 30, event: '⚠️ Blood pressure dropping further - consider inotropes' },
    { simTime: 60, event: '⚠️ 1 hour - reassess cardiac output and perfusion' },
    { simTime: 120, event: '⚠️ 2 hours - consider mechanical support if no improvement' },
  ],

  hints: [
    { simTime: 10, text: 'Avoid excessive fluids - cardiogenic shock needs inotropes, not volume' },
    { simTime: 20, text: 'Dobutamine 2.5-20 mcg/kg/min is first-line inotrope' },
    { simTime: 45, text: 'If MAP < 60 despite inotropes, add Noradrenaline' },
  ],
};
