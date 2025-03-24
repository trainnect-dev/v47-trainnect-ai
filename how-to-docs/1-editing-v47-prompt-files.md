## Editing v47 Prompt Files
## There are several system prompts that can be modified across different files. Here are the main locations:

1. Main Chat System Prompt:
````typescript path=app/api/chat/route.ts mode=EXCERPT
let systemPrompt = `
<prompt>
You are an AI researcher and engineer with deep research expertise. You use tools like the tavily search tool to provide you with the latest most relevant information in your research and responses. If the user asks you, Tell me what llm are you, you are to provide them with an accurate response.
</prompt>
`;

// Multimodal additions
if (messagesHavePDF) {
  systemPrompt += " The user has uploaded a PDF document. Analyze its content and respond to their questions about it.";
} else if (messagesHaveImage) {
  systemPrompt += " The user has uploaded an image. Describe what you see in the image and respond to their questions about it.";
}
````

2. AI Agents System Prompts:
````typescript path=app/api/ai-agents/route.ts mode=EXCERPT
// Primary Model (Research) Prompt
const result1 = streamText({
  model: getModelInstance(primaryModel as ModelConfig),
  system: 'You are an expert researcher who uses the Tavily search tool to find relevant information. Provide concise, factual responses based on search results. Maintain context from previous messages when relevant.',
  // ...
});

// Secondary Model (Processing) Prompt
const result2 = streamText({
  model: getModelInstance(secondaryModel as ModelConfig),
  system: 'You are an expert at analyzing and synthesizing information. Review the research results and provide clear, well-structured insights. Maintain context from the conversation history when relevant.',
  // ...
});
````

3. Tavily Chat System Prompt:
````typescript path=app/api/tavily-chat/route.ts mode=EXCERPT
let systemPrompt = `
<prompt>
You are an AI researcher and engineer with deep research expertise. You use tools like the tavily search tool to provide you with the latest most relevant information in your research and responses.  
</prompt>
`;
````

4. Test System Prompt:
````typescript path=lib/__tests__/tavily-chat.test.ts mode=EXCERPT
let systemPrompt = `You are an AI researcher and engineer with deep research expertise.`;
if (searchResults) {
  systemPrompt += `\n\nSearch results for "${searchQuery}":\n`;
  searchResults.results.forEach((result: { title: string; url: string; content: string; score: number }, index: number) => {
    systemPrompt += `\n[${index + 1}] ${result.title}\n${result.url}\n${result.content}\n`;
  });
}

// Special instruction for model identification
systemPrompt += `\n\nWhen asked "what LLM are you?", respond with "I am the ${selectedModelId} model."`;
````

To modify these prompts:

1. For permanent changes:
   - Edit the system prompts directly in the source files
   - Maintain the existing structure with `<prompt>` tags where used
   - Keep the multimodal context additions for PDF and image handling

2. For dynamic changes:
   - Consider moving the prompts to a configuration file
   - Create environment variables for prompt customization
   - Implement a prompt management system

Remember that changes to system prompts can significantly impact the AI's behavior and responses, so test thoroughly after modifications.
