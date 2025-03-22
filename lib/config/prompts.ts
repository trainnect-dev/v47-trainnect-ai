export interface TavilySettings {
  includeDomains?: string[];
  excludeDomains?: string[];
  searchDepth: "basic" | "advanced";
  maxResults: number;
  includeAnswer: boolean;
  includeRawContent: boolean;
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
    variables: ['SEARCH_RESULTS', 'SEARCH_DEPTH'],
    tavilySettings: {
      searchDepth: "advanced",
      maxResults: 5,
      includeAnswer: true,
      includeRawContent: false,
      includeDomains: [],
      excludeDomains: []
    }
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
