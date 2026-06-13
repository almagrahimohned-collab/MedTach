// ========== Scoring Engine ==========
import { TrendAnalysis, countGoalsMet, calculateScore as calcTrendScore } from './scenarios/engines/trendEngine';

export interface ScoreBreakdown {
  total: number;
  goalsMet: number;
  totalGoals: number;
  trendBonus: number;
  timeBonus: number;
  complication: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  message: string;
}

export function calculateFinalScore(
  state: any,
  winConditions: any,
  scenarioId: string
): ScoreBreakdown {
  const v = state.vitals;
  const history = state._trendHistory || [];
  const goalsMet = countGoalsMet(state, winConditions);
  const totalGoals = Object.keys(winConditions).length || 4;
  const patientDied = state.status === 'dead';
  
  // Base score
  let score = goalsMet * 200;
  
  // Time bonus: faster = more points
  const optimalTime = 180; // 3 hours
  const timeBonus = Math.max(0, Math.round((1 - state.simTime / optimalTime) * 100));
  
  // Complication penalty
  let complication = 0;
  if (state.events.some((e: string) => e.includes('PULMONARY_EDEMA'))) complication -= 50;
  if (state.events.some((e: string) => e.includes('DELAYED_ABX'))) complication -= 30;
  if (state.events.some((e: string) => e.includes('OLIGURIA'))) complication -= 20;
  
  score += timeBonus + complication;
  if (patientDied) score = Math.max(0, score - 300);
  
  score = Math.max(0, Math.min(score, 1000));
  
  // Grade
  let grade: ScoreBreakdown['grade'] = 'F';
  let message = '';
  
  if (score >= 900) { grade = 'S'; message = '🏆 Perfect! Attending-level performance!'; }
  else if (score >= 700) { grade = 'A'; message = '🌟 Excellent! Ready for independent practice.'; }
  else if (score >= 500) { grade = 'B'; message = '👍 Good job! Review the missed goals.'; }
  else if (score >= 300) { grade = 'C'; message = '📚 Fair attempt. Study the guidelines and retry.'; }
  else if (score >= 100) { grade = 'D'; message = '⚠️ Needs improvement. Review basic management.'; }
  else { grade = 'F'; message = '❌ Failed. Patient safety concern.'; }
  
  if (patientDied && score < 100) message = '💀 Patient died. Review critical care protocols.';
  
  return {
    total: score,
    goalsMet,
    totalGoals,
    trendBonus: timeBonus,
    timeBonus,
    complication,
    grade,
    message,
  };
}
