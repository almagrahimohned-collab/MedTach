import AsyncStorage from '@react-native-async-storage/async-storage';

const EXAM_STATE_KEY = 'current_exam_state';
const EXAM_HISTORY_KEY = 'board_prep_data';

export interface SavedExamState {
  mode: 'mock' | 'half' | 'full';
  boardType: string;
  answers: Record<string, string>;
  currentBlock: number;
  currentQuestionIndex: number;
  timeRemaining: number;
  flaggedQuestions: string[];
  examQuestions: any[];
  startedAt: string;
  lastSaved: string;
  totalBlocks: number;
  attemptNumber: number;
}

export async function saveExamProgress(state: SavedExamState): Promise<void> {
  try {
    await AsyncStorage.setItem(EXAM_STATE_KEY, JSON.stringify({
      ...state,
      lastSaved: new Date().toISOString(),
    }));
  } catch (error) {}
}

export async function loadExamProgress(): Promise<SavedExamState | null> {
  try {
    const stored = await AsyncStorage.getItem(EXAM_STATE_KEY);
    if (stored) {
      const state: SavedExamState = JSON.parse(stored);
      const now = new Date();
      const startedAt = new Date(state.startedAt);
      const hoursSinceStart = (now.getTime() - startedAt.getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceStart > 24) {
        await clearExamProgress();
        return null;
      }
      
      return state;
    }
    return null;
  } catch (error) {
    return null;
  }
}

export async function clearExamProgress(): Promise<void> {
  try { await AsyncStorage.removeItem(EXAM_STATE_KEY); } catch (error) {}
}

export async function hasUnfinishedExam(): Promise<boolean> {
  const state = await loadExamProgress();
  return state !== null && state.timeRemaining > 0;
}

export async function getUnfinishedExamSummary(): Promise<any | null> {
  const state = await loadExamProgress();
  if (!state || state.timeRemaining <= 0) return null;
  
  const answeredCount = Object.keys(state.answers).length;
  const totalQuestions = state.examQuestions.length;
  const progress = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;
  
  return {
    mode: state.mode,
    boardType: state.boardType,
    answeredCount,
    totalQuestions,
    timeRemaining: state.timeRemaining,
    progress,
    startedAt: state.startedAt,
  };
}

export async function saveCompletedExam(examData: any): Promise<void> {
  try {
    const stored = await AsyncStorage.getItem(EXAM_HISTORY_KEY);
    const attempts = stored ? JSON.parse(stored) : [];
    attempts.push(examData);
    await AsyncStorage.setItem(EXAM_HISTORY_KEY, JSON.stringify(attempts));
  } catch (error) {}
}

export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function formatRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}
