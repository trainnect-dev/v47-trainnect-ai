import { modelApiNames } from '../models';

export type ModelProvider = 'anthropic' | 'openai' | 'google' | 'groq' | 'mistral' | 'openrouter' | 'perplexity';

export type ModelConfig = {
  provider: ModelProvider;
  model: string;
  label: string;
};

// Use the existing models from the application
export const AVAILABLE_MODELS: ModelConfig[] = [
  {
    provider: 'anthropic',
    model: 'claude-3.7-sonnet',
    label: 'Claude 3.7 Sonnet',
  },
  {
    provider: 'anthropic',
    model: 'claude-3.5-sonnet',
    label: 'Claude 3.5 Sonnet',
  },
  {
    provider: 'openai',
    model: 'o3-mini',
    label: 'O3 Mini',
  },
  {
    provider: 'google',
    model: 'gemini-2.0-flash',
    label: 'Gemini 2.0 Flash',
  },
  {
    provider: 'groq',
    model: 'qwen-qwq-32b',
    label: 'Qwen QWQ 32B',
  },
  {
    provider: 'mistral',
    model: 'codestral-latest',
    label: 'Codestral Latest',
  },
  {
    provider: 'perplexity',
    model: 'perplexity sonar',
    label: 'Perplexity Sonar',
  },
  {
    provider: 'openrouter',
    model: 'google/gemini-2.0-flash-thinking-exp:free',
    label: 'Gemini 2.0 Flash Thinking',
  },
];

export type AgentMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
  toolCalls?: {
    type: string;
    function: {
      name: string;
      arguments: Record<string, unknown>;
    };
  }[];
};
