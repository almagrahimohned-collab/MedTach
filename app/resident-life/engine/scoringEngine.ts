/**
 * ScoringEngine.ts
 * Pure functions for scoring, evaluation, and clinical audit
 * No state mutation - all calculations are deterministic
 */

import { Patient, ShiftState } from '../types';
import { calculateSurvivalScore } from './physiologyEngine';
import { getCaseTemplate } from '../data/cases';

// ==================== SUGGESTED PATIENT ====================

export function getSuggestedPatient(patients: Patient[]): Patient | null {
  const active = patients.filter(
    p => p.status === 'waiting' || p.status === 'in-progress' || p.status === 'deteriorated'
  );
  if (!active.length) return null;

  const scored = active.map(p => {
    let score = 0;

    // Priority weight
    if (p.priority === 'critical') score += 100;
    else if (p.priority === 'urgent') score += 50;

    // Time urgency
    if (p.deteriorationTimer < 5) score += 100;
    else if (p.deteriorationTimer < 10) score += 60;
    else if (p.deteriorationTimer < 20) score += 30;

    // Status urgency
    if (p.status === 'deteriorated') score += 80;

    // Harmful treatment given = emergency
    const template = getCaseTemplate(p.priority, p.correctDiagnosis);
    const hasHarmful = p.requiredActions.some(
      a => template?.harmfulActions.includes(a.id) && a.status === 'completed'
    );
    if (hasHarmful) score += 200;

    return { patient: p, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0].patient;
}

// ==================== CLINICAL AUDIT ====================

export interface ClinicalAudit {
  unnecessaryTests: number;
  guidelineAdherence: number;
  harmfulActions: number;
  survivalScoreAvg: number;
}

export function getClinicalAudit(patients: Patient[]): ClinicalAudit {
  let unnecessaryTests = 0;
  let totalEssential = 0;
  let essentialDone = 0;
  let harmfulCount = 0;
  let totalSurvivalScore = 0;
  let evaluatedPatients = 0;

  patients.forEach(p => {
    if (p.status === 'died') return;
    evaluatedPatients++;

    const acts = p.requiredActions;
    const essential = acts.filter(a => a.isEssential || a.category === 'treatment');
    totalEssential += essential.length;
    essentialDone += essential.filter(a => a.status === 'completed').length;

    // Unnecessary tests on stable patients
    if (p.priority === 'stable') {
      const investigations = acts.filter(
        a => (a.category === 'lab' || a.category === 'imaging') &&
        !a.isEssential &&
        a.status === 'completed'
      );
      if (investigations.length > 2) {
        unnecessaryTests += investigations.length - 2;
      }
    }

    // Harmful actions count
    const template = getCaseTemplate(p.priority, p.correctDiagnosis);
    p.requiredActions.forEach(a => {
      if (template?.harmfulActions.includes(a.id) && a.status === 'completed') {
        harmfulCount++;
      }
    });

    totalSurvivalScore += calculateSurvivalScore(p);
  });

  return {
    unnecessaryTests,
    guidelineAdherence: totalEssential > 0 ? (essentialDone / totalEssential) * 100 : 0,
    harmfulActions: harmfulCount,
    survivalScoreAvg: evaluatedPatients > 0 ? totalSurvivalScore / evaluatedPatients : 0,
  };
}

// ==================== CLINICAL PEARLS ====================

export function getClinicalPearls(patients: Patient[]): string[] {
  const pearls: string[] = [];

  // Deaths analysis
  patients.filter(p => p.status === 'died').forEach(p => {
    const score = calculateSurvivalScore(p);
    const template = getCaseTemplate(p.priority, p.correctDiagnosis);
    const harmful = p.requiredActions.some(
      a => template?.harmfulActions.includes(a.id) && a.status === 'completed'
    );
    pearls.push(
      `💀 ${p.name} (${p.correctDiagnosis}): Score ${score}/100` +
      (harmful ? ' - HARMFUL treatment given!' : '')
    );
  });

  // Critical saves
  const saves = patients.filter(p => p.priority === 'critical' && p.status === 'stable');
  if (saves.length) {
    pearls.push(`✅ Saved ${saves.length} critical patients.`);
  }

  // Misdiagnoses
  const misdiagnosed = patients.filter(p => p.diagnosisAttempted && !p.diagnosisCorrect);
  if (misdiagnosed.length) {
    pearls.push(`❌ ${misdiagnosed.length} misdiagnosed patient(s).`);
  }

  return pearls;
}

// ==================== SHIFT SCORING ====================

export interface ShiftScore {
  accuracy: number;
  diagnosticAccuracy: number;
  baseXP: number;
  deathPenalty: number;
  bonusXP: number;
}

export function calculateShiftScore(
  patients: Patient[],
  consultsAnswered: number,
  consultsCorrect: number,
  interruptionsHandled: number,
  handoverQuality: number,
  handoverPenalty: number
): ShiftScore {
  const survived = patients.filter(p => p.status !== 'died').length;
  const died = patients.filter(p => p.status === 'died').length;
  const totalPatients = patients.length;
  const diagnosesCorrect = patients.filter(p => p.diagnosisCorrect).length;
  const diagnosesAttempted = patients.filter(p => p.diagnosisAttempted).length;

  const accuracy = totalPatients > 0 ? (survived / totalPatients) * 100 : 0;
  const diagnosticAccuracy = diagnosesAttempted > 0 ? (diagnosesCorrect / diagnosesAttempted) * 100 : 0;

  const baseXP = Math.floor(
    survived * 50 +
    diagnosticAccuracy * 5 +
    consultsCorrect * 25 +
    handoverQuality * 2 +
    interruptionsHandled * 15
  );
  const deathPenalty = died * 60;
  const bonusXP = Math.max(0, baseXP - deathPenalty - handoverPenalty);

  return {
    accuracy,
    diagnosticAccuracy,
    baseXP,
    deathPenalty,
    bonusXP,
  };
}

// ==================== HANDOVER QUALITY ====================

export function calculateHandoverQuality(patients: Patient[]): {
  quality: number;
  penalty: number;
  pendingCount: number;
  unknownDiagnoses: number;
} {
  const activePatients = patients.filter(
    p => p.status !== 'died' && p.status !== 'transferred'
  );

  let pendingCount = 0;
  let unknownDiagnoses = 0;

  activePatients.forEach(p => {
    pendingCount += p.requiredActions.filter(a => a.status === 'in-progress').length;
    if (!p.diagnosisAttempted) unknownDiagnoses++;
  });

  const quality = Math.max(0, 100 - pendingCount * 15 - unknownDiagnoses * 25);
  const penalty = pendingCount * 10 + unknownDiagnoses * 20;

  return { quality, penalty, pendingCount, unknownDiagnoses };
}
