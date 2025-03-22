import { PromptConfig, DEFAULT_PROMPTS } from '../config/prompts';

export class PromptManager {
  private prompts: Map<string, PromptConfig>;
  private variables: Map<string, string>;

  constructor() {
    this.prompts = new Map(Object.entries(DEFAULT_PROMPTS));
    this.variables = new Map();
  }

  setPrompt(id: string, config: PromptConfig) {
    this.prompts.set(id, config);
  }

  getPrompt(id: string): PromptConfig | undefined {
    return this.prompts.get(id);
  }

  setVariable(key: string, value: string) {
    this.variables.set(key, value);
  }

  compilePrompt(id: string, additionalVars?: Record<string, string>): string {
    const prompt = this.prompts.get(id);
    if (!prompt) throw new Error(`Prompt not found: ${id}`);

    let content = prompt.content;
    
    // Replace environment variables
    prompt.variables?.forEach(varName => {
      const value = additionalVars?.[varName] || 
                   this.variables.get(varName) || 
                   process.env[varName];
      if (value) {
        content = content.replace(`{{${varName}}}`, value);
      }
    });

    return content;
  }

  getAllPrompts(): PromptConfig[] {
    return Array.from(this.prompts.values());
  }
}

export const promptManager = new PromptManager();
