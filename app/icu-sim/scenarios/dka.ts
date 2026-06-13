import { Scenario } from './types';

export const dkaScenario: Scenario = {
  id: 'dka',
  title: 'Diabetic Ketoacidosis',
  patient: {
    name: 'Ms. Fatima Al-Zahrani',
    age: 22,
    gender: 'female',
    weight: 60,
    bed: 'ICU-5',
  },
  diagnosis: 'Type 1 DM → Severe DKA',
  description: '22F with DM1, vomiting x2 days, Kussmaul breathing. Close the anion gap and correct dehydration.',
  difficulty: 'Medium',
  durationMinutes: 360,
  initialStatus: 'critical',

  initialVitals: {
    hr: 135,
    bp: { systolic: 90, diastolic: 55 },
    spo2: 96,
    rr: 32,
    temp: 36.1,
    cvp: 2,
    lactate: 2.1,
    urineOutput: 5,
    gcs: 13,
    etco2: 18,
    ph: 7.08,
    pao2: 98,
    paco2: 22,
    hco3: 8,
    baseExcess: -22,
  },

  goals: [
    'pH > 7.30',
    'HCO3 > 15',
    'Anion Gap < 12',
    'Potassium 3.5-5.0',
    'Glucose < 250 mg/dL',
    'Urine Output > 30 mL/hr',
  ],

  winConditions: {
    phAbove: 7.30,
    urineOutputAbove: 30,
    mapAbove: 65,
  },

  loseConditions: {
    phBelow: 6.9,
    mapBelow: 25,
  },

  hiddenLabs: {
    cbc: 'WBC: 16,000\nHb: 14.2 g/dL\nPLT: 250,000',
    abg: 'pH: 7.08 | PaO2: 98 | PaCO2: 22\nHCO3: 8 | BE: -22',
    cmp: 'Na: 130 | K: 5.8 | Cl: 94\nBUN: 38 | Cr: 1.4 | Glucose: 620',
    serum_ketones: 'Positive - Large amount',
    anion_gap: '28 (Normal < 12)',
    serum_osmolality: '320 mOsm/kg',
  },

  timedEvents: [
    { simTime: 30, event: '⚠️ Potassium dropping - monitor ECG closely' },
    { simTime: 120, event: '⚠️ 2 hours - reassess anion gap and pH' },
    { simTime: 240, event: '⚠️ 4 hours - consider transitioning to subcutaneous insulin' },
  ],

  hints: [
    { simTime: 10, text: 'Start with 0.9% NaCl: 15-20 mL/kg in first hour' },
    { simTime: 30, text: 'Insulin infusion: 0.1 units/kg/hr. Add K+ to fluids when K < 5.0' },
  ],
};
