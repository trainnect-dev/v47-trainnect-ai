// Mock for @/lib/models
const models = [
  {
    id: 'anthropic/claude-3-haiku',
    name: 'Claude 3 Haiku',
    description: 'Anthropic Claude 3 Haiku',
    features: ['multimodal'],
  },
  {
    id: 'anthropic/claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    description: 'Anthropic Claude 3 Sonnet',
    features: ['multimodal'],
  },
  {
    id: 'openai/gpt-4o',
    name: 'GPT-4o',
    description: 'OpenAI GPT-4o',
    features: ['multimodal'],
  }
];

module.exports = {
  models
};
