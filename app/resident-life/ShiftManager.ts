/**
 * ShiftManager.ts - FACADE ONLY
 * Thin wrapper that delegates to engine modules
 * No business logic here - just orchestration
 */

import { Patient, Action, ShiftState, ShiftResult, GameLevel, ShiftType } from './types';
import { createInitialResources, updateResourceState, getResourceStatusText } from './ResourceManager';
import { createAchievementState, checkAchievements, AchievementEvent } from './AchievementSystem';
import { createCareerState, addXp, recordShift, getLevelProgress } from './CareerSystem';

// Engine imports
import { updateAllPatients } from './engine/physiologyEngine';
import { getSuggestedPatient, getClinicalPearls, getClinicalAudit, calculateShiftScore, calculateHandoverQuality } from './engine/scoringEngine';
import { processNewArrivals, checkMassCasualty, checkInterruptions, checkConsults, checkForgottenPatients, updateFatigue } from './engine/eventEngine';
import { createInitialPatients, completeActions, processAction, processDiagnosis } from './engine/shiftCore';

// ==================== CONSTANTS ====================

export const TICK_SPEED_MS = 2000;

// ==================== SHIFT CREATION ====================

export async function createInitialShift(
  level: string,
  shiftType?: string,
  careerState?: any
): Promise<ShiftState> {
  const selectedShiftType: ShiftType = (shiftType || (Math.random() > 0.5 ? 'morning' : 'night')) as ShiftType;

  const baseState: ShiftState = {
    timeElapsed: 0, focus: 100,
    fatigue: { mental: 100, physical: 100, total: 100 },
    reputation: 500, xp: 0,
    patients: [], consults: [], interruptions: [], events: [],
    level: level as GameLevel, shiftsCompleted: 0,
    totalPatientsTreated: 0, totalDeaths: 0, correctDiagnoses: 0,
    patientQueue: [], shiftType: selectedShiftType,
    resources: createInitialResources(selectedShiftType),
    achievements: createAchievementState(),
    career: careerState || createCareerState(),
    achievementEvents: [],
    handover: { items: [], quality: 100, penalty: 0 },
    shiftStartTime: Date.now(), paused: false, gameSpeed: 1,
  };

  const { patients, queuePatients } = createInitialPatients(level, baseState);
  baseState.patients = patients;
  baseState.patientQueue = queuePatients;
  baseState.events = [
    `${selectedShiftType === 'night' ? '🌙 Night' : '🌅 Morning'} shift. ${patients.length} patients waiting.`,
  ];

  return baseState;
}

// ==================== SHIFT UPDATE ====================

export function updateShift(state: ShiftState): ShiftState {
  if (state.paused) return state;

  const newTime = state.timeElapsed + 1;
  let events: string[] = [];

  // 1. Complete in-progress actions
  let patients = completeActions(state.patients, newTime);

  // 2. Update patient physiology
  const physResult = updateAllPatients(patients, newTime);
  patients = physResult.updatedPatients;
  events = [...events, ...physResult.events];

  // 3. Update resources
  const resources = updateResourceState(state.resources, 1);

  // 4. New patient arrivals
  const arrivalResult = processNewArrivals(state, newTime);
  patients = arrivalResult.updatedPatients;
  const patientQueue = arrivalResult.updatedQueue;
  events = [...events, ...arrivalResult.events];

  // 5. Mass casualty
  const mcResult = checkMassCasualty(state, newTime);
  const finalQueue = mcResult.updatedQueue.length > patientQueue.length ? mcResult.updatedQueue : patientQueue;
  events = [...events, ...mcResult.events];

  // 6. Interruptions
  const intResult = checkInterruptions(state, newTime);
  const interruptions = intResult.updatedInterruptions;
  events = [...events, ...intResult.events];

  // 7. Consults
  const consResult = checkConsults(state, newTime);
  const consults = consResult.updatedConsults;
  events = [...events, ...consResult.events];

  // 8. Forgotten patients
  const forgottenEvents = checkForgottenPatients(patients, newTime);
  events = [...events, ...forgottenEvents];

  // 9. Fatigue
  const fatigueResult = updateFatigue(state, newTime);
  events = [...events, ...fatigueResult.events];

  // 10. Previous events (keep last 50)
  const allEvents = [...state.events, ...events].slice(-50);

  return {
    ...state,
    timeElapsed: newTime,
    patients,
    patientQueue: finalQueue,
    resources,
    interruptions,
    consults,
    events: allEvents,
    fatigue: {
      mental: fatigueResult.mental,
      physical: fatigueResult.physical,
      total: fatigueResult.total,
    },
    focus: fatigueResult.focus,
    totalPatientsTreated: state.totalPatientsTreated + physResult.patientsSaved,
    totalDeaths: state.totalDeaths + physResult.patientsDied,
  };
}

