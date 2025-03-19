import { ModelConfig } from './types';
import { myProvider } from '../models';

export function getModelInstance(config: ModelConfig) {
  return myProvider.languageModel(config.model);
}

export function getDefaultModels(): [ModelConfig, ModelConfig] {
  return [
    {
      provider: 'anthropic',
      model: 'claude-3.7-sonnet',
      label: 'Claude 3.7 Sonnet',
    },
    {
      provider: 'openai',
      model: 'o3-mini',
      label: 'O3 Mini',
    },
  ];
}
