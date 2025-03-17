// app/api/tavily-chat/route.ts
import { myProvider, modelApiNames } from "@/lib/models";
import { Message, smoothStream, streamText } from "ai";
import { NextRequest } from "next/server";
import { searchTavily } from "@/tools/tavily-search";

export async function POST(request: NextRequest) {
  const {
    messages,
    selectedModelId,
    isReasoningEnabled,
    searchQuery,
  }: {
    messages: Array<Message>;
    selectedModelId: string;
    isReasoningEnabled: boolean;
    searchQuery?: string;
  } = await request.json();

  // Check if messages contain PDF or image attachments
  const messagesHavePDF = messages.some(message =>
    message.experimental_attachments?.some(
      a => a.contentType === 'application/pdf',
    ),
  );
  
  const messagesHaveImage = messages.some(message =>
    message.experimental_attachments?.some(
      a => a.contentType?.startsWith('image/'),
    ),
  );

  // Configure provider-specific options based on the selected model
  const providerOptions: Record<string, any> = {};
  
  // Default to Claude 3.7 Sonnet if no model is selected
  let modelId = selectedModelId || "claude-3.7-sonnet";
  
  // Override model selection for multimodal content if needed
  if (messagesHavePDF) {
    // For PDFs, Claude, GPT-4o, and Gemini all support PDFs
    if (!modelId.startsWith("gemini")) {
      modelId = "gemini-2.0-flash";
    }
  } else if (messagesHaveImage) {
    // For images, ensure we're using a model that supports image input
    // Claude, GPT-4o, and Gemini all support images
    if (!modelId.startsWith("gemini") && !modelId.startsWith("o3") && !modelId.startsWith("gemini")) {
      modelId = "gemini-2.0-flash";
    }
  }
  
  // Get the API model name for the selected model ID
  const apiModelName = modelApiNames[modelId];
  
  if (!apiModelName) {
    console.error(`No API model name found for model ID: ${modelId}`);
    return new Response(
      JSON.stringify({
        error: `Invalid model ID: ${modelId}. Please select a valid model.`
      }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  // Configure provider-specific options based on the selected model
  if (modelId.startsWith("claude")) {
    providerOptions.anthropic = {
      thinking: {
        type: isReasoningEnabled ? "enabled" : "disabled",
        budgetTokens: 12000,
      },
      model: apiModelName,
    };
  } else if (modelId.startsWith("o3")) {
    providerOptions.openai = {
      temperature: 0.2,
      model: "o3-mini", // Use the exact model name
    };
  } else if (modelId.startsWith("gemini")) {
    providerOptions.google = {
      temperature: 0.2,
      model: apiModelName,
    };
  } else if (modelId.includes("qwen")) {
    providerOptions.groq = {
      temperature: 0.2,
      model: apiModelName,
    };
  } else if (modelId.includes("codestral")) {
    providerOptions.mistral = {
      temperature: 0.2,
      model: apiModelName,
    };
  } else if (modelId.includes("perplexity")) {
    providerOptions.perplexity = {
      temperature: 0.2,
      model: apiModelName,
    };
  } else if (modelId.includes("google/gemini-2.0-flash-thinking-exp:free")) {
    providerOptions.openrouter = {
      temperature: 0.2,
      model: apiModelName,
    };
  }

  try {
    console.log(`Attempting to use model: ${modelId} with options:`, providerOptions);
    
    // Perform Tavily search if searchQuery is provided
    let searchResults = null;
    if (searchQuery) {
      try {
        searchResults = await searchTavily({
          query: searchQuery,
          searchDepth: "basic",
          maxResults: 5,
          includeAnswer: true,
          modelId: modelId // Pass the model ID to track which model triggered the search
        });
        console.log("Tavily search results:", searchResults);
      } catch (error) {
        console.error("Error performing Tavily search:", error);
      }
    }
    
    // Add multimodal context to system prompt if attachments are present
    let systemPrompt = `
<prompt>
You are an AI researcher and engineer with deep research expertise. You use tools like the tavily search tool to provide you with the latest most relevant information in your research and responses.  
</prompt>
    `;
    
    if (messagesHavePDF) {
      systemPrompt += " The user has uploaded a PDF document. Analyze its content and respond to their questions about it.";
    } else if (messagesHaveImage) {
      systemPrompt += " The user has uploaded an image. Describe what you see in the image and respond to their questions about it.";
    }
    
    // Add search results to the system prompt if available
    if (searchResults) {
      systemPrompt += `\n\nI have searched the web for information related to the user's query. Here are the search results:
${JSON.stringify(searchResults, null, 2)}

Use these search results to provide a more informed response to the user's question. Always cite your sources.`;
    }
    
    const stream = streamText({
      system: systemPrompt,
      providerOptions,
      model: myProvider.languageModel(modelId),
      experimental_transform: [
        smoothStream({
          chunking: "word",
        }),
      ],
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
  } catch (error) {
    console.error(`Failed to stream with model ${modelId}:`, error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({
        error: `Failed to initialize ${modelId}: ${errorMessage}. Please check your API keys and try again.`
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
