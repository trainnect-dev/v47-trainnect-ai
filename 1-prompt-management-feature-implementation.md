I'll provide a comprehensive guide that combines the prompt management system with your existing codebase.

1. First, create the prompt configuration file:

````typescript path=lib/config/prompts.ts mode=EDIT
export interface PromptConfig {
  id: string;
  name: string;
  content: string;
  description?: string;
  variables?: string[];
}

export const DEFAULT_PROMPTS: Record<string, PromptConfig> = {
  mainChat: {
    id: 'main-chat',
    name: 'Main Chat',
    content: process.env.MAIN_CHAT_PROMPT || `
<prompt>
You are an AI researcher and engineer with deep research expertise. You use tools like the tavily search tool to provide you with the latest most relevant information in your research and responses. If the user asks you, Tell me what llm are you, you are to provide them with an accurate response.
</prompt>`,
    variables: ['MODEL_ID', 'USER_ROLE', 'EXPERTISE_LEVEL']
  },
  tavilyChat: {
    id: 'tavily-chat',
    name: 'Tavily Chat',
    content: process.env.TAVILY_CHAT_PROMPT || `
<prompt>
You are an AI researcher and engineer with deep research expertise. You use tools like the tavily search tool to provide you with the latest most relevant information in your research and responses.
</prompt>`,
    variables: ['SEARCH_RESULTS', 'SEARCH_DEPTH']
  },
  aiAgent: {
    id: 'ai-agent',
    name: 'AI Agent Research',
    content: process.env.AI_AGENT_PROMPT || 'You are an expert researcher who uses the Tavily search tool to find relevant information. Provide concise, factual responses based on search results. Maintain context from previous messages when relevant.',
    variables: ['SEARCH_DEPTH', 'RESPONSE_STYLE']
  },
  aiAgentProcessor: {
    id: 'ai-agent-processor',
    name: 'AI Agent Processor',
    content: process.env.AI_AGENT_PROCESSOR_PROMPT || 'You are an expert at analyzing and synthesizing information. Review the research results and provide clear, well-structured insights.',
    variables: ['ANALYSIS_DEPTH', 'OUTPUT_FORMAT']
  },
  pdfContext: {
    id: 'pdf-context',
    name: 'PDF Context',
    content: ' The user has uploaded a PDF document. Analyze its content and respond to their questions about it.'
  },
  imageContext: {
    id: 'image-context',
    name: 'Image Context',
    content: ' The user has uploaded an image. Describe what you see in the image and respond to their questions about it.'
  }
};
````

2. Create the prompt management service:

````typescript path=lib/services/prompt-manager.ts mode=EDIT
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
````

3. Update your `.env.local` file:

````bash path=.env.local mode=EDIT
# System Prompts
MAIN_CHAT_PROMPT="You are an AI researcher with {{EXPERTISE_LEVEL}} expertise in {{USER_ROLE}}. If asked about your identity, you are the {{MODEL_ID}} model."
TAVILY_CHAT_PROMPT="You are an AI researcher and engineer focusing on {{SEARCH_DEPTH}} research using the tavily search tool. {{SEARCH_RESULTS}}"
AI_AGENT_PROMPT="You are a researcher focusing on {{SEARCH_DEPTH}} analysis with {{RESPONSE_STYLE}} style responses."
AI_AGENT_PROCESSOR_PROMPT="You are an expert at {{ANALYSIS_DEPTH}} analysis, providing outputs in {{OUTPUT_FORMAT}} format."

# Prompt Variables
EXPERTISE_LEVEL="advanced"
USER_ROLE="AI and machine learning"
SEARCH_DEPTH="comprehensive"
RESPONSE_STYLE="concise"
ANALYSIS_DEPTH="detailed"
OUTPUT_FORMAT="structured"
````

4. Update your API routes:

````typescript path=app/api/chat/route.ts mode=EDIT
import { promptManager } from '@/lib/services/prompt-manager';

