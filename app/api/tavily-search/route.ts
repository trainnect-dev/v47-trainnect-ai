// app/api/tavily-search/route.ts
import { NextRequest } from "next/server";
import { searchTavily, TavilySearchParams } from "@/tools/tavily-search";

export async function POST(request: NextRequest) {
  try {
    const params: TavilySearchParams = await request.json();
    
    if (!params.query) {
      return new Response(
        JSON.stringify({ error: "Query parameter is required" }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // If modelId is not provided, use a default identifier for direct API calls
    if (!params.modelId) {
      params.modelId = "direct-api-call";
    }
    
    // Apply environment variables if available
    if (!params.searchDepth && process.env.TAVILY_SEARCH_DEPTH) {
      params.searchDepth = process.env.TAVILY_SEARCH_DEPTH as "basic" | "advanced";
    }
    
    if (!params.maxResults && process.env.TAVILY_MAX_RESULTS) {
      params.maxResults = parseInt(process.env.TAVILY_MAX_RESULTS, 10);
    }
    
    if (params.includeAnswer === undefined && process.env.TAVILY_INCLUDE_ANSWER) {
      params.includeAnswer = process.env.TAVILY_INCLUDE_ANSWER === "true";
    }
    
    if (params.includeRawContent === undefined && process.env.TAVILY_INCLUDE_RAW_CONTENT) {
      params.includeRawContent = process.env.TAVILY_INCLUDE_RAW_CONTENT === "true";
    }
    
    if (!params.includeDomains?.length && process.env.TAVILY_INCLUDE_DOMAINS) {
      params.includeDomains = process.env.TAVILY_INCLUDE_DOMAINS.split(',').map(domain => domain.trim());
    }
    
    if (!params.excludeDomains?.length && process.env.TAVILY_EXCLUDE_DOMAINS) {
      params.excludeDomains = process.env.TAVILY_EXCLUDE_DOMAINS.split(',').map(domain => domain.trim());
    }
    
    // Handle topic with proper type checking
    if (!params.topic && process.env.TAVILY_TOPIC) {
      const topic = process.env.TAVILY_TOPIC.trim().toLowerCase();
      if (topic === "general" || topic === "news" || topic === "finance") {
        params.topic = topic;
      }
    }
    
    // Handle timeRange with proper type checking
    if (!params.timeRange && process.env.TAVILY_TIME_RANGE) {
      const timeRange = process.env.TAVILY_TIME_RANGE.trim().toLowerCase();
      if (["year", "month", "week", "day", "y", "m", "w", "d"].includes(timeRange)) {
        params.timeRange = timeRange as "year" | "month" | "week" | "day" | "y" | "m" | "w" | "d";
      }
    }
    
    // Handle days parameter
    if (!params.days && process.env.TAVILY_DAYS) {
      params.days = parseInt(process.env.TAVILY_DAYS, 10);
    }
    
    // Handle maxTokens parameter
    if (!params.maxTokens && process.env.TAVILY_MAX_TOKENS) {
      params.maxTokens = parseInt(process.env.TAVILY_MAX_TOKENS, 10);
    }
    
    // Handle chunksPerSource parameter
    if (!params.chunksPerSource && process.env.TAVILY_CHUNKS_PER_SOURCE) {
      params.chunksPerSource = parseInt(process.env.TAVILY_CHUNKS_PER_SOURCE, 10);
    }
    
    const results = await searchTavily(params);
    
    return new Response(
      JSON.stringify(results),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Tavily API route error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return new Response(
      JSON.stringify({ error: `Tavily search failed: ${errorMessage}` }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
