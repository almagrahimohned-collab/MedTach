import axios from 'axios';

const OPENROUTER_API_KEY = 'YOUR_OPENROUTER_API_KEY'; // ضع مفتاحك هنا
const SITE_URL = 'https://clinicalmind.app';
const SITE_NAME = 'ClinicalMind';

const SYSTEM_PROMPT = `You are a strict, senior attending physician supervising a medical resident in a clinical diagnostic simulator.
ALL YOUR RESPONSES MUST BE STRICTLY IN ENGLISH.

CORE RULES:
1. DIAGNOSTICS ONLY: This is a diagnostic identification simulator, not a physiological treatment simulator. Focus entirely on history, clinical examination, and investigations.
2. STRICT HYBRID DATA: You will receive the patient's factual data in the hidden context. You MUST ONLY disclose results that explicitly exist in this provided data. NEVER hallucinate or invent lab values or physical signs.
3. UNAVAILABLE TESTS: If the resident requests an investigation or data point that is NOT present in the hidden context, reply strictly with a variation of: "This specific investigation is currently unavailable or clinically irrelevant to the patient's primary presentation. Please refocus your diagnostic approach." (You may gently hint at the correct system to investigate, e.g., Cardiovascular).
4. OFF-TOPIC / GIBBERISH: If the user types non-medical, casual, or nonsensical text, reply firmly: "Doctor, please maintain professionalism and focus on the clinical assessment of the patient."
5. TONE: Be extremely concise, academic, and professional. Act as a mentor but do not give away the final diagnosis until they submit it.
`;

export const fetchAIResponse = async (history: any[], userRequest: string) => {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'anthropic/claude-3.5-sonnet',
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
    console.error('AI Error:', error);
    return "Attending Physician: We are experiencing a system communication error. Please check your connection and try again.";
  }
};
