export const MODEL_CONFIG = {
  classifier: {
    name: 'google/gemini-2.0-flash-lite-001',
    maxTokens: 50,
    temperature: 0.1,
    costPer1k: 0.0001,
  },
  chat: {
    primary: 'anthropic/claude-3.5-sonnet',
    fallbacks: [
      'google/gemini-2.0-flash-exp',
      'meta-llama/llama-3.1-405b-instruct',
      'mistralai/mistral-large-2',
    ],
    maxTokens: 500,
    temperature: 0.7,
    costPer1k: 0.003,
  },
  evaluator: {
    name: 'anthropic/claude-3.5-sonnet',
    maxTokens: 300,
    temperature: 0.3,
    costPer1k: 0.003,
  },
} as const;

export type ModelType = keyof typeof MODEL_CONFIG;
