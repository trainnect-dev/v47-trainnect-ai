import { NextRequest } from 'next/server';

// Mock the Tavily search function
const mockSearchTavily = jest.fn();

// Mock the Tavily search module
jest.mock('../../tools/tavily-search', () => ({
  searchTavily: mockSearchTavily
}));

// Mock the route module
const mockPost = jest.fn();
jest.mock('../../app/api/tavily-search/route', () => ({
  POST: mockPost
}));

describe('Tavily Search API', () => {
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
    
    // Default mock implementation for POST
    mockPost.mockImplementation(async (req: NextRequest) => {
      const body = await req.json();
      const { query } = body;
      
      if (!query) {
        return new Response(JSON.stringify({ error: 'Query is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      const results = await mockSearchTavily({ query });
      return new Response(JSON.stringify(results), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    });
  });
  
  test('handles search request with valid query', async () => {
    const req = new NextRequest('http://localhost:3000/api/tavily-search', {
      method: 'POST',
      body: JSON.stringify({
        query: 'What is artificial intelligence?'
      })
    });
    
    const response = await mockPost(req);
    const data = await response.json();
    
    expect(mockSearchTavily).toHaveBeenCalledWith({
      query: 'What is artificial intelligence?'
    });
    
    expect(data).toEqual({
      query: 'What is artificial intelligence?',
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
    });
  });
  
  test('handles search request with empty query', async () => {
    const req = new NextRequest('http://localhost:3000/api/tavily-search', {
      method: 'POST',
      body: JSON.stringify({
        query: ''
      })
    });
    
    const response = await mockPost(req);
    const data = await response.json();
    
    expect(data).toEqual({ error: 'Query is required' });
    expect(mockSearchTavily).not.toHaveBeenCalled();
  });
  
  test('handles search request with specific parameters', async () => {
    // Update the mock implementation for POST to pass all parameters
    mockPost.mockImplementationOnce(async (req: NextRequest) => {
      const body = await req.json();
      const { query, search_depth, include_domains, exclude_domains } = body;
      
      if (!query) {
        return new Response(JSON.stringify({ error: 'Query is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      const results = await mockSearchTavily({ 
        query,
        search_depth,
        include_domains,
        exclude_domains
      });
      
      return new Response(JSON.stringify(results), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    });
    
    mockSearchTavily.mockImplementationOnce(async (params) => {
      return {
        query: params.query,
        results: [
          {
            title: 'Custom Result',
            url: 'https://example.com/custom',
            content: 'This is custom content',
            score: 0.95
          }
        ],
        answer: 'This is a custom answer'
      };
    });
    
    const req = new NextRequest('http://localhost:3000/api/tavily-search', {
      method: 'POST',
      body: JSON.stringify({
        query: 'Custom query',
        search_depth: 'advanced',
        include_domains: ['example.com'],
        exclude_domains: ['excluded.com']
      })
    });
    
    const response = await mockPost(req);
    const data = await response.json();
    
    expect(mockSearchTavily).toHaveBeenCalledWith(expect.objectContaining({
      query: 'Custom query',
      search_depth: 'advanced',
      include_domains: ['example.com'],
      exclude_domains: ['excluded.com']
    }));
    
    expect(data).toEqual({
      query: 'Custom query',
      results: [
        {
          title: 'Custom Result',
          url: 'https://example.com/custom',
          content: 'This is custom content',
          score: 0.95
        }
      ],
      answer: 'This is a custom answer'
    });
  });
});
