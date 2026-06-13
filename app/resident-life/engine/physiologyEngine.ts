/**
 * PhysiologyEngine.ts
 * Pure functions for vital signs deterioration and patient physiology
 * No state mutation - returns new objects only
 */

import { Patient, VitalSigns, PatientStatus } from '../types';
import { getCaseTemplate } from '../data/cases';

// ==================== CONSTANTS ====================

const DEATH_THRESHOLD_SCORE = 15;
const DETERIORATE_THRESHOLD_SCORE = 35;
const STABLE_THRESHOLD_SCORE = 70;
const STABLE_DISCHARGE_TIME = 20;

// ==================== SURVIVAL SCORE ====================

export function calculateSurvivalScore(patient: Patient): number {
  const template = getCaseTemplate(patient.priority, patient.correctDiagnosis);
  if (!template) return 0;

  let score = 0;
  const scores = template.survivalScores || {};

  // Add scores for completed actions
  patient.requiredActions.forEach(action => {
    if (action.status === 'completed' && scores[action.id]) {
      score += scores[action.id];
    }
  });

  // Penalty for harmful actions
  template.harmfulActions.forEach(harmfulId => {
    const harmfulAction = patient.requiredActions.find(a => a.id === harmfulId);
    if (harmfulAction && harmfulAction.status === 'completed') {
      score -= 50;
    }
  });

  // Bonus for correct diagnosis
  if (patient.diagnosisCorrect) {
    score += 10;
  }

  return Math.max(0, Math.min(100, score));
}

// ==================== VITALS DETERIORATION ====================

export function deteriorateVitals(
  vitals: VitalSigns,
  survivalScore: number,
  isHarmful: boolean
): VitalSigns {
  const newVitals = { ...vitals };

  if (isHarmful) {
    // Catastrophic deterioration from harmful treatment
    newVitals.sbp = Math.max(30, newVitals.sbp - 8);
    newVitals.hr = Math.min(180, newVitals.hr + 10);
    newVitals.spo2 = Math.max(45, newVitals.spo2 - 5);
    newVitals.gcs = Math.max(3, newVitals.gcs - 2);
  } else if (survivalScore < DETERIORATE_THRESHOLD_SCORE) {
    // Severe deterioration
    newVitals.sbp = Math.max(40, newVitals.sbp - 4);
    newVitals.hr = Math.min(170, newVitals.hr + 6);
    newVitals.spo2 = Math.max(55, newVitals.spo2 - 3);
    newVitals.gcs = Math.max(3, newVitals.gcs - (survivalScore < 20 ? 2 : 1));
  } else if (survivalScore < STABLE_THRESHOLD_SCORE) {
    // Moderate deterioration
    newVitals.sbp = Math.max(55, newVitals.sbp - 2);
    newVitals.hr = Math.min(150, newVitals.hr + 3);
    newVitals.spo2 = Math.max(70, newVitals.spo2 - 1);
  }
  // If score >= 70: vitals remain stable

  return newVitals;
}

// ==================== RECOVERY VITALS ====================

export function recoveryVitals(vitals: VitalSigns): VitalSigns {
  return {
    hr: Math.max(65, vitals.hr - 25),
    sbp: Math.min(vitals.sbp + 25, 140),
    dbp: Math.min(vitals.dbp + 15, 85),
    rr: Math.max(14, vitals.rr - 8),
    spo2: Math.min(vitals.spo2 + 5, 99),
    temp: Math.max(36.5, vitals.temp - 1.5),
    gcs: 15,
  };
}

// ==================== PATIENT STATUS UPDATE ====================

export interface PhysiologyResult {
  patient: Patient;
  event?: string;
  patientSaved?: boolean;
  patientDied?: boolean;
}

