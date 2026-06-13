import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CaseResult { caseId: string; score: number; date: string; }

interface DailyChallenge {
  date: string; specialty: string; level: string;
  caseId: string; completed: boolean; bonusPoints: number;
}

// 🔥 Streak interface
interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  streakHistory: string[];
  todayXP: number;
  lastBonusDate: string | null;
}

// 🎮 Boss Deck interface
interface BossDeck {
  id: string;
  name: string;
  icon: string;
  emoji: string;
  color: string;
  description: string;
  requiredLevel: number;
  totalQuestions: number;
  passingScore: number;
  timePerQuestion: number;
  hpLossPerWrong: number;
}

interface BossProgress {
  deckId: string;
  defeated: boolean;
  attempts: number;
  bestScore: number;
  flawless: boolean;
  lastAttempt: string | null;
}

interface AppStore {
  score: number;
  totalPoints: number;
  completedCases: CaseResult[];
  subCategory: string | null;
  difficulty: string | null;
  specialtyId: string | null;
  dailyChallenge: DailyChallenge | null;
  lastChallengeDate: string | null;
  badges: string[];
  user: { id: string; email: string; name: string } | null;
  
  // 🔥 Streak
  streak: StreakData;

  // 🎮 Boss Decks
  bossProgress: BossProgress[];
  activeBoss: string | null;
  activeBossDeck: string | null;

  // ⭐ Level System
  getLevel: () => number;
  getLevelProgress: () => { current: number; next: number; progress: number; title: string };
  getXpToNextLevel: () => number;
  getLevelTitle: (level: number) => string;

  addPoints: (points: number) => void;
  deductPoints: (points: number) => void;
  resetScore: () => void;
  saveCaseResult: (caseId: string, finalScore: number) => void;
  setCategory: (specialtyId: string, sub: string, diff: string) => void;
  resetSession: () => void;
  setDailyChallenge: (challenge: DailyChallenge) => void;
  completeDailyChallenge: (bonusPoints: number) => void;
  addBadge: (badge: string) => void;
  setUser: (user: { id: string; email: string; name: string } | null) => void;
  getAccuracy: () => number;
  getUniqueSpecialties: () => number;
  getTodayCases: () => CaseResult[];
  
  // 🔥 Streak functions
  recordActivity: () => { streakBonus: number; badge?: string; isNewDay: boolean };
  getStreakBonus: () => number;
  getStreakBadge: (streak: number) => string | null;

  // 🎮 Boss functions
  getBossDecks: () => BossDeck[];
  isBossUnlocked: (deckId: string) => boolean;
  defeatBoss: (deckId: string, score: number, total: number, flawless: boolean) => void;
  getBossProgress: (deckId: string) => BossProgress | null;
}

export const BOSS_DECKS: BossDeck[] = [
  {
    id: 'ecg_boss',
    name: 'ECG Boss',
    icon: 'pulse-outline',
    emoji: '⚡',
    color: '#EF4444',
    description: 'Master advanced ECG interpretation\n15 high-difficulty rhythm strips',
    requiredLevel: 5,
    totalQuestions: 15,
    passingScore: 12,
    timePerQuestion: 45,
    hpLossPerWrong: 7,
  },
  {
    id: 'pharma_boss',
    name: 'Pharmacology Boss',
    icon: 'flask-outline',
    emoji: '💊',
    color: '#EC4899',
    description: 'Complex drug interactions & dosing\n15 critical pharm scenarios',
    requiredLevel: 8,
    totalQuestions: 15,
    passingScore: 12,
    timePerQuestion: 50,
    hpLossPerWrong: 7,
  },
  {
    id: 'emergency_boss',
    name: 'Emergency Boss',
    icon: 'warning-outline',
    emoji: '🚨',
    color: '#F97316',
    description: 'Trauma & resuscitation protocols\n15 life-or-death decisions',
    requiredLevel: 10,
    totalQuestions: 15,
    passingScore: 11,
    timePerQuestion: 40,
    hpLossPerWrong: 8,
  },
  {
    id: 'icu_boss',
    name: 'ICU Boss',
    icon: 'heart-outline',
    emoji: '🫀',
    color: '#DC2626',
    description: 'Critical care management\n15 ICU scenarios',
    requiredLevel: 15,
    totalQuestions: 15,
    passingScore: 12,
    timePerQuestion: 60,
    hpLossPerWrong: 7,
  },
];

