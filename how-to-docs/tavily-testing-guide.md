# Tavily Testing Guide

This guide provides detailed instructions for testing the Tavily search integration in your application.

## Prerequisites

1. Ensure you have a valid Tavily API key configured in `.env.local`:
```env
TAVILY_API_KEY=tvly-...
```

2. Optional Tavily configuration parameters are set:
```env
TAVILY_SEARCH_DEPTH="advanced"
TAVILY_MAX_RESULTS=20
TAVILY_INCLUDE_ANSWER=true
TAVILY_INCLUDE_RAW_CONTENT=false
TAVILY_INCLUDE_DOMAINS="example.com, another-site.com"
TAVILY_EXCLUDE_DOMAINS="exclude.com, block-this.com"
```

## Test Suite Overview

### 1. Basic Search Functionality
```bash
pnpm test:tavily:search
```

Tests:
- Basic search queries
- Result formatting
- Response time
- Error handling

### 2. Integration with LLM Models
```bash
pnpm test:tavily:chat
```

Tests:
- Search-enhanced chat responses
- Context injection
- Multi-turn conversations
- Cross-model compatibility

### 3. Advanced Features
```bash
pnpm test:tavily:advanced
```

Tests:
- Domain filtering
- Search depth settings
- Result limit enforcement
- Raw content handling

## Manual Testing Procedures

### 1. Search API Testing

Test the direct search endpoint:
```bash
curl -X POST http://localhost:3000/api/tavily-search \
  -H "Content-Type: application/json" \
  -d '{"query": "latest AI developments"}'
```

Expected response structure:
```json
{
  "query": "latest AI developments",
  "responseTime": 1.23,
  "results": [
    {
      "title": "...",
      "url": "...",
      "content": "...",
      "score": 0.95
    }
  ]
}
```

### 2. Chat Integration Testing

Test the chat endpoint with search:
```bash
curl -X POST http://localhost:3000/api/tavily-chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "What are the latest developments in AI?"}
    ],
    "model": "claude-3.7-sonnet"
  }'
```

### 3. Performance Testing

Run the performance test suite:
```bash
pnpm test:tavily:perf
```

This tests:
- Response times
- Concurrent request handling
- Rate limiting
- Error recovery

## Troubleshooting

### Common Issues

1. Rate Limiting
```
Error: Too many requests
```
- Check your API quota
- Implement request throttling
- Use caching where appropriate

2. Search Quality
```
Error: No relevant results found
```
- Adjust search depth
- Review domain filters
- Check query formatting

3. Integration Issues
```
Error: Failed to enhance LLM response with search results
```
- Verify search result format
- Check context window limits
- Review model compatibility

## Monitoring and Logging

Enable detailed Tavily logs:
```bash
DEBUG=tavily:* pnpm dev
```

Log files:
- `logs/tavily-search.log`: Search API calls
- `logs/tavily-chat.log`: Chat integration
- `logs/tavily-errors.log`: Error tracking

## Best Practices

1. Search Configuration
- Use appropriate search depth for your use case
- Set reasonable result limits
- Configure relevant domain filters

2. Integration
- Cache frequent searches
- Implement retry logic
- Handle timeouts gracefully

3. Monitoring
- Track API usage
- Monitor response times
- Set up alerts for errors

## Automated Testing

Add to your CI/CD pipeline:
```yaml
jobs:
  test-tavily:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: pnpm install
      - name: Run Tavily tests
        run: pnpm test:tavily:all
        env:
          TAVILY_API_KEY: ${{ secrets.TAVILY_API_KEY }}
```

## Next Steps

After testing:
1. Monitor API usage in production
2. Set up error tracking
3. Implement caching strategy
4. Configure backup search providers

For general configuration testing, refer back to [How to Run Configuration Tests](docs/How%20to%20Run%20Configuration%20Tests.md).
