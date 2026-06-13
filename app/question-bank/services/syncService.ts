// ☁️ Sync Service v2 - With Offline Queue
import { supabase } from '../../../src/config/supabase';
import { addToQueue } from '../../../src/services/offlineQueue';

export interface SRRecord {
  question_id: string; interval: number; next_review: string;
  correct_count: number; wrong_count: number;
}

// 🧠 Sync Spaced Repetition (with offline queue)
export async function syncSpacedRepetition(userId: string, data: Record<string, SRRecord>): Promise<void> {
  for (const [question_id, d] of Object.entries(data)) {
    const payload = {
      user_id: userId, question_id,
      interval: d.interval, next_review: d.next_review,
      correct_count: d.correct_count, wrong_count: d.wrong_count,
      last_reviewed: new Date().toISOString(),
    };
    
    // Try direct sync, fallback to queue
    try {
      const { error } = await supabase.from('user_spaced_repetition').upsert(
        payload, { onConflict: 'user_id, question_id' }
      );
      if (error) throw error;
    } catch {
      await addToQueue('sr_update', payload);
    }
  }
}

// 📥 Load SR from cloud
export async function loadSpacedRepetition(userId: string): Promise<Record<string, SRRecord> | null> {
  try {
    const { data } = await supabase.from('user_spaced_repetition').select('*').eq('user_id', userId);
    if (!data) return null;
    const result: Record<string, SRRecord> = {};
    data.forEach((r: any) => {
      result[r.question_id] = {
        question_id: r.question_id, interval: r.interval,
        next_review: r.next_review, correct_count: r.correct_count,
        wrong_count: r.wrong_count,
      };
    });
    return result;
  } catch { return null; }
}

// 📊 Save Quiz Session (with queue)
export async function saveQuizSession(userId: string, session: any): Promise<void> {
  const payload = { user_id: userId, ...session, created_at: new Date().toISOString() };
  try {
    const { error } = await supabase.from('user_quiz_sessions').insert(payload);
    if (error) throw error;
  } catch {
    await addToQueue('quiz_session', payload);
  }
}

// 📝 Log Answer (with queue)
export async function logAnswer(
  userId: string, questionId: string, isCorrect: boolean,
  timeSpent: number, confidence: number, cognitiveLevel?: string,
  trapType?: string, tags?: string[]
): Promise<void> {
  const payload = {
    user_id: userId, question_id: questionId, is_correct: isCorrect,
    time_spent: timeSpent, confidence, cognitive_level: cognitiveLevel,
    trap_type: trapType, tags: tags || [], created_at: new Date().toISOString(),
  };
  try {
    const { error } = await supabase.from('user_question_progress').insert(payload);
    if (error) throw error;
  } catch {
    await addToQueue('answer_log', payload);
  }
}
