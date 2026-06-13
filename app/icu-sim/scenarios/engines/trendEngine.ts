// ========== Trend Analysis Engine ==========
// يحول snapshot logic إلى trajectory logic

export interface TrendSnapshot {
  simTime: number;
  map: number;
  lactate: number;
  spo2: number;
  urineOutput: number;
  ph?: number;
  glucose?: number;
  potassium?: number;
}

export interface TrendAnalysis {
  mapTrend: 'rising' | 'stable' | 'falling';
  lactateTrend: 'clearing' | 'stable' | 'rising';
  spo2Trend: 'improving' | 'stable' | 'worsening';
  overallTrend: 'improving' | 'stable' | 'deteriorating';
  mapSlope: number;
  lactateSlope: number;
  sustainedHypotension: number; // دقائق متواصلة من MAP < 65
}

const HISTORY_SIZE = 8; // 8 لقطات = 16 دقيقة محاكاة

export function trackHistory(state: any): TrendSnapshot[] {
  const history: TrendSnapshot[] = state._trendHistory || [];
  
  const snapshot: TrendSnapshot = {
    simTime: state.simTime,
    map: state.vitals.map,
    lactate: state.vitals.lactate,
    spo2: state.vitals.spo2,
    urineOutput: state.vitals.urineOutput,
    ph: state.vitals.ph,
    glucose: state.vitals.glucose,
    potassium: state.vitals.potassium,
  };
  
  history.push(snapshot);
  
  // Keep only last N snapshots
  if (history.length > HISTORY_SIZE) {
    history.shift();
  }
  
  state._trendHistory = history;
  return history;
}

export function analyzeTrend(history: TrendSnapshot[]): TrendAnalysis {
  if (history.length < 3) {
    return {
      mapTrend: 'stable',
      lactateTrend: 'stable',
      spo2Trend: 'stable',
      overallTrend: 'stable',
      mapSlope: 0,
      lactateSlope: 0,
      sustainedHypotension: 0,
    };
  }
  
  const first = history[0];
  const last = history[history.length - 1];
  const timeSpan = last.simTime - first.simTime || 1;
  
  // Calculate slopes (per minute)
  const mapSlope = (last.map - first.map) / timeSpan;
  const lactateSlope = (last.lactate - first.lactate) / timeSpan;
  
  // Determine trends
  const mapTrend = mapSlope > 0.3 ? 'rising' : mapSlope < -0.3 ? 'falling' : 'stable';
  const lactateTrend = lactateSlope < -0.05 ? 'clearing' : lactateSlope > 0.05 ? 'rising' : 'stable';
  const spo2Trend = (last.spo2 - first.spo2) > 2 ? 'improving' : (last.spo2 - first.spo2) < -2 ? 'worsening' : 'stable';
  
  // Count sustained hypotension
  let sustainedHypotension = 0;
  for (const snap of history) {
    if (snap.map < 65) sustainedHypotension += 2; // كل لقطة = 2 دقيقة محاكاة
  }
  
  // Overall assessment
  let overallTrend: TrendAnalysis['overallTrend'] = 'stable';
  const score = (mapSlope > 0 ? 1 : -1) + (lactateSlope < 0 ? 1 : -1) + (last.spo2 - first.spo2 > 0 ? 1 : -1);
  
  if (score >= 2) overallTrend = 'improving';
  else if (score <= -2) overallTrend = 'deteriorating';
  
  return {
    mapTrend,
    lactateTrend,
    spo2Trend,
    overallTrend,
    mapSlope,
    lactateSlope,
    sustainedHypotension,
  };
}

export function evaluateOutcome(state: any, winConditions: any, loseConditions: any): string {
  const history = state._trendHistory || [];
  const trend = analyzeTrend(history);
  const v = state.vitals;
  
  // ===== DEATH CHECK (with inertia) =====
  // Sustained extreme values for >10 minutes
  if (trend.sustainedHypotension > 10 && v.map < 30) return 'dead';
  if (v.spo2 < 35 && trend.sustainedHypotension > 6) return 'dead';
  if (v.lactate > 15 && trend.lactateTrend === 'rising') return 'dead';
  
  // Instant death only if truly irreversible
  if (v.map < 15 || v.spo2 < 20) return 'dead';
  
  // ===== IMPROVEMENT CHECK (with persistence) =====
  const goalsMet = countGoalsMet(state, winConditions);
  
  if (goalsMet >= 4 && trend.overallTrend === 'improving') return 'recovered';
  if (goalsMet >= 3 && trend.overallTrend === 'improving') return 'improving';
  if (goalsMet >= 2 && trend.overallTrend !== 'deteriorating') return 'stable';
  
  // ===== DETERIORATING =====
  if (trend.overallTrend === 'deteriorating' && v.map < 55) return 'deteriorating';
  if (trend.sustainedHypotension > 20) return 'deteriorating';
  
  return state.status || 'critical';
}

export function countGoalsMet(state: any, winConditions: any): number {
  const v = state.vitals;
  let count = 0;
  
  if (winConditions.mapAbove && v.map > winConditions.mapAbove) count++;
  if (winConditions.lactateBelow && v.lactate < winConditions.lactateBelow) count++;
  if (winConditions.spo2Above && v.spo2 > winConditions.spo2Above) count++;
  if (winConditions.urineOutputAbove && v.urineOutput > winConditions.urineOutputAbove) count++;
  if (winConditions.phAbove && v.ph > winConditions.phAbove) count++;
  
  return count;
}

export function calculateScore(goalsMet: number, totalGoals: number, trend: TrendAnalysis, patientDied: boolean): number {
  if (patientDied) return Math.max(0, goalsMet * 50); // بعض النقاط لو وصلت Goals قبل الموت
  
  let score = 0;
  
  // Base score per goal
  score += goalsMet * 200;
  
  // Trend bonus
  if (trend.overallTrend === 'improving') score += 200;
  if (trend.lactateTrend === 'clearing') score += 100;
  if (trend.mapTrend === 'rising') score += 100;
  
  // Sustained stability bonus
  if (trend.sustainedHypotension === 0 && goalsMet >= 3) score += 200;
  
  return Math.min(score, 1000);
}
