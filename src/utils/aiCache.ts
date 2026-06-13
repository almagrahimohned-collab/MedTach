// 🗄️ AI Response Cache - يقلل استهلاك التوكينز
import { supabase } from '../config/supabase';

export async function getCachedFeedback(
  caseId: string,
  correctDx: string,
  userDx: string
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('ai_feedback_cache')
      .select('ai_response')
      .eq('case_id', caseId)
      .eq('user_diagnosis', userDx)
      .single();
    
    if (data && !error) {
      // تحديث عداد الاستخدام
      await supabase
        .from('ai_feedback_cache')
        .update({ usage_count: supabase.sql`usage_count + 1` })
        .eq('case_id', caseId)
        .eq('user_diagnosis', userDx);
      
      return data.ai_response;
    }
    return null;
  } catch {
    return null;
  }
}

export async function saveFeedbackToCache(
  caseId: string,
  correctDx: string,
  userDx: string,
  chiefComplaint: string,
  aiResponse: string
): Promise<void> {
  try {
    await supabase.from('ai_feedback_cache').upsert({
      case_id: caseId,
      correct_diagnosis: correctDx,
      user_diagnosis: userDx,
      chief_complaint: chiefComplaint,
      ai_response: aiResponse,
      usage_count: 1
    }, {
      onConflict: 'case_id, user_diagnosis'
    });
  } catch (e) {
    console.log('Cache save failed (non-critical):', e);
  }
}
