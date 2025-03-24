// tools/tavily-search.ts
import { tavily } from "@tavily/core";
import { tavilyLogger } from "@/utils/tavily-logger";

// Initialize Tavily client
export const tavilyClient = (apiKey?: string) => {
  const key = apiKey || process.env.TAVILY_API_KEY;
  if (!key) {
    throw new Error("No Tavily API key provided");
  }
  
  return tavily({ apiKey: key });
};

export interface TavilySearchParams {
  query: string;
  searchDepth?: "basic" | "advanced";
  maxResults?: number;
  includeAnswer?: boolean;
  includeRawContent?: boolean;
  includeDomains?: string[];
  excludeDomains?: string[];
  modelId?: string;
  topic?: "general" | "news" | "finance";
  days?: number;
  maxTokens?: number;
  timeRange?: "year" | "month" | "week" | "day" | "y" | "m" | "w" | "d" | undefined;
  chunksPerSource?: number;
}

export async function searchTavily(params: TavilySearchParams) {
  const client = tavilyClient();
  
  const defaultOptions: TavilySearchParams = {
    query: params.query,
    searchDepth: "advanced",
    maxResults: 10,
    includeAnswer: true,
    includeRawContent: false,
    includeDomains: [],
    excludeDomains: [],
    modelId: params.modelId,
    topic: "general",
    days: 3,
    maxTokens: undefined,
    timeRange: undefined,
    chunksPerSource: undefined
  };

  const mergedOptions = { ...defaultOptions, ...params };
  
  try {
    const response = await client.search(
      mergedOptions.query,
      {
        searchDepth: mergedOptions.searchDepth,
        maxResults: mergedOptions.maxResults,
        includeAnswer: mergedOptions.includeAnswer,
        includeRawContent: mergedOptions.includeRawContent,
        includeDomains: mergedOptions.includeDomains,
        excludeDomains: mergedOptions.excludeDomains,
        topic: mergedOptions.topic,
        days: mergedOptions.days,
        maxTokens: mergedOptions.maxTokens,
        timeRange: mergedOptions.timeRange,
        chunksPerSource: mergedOptions.chunksPerSource,
      }
    );
    
    tavilyLogger.logSearchResults(mergedOptions.query, response, mergedOptions.modelId);
    tavilyLogger.appendToConsolidatedLog(mergedOptions.query, response, mergedOptions.modelId);
    
    return response;
  } catch (error) {
    console.error("Tavily search error:", error);
    throw error;
  }
}
