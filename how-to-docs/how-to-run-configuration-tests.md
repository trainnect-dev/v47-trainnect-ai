# How to Run Configuration Tests

This guide explains how to verify that your API keys and model configurations are working correctly.

## 1. Quick Verification

Run the all-in-one test script:
```bash
pnpm test:all
```

This command runs both Jest tests and model integration tests.

## 2. Step-by-Step Testing

### A. Basic API Key Verification
```bash
# Run the API key verification test
pnpm test

# This will run Jest tests including lib/__tests__/models.test.ts
# which verifies the presence of all required API keys
```

Expected output:
- ✅ All required API keys present
- ❌ Missing keys will be listed with their associated models

### B. Individual Model Testing
```bash
# Run the model integration tests
pnpm test:models
```

This script will:
1. Start a local development server
2. Test each model with a simple prompt
3. Verify both regular chat and Tavily-enhanced responses
4. Generate a detailed test report

Expected output:
```
=== Test Results Summary ===
Main Chat API:
✅ claude-3.7-sonnet
✅ o3-mini
✅ gemini-2.0-flash
✅ qwen-qwq-32b
✅ codestral-latest
✅ perplexity sonar
✅ google/gemini-2.0-flash-thinking-exp:free

Tavily Chat API:
✅ claude-3.7-sonnet
✅ o3-mini
✅ gemini-2.0-flash
✅ qwen-qwq-32b
✅ codestral-latest
✅ perplexity sonar
✅ google/gemini-2.0-flash-thinking-exp:free
```

### C. Testing Tavily Search Integration
```bash
# Run Tavily-specific tests
pnpm test:tavily
```

This will verify:
- API key validity
- Search functionality
- Result formatting
- Domain filtering
- Custom parameters

## 3. Troubleshooting Common Issues

### Invalid API Keys
If you see errors like:
```
Error testing model claude-3.7-sonnet: Invalid API key
```
- Verify the key format in `.env.local`
- Check if the key has expired
- Ensure you have sufficient credits/quota

### Connection Issues
If you see:
```
Error: Failed to fetch from API endpoint
```
- Check your internet connection
- Verify API endpoint accessibility
- Check if your IP is allowlisted (if required)

### Model Availability
If specific models fail:
```
Error: Model not available
```
- Verify your subscription level
- Check if the model is in beta/preview
- Confirm regional availability

## 4. Continuous Integration Testing

For CI/CD pipelines, use:
```bash
pnpm test:ci
```

This runs a subset of tests suitable for CI environments:
- Skip tests requiring real API calls
- Mock responses for integration tests
- Verify configuration structure

## 5. Environment-Specific Testing

### Development
```bash
# Test with development configuration
NODE_ENV=development pnpm test:all
```

### Production
```bash
# Test with production configuration
NODE_ENV=production pnpm test:all
```

### Staging
```bash
# Test with staging configuration
NODE_ENV=staging pnpm test:all
```

## 6. Manual Verification

For thorough testing, you can also:

1. Start the development server:
```bash
pnpm dev
```

2. Visit http://localhost:3000

3. Try each model with these test prompts:
- "What LLM are you?" (Model identification)
- "Search for recent AI news" (Tavily integration)
- "Explain quantum computing" (Complex response)

## 7. Logging and Debugging

Enable detailed logging:
```bash
DEBUG=true pnpm test:all
```

Logs will be saved to:
- `logs/model-tests.log`
- `logs/tavily-tests.log`
- `logs/api-tests.log`

## 8. Configuration Validation

Run the configuration validator:
```bash
pnpm validate:config
```

This checks:
- API key format validity
- Required environment variables
- Optional parameter formatting
- Configuration file structure

## Next Steps

After confirming all tests pass:
1. Deploy your configuration to production
2. Set up monitoring for API usage
3. Configure rate limiting and quotas
4. Set up alerts for API key expiration

For detailed testing instructions specific to Tavily integration, see the [Tavily Testing Guide](docs/tavily-testing-guide.md).