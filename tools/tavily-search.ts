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
}

export async function searchTavily(params: TavilySearchParams) {
  const client = tavilyClient();
  
  try {
    const response = await client.search(
      params.query,
      {
        searchDepth: params.searchDepth || "advanced",
        maxResults: params.maxResults || 10,
        includeAnswer: params.includeAnswer || true,
        includeRawContent: params.includeRawContent || false,
        includeDomains: params.includeDomains,
        excludeDomains: params.excludeDomains,
      }
    );
    
    tavilyLogger.logSearchResults(params.query, response, params.modelId);
    tavilyLogger.appendToConsolidatedLog(params.query, response, params.modelId);
    
    return response;
  } catch (error) {
    console.error("Tavily search error:", error);
    throw error;
  }
}
