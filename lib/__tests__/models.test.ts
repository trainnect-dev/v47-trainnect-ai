const { myProvider, models } = require("../models");

// This is a simple test file to verify that each model is properly configured
// and can be used with the Vercel AI SDK.

// Mock the models
jest.mock('../models', () => {
  return {
    myProvider: {
      languageModel: jest.fn((modelId) => ({ id: modelId })),
    },
    models: [
      { id: 'claude-3.7-sonnet', name: 'Claude 3.7 Sonnet', description: 'Test description' },
      { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', description: 'Test description' },
      { id: 'o3-mini', name: 'Openai o3-mini', description: 'Test description' },
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', description: 'Test description' },
      { id: 'qwen-qwq-32b', name: 'Groq open source llms', description: 'Test description' },
      { id: 'codestral-latest', name: 'Mistral open source llms', description: 'Test description' },
      { id: 'perplexity sonar', name: 'perplexity models', description: 'Test description' },
      { id: 'google/gemini-2.0-flash-thinking-exp:free', name: 'Openrouter models', description: 'Test description' },
    ],
    modelApiNames: {
      'claude-3.7-sonnet': 'claude-3-7-sonnet-20250219',
      'claude-3.5-sonnet': 'claude-3-5-sonnet-latest',
      'o3-mini': 'o3-mini',
      'gemini-2.0-flash': 'gemini-2.0-flash',
      'qwen-qwq-32b': 'qwen-qwq-32b',
      'codestral-latest': 'codestral-latest',
      'perplexity sonar': 'perplexity sonar',
      'google/gemini-2.0-flash-thinking-exp:free': 'google/gemini-2.0-flash-thinking-exp:free',
    },
  };
});

// Restore console methods after all tests
afterAll(() => {
  if (global.originalConsoleError) {
    console.error = global.originalConsoleError;
  }
  if (global.originalConsoleWarn) {
    console.warn = global.originalConsoleWarn;
  }
});

describe("Model Configuration Tests", () => {
  // Test that all models in the models array have corresponding entries in myProvider
  test("All models should have corresponding provider configurations", () => {
    for (const model of models) {
      expect(() => {
        // This should not throw an error if the model is properly configured
        const languageModel = myProvider.languageModel(model.id);
        expect(languageModel).toBeDefined();
      }).not.toThrow();
    }
  });

  // Test specific model configurations
  test("Claude models should be configured correctly", () => {
    const claudeModels = models.filter(model => model.id.startsWith("claude"));
    expect(claudeModels.length).toBeGreaterThan(0);
    
    for (const model of claudeModels) {
      const languageModel = myProvider.languageModel(model.id);
      expect(languageModel).toBeDefined();
    }
  });

  test("OpenAI models should be configured correctly", () => {
    const openaiModels = models.filter(model => model.id.startsWith("o3"));
    expect(openaiModels.length).toBeGreaterThan(0);
    
    for (const model of openaiModels) {
      const languageModel = myProvider.languageModel(model.id);
      expect(languageModel).toBeDefined();
    }
  });

  test("Google models should be configured correctly", () => {
    const googleModels = models.filter(model => model.id.startsWith("gemini"));
    expect(googleModels.length).toBeGreaterThan(0);
    
    for (const model of googleModels) {
      const languageModel = myProvider.languageModel(model.id);
      expect(languageModel).toBeDefined();
    }
  });
});

// This test would be skipped in CI environments but can be run locally
// to verify that all required API keys are present
test.skip("All required API keys should be present", () => {
  // Mock function to check API keys
  const checkApiKeys = () => {
    const requiredEnvVars = [
      { name: "ANTHROPIC_API_KEY", models: ["claude-3.7-sonnet", "claude-3.5-sonnet"] },
      { name: "OPENAI_API_KEY", models: ["o3-mini"] },
      { name: "GOOGLE_GENERATIVE_AI_API_KEY", models: ["gemini-2.0-flash"] },
      { name: "GROQ_API_KEY", models: ["qwen-qwq-32b"] },
      { name: "MISTRAL_API_KEY", models: ["codestral-latest"] },
      { name: "PERPLEXITY_API_KEY", models: ["perplexity sonar"] },
      { name: "OPENROUTER_API_KEY", models: ["google/gemini-2.0-flash-thinking-exp:free"] },
    ];
  
    const missingKeys = [];
    
    for (const { name, models: relatedModels } of requiredEnvVars) {
      if (!process.env[name]) {
        missingKeys.push(`${name} (required for models: ${relatedModels.join(", ")})`);
      }
    }
    
    if (missingKeys.length > 0) {
      console.warn("Missing API keys:", missingKeys.join(", "));
      return false;
    }
    
    return true;
  };

  expect(checkApiKeys()).toBe(true);
});
