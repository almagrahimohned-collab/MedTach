/**
 * CareerSystem.ts
 * Career progression system for Resident Life
 */

export interface CareerState {
  level: 'intern' | 'junior' | 'senior' | 'chief' | 'attending';
  xp: number;
  xpToNextLevel: number;
  totalShifts: number;
  totalPatients: number;
  totalDeaths: number;
  mortalityRate: number;
  bestAccuracy: number;
  totalCorrectDiagnoses: number;
  diagnosticAccuracy: number;
  shiftsByType: {
    morning: number;
    night: number;
    weekend: number;
  };
  stats: CareerStats;
}

export interface CareerStats {
  totalSTEMITreated: number;
  totalStrokesThrombolysed: number;
  totalSepsisTreated: number;
  totalPEThrombolysed: number;
  totalDissectionsDiagnosed: number;
  fastestDiagnosis: number;
  longestStreakNoDeaths: number;
  currentStreakNoDeaths: number;
  patientsSaved: number;
}

export interface LevelInfo {
  level: string;
  title: string;
  xpRequired: number;
  patientLimit: number;
  description: string;
  unlocks: string[];
}

export const LEVELS: LevelInfo[] = [
  {
    level: 'intern',
    title: 'Intern (PGY-1)',
    xpRequired: 0,
    patientLimit: 4,
    description: 'New doctor learning the ropes. Basic cases with supervision.',
    unlocks: ['Basic cases', 'History & Exam', 'Simple labs'],
  },
  {
    level: 'junior',
    title: 'Junior Resident (PGY-2)',
    xpRequired: 500,
    patientLimit: 6,
    description: 'Independent management. Consults and procedures.',
    unlocks: ['Consults', 'Procedures', 'Intermediate cases', 'Night shifts'],
  },
  {
    level: 'senior',
    title: 'Senior Resident (PGY-3)',
    xpRequired: 1500,
    patientLimit: 10,
    description: 'Trauma, codes, supervision of juniors. Complex cases.',
    unlocks: ['Trauma alerts', 'Code Blue', 'Advanced procedures', 'Teaching role'],
  },
  {
    level: 'chief',
    title: 'Chief Resident (PGY-4)',
    xpRequired: 3500,
    patientLimit: 15,
    description: 'Department management. All cases. Teaching responsibility.',
    unlocks: ['Mass casualty', 'All procedures', 'Department control', 'Mentoring'],
  },
  {
    level: 'attending',
    title: 'Attending Physician',
    xpRequired: 7000,
    patientLimit: 20,
    description: 'Master clinician. Teaching and supervision.',
    unlocks: ['Extreme difficulty', 'Teaching mode', 'Full autonomy', 'Legend status'],
  },
];

export function createCareerState(): CareerState {
  return {
    level: 'intern',
    xp: 0,
    xpToNextLevel: 500,
    totalShifts: 0,
    totalPatients: 0,
    totalDeaths: 0,
    mortalityRate: 0,
    bestAccuracy: 0,
    totalCorrectDiagnoses: 0,
    diagnosticAccuracy: 0,
    shiftsByType: { morning: 0, night: 0, weekend: 0 },
    stats: {
      totalSTEMITreated: 0,
      totalStrokesThrombolysed: 0,
      totalSepsisTreated: 0,
      totalPEThrombolysed: 0,
      totalDissectionsDiagnosed: 0,
      fastestDiagnosis: 999,
      longestStreakNoDeaths: 0,
      currentStreakNoDeaths: 0,
      patientsSaved: 0,
    },
  };
}

export function addXp(state: CareerState, xp: number): CareerState {
  const newXP = state.xp + xp;
  const currentLevelIndex = LEVELS.findIndex(l => l.level === state.level);
  const nextLevel = LEVELS[currentLevelIndex + 1];
  
  let newLevel = state.level;
  let xpToNext = state.xpToNextLevel;

  if (nextLevel && newXP >= nextLevel.xpRequired) {
    newLevel = nextLevel.level as any;
    const nextNextLevel = LEVELS.find(l => l.level === newLevel);
    xpToNext = nextNextLevel ? nextNextLevel.xpRequired : 999999;
  } else if (nextLevel) {
    xpToNext = nextLevel.xpRequired - newXP;
  }

  return {
    ...state,
    xp: newXP,
    level: newLevel as any,
    xpToNextLevel: Math.max(0, xpToNext),
  };
}

export function recordShift(
  state: CareerState,
  shiftData: {
    patientsTreated: number;
    deaths: number;
    accuracy: number;
    correctDiagnoses: number;
    shiftType: 'morning' | 'night' | 'weekend';
    specificStats?: Partial<CareerStats>;
  }
): CareerState {
  const totalShifts = state.totalShifts + 1;
  const totalPatients = state.totalPatients + shiftData.patientsTreated;
  const totalDeaths = state.totalDeaths + shiftData.deaths;
  const totalCorrectDiagnoses = state.totalCorrectDiagnoses + shiftData.correctDiagnoses;

  const mortalityRate = totalPatients > 0 ? (totalDeaths / totalPatients) * 100 : 0;
  const diagnosticAccuracy = totalPatients > 0 ? (totalCorrectDiagnoses / totalPatients) * 100 : 0;
  const bestAccuracy = Math.max(state.bestAccuracy, shiftData.accuracy);

  // Death streak
  const currentStreakNoDeaths = shiftData.deaths === 0 ? state.currentStreakNoDeaths + 1 : 0;
  const longestStreakNoDeaths = Math.max(state.longestStreakNoDeaths, currentStreakNoDeaths);

  const shiftsByType = {
    ...state.shiftsByType,
    [shiftData.shiftType]: state.shiftsByType[shiftData.shiftType] + 1,
  };

  const stats = {
    ...state.stats,
    ...shiftData.specificStats,
    fastestDiagnosis: Math.min(state.stats.fastestDiagnosis, shiftData.specificStats?.fastestDiagnosis || 999),
    longestStreakNoDeaths,
    currentStreakNoDeaths,
    patientsSaved: state.stats.patientsSaved + (shiftData.patientsTreated - shiftData.deaths),
  };

  return {
    ...state,
    totalShifts,
    totalPatients,
    totalDeaths,
    mortalityRate,
    bestAccuracy,
    totalCorrectDiagnoses,
    diagnosticAccuracy,
    shiftsByType,
    stats,
  };
}

export function getLevelProgress(state: CareerState): number {
  const currentLevel = LEVELS.find(l => l.level === state.level);
  const nextLevel = LEVELS[LEVELS.findIndex(l => l.level === state.level) + 1];
  if (!nextLevel) return 100;
  const progress = ((state.xp - currentLevel!.xpRequired) / (nextLevel.xpRequired - currentLevel!.xpRequired)) * 100;
  return Math.min(100, Math.max(0, progress));
}

export function getCurrentLevelInfo(state: CareerState): LevelInfo {
  return LEVELS.find(l => l.level === state.level) || LEVELS[0];
}

export function getNextLevelInfo(state: CareerState): LevelInfo | null {
  const index = LEVELS.findIndex(l => l.level === state.level);
  return index < LEVELS.length - 1 ? LEVELS[index + 1] : null;
}