export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      score: 100,
      totalPoints: 0,
      completedCases: [],
      subCategory: null,
      difficulty: null,
      specialtyId: null,
      dailyChallenge: null,
      lastChallengeDate: null,
      badges: [],
      user: null,

      streak: {
        currentStreak: 0,
        longestStreak: 0,
        lastActiveDate: null,
        streakHistory: [],
        todayXP: 0,
        lastBonusDate: null,
      },

      // 🎮 Boss data
      bossProgress: [],
      activeBoss: null,
      activeBossDeck: null,

      // ⭐ Level System
      getLevel: () => {
        const xp = get().totalPoints;
        let level = 1;
        let xpNeeded = 0;
        while (true) {
          xpNeeded = level * 100 + (level - 1) * 50;
          if (xp < xpNeeded) break;
          level++;
        }
        return level;
      },

      getLevelProgress: () => {
        const xp = get().totalPoints;
        const level = get().getLevel();
        const currentXpNeeded = (level - 1) * 100 + (level - 2) * 50;
        const nextXpNeeded = level * 100 + (level - 1) * 50;
        const progress = ((xp - currentXpNeeded) / (nextXpNeeded - currentXpNeeded)) * 100;
        return {
          current: level,
          next: level + 1,
          progress: Math.min(Math.max(progress, 0), 100),
          title: get().getLevelTitle(level),
        };
      },

      getXpToNextLevel: () => {
        const xp = get().totalPoints;
        const level = get().getLevel();
        const nextXpNeeded = level * 100 + (level - 1) * 50;
        return Math.max(0, nextXpNeeded - xp);
      },

      getLevelTitle: (level: number) => {
        if (level >= 30) return '👑 Chief of Medicine';
        if (level >= 20) return '💎 Attending Physician';
        if (level >= 15) return '🥇 Senior Fellow';
        if (level >= 10) return '🥈 Fellow';
        if (level >= 7) return '🥉 Senior Resident';
        if (level >= 5) return '📚 Junior Resident';
        if (level >= 3) return '🩺 Intern';
        return '🎓 Medical Student';
      },

      addPoints: (points) => set((state) => ({ totalPoints: state.totalPoints + points })),
      deductPoints: (points) => set((state) => ({ score: Math.max(0, state.score - points) })),
      resetScore: () => set({ score: 100 }),

      saveCaseResult: (caseId, finalScore) =>
        set((state) => ({
          completedCases: [...state.completedCases, { caseId, score: finalScore, date: new Date().toISOString() }],
          totalPoints: state.totalPoints + finalScore,
        })),

      setCategory: (specialtyId, sub, diff) =>
        set({ specialtyId, subCategory: sub, difficulty: diff, score: 100 }),

      resetSession: () =>
        set({ specialtyId: null, subCategory: null, difficulty: null, score: 100 }),

      setDailyChallenge: (challenge) =>
        set({ dailyChallenge: challenge, lastChallengeDate: challenge.date }),

      completeDailyChallenge: (bonusPoints) =>
        set((state) => ({
          totalPoints: state.totalPoints + bonusPoints,
          dailyChallenge: state.dailyChallenge ? { ...state.dailyChallenge, completed: true } : null,
        })),

      addBadge: (badge) =>
        set((state) => ({
          badges: state.badges.includes(badge) ? state.badges : [...state.badges, badge],
        })),

      setUser: (user) => set({ user }),

      getAccuracy: () => {
        const cases = get().completedCases;
        if (cases.length === 0) return 100;
        return Math.round(cases.reduce((acc, c) => acc + c.score, 0) / cases.length);
      },

      getUniqueSpecialties: () => {
        const cases = get().completedCases;
        return new Set(cases.map((c) => c.caseId?.split('_')[0])).size;
      },

      getTodayCases: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().completedCases.filter((c) => c.date?.startsWith(today));
      },

      getStreakBonus: () => {
        const streak = get().streak.currentStreak;
        if (streak >= 60) return 100;
        if (streak >= 30) return 80;
        if (streak >= 14) return 50;
        if (streak >= 7) return 30;
        if (streak >= 5) return 20;
        if (streak >= 3) return 10;
        return 5;
      },

      getStreakBadge: (streak: number) => {
        if (streak >= 100) return '⚡ Unstoppable';
        if (streak >= 60) return '👑 Legend';
        if (streak >= 30) return '💎 Diamond';
        if (streak >= 14) return '🥇 Gold';
        if (streak >= 7) return '🥈 Silver';
        if (streak >= 3) return '🥉 Bronze';
        return null;
      },

      recordActivity: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];
        const { currentStreak, longestStreak, lastActiveDate, streakHistory, lastBonusDate } = state.streak;

        if (lastActiveDate === today) {
          return { streakBonus: 0, isNewDay: false };
        }

        let newStreak = currentStreak;
        let bonus = 0;
        let newBadge: string | null = null;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (lastActiveDate === yesterdayStr || lastActiveDate === null) {
          newStreak = currentStreak + 1;
        } else {
          newStreak = 1;
        }

        const shouldBonus = !lastBonusDate || (new Date(today).getTime() - new Date(lastBonusDate).getTime()) >= 2 * 24 * 60 * 60 * 1000;
        
        if (shouldBonus) {
          bonus = state.getStreakBonus();
          const badge = state.getStreakBadge(newStreak);
          if (badge) newBadge = badge;
        }

        const newLongestStreak = Math.max(newStreak, longestStreak);

        set((state) => ({
          totalPoints: state.totalPoints + bonus,
          streak: {
            currentStreak: newStreak,
            longestStreak: newLongestStreak,
            lastActiveDate: today,
            streakHistory: [...streakHistory, today],
            todayXP: state.streak.todayXP + bonus,
            lastBonusDate: shouldBonus ? today : lastBonusDate,
          },
        }));

        if (newBadge) {
          get().addBadge(newBadge);
        }

        return { streakBonus: bonus, badge: newBadge, isNewDay: true };
      },

      // 🎮 Boss functions
      getBossDecks: () => BOSS_DECKS,

      isBossUnlocked: (deckId: string) => {
        const deck = BOSS_DECKS.find(d => d.id === deckId);
        if (!deck) return false;
        return get().getLevel() >= deck.requiredLevel;
      },

      defeatBoss: (deckId: string, score: number, total: number, flawless: boolean) => {
        set((state) => {
          const existing = state.bossProgress.find(p => p.deckId === deckId);
          const newProgress: BossProgress = {
            deckId,
            defeated: score >= (BOSS_DECKS.find(d => d.id === deckId)?.passingScore || total),
            attempts: (existing?.attempts || 0) + 1,
            bestScore: Math.max(score, existing?.bestScore || 0),
            flawless: flawless || existing?.flawless || false,
            lastAttempt: new Date().toISOString(),
          };

          const updatedProgress = existing
            ? state.bossProgress.map(p => p.deckId === deckId ? newProgress : p)
            : [...state.bossProgress, newProgress];

          return { bossProgress: updatedProgress };
        });

        // Add rewards
        const deck = BOSS_DECKS.find(d => d.id === deckId);
        if (!deck) return;

        const passed = score >= deck.passingScore;
        if (passed) {
          get().addPoints(200);
          get().addBadge(`🗡️ ${deck.name} Slayer`);
          if (flawless) {
            get().addPoints(300);
            get().addBadge(`⭐ Flawless ${deck.name}`);
          }
        }
      },

      getBossProgress: (deckId: string) => {
        return get().bossProgress.find(p => p.deckId === deckId) || null;
      },
    }),
    {
      name: 'medtach-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
