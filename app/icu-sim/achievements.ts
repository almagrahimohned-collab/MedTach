// ========== Achievements System ==========

export interface Achievement {
  id: string;
  emoji: string;
  title: string;
  description: string;
  condition: (state: any, meta: any) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_save',
    emoji: '🦅',
    title: 'First Flight',
    description: 'Save your first patient',
    condition: (state) => state.status === 'improving' || state.status === 'recovered',
  },
  {
    id: 'golden_hour',
    emoji: '⏰',
    title: 'Golden Hour',
    description: 'Antibiotics within 30 minutes',
    condition: (state) => {
      const abxOrder = state.activeOrders.find((o: any) => o.category === 'antibiotic');
      return abxOrder && abxOrder.startSimTime <= 30;
    },
  },
  {
    id: 'perfect_score',
    emoji: '👑',
    title: 'Royal Flush',
    description: 'All goals met with no complications',
    condition: (state, meta) => {
      return meta.goalsMet >= 4 && meta.complication === 0 && state.status !== 'dead';
    },
  },
  {
    id: 'phoenix',
    emoji: '🔥',
    title: 'Phoenix',
    description: 'MAP dropped below 30 and patient survived',
    condition: (state) => {
      return (state as any)._minMAP < 30 && (state.status === 'improving' || state.status === 'recovered');
    },
  },
  {
    id: 'speed_demon',
    emoji: '⚡',
    title: 'Rapid Response',
    description: 'Stabilized within 2 hours',
    condition: (state) => {
      return state.simTime <= 120 && (state.status === 'improving' || state.status === 'recovered');
    },
  },
  {
    id: 'no_fluids',
    emoji: '🎯',
    title: 'Precision Medicine',
    description: 'Won without giving any fluids',
    condition: (state) => {
      const hasFluids = state.activeOrders.some((o: any) => 
        o.name.includes('Saline') || o.name.includes('Ringer')
      );
      return !hasFluids && (state.status === 'improving' || state.status === 'recovered');
    },
  },
  {
    id: 'vasopressor_master',
    emoji: '💉',
    title: 'Vasopressor Master',
    description: 'Used 3+ vasopressors simultaneously',
    condition: (state) => {
      const vasopressors = state.activeOrders.filter((o: any) =>
        ['vasopressor', 'inotrope'].includes(o.category) && o.running
      );
      return vasopressors.length >= 3;
    },
  },
  {
    id: 'ten_lives',
    emoji: '😇',
    title: 'Guardian Angel',
    description: 'Saved 10 patients total',
    condition: (state, meta) => {
      return (meta?.totalSaves || 0) >= 10;
    },
  },
];

export function checkAchievements(state: any, meta: any): Achievement[] {
  const unlocked: Achievement[] = [];
  
  for (const achievement of ACHIEVEMENTS) {
    try {
      if (achievement.condition(state, meta)) {
        unlocked.push(achievement);
      }
    } catch (e) {
      // Skip if condition fails
    }
  }
  
  return unlocked;
}

// تخزين الإنجازات (في AsyncStorage لاحقاً)
export function saveAchievements(achievements: Achievement[]): void {
  // TODO: Save to AsyncStorage or Supabase
  console.log('🏆 Achievements unlocked:', achievements.map(a => a.title));
}
