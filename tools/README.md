# Tavily Search Tool

This directory contains the Tavily Search Tool implementation for the Trainnect AI application.

## Setup

1. Sign up for a Tavily API key at [Tavily's website](https://tavily.com/)
2. Add your Tavily API key to your `.env.local` file:

```
TAVILY_API_KEY=your-tavily-api-key
```

## Usage

The Tavily Search Tool is integrated into the application at `/tavily-ai-search`. This page provides all the same functionality as the main chat interface but with the added ability to search the web for information related to user queries.

To use the Tavily Search:
1. Navigate to http://localhost:3000/tavily-ai-search
2. Toggle the "Web Search" option
3. Enter your query
4. The AI will use Tavily to search the web and incorporate the results into its response
