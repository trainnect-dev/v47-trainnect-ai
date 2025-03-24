# How to Run the App in GitHub Codespaces

This guide provides step-by-step instructions for setting up and running the Trainnect AI application in GitHub Codespaces.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Setting Up a Codespace](#setting-up-a-codespace)
3. [Environment Configuration](#environment-configuration)
4. [Running the Application](#running-the-application)
5. [Troubleshooting](#troubleshooting)
6. [Development Workflow](#development-workflow)

## Prerequisites

Before starting, ensure you have:

- A GitHub account with access to the repository
- Required API keys for the LLM providers used in the application:
  - Anthropic API Key
  - OpenAI API Key
  - Google AI API Key
  - Groq API Key
  - Mistral API Key
  - Perplexity API Key
  - OpenRouter API Key
  - Tavily API Key

## Setting Up a Codespace

1. **Navigate to the Repository**
   - Go to the GitHub repository in your browser

2. **Create a New Codespace**
   - Click the green "Code" button
   - Select the "Codespaces" tab
   - Click "Create codespace on main"

3. **Wait for Setup to Complete**
   - GitHub will automatically set up your development environment using the configuration in `.devcontainer/devcontainer.json`
   - This includes:
     - Setting up Node.js 20
     - Installing SQLite3 dependencies
     - Installing pnpm 10.4.0
     - Installing project dependencies

## Environment Configuration

1. **Create Environment Variables File**
   - Once your Codespace is ready, create a `.env.local` file in the root directory:

   ```bash
   touch .env.local
   ```

2. **Add Required API Keys and Configuration**
   - Open the `.env.local` file in the editor
   - Add your API keys and configuration in the following format:

   ```
   # LLM Provider API Keys
   ANTHROPIC_API_KEY=your_anthropic_api_key
   OPENAI_API_KEY=your_openai_api_key
   GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key
   GROQ_API_KEY=your_groq_api_key
   MISTRAL_API_KEY=your_mistral_api_key
   PERPLEXITY_API_KEY=your_perplexity_api_key
   OPENROUTER_API_KEY=your_openrouter_api_key
   
   # Optional providers (uncomment if needed)
   # DEEPSEEK_API_BASE_URL=https://api.deepseek.com
   # DEEPSEEK_API_KEY=your_deepseek_api_key
   # FIRECRAWL_API_KEY=your_firecrawl_api_key
   
   # Authentication (generate a random secret)
   AUTH_SECRET=your_random_secret_key
   
   # System Prompts
   MAIN_CHAT_PROMPT="You are an professional and mindful expert {{USER_ROLE}} AI trainer and researcher with deep expertise in fortune 500 level technical course proposals, outlines and full course creation. You focus on {{SEARCH_DEPTH}} research using the Tavily search tool {{TAVILY_INCLUDE_DOMAINS}} and incorporate the following search results: {{SEARCH_RESULTS}} {{TAVILY_INCLUDE_DOMAINS}} {{TAVILY_INCLUDE_ANSWER}} into your answers and responses.  If asked about your identity, you are the {{MODEL_ID}} model."
   TAVILY_CHAT_PROMPT="You are an professional and mindful expert {{USER_ROLE}} AI trainer and researcher with deep expertise in fortune 500 level technical course proposals, outlines and full courses. You focus on {{SEARCH_DEPTH}} research using the Tavily search tool {{TAVILY_INCLUDE_DOMAINS}} and incorporate the following search results: {{SEARCH_RESULTS}} into your answers {{TAVILY_INCLUDE_ANSWER}} and responses.  If asked about your identity, you are the {{MODEL_ID}} model."
   AI_AGENT_PROMPT="You are an professional and mindful expert {{USER_ROLE}} AI trainer and researcher with deep expertise in fortune 500 level technical course proposals, outlines and full courses. You focus on {{SEARCH_DEPTH}} research using the Tavily search tool {{TAVILY_INCLUDE_DOMAINS}} and incorporate the following search results: {{SEARCH_RESULTS}} into your answers {{TAVILY_INCLUDE_ANSWER}} and responses.  If asked about your identity, you are the AI Agent {{MODEL_ID}} model."
   AI_AGENT_PROCESSOR_PROMPT="You are an expert at proofreading technical documentation ensuring that it is perfect and contains detailed {{ANALYSIS_DEPTH}} analysis in order to ensure that it is of the highest quality, providing outputs in {{OUTPUT_FORMAT}} format. If asked about your identity, you are the AI Agent Processor {{MODEL_ID}} model."
   
   # Prompt Variables
   EXPERTISE_LEVEL="advanced"
   USER_ROLE="AI and machine learning"
   SEARCH_DEPTH="comprehensive"
   RESPONSE_STYLE="comprehensive"
   ANALYSIS_DEPTH="detailed"
   OUTPUT_FORMAT="structured"
   
   # Tavily Search Parameters
   TAVILY_API_KEY=your_tavily_api_key
   TAVILY_SEARCH_DEPTH="advanced"
   TAVILY_MAX_RESULTS=20
   TAVILY_INCLUDE_ANSWER=true
   TAVILY_INCLUDE_RAW_CONTENT=false
   TAVILY_INCLUDE_DOMAINS=true "example.com, another-site.com"
   TAVILY_EXCLUDE_DOMAINS="exclude.com, block-this.com"
   ```

   > Note: Never commit your `.env.local` file as it contains sensitive API keys. The `.env.local` file is properly gitignored in this project to protect your credentials.

## Running the Application

1. **Start the Development Server**
   - In the terminal, run:

   ```bash
   pnpm dev
   ```

2. **Access the Application**
   - Once the server starts, Codespaces will display a notification that a service is running on port 3000
   - Click "Open in Browser" to view the application
   - Alternatively, you can click the "Ports" tab and then click the globe icon next to port 3000

3. **Using the Application**
   - The application should now be running and accessible through your browser
   - You can interact with the AI assistant, switch between models, and use all the features described in the project README

## Troubleshooting

### SQLite3 Issues

If you encounter issues with better-sqlite3:

1. **Verify SQLite3 Installation**
   ```bash
   sqlite3 --version
   ```

2. **Rebuild the better-sqlite3 Module**
   ```bash
   pnpm rebuild better-sqlite3
   ```

3. **Check for Permissions Issues**
   ```bash
   ls -la
   ```
   Ensure the database directory has proper permissions.

### Node.js or pnpm Issues

1. **Verify Node.js Version**
   ```bash
   node --version
   ```
   Ensure it shows version 20.x.x.

2. **Verify pnpm Installation**
   ```bash
   pnpm --version
   ```
   Ensure it shows version 10.4.0 or compatible.

3. **Reinstall Dependencies**
   ```bash
   rm -rf node_modules && pnpm store prune && pnpm install
   ```

### Port Forwarding Issues

If you can't access the application in your browser:

1. **Check Running Processes**
   ```bash
   lsof -i :3000
   ```

2. **Restart the Server**
   ```bash
   pkill -f "npm" && pnpm dev
   ```

3. **Manual Port Forwarding**
   - Go to the "Ports" tab in Codespaces
   - Click "Add Port"
   - Enter "3000"
   - Set visibility to "Public"

## Development Workflow

### Recommended Workflow

1. **Create a New Branch for Features**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes and Test Locally**
   - Edit files in the Codespaces editor
   - Run the application to test changes
   - Run tests to ensure everything works:
     ```bash
     pnpm test
     ```

3. **Commit and Push Changes**
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin feature/your-feature-name
   ```

4. **Create a Pull Request**
   - Go to the repository on GitHub
   - Click "Pull requests" > "New pull request"
   - Select your branch and create the PR

### Working with Multiple Codespaces

- You can create multiple Codespaces for different features or branches
- Codespaces will save your work automatically
- You can stop a Codespace when not in use to save resources

## Additional Resources

- [GitHub Codespaces Documentation](https://docs.github.com/en/codespaces)
- [Next.js Documentation](https://nextjs.org/docs)
- [pnpm Documentation](https://pnpm.io/documentation)
- [Vercel AI SDK Documentation](https://sdk.vercel.ai/docs)