// ==================== ACTIONS ====================

export function performAction(state: ShiftState, patientId: string, actionId: string): ShiftState {
  const pIdx = state.patients.findIndex(p => p.id === patientId);
  if (pIdx === -1) return state;

  const patient = state.patients[pIdx];
  const { updatedPatient, isHarmful } = processAction(patient, actionId, state.timeElapsed, state.shiftType);

  const newPatients = [...state.patients];
  newPatients[pIdx] = updatedPatient;

  const events = [...state.events];
  if (isHarmful) {
    events.push(`⚠️ CRITICAL: Harmful treatment given to ${patient.name}!`);
  }

  const action = patient.requiredActions.find(a => a.id === actionId);
  if (action) {
    const completionTime = state.timeElapsed + (action.resultTime || action.timeCost);
    events.push(
      `[${state.timeElapsed}m] Started: ${action.name} - ${patient.name} (ready in ${Math.ceil(completionTime - state.timeElapsed)}min)`
    );
  }

  return { ...state, patients: newPatients, events };
}

export function makeDiagnosis(state: ShiftState, patientId: string, diagnosis: string): ShiftState {
  const pIdx = state.patients.findIndex(p => p.id === patientId);
  if (pIdx === -1) return state;

  const patient = state.patients[pIdx];
  const result = processDiagnosis(patient, diagnosis);

  const newPatients = [...state.patients];
  newPatients[pIdx] = result.updatedPatient;

  const events = [...state.events];
  if (result.isCorrect) {
    events.push(`✅ Correct: ${diagnosis}! +${result.xpChange} XP`);
  } else {
    events.push(`❌ Wrong: ${diagnosis}. Correct: ${patient.correctDiagnosis}. -12min penalty.`);
  }

  return {
    ...state,
    patients: newPatients,
    xp: state.xp + result.xpChange,
    reputation: state.reputation + result.repChange,
    correctDiagnoses: result.isCorrect ? state.correctDiagnoses + 1 : state.correctDiagnoses,
    events,
  };
}

// ==================== CONSULTS ====================

export function acceptConsult(state: ShiftState, consultId: string): ShiftState {
  return {
    ...state,
    consults: state.consults.map(c => c.id === consultId ? { ...c, accepted: true } : c),
  };
}

export function answerConsult(state: ShiftState, consultId: string, answerIndex: number): ShiftState {
  const cIdx = state.consults.findIndex(c => c.id === consultId);
  if (cIdx === -1) return state;
  const consult = state.consults[cIdx];
  if (consult.completed) return state;

  const isCorrect = answerIndex === consult.correctAnswer;
  const newConsults = [...state.consults];
  newConsults[cIdx] = { ...consult, accepted: true, completed: true, answerGiven: answerIndex };

  return {
    ...state,
    consults: newConsults,
    reputation: state.reputation + (isCorrect ? consult.repReward : -15),
    xp: state.xp + (isCorrect ? 30 : 0),
    events: [
      ...state.events,
      isCorrect
        ? `✅ ${consult.from} consult correct! +${consult.repReward} rep`
        : `❌ ${consult.from} consult incorrect. Correct: ${consult.options[consult.correctAnswer]}`,
    ],
  };
}

