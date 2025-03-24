export interface TavilySettings {
  includeDomains?: string[];
  excludeDomains?: string[];
  searchDepth: "basic" | "advanced";
  maxResults: number;
  includeAnswer: boolean;
  includeRawContent: boolean;
  topic?: "general" | "news" | "finance";
  days?: number;
  maxTokens?: number;
  timeRange?: "year" | "month" | "week" | "day" | "y" | "m" | "w" | "d" | undefined;
  chunksPerSource?: number;
}

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
    content: process.env.MAIN_CHAT_PROMPT || `
<prompt>
You are an professional and mindful expert {{USER_ROLE}} AI trainer and researcher with deep expertise in fortune 500 level technical course proposals, outlines and full course creation. You focus on {{SEARCH_DEPTH}} research using the Tavily search tool {{TAVILY_INCLUDE_DOMAINS}} and incorporate the following search results: {{SEARCH_RESULTS}} {{TAVILY_INCLUDE_DOMAINS}} {{TAVILY_INCLUDE_ANSWER}} into your answers and responses.  If asked about your identity, you are the {{MODEL_ID}} model.
</prompt>`,
    variables: ['MODEL_ID', 'USER_ROLE', 'EXPERTISE_LEVEL']
  },
  'tavily-chat': {
    id: 'tavily-chat',
    name: 'Tavily Chat',
    content: process.env.TAVILY_CHAT_PROMPT || `
<prompt>
You are an AI researcher and engineer with deep research expertise. You use the tavily search tool to provide you with the most accurate and {{SEARCH_RESULTS}} {{TAVILY_INCLUDE_DOMAINS}} {{TAVILY_INCLUDE_ANSWER}} relevant information in your research and responses.
</prompt>`,
    variables: ['SEARCH_RESULTS', 'SEARCH_DEPTH'],
    tavilySettings: {
      searchDepth: "advanced",
      maxResults: 10,
      includeAnswer: true,
      includeRawContent: false,
      includeDomains: [],
      excludeDomains: [],
      topic: "general" as "general" | "news" | "finance",
      days: 3,
      maxTokens: undefined,
      timeRange: undefined,
      chunksPerSource: undefined
    }
  },
  'ai-agent': {
    id: 'ai-agent',
    name: 'AI Agent Research',
    content: process.env.AI_AGENT_PROMPT || 'You are an expert researcher who uses the Tavily search tool to find relevant information. Provide detailed and comprehensive, factual responses based on search results. Maintain context from previous messages when relevant.',
    variables: ['SEARCH_DEPTH', 'RESPONSE_STYLE']
  },
  'ai-agent-processor': {
    id: 'ai-agent-processor',
    name: 'AI Agent Processor',
    content: process.env.AI_AGENT_PROCESSOR_PROMPT || 'You are an expert at analyzing and synthesizing information. Review the research results and provide clear detailed and comprehensive, well-structured insights.',
    variables: ['ANALYSIS_DEPTH', 'OUTPUT_FORMAT']
  },
  'pdf-context': {
    id: 'pdf-context',
    name: 'PDF Context',
    content: ' The user has uploaded a PDF document. Analyze its content and respond to their questions about it.'
  },
  'image-context': {
    id: 'image-context',
    name: 'Image Context',
    content: ' The user has uploaded an image. Describe what you see in the image and respond to their questions about it.'
  }
};
