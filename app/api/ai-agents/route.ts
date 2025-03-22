import { createDataStreamResponse, streamText, tool } from 'ai';
import { z } from 'zod';
import { getModelInstance } from '@/lib/ai-agents/utils';
import type { ModelConfig } from '@/lib/ai-agents/types';
import { searchTavily } from "@/tools/tavily-search";
import { aiAgentsLogger } from '@/utils/ai-agents-logger';
import { promptManager } from '@/lib/services/prompt-manager';

export async function POST(req: Request) {
  const { messages, primaryModel, secondaryModel } = await req.json();
  const timestamp = new Date().toISOString();
  const query = messages[messages.length - 1].content;

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
