import { Scenario } from './types';

export const septicShockScenario: Scenario = {
  id: 'septic_shock',
  title: 'Septic Shock - Pneumonia',
  patient: { name: 'Mr. Ahmed Hassan', age: 65, gender: 'male', weight: 80, bed: 'ICU-3' },
  diagnosis: 'CAP → Septic Shock',
  description: '65M with CAP, hypotensive, febrile. Stabilize within 6 hours.',
  difficulty: 'Medium',
  durationMinutes: 360,
  initialStatus: 'critical',
  initialVitals: {
    hr: 120, bp: { systolic: 85, diastolic: 50 }, spo2: 89, rr: 28, temp: 39.2,
    cvp: 3, lactate: 5.8, urineOutput: 10, gcs: 14, etco2: 28,
    ph: 7.22, pao2: 68, paco2: 32, hco3: 14, baseExcess: -8,
  },
  goals: [
    'MAP > 65 mmHg',
    'Lactate < 2.5 mmol/L',
    'SpO2 > 92%',
    'Urine Output > 25 mL/hr',
    'Antibiotics within 1 hour',
  ],
  winConditions: { mapAbove: 65, lactateBelow: 2.5, spo2Above: 92, urineOutputAbove: 25 },
  loseConditions: { mapBelow: 25, spo2Below: 35, lactateAbove: 15 },
  hiddenLabs: {
    cbc: 'WBC: 22,000\nHb: 13.5\nPLT: 180,000',
    abg: 'pH: 7.22 | PaO2: 68 | PaCO2: 32\nHCO3: 14 | Lactate: 5.8 | BE: -8',
    cmp: 'Na: 138 | K: 4.2 | Cl: 102\nBUN: 28 | Cr: 1.6 | Glucose: 180',
  },
  timedEvents: [
    { simTime: 60, event: '⚠️ 1h passed - reassess' },
    { simTime: 180, event: '⚠️ 3h passed - check cultures' },
  ],
  hints: [
    { simTime: 15, text: '30mL/kg crystalloid for initial resuscitation' },
    { simTime: 45, text: 'Consider vasopressors if MAP < 65 after fluids' },
  ],
};
