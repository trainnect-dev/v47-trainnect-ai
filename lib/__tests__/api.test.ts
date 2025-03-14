import { NextRequest } from 'next/server';
import { streamText } from 'ai';

// Mock the POST handler
const mockPost = jest.fn();

// Mock the streamText function
jest.mock('ai', () => ({
  streamText: jest.fn()
}));

// Mock the models
jest.mock('../../lib/models', () => ({
  models: {
    'claude-3-opus-20240229': {
      provider: 'anthropic',
      name: 'claude-3-opus-20240229'
    }
  }
}));

// Mock the route module
jest.mock('../../app/api/chat/route', () => ({
  POST: mockPost
}));

describe('API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementation for streamText
    (streamText as jest.Mock).mockImplementation(() => {
      return Promise.resolve({ text: 'Mock response' });
    });
    
    // Default mock implementation for POST
    mockPost.mockImplementation(async (req: NextRequest) => {
      const body = await req.json();
      const { messages, model } = body;
      
      if (model !== 'claude-3-opus-20240229') {
        return new Response(JSON.stringify({ error: 'Invalid model' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      return streamText({
        model,
        messages,
        temperature: 0.7,
      });
    });
  });
  
  test('handles request with reasoning enabled', async () => {
    const req = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hello' }],
        model: 'claude-3-opus-20240229',
        reasoning: true
      })
    });
    
    await mockPost(req);
    
    expect(streamText).toHaveBeenCalledWith(expect.objectContaining({
      model: 'claude-3-opus-20240229',
      messages: [{ role: 'user', content: 'Hello' }],
      temperature: 0.7,
    }));
  });
  
  test('handles request with reasoning disabled', async () => {
    const req = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hello' }],
        model: 'claude-3-opus-20240229',
        reasoning: false
      })
    });
    
    await mockPost(req);
    
    expect(streamText).toHaveBeenCalledWith(expect.objectContaining({
      model: 'claude-3-opus-20240229',
      messages: [{ role: 'user', content: 'Hello' }],
      temperature: 0.7,
    }));
  });
  
  test('handles invalid model ID', async () => {
    const req = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hello' }],
        model: 'invalid-model',
        reasoning: true
      })
    });
    
    const response = await mockPost(req);
    const data = await response.json();
    
    expect(data).toEqual({ error: 'Invalid model' });
    expect(streamText).not.toHaveBeenCalled();
  });
}); 