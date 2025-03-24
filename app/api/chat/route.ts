import { myProvider, modelApiNames } from "@/lib/models";
import { Message, smoothStream, streamText } from "ai";
import { NextRequest } from "next/server";
import { promptManager } from '@/lib/services/prompt-manager';
import type { Message as DBMessage } from "@/lib/db";
import { stmts } from "@/lib/db/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  const {
    messages,
    selectedModelId,
    isReasoningEnabled,
    conversationId = uuidv4(),
  }: {
    messages: Array<Message>;
    selectedModelId: string;
    isReasoningEnabled: boolean;
    conversationId?: string;
  } = await request.json();

  // Store incoming user message
  const userMessage = messages[messages.length - 1];
  if (userMessage.role === 'user') {
    const dbMessage: DBMessage = {
      id: uuidv4(),
      role: userMessage.role,
      content: userMessage.content,
      timestamp: Date.now(),
      conversation_id: conversationId,
      chat_type: 'chat'
    };
    stmts.insertMessage.run(
      dbMessage.id,
      dbMessage.role,
      dbMessage.content,
      dbMessage.timestamp,
      dbMessage.conversation_id,
      dbMessage.chat_type,
      dbMessage.metadata
    );
  }

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
    // Claude, OpenAI, and Gemini all support images
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
    
    // Get base prompt and add multimodal context if needed
    let systemPrompt = promptManager.compilePrompt('main-chat', {
      MODEL_ID: modelId,
      USER_ROLE: 'AI and machine learning research',
      EXPERTISE_LEVEL: 'advanced'
    });
    
    if (messagesHavePDF) {
      systemPrompt += promptManager.compilePrompt('pdf-context');
    } else if (messagesHaveImage) {
      systemPrompt += promptManager.compilePrompt('image-context');
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

    const response = stream.toDataStreamResponse({
      sendReasoning: true,
      getErrorMessage: (error) => {
        console.error(`Error with model ${modelId}:`, error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return `An error occurred with ${modelId}: ${errorMessage}. Please try again or select a different model.`;
      },
    });

    // Store assistant's response
    response.clone().text().then(text => {
      try {
        const assistantMessage: DBMessage = {
          id: uuidv4(),
          role: 'assistant',
          content: text,
          timestamp: Date.now(),
          conversation_id: conversationId,
          chat_type: 'chat'
        };
        stmts.insertMessage.run(
          assistantMessage.id,
          assistantMessage.role,
          assistantMessage.content,
          assistantMessage.timestamp,
          assistantMessage.conversation_id,
          assistantMessage.chat_type,
          assistantMessage.metadata
        );
      } catch (error) {
        console.error('Failed to store assistant message:', error);
      }
    });

    return response;
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
