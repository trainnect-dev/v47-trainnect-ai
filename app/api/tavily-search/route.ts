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
