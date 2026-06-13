/**
 * AchievementSystem.ts
 * Achievement tracking for Resident Life Simulator
 */

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  progress: number;
  unlocked: boolean;
  xpReward: number;
  category: 'clinical' | 'performance' | 'milestone' | 'special';
  hidden: boolean;
}

export interface AchievementState {
  achievements: Achievement[];
  totalUnlocked: number;
  totalXP: number;
}

const ACHIEVEMENT_DEFINITIONS: Omit<Achievement, 'progress' | 'unlocked'>[] = [
  // Clinical Achievements
  {
    id: 'first_save',
    name: 'First Save',
    description: 'Save your first patient',
    icon: '🏆',
    requirement: 1,
    xpReward: 50,
    category: 'clinical',
    hidden: false,
  },
  {
    id: 'stemi_hunter',
    name: 'STEMI Hunter',
    description: 'Correctly diagnose and treat 10 STEMI patients',
    icon: '❤️',
    requirement: 10,
    xpReward: 200,
    category: 'clinical',
    hidden: false,
  },
  {
    id: 'stroke_saver',
    name: 'Stroke Saver',
    description: 'Successfully treat 5 stroke patients with tPA/thrombectomy',
    icon: '🧠',
    requirement: 5,
    xpReward: 250,
    category: 'clinical',
    hidden: false,
  },
  {
    id: 'sepsis_slayer',
    name: 'Sepsis Slayer',
    description: 'Complete Hour-1 Bundle for 10 septic shock patients',
    icon: '⚔️',
    requirement: 10,
    xpReward: 300,
    category: 'clinical',
    hidden: false,
  },
  {
    id: 'dissection_detective',
    name: 'Dissection Detective',
    description: 'Diagnose aortic dissection without missing it (5 times)',
    icon: '🔍',
    requirement: 5,
    xpReward: 350,
    category: 'clinical',
    hidden: true,
  },
  {
    id: 'pe_master',
    name: 'PE Master',
    description: 'Successfully thrombolyse 5 massive PE patients',
    icon: '🫁',
    requirement: 5,
    xpReward: 250,
    category: 'clinical',
    hidden: false,
  },

  // Performance Achievements
  {
    id: 'no_death_shift',
    name: 'Perfect Shift',
    description: 'Complete a shift with zero deaths',
    icon: '✨',
    requirement: 1,
    xpReward: 150,
    category: 'performance',
    hidden: false,
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Complete a shift with average diagnosis time under 5 minutes',
    icon: '⚡',
    requirement: 1,
    xpReward: 200,
    category: 'performance',
    hidden: false,
  },
  {
    id: 'perfect_triage',
    name: 'Perfect Triage',
    description: 'Correctly triage 20 patients in a row',
    icon: '📋',
    requirement: 20,
    xpReward: 300,
    category: 'performance',
    hidden: true,
  },
  {
    id: 'efficiency_expert',
    name: 'Efficiency Expert',
    description: 'Complete a shift with 90%+ accuracy and 0 deaths',
    icon: '🎯',
    requirement: 1,
    xpReward: 400,
    category: 'performance',
    hidden: false,
  },
  {
    id: 'rapid_responder',
    name: 'Rapid Responder',
    description: 'Start treatment within 2 minutes for 10 critical patients',
    icon: '🚀',
    requirement: 10,
    xpReward: 200,
    category: 'performance',
    hidden: false,
  },

  // Milestone Achievements
  {
    id: 'ten_shifts',
    name: 'Dedicated Resident',
    description: 'Complete 10 shifts',
    icon: '💪',
    requirement: 10,
    xpReward: 500,
    category: 'milestone',
    hidden: false,
  },
  {
    id: 'fifty_shifts',
    name: 'Veteran Resident',
    description: 'Complete 50 shifts',
    icon: '🎖️',
    requirement: 50,
    xpReward: 2000,
    category: 'milestone',
    hidden: true,
  },
  {
    id: 'hundred_patients',
    name: 'Century Club',
    description: 'Treat 100 patients',
    icon: '💯',
    requirement: 100,
    xpReward: 1000,
    category: 'milestone',
    hidden: false,
  },
  {
    id: 'thousand_patients',
    name: 'Master Clinician',
    description: 'Treat 1000 patients',
    icon: '👑',
    requirement: 1000,
    xpReward: 10000,
    category: 'milestone',
    hidden: true,
  },
  {
    id: 'night_warrior',
    name: 'Night Warrior',
    description: 'Complete 20 night shifts',
    icon: '🌙',
    requirement: 20,
    xpReward: 750,
    category: 'milestone',
    hidden: false,
  },

  // Special Achievements
  {
    id: 'mass_casualty_hero',
    name: 'Mass Casualty Hero',
    description: 'Save 80%+ patients in a mass casualty event',
    icon: '🦸',
    requirement: 1,
    xpReward: 500,
    category: 'special',
    hidden: true,
  },
  {
    id: 'code_master',
    name: 'Code Master',
    description: 'Successfully run 10 code blues',
    icon: '💀',
    requirement: 10,
    xpReward: 400,
    category: 'special',
    hidden: false,
  },
  {
    id: 'triple_threat',
    name: 'Triple Threat',
    description: 'Have 3 critical patients stabilize in the same shift',
    icon: '🎪',
    requirement: 1,
    xpReward: 300,
    category: 'special',
    hidden: false,
  },
  {
    id: 'comeback_king',
    name: 'Comeback King',
    description: 'Save a patient who deteriorated to critical status',
    icon: '🔄',
    requirement: 1,
    xpReward: 250,
    category: 'special',
    hidden: true,
  },
  {
    id: 'diagnostic_genius',
    name: 'Diagnostic Genius',
    description: 'Correctly diagnose a rare condition (Aortic Dissection, SAH, or Cholangitis)',
    icon: '🧩',
    requirement: 3,
    xpReward: 350,
    category: 'special',
    hidden: true,
  },
];

