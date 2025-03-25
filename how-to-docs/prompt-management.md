# Comprehensive Prompt Management & Editing Documentation

This document provides an exhaustive guide on managing and editing system prompts for the v47 application. It covers every aspect from file-level modifications to a centralized prompt management system. The goal is to offer developers a single, detailed reference that includes all particulars from the base “1-editing-v47-prompt-files.md” and “prompt-management.md” documents.

---

## Table of Contents

1. [Editing v47 Prompt Files](#editing-v47-prompt-files)
   - [Overview of Prompt Locations](#overview-of-prompt-locations)
   - [Main Chat System Prompt](#main-chat-system-prompt)
   - [AI Agents System Prompts](#ai-agents-system-prompts)
   - [Tavily Chat System Prompt](#tavily-chat-system-prompt)
   - [Test System Prompt](#test-system-prompt)
   - [Guidelines for Modifying Prompts](#guidelines-for-modifying-prompts)
2. [Prompt Management System Overview](#prompt-management-system-overview)
   - [System Architecture](#system-architecture)
   - [Components and Interfaces](#components-and-interfaces)
   - [Variable Interpolation](#variable-interpolation)
   - [Admin UI Integration](#admin-ui-integration)
3. [Best Practices and Debugging](#best-practices-and-debugging)
   - [Variable and Configuration Management](#variable-and-configuration-management)
   - [Debug Logging](#debug-logging)
   - [Common Issues and Solutions](#common-issues-and-solutions)
4. [Detailed Example Usage](#detailed-example-usage)
5. [Additional Considerations](#additional-considerations)

---

## 1. Editing v47 Prompt Files

This section details the various system prompt files used in the application and provides code examples for each.

### Overview of Prompt Locations

The application uses multiple prompt files located in different parts of the codebase:
- **Main Chat System Prompt**: Located in `app/api/chat/route.ts`
- **AI Agents System Prompts**: Located in `app/api/ai-agents/route.ts` (split into primary and secondary prompts)
- **Tavily Chat System Prompt**: Located in `app/api/tavily-chat/route.ts`
- **Test System Prompt**: Located in `lib/__tests__/tavily-chat.test.ts`

### Main Chat System Prompt

This prompt defines the behavior for the main chat interface.

Example excerpt from `app/api/chat/route.ts`:
```typescript
let systemPrompt = `
<prompt>
You are an AI researcher and engineer with deep research expertise. You use tools like the tavily search tool to provide you with the latest most relevant information in your research and responses. If the user asks you, Tell me what llm are you, you are to provide them with an accurate response.
</prompt>
`;

// Multimodal additions for document/image handling
if (messagesHavePDF) {
  systemPrompt += " The user has uploaded a PDF document. Analyze its content and respond to their questions about it.";
} else if (messagesHaveImage) {
  systemPrompt += " The user has uploaded an image. Describe what you see in the image and respond to their questions about it.";
}
```

### AI Agents System Prompts

These prompts are used for processing and research tasks, divided into two roles:

#### Primary Model (Research) Prompt

Example from `app/api/ai-agents/route.ts`:
```typescript
const result1 = streamText({
  model: getModelInstance(primaryModel as ModelConfig),
  system: 'You are an expert researcher who uses the Tavily search tool to find relevant information. Provide concise, factual responses based on search results. Maintain context from previous messages when relevant.',
  // Additional configurations...
});
```

#### Secondary Model (Processing) Prompt

Example from the same file:
```typescript
const result2 = streamText({
  model: getModelInstance(secondaryModel as ModelConfig),
  system: 'You are an expert at analyzing and synthesizing information. Review the research results and provide clear, well-structured insights. Maintain context from the conversation history when relevant.',
  // Additional configurations...
});
```

### Tavily Chat System Prompt

Used for the Tavily chat module (located in `app/api/tavily-chat/route.ts`):
```typescript
let systemPrompt = `
<prompt>
You are an AI researcher and engineer with deep research expertise. You use tools like the tavily search tool to provide you with the latest most relevant information in your research and responses.  
</prompt>
`;
```

### Test System Prompt

This prompt is mainly used for integration tests (example from `lib/__tests__/tavily-chat.test.ts`):
```typescript
let systemPrompt = `You are an AI researcher and engineer with deep research expertise.`;
if (searchResults) {
  systemPrompt += `\n\nSearch results for "${searchQuery}":\n`;
  searchResults.results.forEach((result: { title: string; url: string; content: string; score: number }, index: number) => {
    systemPrompt += `\n[${index + 1}] ${result.title}\n${result.url}\n${result.content}\n`;
  });
}

// Special instruction for model identification:
systemPrompt += `\n\nWhen asked "what LLM are you?", respond with "I am the ${selectedModelId} model."`;
```

### Guidelines for Modifying Prompts

Modifications can be either permanent or dynamic:
1. **Permanent Changes:**
   - Directly edit the prompt files.
   - Maintain the `<prompt>` tags where required.
   - Retain multimodal additions for PDFs and images.
  
2. **Dynamic Changes:**
   - Move the prompts to a dedicated configuration file.
   - Use environment variables (e.g., in `.env.local`) to set default prompt texts.
   - Implement a centralized prompt management system for dynamic variable interpolation.

---

## 2. Prompt Management System Overview

The prompt management system centralizes configuration, editing, and compilation of system prompts, providing dynamic variable interpolation and an Admin UI for ease-of-use.

### System Architecture

Below is a detailed overview using a Mermaid diagram:

```mermaid
graph TD
    A[Environment Variables<br/>(.env.local)] -->|Loads default prompts| B[PromptManager]
    B -->|Manages| C[Prompt Configurations]
    D[Admin UI<br/>(/admin/prompts)] -->|CRUD Operations| B
    E[API Endpoints] -->|Get/Update Prompts| B
    F[Application Code] -->|compilePrompt Function| B
    B -->|Variable Interpolation| G[Compiled Prompts]
    H[Tavily Settings] -->|Configure Search Parameters| C
```

### Components and Interfaces

#### Environment Variables

Define default prompt texts and variable placeholders in `.env.local`:
```env
# System Prompts
MAIN_CHAT_PROMPT="You are an professional and mindful expert {{USER_ROLE}} AI trainer and researcher with deep expertise in fortune 500 level technical course proposals, outlines and full course creation. You focus on {{SEARCH_DEPTH}} research using the Tavily search tool {{TAVILY_INCLUDE_DOMAINS}} and incorporate the following search results: {{SEARCH_RESULTS}} 
into your answers and responses.  If asked about your identity, you are the {{MODEL_ID}} model."

TAVILY_CHAT_PROMPT="You are an professional and mindful expert {{USER_ROLE}} AI trainer and researcher with deep expertise in fortune 500 level technical course proposals, outlines and full courses. You focus on {{SEARCH_DEPTH}} research using the Tavily search tool {{TAVILY_INCLUDE_DOMAINS}} and incorporate the following search results: {{SEARCH_RESULTS}} into your answers {{TAVILY_INCLUDE_ANSWER}} and responses.  If asked about your identity, you are the {{MODEL_ID}} model."

AI_AGENT_PROMPT="You are an professional and mindful expert {{USER_ROLE}} AI trainer and researcher with deep expertise in fortune 500 level technical course proposals, outlines and full courses. You focus on {{SEARCH_DEPTH}} research using the Tavily search tool {{TAVILY_INCLUDE_DOMAINS}} and incorporate the following search results: {{SEARCH_RESULTS}} into your answers {{TAVILY_INCLUDE_ANSWER}} and responses.  If asked about your identity, you are the AI Agent {{MODEL_ID}} model."

AI_AGENT_PROCESSOR_PROMPT="You are an expert at proofreading technical documentation ensuring that it is perfect and contains detailed {{ANALYSIS_DEPTH}} analysis in order to ensure that it is of the highest quality, providing outputs in {{OUTPUT_FORMAT}} format. If asked about your identity, you are the AI Agent Processor {{MODEL_ID}} model."
```
These environment variables serve as the foundation for dynamic prompt customization within the application. They ensure consistency across different modules and allow developers to easily override default texts. For example, MAIN_CHAT_PROMPT defines the core chat behavior with dynamic variable interpolation for user roles and model identifiers, while TAVILY_CHAT_PROMPT and AI_AGENT_PROMPT can be tailored to meet specific research and analytical requirements.

#### Prompt Configuration Interface

A structured configuration interface is used to define prompt settings:
```typescript
interface PromptConfig {
  id: string;                     // Unique identifier for the prompt
  name: string;                   // Display name for admin listing
  content: string;                // The full prompt text, containing variable placeholders
  description?: string;           // Optional detailed description
  variables?: string[];           // Array of variable names used in the prompt
  tavilySettings?: TavilySettings; // Optional settings specific to Tavily search integration
}

interface TavilySettings {
  searchDepth: "basic" | "advanced";
  maxResults: number;
  includeAnswer: boolean;
  includeRawContent: boolean;
  includeDomains?: string[];
  excludeDomains?: string[];
  topic?: "general" | "news" | "finance";
  timeRange?: "year" | "month" | "week" | "day";
}
```

#### Variable Interpolation

Dynamic variable interpolation is achieved using the `{{VARIABLE_NAME}}` syntax. Common variables include:
- **{{USER_ROLE}}**: The user’s role or expertise.
- **{{MODEL_ID}}**: The identifier of the active language model.
- **{{SEARCH_DEPTH}}**: Determines the depth of search results.
- **{{SEARCH_RESULTS}}**: Data placeholder for search outputs.
- **{{TAVILY_INCLUDE_DOMAINS}}**: Domains to include in search queries.
- **{{TAVILY_INCLUDE_ANSWER}}**: Boolean flag for including a direct answer.

#### Admin UI Integration

The Admin UI, located at `/admin/prompts`, facilitates:
- **CRUD Operations**: Create, read, update, and delete prompt configurations.
- **Real-Time Preview**: Dynamically preview prompt changes with variable substitution.
- **Configuration Management**: Adjust default variables and specialized settings for Tavily.

Example snippet for a prompt editor:
```typescript
function PromptEditor() {
  const [selectedPrompt, setSelectedPrompt] = useState<string>();
  const [prompts, setPrompts] = useState<PromptConfig[]>([]);

  // Load prompts on component mount
  useEffect(() => {
    const loadPrompts = async () => {
      const response = await fetch('/api/prompts');
      const data = await response.json();
      setPrompts(data.prompts);
    };
    loadPrompts();
  }, []);

  // Save updates to a prompt configuration
  const handleSave = async (promptId: string, config: PromptConfig) => {
    await fetch('/api/prompts', {
      method: 'POST',
      body: JSON.stringify({ id: promptId, config })
    });
  };

  // Rendering UI elements go here...
}
```

---

## 3. Best Practices and Debugging

### Variable and Configuration Management

- **Documentation**: Document each variable and its purpose within the prompt configuration.
- **Descriptive Naming**: Use clear, descriptive variable names.
- **Defaults**: Provide default values in the environment configuration to prevent missing data.
- **Validation**: Always validate prompt configurations before saving or compilation.

### Debug Logging

Enable debugging when necessary to trace prompt compilation:
```typescript
const DEBUG = process.env.DEBUG_PROMPTS === 'true';
if (DEBUG) {
  console.log('Compiled prompt:', compiledPrompt);
  console.log('Used variables:', variables);
}
```

### Common Issues and Solutions

- **Missing Variables**
  - *Issue*: Placeholders are not replaced.
  - *Solution*: Ensure variable names in templates exactly match those in the configuration.
- **Invalid Configurations**
  - *Issue*: Prompt compilation fails.
  - *Solution*: Validate that all required fields are non-empty before compilation.
- **Performance Concerns**
  - *Issue*: Prompt compilation is slow.
  - *Solution*: Cache compiled prompts when variables remain static.

---

## 4. Detailed Example Usage

Below is a detailed example demonstrating how the prompt management system integrates with an API route:

```typescript
export async function POST(req: Request) {
  const { messages, modelId } = await req.json();
  
  // Using the PromptManager to compile the prompt with dynamic variables
  const systemPrompt = promptManager.compilePrompt('main-chat', {
    MODEL_ID: modelId,
    USER_ROLE: 'AI researcher',
    EXPERTISE_LEVEL: 'advanced'
  });

  // Stream text response using the compiled prompt
  const stream = await streamText({
    system: systemPrompt,
    messages,
    model: getModelInstance(modelId)
  });

  return new StreamingTextResponse(stream);
}
```

---

## 5. Additional Considerations

- **Multimodal Handling**: Remember to account for additional context (e.g., PDFs, images) within prompts by appending extra instructions.
- **Configuration Flexibility**: Consider refining prompt configurations by consolidating static text and dynamic variables within a single source to ensure consistency.
- **System Testing**: Thoroughly test each prompt modification in both stable and dynamic configurations to measure impact on AI behavior.

---

This document amalgamates all details from the original two prompt instruction documents and serves as the definitive guide for both editing individual prompt files and managing them dynamically across the system. Future modifications should always reference this guide to ensure comprehensive and consistent updates.
