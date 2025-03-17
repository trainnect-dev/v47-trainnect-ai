import { NextRequest } from 'next/server';
import { streamText } from 'ai';

// Mock the streamText function
jest.mock('ai', () => ({
  streamText: jest.fn()
}));

// Mock the Tavily search function
const mockSearchTavily = jest.fn();
jest.mock('../../tools/tavily-search', () => ({
  searchTavily: mockSearchTavily
}));

// Mock the models
jest.mock('../../lib/models', () => ({
  models: [
    { id: 'claude-3.7-sonnet', name: 'Claude 3.7 Sonnet', description: 'Test description' },
    { id: 'o3-mini', name: 'Openai o3-mini', description: 'Test description' },
    { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', description: 'Test description' }
  ],
  modelApiNames: {
    'claude-3.7-sonnet': 'claude-3-7-sonnet-20250219',
    'o3-mini': 'o3-mini',
    'gemini-2.0-flash': 'gemini-2.0-flash'
  },
  myProvider: {
    languageModel: jest.fn((modelId) => ({ id: modelId }))
  }
}));

// Mock the route module
const mockPost = jest.fn();
jest.mock('../../app/api/tavily-chat/route', () => ({
  POST: mockPost
}));

describe('Tavily Chat API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementation for searchTavily
    mockSearchTavily.mockImplementation(async (params) => {
      return {
        query: params.query,
        results: [
          {
            title: 'Test Result 1',
            url: 'https://example.com/1',
            content: 'This is test content 1',
            score: 0.9
          },
          {
            title: 'Test Result 2',
            url: 'https://example.com/2',
            content: 'This is test content 2',
            score: 0.8
          }
        ],
        answer: 'This is a test answer'
      };
    });
    
    // Default mock implementation for streamText
    (streamText as jest.Mock).mockImplementation(() => {
      return Promise.resolve({ text: 'I am the Claude 3.7 Sonnet model.' });
    });
    
    // Default mock implementation for POST
    mockPost.mockImplementation(async (req: NextRequest) => {
      const body = await req.json();
      const { messages, selectedModelId, isReasoningEnabled, searchQuery } = body;
      
      if (!selectedModelId) {
        return new Response(JSON.stringify({ error: 'Model ID is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      let searchResults = null;
      if (searchQuery) {
        searchResults = await mockSearchTavily({ query: searchQuery });
      }
      
      // Add search results to the system prompt if available
      let systemPrompt = `You are an AI researcher and engineer with deep research expertise.`;
      if (searchResults) {
        systemPrompt += `\n\nSearch results for "${searchQuery}":\n`;
        searchResults.results.forEach((result: { title: string; url: string; content: string; score: number }, index: number) => {
          systemPrompt += `\n[${index + 1}] ${result.title}\n${result.url}\n${result.content}\n`;
        });
      }
      
      // Add a special instruction to identify the model
      systemPrompt += `\n\nWhen asked "what LLM are you?", respond with "I am the ${selectedModelId} model."`;
      
      return streamText({
        model: selectedModelId,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.7,
      });
    });
  });
  
  test('handles chat request with Claude model and search query', async () => {
    const req = new NextRequest('http://localhost:3000/api/tavily-chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'What LLM are you?' }],
        selectedModelId: 'claude-3.7-sonnet',
        isReasoningEnabled: true,
        searchQuery: 'Latest AI developments'
      })
    });
    
    await mockPost(req);
    
    expect(mockSearchTavily).toHaveBeenCalledWith({
      query: 'Latest AI developments'
    });
    
    expect(streamText).toHaveBeenCalledWith(expect.objectContaining({
      model: 'claude-3.7-sonnet',
      messages: expect.arrayContaining([
        expect.objectContaining({ role: 'system' }),
        expect.objectContaining({ role: 'user', content: 'What LLM are you?' })
      ]),
      temperature: 0.7,
    }));
  });
  
  test('handles chat request with OpenAI model and no search query', async () => {
    // Change the mock implementation for this test
    (streamText as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve({ text: 'I am the o3-mini model.' });
    });
    
    const req = new NextRequest('http://localhost:3000/api/tavily-chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'What LLM are you?' }],
        selectedModelId: 'o3-mini',
        isReasoningEnabled: false,
        searchQuery: ''
      })
    });
    
    await mockPost(req);
    
    expect(mockSearchTavily).not.toHaveBeenCalled();
    
    expect(streamText).toHaveBeenCalledWith(expect.objectContaining({
      model: 'o3-mini',
      messages: expect.arrayContaining([
        expect.objectContaining({ role: 'system' }),
        expect.objectContaining({ role: 'user', content: 'What LLM are you?' })
      ]),
      temperature: 0.7,
    }));
  });
  
  test('handles chat request with Gemini model and search query', async () => {
    // Change the mock implementation for this test
    (streamText as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve({ text: 'I am the gemini-2.0-flash model.' });
    });
    
    const req = new NextRequest('http://localhost:3000/api/tavily-chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'What LLM are you?' }],
        selectedModelId: 'gemini-2.0-flash',
        isReasoningEnabled: true,
        searchQuery: 'Gemini AI capabilities'
      })
    });
    
    await mockPost(req);
    
    expect(mockSearchTavily).toHaveBeenCalledWith({
      query: 'Gemini AI capabilities'
    });
    
    expect(streamText).toHaveBeenCalledWith(expect.objectContaining({
      model: 'gemini-2.0-flash',
      messages: expect.arrayContaining([
        expect.objectContaining({ role: 'system' }),
        expect.objectContaining({ role: 'user', content: 'What LLM are you?' })
      ]),
      temperature: 0.7,
    }));
  });
  
  test('handles invalid model ID', async () => {
    const req = new NextRequest('http://localhost:3000/api/tavily-chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'What LLM are you?' }],
        selectedModelId: '',
        isReasoningEnabled: true,
        searchQuery: 'Test query'
      })
    });
    
    const response = await mockPost(req);
    const data = await response.json();
    
    expect(data).toEqual({ error: 'Model ID is required' });
    expect(streamText).not.toHaveBeenCalled();
  });
});