export function createAchievementState(): AchievementState {
  return {
    achievements: ACHIEVEMENT_DEFINITIONS.map(def => ({
      ...def,
      progress: 0,
      unlocked: false,
    })),
    totalUnlocked: 0,
    totalXP: 0,
  };
}

export function checkAchievements(
  state: AchievementState,
  event: AchievementEvent
): { updatedState: AchievementState; newlyUnlocked: Achievement[] } {
  const newlyUnlocked: Achievement[] = [];
  const updatedAchievements = state.achievements.map(ach => {
    if (ach.unlocked) return ach;

    let newProgress = ach.progress;

    switch (ach.id) {
      case 'first_save':
        if (event.type === 'patient_saved') newProgress++;
        break;
      case 'stemi_hunter':
        if (event.type === 'diagnosis' && event.data === 'STEMI') newProgress++;
        break;
      case 'stroke_saver':
        if (event.type === 'stroke_treated') newProgress++;
        break;
      case 'sepsis_slayer':
        if (event.type === 'sepsis_bundle_complete') newProgress++;
        break;
      case 'dissection_detective':
        if (event.type === 'diagnosis' && event.data === 'Aortic Dissection') newProgress++;
        break;
      case 'pe_master':
        if (event.type === 'pe_thrombolysed') newProgress++;
        break;
      case 'no_death_shift':
        if (event.type === 'shift_complete' && event.data?.deaths === 0) newProgress = 1;
        break;
      case 'speed_demon':
        if (event.type === 'shift_complete' && event.data?.avgDiagnosisTime < 5) newProgress = 1;
        break;
      case 'efficiency_expert':
        if (event.type === 'shift_complete' && event.data?.accuracy >= 90 && event.data?.deaths === 0) newProgress = 1;
        break;
      case 'ten_shifts':
        if (event.type === 'shift_complete') newProgress++;
        break;
      case 'fifty_shifts':
        if (event.type === 'shift_complete') newProgress++;
        break;
      case 'hundred_patients':
        if (event.type === 'patient_treated') newProgress++;
        break;
      case 'thousand_patients':
        if (event.type === 'patient_treated') newProgress++;
        break;
      case 'night_warrior':
        if (event.type === 'shift_complete' && event.data?.shiftType === 'night') newProgress++;
        break;
      case 'perfect_triage':
        if (event.type === 'triage_correct') newProgress++;
        break;
      case 'rapid_responder':
        if (event.type === 'rapid_treatment') newProgress++;
        break;
      case 'code_master':
        if (event.type === 'code_blue_success') newProgress++;
        break;
      case 'triple_threat':
        if (event.type === 'shift_complete' && event.data?.criticalSaved >= 3) newProgress = 1;
        break;
      case 'comeback_king':
        if (event.type === 'deterioration_reversed') newProgress = 1;
        break;
      case 'diagnostic_genius':
        if (event.type === 'rare_diagnosis') newProgress++;
        break;
      case 'mass_casualty_hero':
        if (event.type === 'mass_casualty' && event.data?.survivalRate >= 80) newProgress = 1;
        break;
    }

    const unlocked = newProgress >= ach.requirement && !ach.unlocked;
    if (unlocked) {
      newlyUnlocked.push({ ...ach, progress: newProgress, unlocked: true });
    }

    return { ...ach, progress: newProgress, unlocked: unlocked || ach.unlocked };
  });

  const totalNewXP = newlyUnlocked.reduce((sum, ach) => sum + ach.xpReward, 0);

  return {
    updatedState: {
      achievements: updatedAchievements,
      totalUnlocked: state.totalUnlocked + newlyUnlocked.length,
      totalXP: state.totalXP + totalNewXP,
    },
    newlyUnlocked,
  };
}

export interface AchievementEvent {
  type: string;
  data?: any;
}