export async function POST(req: Request) {
  const { messages, selectedModelId, customVars } = await req.json();

  let systemPrompt = promptManager.compilePrompt('mainChat', {
    MODEL_ID: selectedModelId || "claude-3.7-sonnet",
    ...customVars
  });

  if (messagesHavePDF) {
    systemPrompt += promptManager.compilePrompt('pdfContext');
  } else if (messagesHaveImage) {
    systemPrompt += promptManager.compilePrompt('imageContext');
  }

  const stream = streamText({
    system: systemPrompt,
    providerOptions,
    model: myProvider.languageModel(modelId),
    messages,
  });

  return stream.toDataStreamResponse({
    sendReasoning: true,
    getErrorMessage: (error) => {
      console.error(`Error with model ${modelId}:`, error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      return `An error occurred with ${modelId}: ${errorMessage}. Please try again or select a different model.`;
    },
  });
}
````

5. Update your Tavily chat route:

````typescript path=app/api/tavily-chat/route.ts mode=EDIT
import { promptManager } from '@/lib/services/prompt-manager';

export async function POST(req: Request) {
  const { messages, selectedModelId, searchResults, customVars } = await req.json();

  let systemPrompt = promptManager.compilePrompt('tavilyChat', {
    SEARCH_RESULTS: searchResults ? JSON.stringify(searchResults, null, 2) : '',
    SEARCH_DEPTH: 'advanced',
    ...customVars
  });

  if (messagesHavePDF) {
    systemPrompt += promptManager.compilePrompt('pdfContext');
  } else if (messagesHaveImage) {
    systemPrompt += promptManager.compilePrompt('imageContext');
  }

  const stream = streamText({
    system: systemPrompt,
    providerOptions,
    model: myProvider.languageModel(modelId),
    messages,
  });

  return stream.toDataStreamResponse({
    sendReasoning: true,
    getErrorMessage: (error) => {
      console.error(`Error with model ${modelId}:`, error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      return `An error occurred with ${modelId}: ${errorMessage}. Please try again or select a different model.`;
    },
  });
}
````

6. Update your AI agents route:

````typescript path=app/api/ai-agents/route.ts mode=EDIT
import { promptManager } from '@/lib/services/prompt-manager';

export async function POST(req: Request) {
  const { messages, primaryModel, secondaryModel } = await req.json();
  const timestamp = new Date().toISOString();
  const query = messages[messages.length - 1].content;

  return createDataStreamResponse({
    execute: async dataStream => {
      try {
        const previousMessages = messages.slice(0, -1);
        const newMessage = messages[messages.length - 1];

        // Step 1: Research with primary model
        const result1 = streamText({
          model: getModelInstance(primaryModel as ModelConfig),
          system: promptManager.compilePrompt('aiAgent', {
            SEARCH_DEPTH: 'advanced',
            RESPONSE_STYLE: 'analytical'
          }),
          messages: [...previousMessages, newMessage],
          toolChoice: 'required',
          tools: {
            tavily: tool({
              parameters: z.object({ query: z.string() }),
              execute: async ({ query }) => {
                const results = await searchTavily({ 
                  query,
                  searchDepth: "advanced",
                  includeAnswer: true,
                });
                return JSON.stringify(results);
              },
            }),
          },
        });

        result1.mergeIntoDataStream(dataStream, {
          experimental_sendFinish: false,
        });

        const primaryResults = await result1.response;

        // Step 2: Process results with secondary model
        const result2 = streamText({
          model: getModelInstance(secondaryModel as ModelConfig),
          system: promptManager.compilePrompt('aiAgentProcessor', {
            ANALYSIS_DEPTH: 'comprehensive',
            OUTPUT_FORMAT: 'structured'
          }),
          messages: [
            ...previousMessages,
            {
              role: 'assistant',
              content: 'Here is the research information: ' + primaryResults.messages[primaryResults.messages.length - 1].content
            },
            newMessage
          ],
        });

        return result2.mergeIntoDataStream(dataStream);
      } catch (error) {
        console.error('AI Agents Error:', error);
        throw error;
      }
    }
  });
}
````

7. Create the prompt management API endpoints:

````typescript path=app/api/prompts/route.ts mode=EDIT
import { promptManager } from '@/lib/services/prompt-manager';

export async function GET() {
  return Response.json({ prompts: promptManager.getAllPrompts() });
}

export async function POST(req: Request) {
  const { id, config } = await req.json();
  
  try {
    promptManager.setPrompt(id, config);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Failed to update prompt' }, { status: 400 });
  }
}
````

8. Create the prompt editor component:

````typescript path=components/prompt-manager/prompt-editor.tsx mode=EDIT
'use client';

import { useState, useEffect } from 'react';
import { PromptConfig } from '@/lib/config/prompts';

export function PromptEditor() {
  const [prompts, setPrompts] = useState<PromptConfig[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');
  const [editedContent, setEditedContent] = useState('');
  const [variables, setVariables] = useState<string[]>([]);

  useEffect(() => {
    fetchPrompts();
  }, []);

  async function fetchPrompts() {
    const response = await fetch('/api/prompts');
    const data = await response.json();
    setPrompts(data.prompts);
  }

  useEffect(() => {
    const prompt = prompts.find(p => p.id === selectedPrompt);
    if (prompt) {
      setEditedContent(prompt.content);
      setVariables(prompt.variables || []);
    }
  }, [selectedPrompt]);

  async function handleSave() {
    await fetch('/api/prompts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: selectedPrompt,
        config: {
          ...prompts.find(p => p.id === selectedPrompt),
          content: editedContent
        }
      })
    });
    await fetchPrompts();
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Select Prompt</label>
        <select 
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          value={selectedPrompt} 
          onChange={(e) => setSelectedPrompt(e.target.value)}
        >
          <option value="">Select a prompt</option>
          {prompts.map(prompt => (
            <option key={prompt.id} value={prompt.id}>
              {prompt.name}
            </option>
          ))}
        </select>
      </div>

      {selectedPrompt && (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Available Variables</label>
            <div className="mt-1 text-sm text-gray-500">
              {variables.map(variable => (
                <span key={variable} className="inline-block bg-gray-100 rounded px-2 py-1 mr-2 mb-2">
                  {`{{${variable}}}`}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Edit Prompt</label>
            <textarea
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-40"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
          </div>

          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </>
      )}
    </div>
  );
}
````

9. Add the prompt editor to your admin interface:

````typescript path=app/admin/prompts/page.tsx mode=EDIT
import { PromptEditor } from '@/components/prompt-manager/prompt-editor';

export default function PromptsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Prompt Management</h1>
      <PromptEditor />
    </div>
  );
}
````

This implementation:
- Integrates with your existing model selection system
- Supports your multimodal features (PDF/image handling)
- Works with your Tavily search integration
- Supports your AI agents architecture
- Maintains your existing error handling
- Uses your current styling approach
- Preserves your reasoning mode functionality

To use this system:
1. Add all the files as shown above
2. Add the environment variables to your `.env.local`
3. Add the prompt management page to your admin interface
4. Update your existing routes to use the prompt manager
5. Test the system with different prompts and variables

The system will now provide a flexible way to manage prompts while maintaining compatibility with your existing features.
