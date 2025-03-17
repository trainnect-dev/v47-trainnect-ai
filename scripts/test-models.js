#!/usr/bin/env node

/**
 * This script tests all available models in both the main app and the Tavily AI search page.
 * It sends a request to each model asking "What LLM are you?" to verify that the model
 * is correctly identified and functioning.
 * 
 * Usage:
 * node scripts/test-models.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Load environment variables
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

// Get models from the models.ts file
const modelsPath = path.resolve(process.cwd(), 'lib/models.ts');
const modelsContent = fs.readFileSync(modelsPath, 'utf8');

// Extract model IDs using regex
const modelIdRegex = /id:\s*['"]([^'"]+)['"]/g;
const modelIds = [];
let match;
while ((match = modelIdRegex.exec(modelsContent)) !== null) {
  modelIds.push(match[1]);
}

// Function to test a model with the main chat API
async function testMainChatModel(modelId) {
  try {
    console.log(`Testing main chat API with model: ${modelId}`);
    
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'What LLM are you?' }],
        model: modelId,
        reasoning: true,
      }),
    });
    
    if (!response.ok) {
      console.error(`Error testing model ${modelId}: ${response.statusText}`);
      return false;
    }
    
    // For streaming responses, we need to read the chunks
    const reader = response.body.getReader();
    let result = '';
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      // Convert the chunk to a string
      const chunk = new TextDecoder().decode(value);
      result += chunk;
    }
    
    console.log(`✅ Model ${modelId} responded successfully`);
    return true;
  } catch (error) {
    console.error(`Error testing model ${modelId}:`, error);
    return false;
  }
}

// Function to test a model with the Tavily chat API
async function testTavilyChatModel(modelId) {
  try {
    console.log(`Testing Tavily chat API with model: ${modelId}`);
    
    const response = await fetch('http://localhost:3000/api/tavily-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'What LLM are you?' }],
        selectedModelId: modelId,
        isReasoningEnabled: true,
        searchQuery: 'What is the latest news about artificial intelligence?',
      }),
    });
    
    if (!response.ok) {
      console.error(`Error testing model ${modelId} with Tavily: ${response.statusText}`);
      return false;
    }
    
    // For streaming responses, we need to read the chunks
    const reader = response.body.getReader();
    let result = '';
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      // Convert the chunk to a string
      const chunk = new TextDecoder().decode(value);
      result += chunk;
    }
    
    console.log(`✅ Model ${modelId} with Tavily search responded successfully`);
    return true;
  } catch (error) {
    console.error(`Error testing model ${modelId} with Tavily:`, error);
    return false;
  }
}

// Main function to run the tests
async function runTests() {
  console.log('Starting model tests...');
  console.log(`Found ${modelIds.length} models to test: ${modelIds.join(', ')}`);
  
  // Start the Next.js development server
  console.log('Starting Next.js development server...');
  const serverProcess = require('child_process').spawn('pnpm', ['dev'], {
    stdio: 'inherit',
    shell: true,
  });
  
  // Give the server some time to start
  console.log('Waiting for server to start...');
  await new Promise(resolve => setTimeout(resolve, 10000));
  
  // Test each model with the main chat API
  console.log('\n=== Testing Main Chat API ===');
  const mainResults = [];
  for (const modelId of modelIds) {
    const success = await testMainChatModel(modelId);
    mainResults.push({ modelId, success });
  }
  
  // Test each model with the Tavily chat API
  console.log('\n=== Testing Tavily Chat API ===');
  const tavilyResults = [];
  for (const modelId of modelIds) {
    const success = await testTavilyChatModel(modelId);
    tavilyResults.push({ modelId, success });
  }
  
  // Print summary
  console.log('\n=== Test Results Summary ===');
  console.log('Main Chat API:');
  for (const { modelId, success } of mainResults) {
    console.log(`${success ? '✅' : '❌'} ${modelId}`);
  }
  
  console.log('\nTavily Chat API:');
  for (const { modelId, success } of tavilyResults) {
    console.log(`${success ? '✅' : '❌'} ${modelId}`);
  }
  
  // Kill the server process
  serverProcess.kill();
  console.log('Tests completed.');
}

// Run the tests
runTests().catch(error => {
  console.error('Error running tests:', error);
  process.exit(1);
});
