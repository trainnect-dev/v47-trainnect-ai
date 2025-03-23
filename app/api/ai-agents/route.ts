import { createDataStreamResponse, streamText, tool } from 'ai';
import { z } from 'zod';
import { getModelInstance } from '@/lib/ai-agents/utils';
import type { ModelConfig } from '@/lib/ai-agents/types';
import { searchTavily } from "@/tools/tavily-search";
import { aiAgentsLogger } from '@/utils/ai-agents-logger';
import { promptManager } from '@/lib/services/prompt-manager';
import type { Message } from "@/lib/db";
import { stmts } from "@/lib/db/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  const { messages, primaryModel, secondaryModel, conversationId = uuidv4() } = await req.json();
  const timestamp = new Date().toISOString();
  const query = messages[messages.length - 1].content;

  // Store user message
  const userMessage = messages[messages.length - 1];
  const message: Message = {
    id: uuidv4(),
    role: userMessage.role,
    content: userMessage.content,
    timestamp: Date.now(),
    conversation_id: conversationId,
    chat_type: 'ai-agent',
    metadata: JSON.stringify({
      primaryModel,
      secondaryModel,
    })
  };
  stmts.insertMessage.run(
    message.id,
    message.role,
    message.content,
    message.timestamp,
    message.conversation_id,
    message.chat_type,
    message.metadata
  );

  return createDataStreamResponse({
    execute: async dataStream => {
      try {
        // Get all previous messages except the last one (which is the new query)
        const previousMessages = messages.slice(0, -1);
        const newMessage = messages[messages.length - 1];

        // Step 1: Research with primary model and Tavily search
        const result1 = streamText({
          model: getModelInstance(primaryModel as ModelConfig),
          system: promptManager.compilePrompt('aiAgent', {
            SEARCH_DEPTH: 'advanced',
            RESPONSE_STYLE: 'concise'
          }),
          messages: [...previousMessages, newMessage], // Include conversation history
          toolChoice: 'required',
          tools: {
            tavily: tool({
              parameters: z.object({ query: z.string() }),
              execute: async ({ query }) => {
                const tavilyPrompt = promptManager.getPrompt('tavily-chat');
                const results = await searchTavily({ 
                  query,
                  searchDepth: tavilyPrompt?.tavilySettings?.searchDepth || "advanced",
                  maxResults: tavilyPrompt?.tavilySettings?.maxResults || 5,
                  includeAnswer: tavilyPrompt?.tavilySettings?.includeAnswer ?? true,
                  includeRawContent: tavilyPrompt?.tavilySettings?.includeRawContent ?? false,
                  includeDomains: tavilyPrompt?.tavilySettings?.includeDomains,
                  excludeDomains: tavilyPrompt?.tavilySettings?.excludeDomains,
                });
                return JSON.stringify(results);
              },
            }),
          },
        });

        // Forward initial result without finish event
        result1.mergeIntoDataStream(dataStream, {
          experimental_sendFinish: false,
        });

        const primaryResults = await result1.response;

        // Store primary model's response
        const primaryMessage: Message = {
          id: uuidv4(),
          role: 'assistant',
          content: String(primaryResults.messages[primaryResults.messages.length - 1].content),
          timestamp: Date.now(),
          conversation_id: conversationId,
          chat_type: 'ai-agent',
          metadata: JSON.stringify({
            model: primaryModel,
            phase: 'research',
            toolCalls: (primaryResults.messages[primaryResults.messages.length - 1] as any).toolCalls || []
          })
        };
        stmts.insertMessage.run(
          primaryMessage.id,
          primaryMessage.role,
          primaryMessage.content,
          primaryMessage.timestamp,
          primaryMessage.conversation_id,
          primaryMessage.chat_type,
          primaryMessage.metadata
        );

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

        // Forward second result (including finish event)
        result2.mergeIntoDataStream(dataStream, {
          experimental_sendStart: false,
        });

        const secondaryResults = await result2.response;

        // Store secondary model's response
        const secondaryMessage: Message = {
          id: uuidv4(),
          role: 'assistant',
          content: String(secondaryResults.messages[secondaryResults.messages.length - 1].content),
          timestamp: Date.now(),
          conversation_id: conversationId,
          chat_type: 'ai-agent',
          metadata: JSON.stringify({
            model: secondaryModel,
            phase: 'processing'
          })
        };
        stmts.insertMessage.run(
          secondaryMessage.id,
          secondaryMessage.role,
          secondaryMessage.content,
          secondaryMessage.timestamp,
          secondaryMessage.conversation_id,
          secondaryMessage.chat_type,
          secondaryMessage.metadata
        );

        // Log both models' results
        await aiAgentsLogger.logProcessing({
          timestamp,
          query,
          primaryModel,
          secondaryModel,
          primaryResults,
          secondaryResults
        });
      } catch (error) {
        console.error('Error in AI Agents processing:', error);
        throw error;
      }
    },
  });
}
