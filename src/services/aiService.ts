import axios from 'axios';

const OPENROUTER_API_KEY = 'OPENROUTER_KEY_PLACEHOLDER
const SITE_URL = 'https://your-medical-app.com';
const SITE_NAME = 'ClinicalMind';

export const fetchAIResponse = async (history: any[], userRequest: string) => {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          { role: 'system', content: 'You are a senior medical consultant. Respond to clinical requests briefly, professionally, and provide realistic diagnostic test results based on the clinical case.' },
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
    return "Error: Could not retrieve diagnostic results. Please try again.";
  }
};
