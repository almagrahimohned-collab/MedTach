import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CaseResult {
  caseId: string;
  score: number;
  date: string;
}

interface AppStore {
  // Session State
  score: number;
  totalPoints: number;
  completedCases: CaseResult[];
  subCategory: string | null;
  difficulty: string | null;
  specialtyId: string | null;

  // Daily Challenge State
  dailyChallengeId: string | null;
  lastChallengeDate: string | null;

  // Badges State
  badges: string[];

  // Actions
  addPoints: (points: number) => void;
  deductPoints: (points: number) => void;
  resetScore: () => void;
  saveCaseResult: (caseId: string, finalScore: number) => void;
  setCategory: (specialtyId: string, sub: string, diff: string) => void;
  resetSession: () => void;
  setDailyChallenge: (caseId: string) => void;
  addBadge: (badge: string) => void;
}

export const useStore = create<AppStore>()(
  persist(
    (set) => ({
      // Initial State
      score: 100,
      totalPoints: 0,
      completedCases: [],
      subCategory: null,
      difficulty: null,
      specialtyId: null,
      dailyChallengeId: null,
      lastChallengeDate: null,
      badges: [],

      // Actions
      addPoints: (points) =>
        set((state) => ({ totalPoints: state.totalPoints + points })),

      deductPoints: (points) =>
        set((state) => ({ score: Math.max(0, state.score - points) })),

      resetScore: () =>
        set({ score: 100 }),

      saveCaseResult: (caseId, finalScore) =>
        set((state) => ({
          completedCases: [
            ...state.completedCases,
            { caseId, score: finalScore, date: new Date().toISOString() }
          ],
          totalPoints: state.totalPoints + finalScore // إضافة نتيجة الحالة للمجموع التراكمي
        })),

      setCategory: (specialtyId, sub, diff) =>
        set({ specialtyId, subCategory: sub, difficulty: diff, score: 100 }),

      resetSession: () =>
        set({ specialtyId: null, subCategory: null, difficulty: null, score: 100 }),

      setDailyChallenge: (caseId) =>
        set({
          dailyChallengeId: caseId,
          lastChallengeDate: new Date().toISOString().split('T')[0]
        }),

      addBadge: (badge) =>
        set((state) => ({
          badges: state.badges.includes(badge) ? state.badges : [...state.badges, badge]
        })),
    }),
    {
      name: 'clinical-mind-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
