/**
 * EventEngine.ts
 * Manages interruptions, consults, mass casualty events, and new patient arrivals
 * Pure functions - returns new state, no mutations
 */

import { Patient, ConsultRequest, Interruption, ShiftState, PatientPriority } from '../types';
import { generatePatient } from './shiftCore';

// ==================== CONSTANTS ====================

const TRIAGE_TIMERS: Record<number, number> = { 1: 5, 2: 15, 3: 30, 4: 60, 5: 90 };

// ==================== NEW PATIENT ARRIVALS ====================

export function processNewArrivals(
  state: ShiftState,
  timeElapsed: number
): {
  updatedPatients: Patient[];
  updatedQueue: Patient[];
  events: string[];
} {
  const events: string[] = [];
  let patients = [...state.patients];
  let queue = [...state.patientQueue];

  // First arrival at 3 minutes, then every 6 minutes
  if (queue.length > 0 && (timeElapsed === 3 || (timeElapsed > 5 && timeElapsed % 6 === 0))) {
    const newPatient: Patient = {
      ...queue[0],
      arrivalTime: timeElapsed,
    };
    patients = [...patients, newPatient];
    queue = queue.slice(1);
    events.push(
      `🚨 New: ${newPatient.name}, ${newPatient.age}${newPatient.gender === 'male' ? 'M' : 'F'} - ${newPatient.complaint.substring(0, 40)}...`
    );
  }

  // Refill queue
  if (timeElapsed > 3 && timeElapsed % 10 === 0 && queue.length < 4) {
    const rand = Math.random();
    const priority: PatientPriority = rand < 0.25 ? 'critical' : rand < 0.6 ? 'urgent' : 'stable';
    queue = [...queue, generatePatient(priority, `q${timeElapsed}`, state)];
  }

  return { updatedPatients: patients, updatedQueue: queue, events };
}

// ==================== MASS CASUALTY ====================

export function checkMassCasualty(
  state: ShiftState,
  timeElapsed: number
): {
  updatedQueue: Patient[];
  events: string[];
} {
  const events: string[] = [];
  let queue = [...state.patientQueue];

  if (timeElapsed === 40 && Math.random() < 0.15) {
    const count = 6 + Math.floor(Math.random() * 6);
    events.push(`🚨 MASS CASUALTY: ${count} patients incoming!`);

    for (let i = 0; i < count; i++) {
      const priority: PatientPriority = i < 3 ? 'critical' : i < 7 ? 'urgent' : 'stable';
      queue = [generatePatient(priority, `mc_${i}`, state), ...queue];
    }
  }

  return { updatedQueue: queue, events };
}

// ==================== INTERRUPTIONS ====================

export function checkInterruptions(
  state: ShiftState,
  timeElapsed: number
): {
  updatedInterruptions: Interruption[];
  events: string[];
} {
  const events: string[] = [];
  let interruptions = [...state.interruptions];

  if (timeElapsed > 5 && timeElapsed % 7 === 0 && Math.random() < 0.4) {
    const its: Interruption[] = [
      {
        id: `i${timeElapsed}`, type: 'nurse',
        message: 'Nurse: Bed 4 BP dropping!',
        urgency: 'high', requiresResponse: true,
        timeCost: 3, resolved: false, timeTrigger: timeElapsed,
      },
      {
        id: `i${timeElapsed}`, type: 'lab',
        message: 'Lab: Critical K+ 7.2 on Bed 2!',
        urgency: 'high', requiresResponse: true,
        timeCost: 3, resolved: false, timeTrigger: timeElapsed,
      },
      {
        id: `i${timeElapsed}`, type: 'equipment',
        message: '⚠️ CT scanner malfunction! 15min repair.',
        urgency: 'high', requiresResponse: true,
        timeCost: 2, resolved: false, timeTrigger: timeElapsed,
      },
      {
        id: `i${timeElapsed}`, type: 'family',
        message: 'Family demanding update on Bed 5.',
        urgency: 'medium', requiresResponse: false,
        timeCost: 5, resolved: false, timeTrigger: timeElapsed,
      },
      {
        id: `i${timeElapsed}`, type: 'code_blue',
        message: '🚨 CODE BLUE - Bed 3! Patient unresponsive!',
        urgency: 'high', requiresResponse: true,
        timeCost: 15, resolved: false, timeTrigger: timeElapsed,
      },
    ];

    const selected = its[Math.floor(Math.random() * its.length)];
    interruptions = [...interruptions, selected];
    events.push(`🔔 ${selected.type.toUpperCase()}: ${selected.message}`);
  }

  return { updatedInterruptions: interruptions, events };
}