export function updatePatientPhysiology(
  patient: Patient,
  timeElapsed: number,
  isEarlyPhase: boolean
): PhysiologyResult {
  // Dead patients stay dead
  if (patient.status === 'died') {
    return { patient };
  }

  // Stable patients count down to discharge
  if (patient.status === 'stable') {
    const newTimer = patient.deteriorationTimer - 1;
    if (newTimer <= -STABLE_DISCHARGE_TIME) {
      return {
        patient: {
          ...patient,
          status: 'transferred',
          location: patient.disposition === 'icu' ? 'ICU' : 'Ward',
        },
        event: `🏠 ${patient.name} discharged to ${patient.disposition}.`,
      };
    }
    return { patient: { ...patient, deteriorationTimer: newTimer } };
  }

  // Active patients
  const survivalScore = calculateSurvivalScore(patient);
  const template = getCaseTemplate(patient.priority, patient.correctDiagnosis);
  
  const stabilityMet = patient.outcomeCriteria.requiredForStability.every(a =>
    patient.requiredActions.find(act => act.id === a)?.status === 'completed'
  );

  const isHarmful = patient.requiredActions.some(a => {
    return template?.harmfulActions.includes(a.id) && a.status === 'completed';
  });

  // Check stabilization
  if (stabilityMet && survivalScore >= STABLE_THRESHOLD_SCORE) {
    return {
      patient: {
        ...patient,
        deteriorationTimer: STABLE_DISCHARGE_TIME,
        status: 'stable',
        vitals: recoveryVitals(patient.vitals),
        disposition: patient.priority === 'critical' ? 'icu' : 'ward',
      },
      event: `✅ ${patient.name} stabilized (score: ${survivalScore}).`,
      patientSaved: true,
    };
  }

  // Calculate deterioration
  const rate = isEarlyPhase ? 0.3 : patient.deteriorationRate;
  const newTimer = patient.deteriorationTimer - rate;
  const newVitals = deteriorateVitals(patient.vitals, survivalScore, isHarmful);

  // Death check
  if ((survivalScore < DEATH_THRESHOLD_SCORE || isHarmful) && newTimer <= -8) {
    return {
      patient: {
        ...patient,
        status: 'died',
        vitals: newVitals,
      },
      event: `💀 ${patient.name} died. Score: ${survivalScore}${isHarmful ? ' (HARMFUL treatment!)' : ''}.`,
      patientDied: true,
    };
  }

  // Deterioration check
  if ((survivalScore < DETERIORATE_THRESHOLD_SCORE || isHarmful) && newTimer <= 0 && patient.status !== 'deteriorated') {
    return {
      patient: {
        ...patient,
        deteriorationTimer: newTimer,
        status: 'deteriorated',
        vitals: newVitals,
      },
      event: `⚠️ ${patient.name} deteriorating! Score: ${survivalScore}. VS: BP ${newVitals.sbp}/${newVitals.dbp}, HR ${newVitals.hr}, SpO2 ${newVitals.spo2}%${isHarmful ? ' [HARMFUL TX]' : ''}.`,
    };
  }

  // Continue deteriorating
  return {
    patient: {
      ...patient,
      deteriorationTimer: newTimer,
      vitals: newVitals,
    },
  };
}

// ==================== BATCH UPDATE ====================

export function updateAllPatients(
  patients: Patient[],
  timeElapsed: number
): {
  updatedPatients: Patient[];
  events: string[];
  patientsSaved: number;
  patientsDied: number;
} {
  const events: string[] = [];
  let patientsSaved = 0;
  let patientsDied = 0;
  const isEarlyPhase = timeElapsed < 5;

  const updatedPatients = patients.map(p => {
    const result = updatePatientPhysiology(p, timeElapsed, isEarlyPhase);
    if (result.event) events.push(result.event);
    if (result.patientSaved) patientsSaved++;
    if (result.patientDied) patientsDied++;
    return result.patient;
  });

  return { updatedPatients, events, patientsSaved, patientsDied };
}

// ==================== ACTION EFFECTS ====================

export function applyHarmfulActionEffects(patient: Patient, actionId: string): Patient {
  const template = getCaseTemplate(patient.priority, patient.correctDiagnosis);
  if (!template?.harmfulActions.includes(actionId)) return patient;

  return {
    ...patient,
    vitals: {
      ...patient.vitals,
      sbp: Math.max(30, patient.vitals.sbp - 15),
      hr: Math.min(180, patient.vitals.hr + 15),
      spo2: Math.max(50, patient.vitals.spo2 - 8),
      gcs: Math.max(3, patient.vitals.gcs - 2),
    },
    deteriorationTimer: Math.max(1, patient.deteriorationTimer - 20),
  };
}
