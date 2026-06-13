/**
 * shiftCore.ts
 * Core shift logic - patient generation, action processing, diagnosis
 * Pure functions that orchestrate the engine systems
 */

import { Patient, Action, ShiftState, PatientPriority, ActionStatus, Gender } from '../types';
import { CASE_TEMPLATES } from '../data/cases';
import { generateName } from '../data/names';
import { getLabDelay } from '../ResourceManager';
import { applyHarmfulActionEffects } from './physiologyEngine';

// ==================== CONSTANTS ====================

const CRITICAL_BASE = 35;
const URGENT_BASE = 70;
const STABLE_BASE = 140;

// ==================== BED MANAGEMENT ====================

function nextBed(state: ShiftState): number {
  const usedBeds = state.patients.map(p => p.bedNumber);
  let bed = 1;
  while (usedBeds.includes(bed)) bed++;
  return bed;
}

// ==================== PATIENT GENERATION ====================

export function generatePatient(
  priority: PatientPriority,
  id: string,
  state: ShiftState
): Patient {
  const gender: Gender = Math.random() > 0.45 ? 'male' : 'female';
  const templates = CASE_TEMPLATES[priority];
  const template = templates[Math.floor(Math.random() * templates.length)];
  const age = Math.floor(Math.random() * 55) + 25;
  const baseTimer = priority === 'critical' ? CRITICAL_BASE : priority === 'urgent' ? URGENT_BASE : STABLE_BASE;
  const bed = nextBed(state);

  return {
    id,
    name: generateName(gender),
    age,
    gender,
    complaint: template.complaint,
    priority,
    severity: template.severity,
    requiredActions: template.actions.map(a => ({
      ...a,
      status: 'available' as ActionStatus,
      resultAt: undefined,
    } as Action)),
    vitals: { ...template.vitals },
    deteriorationTimer: baseTimer + Math.floor(Math.random() * 8),
    deteriorationRate: priority === 'critical' ? 1.5 : priority === 'urgent' ? 1.0 : 0.5,
    location: 'ER',
    bedNumber: bed,
    status: 'waiting',
    disposition: 'pending',
    correctDiagnosis: template.diagnosis,
    differentialDiagnoses: template.differentials,
    outcomeCriteria: template.outcomeCriteria,
    xpReward: template.xpReward,
    diagnosisAttempted: false,
    diagnosisCorrect: false,
  };
}

// ==================== INITIAL SHIFT STATE ====================

export function createInitialPatients(
  level: string,
  state: ShiftState
): { patients: Patient[]; queuePatients: Patient[] } {
  const patientCounts: Record<string, number> = {
    intern: 2, junior: 4, senior: 8, chief: 12,
  };
  const count = patientCounts[level] || 3;

  const patients: Patient[] = [];
  for (let i = 0; i < count; i++) {
    const rand = Math.random();
    const priority: PatientPriority = rand < 0.25 ? 'critical' : rand < 0.55 ? 'urgent' : 'stable';
    patients.push(generatePatient(priority, `p${i + 1}`, state));
  }

  const queuePatients: Patient[] = [];
  for (let i = 0; i < 3; i++) {
    const rand = Math.random();
    queuePatients.push(
      generatePatient(
        rand < 0.3 ? 'critical' : rand < 0.7 ? 'urgent' : 'stable',
        `q${i + 1}`,
        state
      )
    );
  }

  return { patients, queuePatients };
}

// ==================== ACTION PROCESSING ====================

export function processAction(
  patient: Patient,
  actionId: string,
  timeElapsed: number,
  shiftType: string
): { updatedPatient: Patient; isHarmful: boolean } {
  const aIdx = patient.requiredActions.findIndex(a => a.id === actionId);
  if (aIdx === -1) return { updatedPatient: patient, isHarmful: false };

  const action = patient.requiredActions[aIdx];
  if (action.status !== 'available') return { updatedPatient: patient, isHarmful: false };

  // Check if harmful
  const templates = CASE_TEMPLATES[patient.priority];
  const template = templates.find(t => t.diagnosis === patient.correctDiagnosis);
  const isHarmful = template?.harmfulActions?.includes(actionId) || false;

  // Calculate completion time
  const labMultiplier = action.category === 'lab' ? getLabDelay(shiftType as any) : 1;
  const completionTime = timeElapsed + Math.floor(
    (action.resultTime || action.timeCost) * labMultiplier
  );

  // Update action
  const updatedActions = [...patient.requiredActions];
  updatedActions[aIdx] = {
    ...action,
    status: 'in-progress' as ActionStatus,
    resultAt: completionTime,
  };

  // Calculate effects
  const timeExtension = !isHarmful &&
    action.category === 'treatment' &&
    patient.outcomeCriteria.timeExtensionActions.includes(actionId) ? 8 : 0;
  const deteriorationPenalty = isHarmful ? 20 : 0;

  let updatedPatient: Patient = {
    ...patient,
    requiredActions: updatedActions,
    status: patient.status === 'waiting' ? 'in-progress' : patient.status,
    deteriorationTimer: Math.max(
      1,
      patient.deteriorationTimer + timeExtension - deteriorationPenalty
    ),
  };

  // Apply harmful effects
  if (isHarmful) {
    updatedPatient = applyHarmfulActionEffects(updatedPatient, actionId);
  }

  return { updatedPatient, isHarmful };
}

// ==================== COMPLETE IN-PROGRESS ACTIONS ====================

export function completeActions(patients: Patient[], timeElapsed: number): Patient[] {
  return patients.map(p => ({
    ...p,
    requiredActions: p.requiredActions.map(a => {
      if (a.status === 'in-progress' && a.resultAt && timeElapsed >= a.resultAt) {
        return { ...a, status: 'completed' as ActionStatus };
      }
      return a;
    }),
  }));
}

// ==================== DIAGNOSIS ====================

export function processDiagnosis(
  patient: Patient,
  diagnosis: string
): { updatedPatient: Patient; isCorrect: boolean; xpChange: number; repChange: number } {
  if (patient.diagnosisAttempted) {
    return {
      updatedPatient: patient,
      isCorrect: patient.diagnosisCorrect,
      xpChange: 0,
      repChange: 0,
    };
  }

  const isCorrect = diagnosis === patient.correctDiagnosis;
  const xpChange = isCorrect ? Math.floor(patient.xpReward * 0.5) : -50;
  const repChange = isCorrect ? 30 : -35;

  return {
    updatedPatient: {
      ...patient,
      diagnosisAttempted: true,
      diagnosisCorrect: isCorrect,
      deteriorationTimer: isCorrect
        ? patient.deteriorationTimer
        : Math.max(1, patient.deteriorationTimer - 12),
    },
    isCorrect,
    xpChange,
    repChange,
  };
}

// ==================== RESOURCE RELEASE ====================

export function releasePatientResources(patient: Patient, resources: any): any {
  if (patient.status !== 'transferred') return resources;

  let updatedResources = resources;
  patient.requiredActions.forEach(a => {
    if (a.resourceRequired) {
      // Release handled by ResourceManager
    }
  });

  return updatedResources;
}