// ==================== INTERRUPTIONS ====================

export function resolveInterruption(state: ShiftState, interruptionId: string): ShiftState {
  const interruption = state.interruptions.find(i => i.id === interruptionId);
  if (!interruption) return state;

  return {
    ...state,
    interruptions: state.interruptions.map(i => i.id === interruptionId ? { ...i, resolved: true } : i),
    focus: Math.min(100, state.focus + 5),
    events: [...state.events, `✅ Handled: ${interruption.message}`],
  };
}

// ==================== SHIFT END ====================

export function evaluateShift(state: ShiftState): ShiftResult {
  const consultsAnswered = state.consults.filter(c => c.completed).length;
  const consultsCorrect = state.consults.filter(c => c.completed && c.answerGiven === c.correctAnswer).length;
  const interruptionsHandled = state.interruptions.filter(i => i.resolved).length;

  const handover = calculateHandoverQuality(state.patients);
  const score = calculateShiftScore(
    state.patients, consultsAnswered, consultsCorrect,
    interruptionsHandled, handover.quality, handover.penalty
  );

  // Achievements
  let updatedAchievements = state.achievements;
  let newlyEarnedXP = 0;
  const unlockedNames: string[] = [];

  const shiftEvents: AchievementEvent[] = [
    ...state.achievementEvents,
    { type: 'shift_complete', data: { deaths: state.patients.filter(p => p.status === 'died').length, accuracy: score.accuracy } },
    ...Array(state.patients.filter(p => p.status !== 'died').length).fill({ type: 'patient_treated' }),
  ];

  shiftEvents.forEach(event => {
    const before = updatedAchievements.totalXP;
    const result = checkAchievements(updatedAchievements, event);
    updatedAchievements = result.updatedState;
    newlyEarnedXP += result.updatedState.totalXP - before;
    result.newlyUnlocked.forEach((ach: any) => unlockedNames.push(`${ach.icon} ${ach.name}`));
  });

  const totalXP = score.bonusXP + newlyEarnedXP;

  let updatedCareer = state.career;
  updatedCareer = recordShift(updatedCareer, {
    patientsTreated: state.patients.length,
    deaths: state.patients.filter(p => p.status === 'died').length,
    accuracy: score.accuracy,
    correctDiagnoses: state.patients.filter(p => p.diagnosisCorrect).length,
    shiftType: state.shiftType,
  });
  updatedCareer = addXp(updatedCareer, totalXP);

  return {
    survived: state.patients.filter(p => p.status !== 'died').length,
    died: state.patients.filter(p => p.status === 'died').length,
    consultsAnswered,
    consultsCorrect,
    xpEarned: totalXP,
    accuracy: score.accuracy,
    diagnosticAccuracy: score.diagnosticAccuracy,
    avgDiagnosisTime: 0,
    achievementsUnlocked: unlockedNames,
    levelUp: state.career.level !== updatedCareer.level,
    newLevel: state.career.level !== updatedCareer.level ? updatedCareer.level : null,
    careerProgress: getLevelProgress(updatedCareer),
    interruptionsHandled,
    handoverQuality: handover.quality,
    handoverPenalty: handover.penalty,
  };
}

// ==================== UTILITY ====================

export function formatTime(min: number): string {
  const h = (Math.floor(min / 60) + 7) % 24;
  const m = min % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export function getResourceSummary(state: ShiftState): string[] {
  return getResourceStatusText(state.resources);
}

export { getSuggestedPatient, getClinicalPearls, getClinicalAudit };

export function togglePause(state: ShiftState): ShiftState {
  return {
    ...state,
    paused: !state.paused,
    events: [...state.events, state.paused ? '▶️ Resumed' : '⏸ Paused'],
  };
}

export function setGameSpeed(state: ShiftState, speed: 1 | 2): ShiftState {
  return { ...state, gameSpeed: speed, events: [...state.events, `Speed: ${speed}x`] };
}
