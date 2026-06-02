import axios from 'axios';

const OPENROUTER_API_KEY = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY;
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const SITE_URL = 'https://medtach.app';
const SITE_NAME = 'MedTach';

const getHeaders = () => ({
  'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
  'Content-Type': 'application/json',
});

export async function chatWithCase(
  userMessage: string,
  _queryType: string,
  caseContext: any,
  history: any[] = []
): Promise<string> {
  const systemPrompt = `You are a medical simulation AI with THREE roles:

1. PATIENT: When asked personal questions (symptoms, history, feelings), respond AS THE PATIENT naturally with 2-4 sentences. Express emotions matching the persona. Use simple non-medical language.

2. TECHNICIAN: When asked for test results, provide ONLY the exact stored data. If test not available, say "This investigation is not clinically indicated."

3. SUPERVISOR: When asked for medical guidance, act as senior attending. Be concise but helpful. NEVER reveal the final diagnosis.

CASE: ${caseContext.patientInfo}
COMPLAINT: ${caseContext.chiefComplaint}
PERSONA: ${caseContext.patientPersona}
DATA: ${JSON.stringify(caseContext.hiddenData).substring(0, 600)}
RESPONSES: ${JSON.stringify(caseContext.patientResponses).substring(0, 600)}`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-6),
    { role: 'user', content: userMessage },
  ];

  const models = ['google/gemini-2.0-flash-exp', 'meta-llama/llama-3.1-8b-instruct'];
  
  for (const model of models) {
    try {
      const response = await axios.post(API_URL, {
        model, messages, max_tokens: 300, temperature: 0.7,
      }, { headers: getHeaders() });
      return response.data.choices[0].message.content;
    } catch { continue; }
  }
  return 'I apologize, Doctor. I am unable to respond at this moment. Please try again.';
}

export async function evaluateDiagnosis(
  student: string, correct: string, tests: number, time: number, diff: string
): Promise<any> {
  const prompt = `Compare student diagnosis with correct diagnosis.
Student: "${student}"
Correct: "${correct}"

Reply ONLY with JSON (no markdown, no backticks):
{"verdict":"correct"|"incorrect"|"partially_correct","confidence":0-100,"key_clue_used":"brief","key_clue_missed":"brief or null","one_action":"brief","learning_tip":"brief"}`;

  try {
    const response = await axios.post(API_URL, {
      model: 'google/gemini-2.0-flash-exp',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 250,
      temperature: 0.2,
    }, { headers: getHeaders() });
    
    const text = response.data.choices[0].message.content;
    const cleanText = text.replace(/```json|```/g, '').trim();
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.warn('Evaluation error:', e);
  }
  
  // Fallback
  const isCorrect = student.toLowerCase().includes(correct.toLowerCase());
  return {
    verdict: isCorrect ? 'correct' : 'incorrect',
    confidence: isCorrect ? 85 : 40,
    key_clue_used: 'Diagnosis submitted',
    key_clue_missed: isCorrect ? null : 'Review the case findings carefully',
    one_action: 'Compare your findings with the correct diagnosis',
    learning_tip: 'Practice more cases to improve diagnostic accuracy',
  };
}

export const fetchAIResponse = chatWithCase;
export const classifyQuery = async (text: string) => ({ category: 'medical', type: 'general' });
