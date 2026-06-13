import { supabase } from '../config/supabase';

export interface ICUScore {
  scenario_id: string;
  score: number;
  grade: string;
  goals_met: number;
  total_goals: number;
  time_bonus?: number;
  complications?: number;
  patient_died: boolean;
  achievements: string[];
}

// حفظ نتيجة
export async function saveICUScore(data: ICUScore): Promise<boolean> {
  try {
    const { error } = await supabase.from('icu_scores').insert({
      user_id: (await supabase.auth.getUser()).data.user?.id,
      scenario_id: data.scenario_id,
      score: data.score,
      grade: data.grade,
      goals_met: data.goals_met,
      total_goals: data.total_goals,
      time_bonus: data.time_bonus || 0,
      complications: data.complications || 0,
      patient_died: data.patient_died,
      achievements: data.achievements,
    });

    return !error;
  } catch (e) {
    console.error('Failed to save ICU score:', e);
    return false;
  }
}

// فتح سيناريو جديد
export async function unlockScenario(scenarioId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('icu_unlocks').insert({
      user_id: (await supabase.auth.getUser()).data.user?.id,
      scenario_id: scenarioId,
    });

    return !error;
  } catch (e) {
    console.error('Failed to unlock scenario:', e);
    return false;
  }
}

// حفظ إنجاز
export async function saveAchievement(achievementId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('icu_achievements').insert({
      user_id: (await supabase.auth.getUser()).data.user?.id,
      achievement_id: achievementId,
    });

    return !error;
  } catch (e) {
    console.error('Failed to save achievement:', e);
    return false;
  }
}

// جلب السيناريوهات المفتوحة
export async function getUnlockedScenarios(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('icu_unlocks')
      .select('scenario_id')
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

    if (error) return [];
    return data.map((d: any) => d.scenario_id);
  } catch (e) {
    console.error('Failed to get unlocks:', e);
    return [];
  }
}

// جلب الإنجازات
export async function getAchievements(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('icu_achievements')
      .select('achievement_id')
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

    if (error) return [];
    return data.map((d: any) => d.achievement_id);
  } catch (e) {
    console.error('Failed to get achievements:', e);
    return [];
  }
}

// جلب أفضل النتائج
export async function getTopScores(scenarioId: string, limit = 10): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('icu_scores')
      .select('score, grade, goals_met, created_at, user_id')
      .eq('scenario_id', scenarioId)
      .order('score', { ascending: false })
      .limit(limit);

    if (error) return [];
    return data;
  } catch (e) {
    console.error('Failed to get top scores:', e);
    return [];
  }
}

// جلب إحصائيات المستخدم
export async function getUserStats(): Promise<any> {
  try {
    const userId = (await supabase.auth.getUser()).data.user?.id;

    const { data: scores, error } = await supabase
      .from('icu_scores')
      .select('score, grade, scenario_id, patient_died')
      .eq('user_id', userId);

    if (error || !scores) return null;

    const totalCases = scores.length;
    const saves = scores.filter((s: any) => !s.patient_died).length;
    const bestScore = Math.max(...scores.map((s: any) => s.score));
    const avgScore = Math.round(scores.reduce((a: number, s: any) => a + s.score, 0) / totalCases);
    const grades: Record<string, number> = {};
    scores.forEach((s: any) => {
      grades[s.grade] = (grades[s.grade] || 0) + 1;
    });

    return {
      totalCases,
      saves,
      deaths: totalCases - saves,
      bestScore,
      avgScore,
      grades,
    };
  } catch (e) {
    console.error('Failed to get user stats:', e);
    return null;
  }
}
