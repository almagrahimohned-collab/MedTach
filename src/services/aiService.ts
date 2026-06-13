import axios from 'axios';

const OPENROUTER_API_KEY = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY;
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const getHeaders = () => ({
  'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
  'Content-Type': 'application/json',
});

// نماذج مختلفة حسب المهمة
const MODELS = {
  patient: 'google/gemini-2.0-flash-lite-001',  // أرخص نموذج - للمريض
  supervisor: 'google/gemini-2.0-flash-exp',     // نموذج متوسط - للمشرف
  evaluation: 'google/gemini-2.0-flash-exp',     // للتقييم النهائي
};

async function callModel(model: string, messages: any[], maxTokens = 300, temp = 0.7): Promise<string> {
  try {
    const res = await axios.post(API_URL, {
      model, messages, max_tokens: maxTokens, temperature: temp,
    }, { headers: getHeaders() });
    return res.data.choices[0].message.content;
  } catch (e) {
    console.warn(`Model ${model} failed`);
    throw e;
  }
}

// ========== SYSTEM PROMPTS ==========

const PATIENT_PROMPT = (ctx: any) => `You are a PATIENT in a medical simulation. 
Your name: ${ctx.patientInfo}
Your main complaint: ${ctx.chiefComplaint}
Your personality: ${ctx.patientPersona}

RULES:
- Speak like a real patient, NOT a doctor
- Use simple, non-medical language
- Express emotions (fear, pain, worry) when appropriate  
- Answer questions about YOUR symptoms and history ONLY
- Never mention diagnoses or medical terms
- Keep responses 2-3 sentences
- If asked something you don't know, say "I'm not sure, doctor"

Your known responses: ${JSON.stringify(ctx.patientResponses).substring(0, 400)}`;

const SUPERVISOR_PROMPT = (ctx: any) => `You are a SENIOR ATTENDING PHYSICIAN supervising a medical resident.

CASE CONTEXT:
Patient: ${ctx.patientInfo}
Chief Complaint: ${ctx.chiefComplaint}
Correct Diagnosis (HIDDEN - do NOT reveal): ${ctx.correctDiagnosis}
Available Test Results: ${JSON.stringify(ctx.hiddenData).substring(0, 500)}

RULES:
- Guide the resident WITHOUT revealing the diagnosis
- If they ask "what is the diagnosis?", reply: "Doctor, you must formulate your own diagnosis. What is your assessment?"
- Praise good clinical reasoning
- Gently correct mistakes
- Be educational but concise (2-4 sentences)
- Suggest next steps when appropriate
- NEVER say the correct diagnosis until they submit theirs`;

const EVALUATION_PROMPT = (diagnosis: string, correct: string, tests: number, time: string, verdict: string) => 
`You are a senior attending physician giving feedback to a medical resident.

Student's diagnosis: "${diagnosis}"
Correct diagnosis: "${correct}"
Verdict: ${verdict}
Tests ordered: ${tests}
Time taken: ${time}

Write a brief (60-80 words), warm, and educational feedback. 
- Start with acknowledging their effort
- If correct: praise their clinical reasoning
- If incorrect: gently guide them to the right answer
- End with an encouraging note
Address them as "Doctor". Be supportive.`;

// ========== MAIN FUNCTIONS ==========

export async function chatWithCase(
  userMessage: string,
  queryType: string,
  ctx: any,
  history: any[] = []
): Promise<string> {
  // اختيار النموذج المناسب
  const isPatientQuestion = /you|your|when did|how long|do you|have you|are you|tell me|describe|what is your/i.test(userMessage);
  const model = isPatientQuestion ? MODELS.patient : MODELS.supervisor;
  const systemPrompt = isPatientQuestion ? PATIENT_PROMPT(ctx) : SUPERVISOR_PROMPT(ctx);

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-10),  // ذاكرة أطول: 10 رسائل
    { role: 'user', content: userMessage },
  ];

  try {
    return await callModel(model, messages, isPatientQuestion ? 200 : 350, 0.7);
  } catch {
    // Fallback: جرب النموذج الثاني
    try {
      const fallbackModel = isPatientQuestion ? MODELS.supervisor : MODELS.patient;
      return await callModel(fallbackModel, messages, 200, 0.7);
    } catch {
      return isPatientQuestion 
        ? "I'm sorry, doctor. I'm not feeling well enough to answer that right now."
        : "Doctor, I recommend continuing your clinical assessment systematically.";
    }
  }
}

export async function generateAttendingFeedback(fbData: any): Promise<string> {
  const prompt = EVALUATION_PROMPT(
    fbData.yourDiagnosis,
    fbData.correctDiagnosis,
    fbData.testsCount,
    fbData.timeStr,
    fbData.verdict
  );

  try {
    return await callModel(MODELS.evaluation, [{ role: 'user', content: prompt }], 150, 0.9);
  } catch {
    // Fallback messages
    if (fbData.verdict === 'correct') {
      return "Excellent work, Doctor. You correctly identified the diagnosis and managed this case efficiently. Your clinical reasoning is impressive. Keep up the great work!";
    } else if (fbData.verdict === 'partially_correct') {
      return "Good effort, Doctor. You were on the right track but missed some key details. Review the case carefully and learn from this experience. You're getting better with every case.";
    }
    return "Don't worry, Doctor. Every case is a learning opportunity. Review the correct diagnosis and the key findings you may have missed. You'll do better on the next one.";
  }
}

// للتوافق مع باقي الكود
export const fetchAIResponse = chatWithCase;
export const evaluateDiagnosis = async () => ({ 
  verdict: 'correct', confidence: 100, key_clue_used: '', 
  key_clue_missed: '', one_action: '', learning_tip: '' 
});

// ========== EDUCATIONAL FEEDBACK FOR WRONG DIAGNOSES ==========
// Prompt صغير جداً لتوفير التوكينز - يستخدم فقط للأخطاء

const EDUCATIONAL_PROMPT = (correctDx: string, userDx: string, chiefComplaint: string) => 
  `Teaching: ${chiefComplaint}. Resident said "${userDx}". Correct: "${correctDx}". Why wrong? (2 sentences max, encouraging tone)`;

export async function getEducationalFeedback(
  correctDx: string,
  userDx: string,
  chiefComplaint: string
): Promise<string> {
  const prompt = EDUCATIONAL_PROMPT(correctDx, userDx, chiefComplaint);
  
  try {
    // استخدام أرخص نموذج (google/gemini-2.0-flash-lite-001)
    const response = await callModel(
      MODELS.patient,
      [{ role: 'user', content: prompt }],
      100, // max 100 tokens فقط!
      0.8
    );
    return response;
  } catch {
    // Fallback static إذا فشل الـ AI
    return `Your diagnosis of "${userDx}" differs from the correct answer. Review the key clinical findings and try to identify what led to this difference. Every case is a learning opportunity!`;
  }
}
