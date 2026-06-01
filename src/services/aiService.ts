import axios from 'axios';

const OPENROUTER_API_KEY = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY;
const SITE_URL = 'https://clinicalmind.app';
const SITE_NAME = 'ClinicalMind';

const MODEL_FALLBACK_LIST = [
  'anthropic/claude-3.5-sonnet',
  'google/gemini-2.0-flash-exp',
  'meta-llama/llama-3.1-405b-instruct',
  'mistralai/mistral-large-2',
  'qwen/qwen-2.5-72b-instruct'
];

const SYSTEM_PROMPT = `You are a strict, senior attending physician supervising a medical resident in a clinical diagnostic simulator. ALL YOUR RESPONSES MUST BE STRICTLY IN ENGLISH.

CORE RULES:
1. DIAGNOSTICS ONLY: This is a diagnostic identification simulator. Focus entirely on history, clinical examination, and investigations.
2. STRICT HYBRID DATA: You will receive the patient's factual data in the hidden context. You MUST ONLY disclose results that explicitly exist in this provided data. NEVER hallucinate or invent lab values.
3. UNAVAILABLE TESTS: If requested data is not present, reply: "This specific investigation is currently unavailable or clinically irrelevant. Please refocus your diagnostic approach."
4. OFF-TOPIC: If the user types non-medical text, reply: "Doctor, please maintain professionalism and focus on the clinical assessment."
5. TONE: Be concise, academic, and professional. Do not give away the final diagnosis until they submit it.`;

export const fetchAIResponse = async (history: any[], userRequest: string) => {
  if (!OPENROUTER_API_KEY) {
    return "Attending Physician: API key not configured. Please check environment variables.";
  }

  for (const model of MODEL_FALLBACK_LIST) {
    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: model,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...history,
            { role: 'user', content: userRequest }
          ],
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'HTTP-Referer': SITE_URL,
            'X-Title': SITE_NAME,
            'Content-Type': 'application/json',
          }
        }
      );
      return response.data.choices[0].message.content;
    } catch (error) {
      console.warn(`Model ${model} failed, trying next...`);
    }
  }
  return "Attending Physician: We are currently experiencing technical difficulties with all diagnostic engines. Please check your connection.";
};