// ==================== CONSULTS ====================

export function checkConsults(
  state: ShiftState,
  timeElapsed: number
): {
  updatedConsults: ConsultRequest[];
  events: string[];
} {
  const events: string[] = [];
  let consults = [...state.consults];

  if (timeElapsed > 10 && timeElapsed % 14 === 0 && Math.random() < 0.45) {
    const cs: ConsultRequest[] = [
      {
        id: `c${timeElapsed}`, from: 'OB/GYN',
        patient: '27F 32w pregnant',
        description: 'BP 170/110, proteinuria, headache',
        question: 'Most likely diagnosis?',
        options: ['Preeclampsia with severe features', 'Eclampsia', 'HELLP Syndrome', 'Gestational HTN'],
        correctAnswer: 0, timeCost: 10, repReward: 25,
        accepted: false, completed: false, answerGiven: null,
      },
      {
        id: `c${timeElapsed}`, from: 'Pediatrics',
        patient: '6M child',
        description: 'Fever 40°C, irritable, refusing feeds',
        question: 'Next best step?',
        options: ['LP for meningitis', 'CBC + Blood culture', 'CXR', 'Observe and hydrate'],
        correctAnswer: 1, timeCost: 8, repReward: 20,
        accepted: false, completed: false, answerGiven: null,
      },
    ];

    const selected = cs[Math.floor(Math.random() * cs.length)];
    consults = [...consults, selected];
    events.push(`📞 Consult from ${selected.from}: ${selected.description}`);
  }

  return { updatedConsults: consults, events };
}

// ==================== FORGOTTEN PATIENT CHECK ====================

export function checkForgottenPatients(
  patients: Patient[],
  timeElapsed: number
): string[] {
  const events: string[] = [];

  if (timeElapsed % 5 === 0 && timeElapsed > 3) {
    const forgotten = patients.filter(p => {
      if (p.status !== 'waiting' || !p.arrivalTime) return false;
      if (p.requiredActions.some(a => a.status !== 'available')) return false;

      // Determine triage-based timeout
      let triageLevel = 3; // default
      if (p.priority === 'critical') triageLevel = 1;
      else if (p.priority === 'urgent') triageLevel = 2;

      const maxWait = TRIAGE_TIMERS[triageLevel] || 30;
      return timeElapsed - p.arrivalTime > maxWait;
    });

    if (forgotten.length > 0) {
      events.push(
        `⚠️ ${forgotten[0].name} (Bed ${forgotten[0].bedNumber}) overdue for assessment (${timeElapsed - (forgotten[0].arrivalTime || 0)}min).`
      );
    }
  }

  return events;
}

// ==================== FATIGUE ====================

export function updateFatigue(
  state: ShiftState,
  timeElapsed: number
): {
  mental: number;
  physical: number;
  total: number;
  focus: number;
  events: string[];
} {
  const events: string[] = [];

  if (timeElapsed % 25 !== 0 || timeElapsed === 0) {
    return {
      mental: state.fatigue.mental,
      physical: state.fatigue.physical,
      total: state.fatigue.total,
      focus: state.focus,
      events: [],
    };
  }

  const mental = Math.max(5, state.fatigue.mental - 5);
  const physical = Math.max(5, state.fatigue.physical - 3);
  const total = Math.max(5, state.fatigue.total - 4);
  const focus = Math.max(10, state.focus - 3);

  if (total < 25 && timeElapsed % 50 === 0) {
    events.push('😴 SEVERE FATIGUE: Risk of errors increased significantly.');
  }

  return { mental, physical, total, focus, events };
}
