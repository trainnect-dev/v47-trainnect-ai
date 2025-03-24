The prompt management system works through several interconnected components. Here's a breakdown:

1. Core Configuration:
````typescript path=lib/config/prompts.ts mode=EXCERPT
export interface PromptConfig {
  id: string;
  name: string;
  content: string;
  description?: string;
  variables?: string[];
  tavilySettings?: TavilySettings;
}

export const DEFAULT_PROMPTS: Record<string, PromptConfig> = {
  'main-chat': {
    id: 'main-chat',
    name: 'Main Chat',
    content: process.env.MAIN_CHAT_PROMPT || `...`,
    variables: ['MODEL_ID', 'USER_ROLE', 'EXPERTISE_LEVEL']
  },
  // ... other prompts
}
````

2. Prompt Manager Service:
````typescript path=lib/services/prompt-manager.ts mode=EXCERPT
export class PromptManager {
  private prompts: Map<string, PromptConfig>;
  private variables: Map<string, string>;

  constructor() {
    this.prompts = new Map();
    Object.values(DEFAULT_PROMPTS).forEach(prompt => {
      this.prompts.set(prompt.id, prompt);
    });
    this.variables = new Map();
  }

  compilePrompt(id: string, additionalVars?: Record<string, string>): string {
    const prompt = this.prompts.get(id);
    if (!prompt) throw new Error(`Prompt not found: ${id}`);

    let content = prompt.content;
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
}
````

3. Admin UI:
- Located at `/admin/prompts`
- Uses the `PromptEditor` component for editing prompts
- Supports real-time editing of prompt content and Tavily settings

4. API Endpoints:
````typescript path=app/api/prompts/route.ts mode=EXCERPT
export async function GET() {
  return NextResponse.json({ prompts: promptManager.getAllPrompts() });
}

export async function POST(req: Request) {
  const { id, config } = await req.json();
  promptManager.setPrompt(id, config);
  return NextResponse.json({ success: true });
}
````

Prompts can be configured in three ways:
1. Default values in `DEFAULT_PROMPTS`
2. Environment variables (`.env.local`)
3. Through the admin UI at `/admin/prompts`

The system supports variable interpolation using `{{VARIABLE_NAME}}` syntax and includes special settings for Tavily search integration. When a prompt is needed, the `promptManager.compilePrompt()` method is called, which replaces variables with their values from either additional variables passed in, stored variables, or environment variables.
