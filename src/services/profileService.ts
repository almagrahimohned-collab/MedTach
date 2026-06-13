import { supabase } from '../config/supabase';

export async function updateProfile(userId: string, data: { totalPoints?: number; casesSolved?: number; badges?: string[] }) {
  const { error } = await supabase
    .from('profiles')
    .update({
      total_points: data.totalPoints,
      cases_solved: data.casesSolved,
      badges: data.badges,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) console.warn('Profile update error:', error);
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) return null;
  return data;
}
