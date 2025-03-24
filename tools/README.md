# Tavily Search Tool

This directory contains the Tavily Search Tool implementation for the Trainnect AI application.

## Setup

1. Sign up for a Tavily API key at [Tavily's website](https://tavily.com/)
2. Add your Tavily API key to your `.env.local` file:

```
TAVILY_API_KEY=your-tavily-api-key
```

3. Configure additional Tavily search parameters in your `.env.local` file (optional):

```
# Tavily Search Parameters
TAVILY_SEARCH_DEPTH="advanced"
TAVILY_MAX_RESULTS=20
TAVILY_INCLUDE_ANSWER=true
TAVILY_INCLUDE_RAW_CONTENT=false
TAVILY_INCLUDE_DOMAINS="example.com, another-site.com"
TAVILY_EXCLUDE_DOMAINS="exclude.com, block-this.com"
```

## Usage

The Tavily Search Tool is integrated into the application at `/tavily-ai-search`. This page provides all the same functionality as the main chat interface but with the added ability to search the web for information related to user queries.

To use the Tavily Search:
1. Navigate to http://localhost:3000/tavily-ai-search
2. Toggle the "Web Search" option
3. Enter your query
4. The AI will use Tavily to search the web and incorporate the results into its response

## Advanced Search Parameters

The Tavily Search Tool now supports the following advanced parameters:

| Parameter | Type | Description |
|-----------|------|-------------|
| query | string | The search query |
| searchDepth | "basic" \| "advanced" | Depth of search (basic is faster, advanced is more thorough) |
| maxResults | number | Maximum number of search results to return (1-20) |
| includeAnswer | boolean | Whether to include an AI-generated answer in the response |
| includeRawContent | boolean | Whether to include the raw content of search results |
| includeDomains | string[] | List of domains to include in the search |
| excludeDomains | string[] | List of domains to exclude from the search |
| topic | string | Focus search on a specific topic (e.g., "technology", "science", "general") |
| days | number | Limit results to those published within the specified number of days |
| maxTokens | number | Maximum number of tokens to include in the response |
| timeRange | string | Specify a time range for results (alternative to days parameter) |
| chunksPerSource | number | Number of content chunks to extract per source |

These parameters can be configured in three ways:

1. **Environment Variables**: Set in `.env.local` file
2. **Prompt Management**: Configure in the admin UI at `/admin/prompts`
3. **API Calls**: Pass directly when calling the Tavily search API

## Implementation Details

The Tavily search functionality is implemented in the following files:

- `tools/tavily-search.ts`: Main implementation of the search functionality
- `utils/tavily-logger.ts`: Logger for Tavily search results
- `app/api/tavily-search/route.ts`: API route for Tavily search
- `app/api/tavily-chat/route.ts`: API route for Tavily chat
- `lib/config/prompts.ts`: Configuration for Tavily search parameters

The search results are logged to the `tavily_output` directory for debugging and analysis.
