import { ModelConfig } from './types';
import { myProvider } from '../models';

export function getModelInstance(config: ModelConfig) {
  return myProvider.languageModel(config.model);
}

export function getDefaultModels(): ModelConfig[] {
  return [
    {
      provider: 'anthropic',
      model: 'claude-3.7-sonnet',
      label: 'Claude 3.7 Sonnet',
    },
    {
      provider: 'anthropic',
      model: 'claude-3.5-haiku',
      label: 'Claude 3.5 Haiku',
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
}
