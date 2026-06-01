import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CaseResult {
  caseId: string;
  score: number;
  date: string;
}

interface DailyChallenge {
  date: string;
  specialty: string;
  level: string;
  caseId: string;
  completed: boolean;
  bonusPoints: number;
}

interface QuestProgress {
  id: string;
  completed: boolean;
  claimed: boolean;
  progress: number;
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
  quests: QuestProgress[];

  addPoints: (points: number) => void;
  deductPoints: (points: number) => void;
  resetScore: () => void;
  saveCaseResult: (caseId: string, finalScore: number) => void;
  setCategory: (specialtyId: string, sub: string, diff: string) => void;
  resetSession: () => void;
  setDailyChallenge: (challenge: DailyChallenge) => void;
  completeDailyChallenge: (bonusPoints: number) => void;
  addBadge: (badge: string) => void;
  updateQuestProgress: (questId: string, progress: number) => void;
  claimQuest: (questId: string) => number;
  getAccuracy: () => number;
  getUniqueSpecialties: () => number;
  getTodayCases: () => CaseResult[];
}

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
      quests: [],

      addPoints: (points) =>
        set((state) => ({ totalPoints: state.totalPoints + points })),

      deductPoints: (points) =>
        set((state) => ({ score: Math.max(0, state.score - points) })),

      resetScore: () => set({ score: 100 }),

      saveCaseResult: (caseId, finalScore) =>
        set((state) => ({
          completedCases: [
            ...state.completedCases,
            { caseId, score: finalScore, date: new Date().toISOString() }
          ],
          totalPoints: state.totalPoints + finalScore
        })),

      setCategory: (specialtyId, sub, diff) =>
        set({ specialtyId, subCategory: sub, difficulty: diff, score: 100 }),

      resetSession: () =>
        set({ specialtyId: null, subCategory: null, difficulty: null, score: 100 }),

      setDailyChallenge: (challenge) =>
        set({
          dailyChallenge: challenge,
          lastChallengeDate: challenge.date
        }),

      completeDailyChallenge: (bonusPoints) =>
        set((state) => ({
          totalPoints: state.totalPoints + bonusPoints,
          dailyChallenge: state.dailyChallenge
            ? { ...state.dailyChallenge, completed: true }
            : null
        })),

      addBadge: (badge) =>
        set((state) => ({
          badges: state.badges.includes(badge)
            ? state.badges
            : [...state.badges, badge]
        })),

      updateQuestProgress: (questId, progress) =>
        set((state) => ({
          quests: state.quests.map(q =>
            q.id === questId ? { ...q, progress, completed: progress >= 100 } : q
          )
        })),

      claimQuest: (questId) => {
        const quest = get().quests.find(q => q.id === questId);
        if (quest && quest.completed && !quest.claimed) {
          const reward = quest.id.includes('weekly') ? 
            (quest.id.includes('accuracy') ? 250 : quest.id.includes('specialties') ? 150 : 200) :
            (quest.id.includes('perfect') ? 75 : quest.id.includes('points') ? 40 : 50);
          
          set((state) => ({
            totalPoints: state.totalPoints + reward,
            quests: state.quests.map(q =>
              q.id === questId ? { ...q, claimed: true } : q
            )
          }));
          return reward;
        }
        return 0;
      },

      getAccuracy: () => {
        const cases = get().completedCases;
        if (cases.length === 0) return 100;
        return Math.round(
          cases.reduce((acc, c) => acc + c.score, 0) / cases.length
        );
      },

      getUniqueSpecialties: () => {
        const cases = get().completedCases;
        const uniqueSpecialties = new Set(
          cases.map((c) => c.caseId?.split('_')[0])
        );
        return uniqueSpecialties.size;
      },

      getTodayCases: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().completedCases.filter((c) => c.date?.startsWith(today));
      },
    }),
    {
      name: 'clinical-mind-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
