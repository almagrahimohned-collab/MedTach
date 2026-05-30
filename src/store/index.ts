import { create } from 'zustand';

interface AppState {
  // Session Configuration
  specialtyId: string | null;
  subCategory: string | null;
  difficulty: string | null;
  
  // Scoring System
  score: number;
  
  // Actions
  setSessionConfig: (specialtyId: string, subCategory: string, difficulty: string) => void;
  deductPoints: (points: number) => void;
  resetSession: () => void;
}

export const useStore = create<AppState>((set) => ({
  specialtyId: null,
  subCategory: null,
  difficulty: null,
  score: 100, // البداية بـ 100 نقطة

  setSessionConfig: (specialtyId, subCategory, difficulty) => 
    set({ specialtyId, subCategory, difficulty, score: 100 }), // تصفير النقاط مع كل حالة جديدة

  deductPoints: (points) => 
    set((state) => ({ score: Math.max(0, state.score - points) })), // لا تنزل تحت الصفر

  resetSession: () => 
    set({ specialtyId: null, subCategory: null, difficulty: null, score: 100 }),
}));
