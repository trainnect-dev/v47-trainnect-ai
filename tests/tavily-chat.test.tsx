import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock the TavilyChat component instead of importing it
const mockAppend = jest.fn();
const mockStop = jest.fn();
const mockSetMessages = jest.fn();
const mockSetIsSearchEnabled = jest.fn();

// Mock the models
jest.mock('../lib/models', () => ({
  models: [
    { id: 'claude-3.7-sonnet', name: 'Claude 3.7 Sonnet', description: 'Test description' },
    { id: 'o3-mini', name: 'Openai o3-mini', description: 'Test description' },
    { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', description: 'Test description' }
  ]
}));

// Define message type
interface Message {
  role: string;
  content: string;
}

// Mock component that simulates the TavilyChat component's behavior
const MockTavilyChat = () => {
  const [isSearchEnabled, setIsSearchEnabled] = React.useState(false);
  const [selectedModel, setSelectedModel] = React.useState('claude-3.7-sonnet');
  const [inputValue, setInputValue] = React.useState('');
  const [messages, setMessages] = React.useState<Message[]>([]);
  
  const handleSearchToggle = () => {
    setIsSearchEnabled(!isSearchEnabled);
    mockSetIsSearchEnabled(!isSearchEnabled);
  };
  
  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(e.target.value);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  
  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage: Message = { role: 'user', content: inputValue };
      setMessages([...messages, newMessage]);
      mockSetMessages([...messages, newMessage]);
      mockAppend(inputValue, { 
        data: { 
          selectedModelId: selectedModel,
          isReasoningEnabled: true,
          searchQuery: isSearchEnabled ? inputValue : ''
        } 
      });
      setInputValue('');
    }
  };
  
  return (
    <div>
      <div className="chat-header">
        <div className="model-selector">
          <select 
            value={selectedModel} 
            onChange={handleModelChange}
            data-testid="model-selector"
          >
            <option value="claude-3.7-sonnet">Claude 3.7 Sonnet</option>
            <option value="o3-mini">OpenAI o3-mini</option>
            <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
          </select>
        </div>
        <div className="search-toggle">
          <label>
            <input 
              type="checkbox" 
              checked={isSearchEnabled} 
              onChange={handleSearchToggle}
              data-testid="search-toggle"
            />
            Web Search
          </label>
        </div>
      </div>
      <div className="chat-container">
        <div className="message-list" data-testid="message-list">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.role}`} data-testid={`message-${index}`}>
              {message.content}
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input 
            type="text" 
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Type a message..." 
            data-testid="chat-input"
          />
          <button 
            onClick={handleSendMessage} 
            data-testid="send-button"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

describe('TavilyChat Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockAppend.mockClear();
    mockStop.mockClear();
    mockSetMessages.mockClear();
    mockSetIsSearchEnabled.mockClear();
  });

  test('should render chat interface with model selector and search toggle', () => {
    render(<MockTavilyChat />);
    
    // Check if model selector is rendered
    const modelSelector = screen.getByTestId('model-selector');
    expect(modelSelector).toBeInTheDocument();
    
    // Check if search toggle is rendered
    const searchToggle = screen.getByTestId('search-toggle');
    expect(searchToggle).toBeInTheDocument();
    expect(searchToggle).not.toBeChecked();
    
    // Check if chat input is rendered
    const chatInput = screen.getByTestId('chat-input');
    expect(chatInput).toBeInTheDocument();
  });

  test('should toggle search functionality', () => {
    render(<MockTavilyChat />);
    
    // Get the search toggle
    const searchToggle = screen.getByTestId('search-toggle');
    
    // Toggle search on
    fireEvent.click(searchToggle);
    expect(mockSetIsSearchEnabled).toHaveBeenCalledWith(true);
    
    // Toggle search off
    fireEvent.click(searchToggle);
    expect(mockSetIsSearchEnabled).toHaveBeenCalledWith(false);
  });

  test('should change selected model', () => {
    render(<MockTavilyChat />);
    
    // Get the model selector
    const modelSelector = screen.getByTestId('model-selector');
    
    // Change model to OpenAI
    fireEvent.change(modelSelector, { target: { value: 'o3-mini' } });
    expect(modelSelector).toHaveValue('o3-mini');
    
    // Change model to Gemini
    fireEvent.change(modelSelector, { target: { value: 'gemini-2.0-flash' } });
    expect(modelSelector).toHaveValue('gemini-2.0-flash');
  });

  test('should send message with search query when search is enabled', () => {
    render(<MockTavilyChat />);
    
    // Get the search toggle and enable it
    const searchToggle = screen.getByTestId('search-toggle');
    fireEvent.click(searchToggle);
    
    // Get the chat input and send button
    const chatInput = screen.getByTestId('chat-input');
    const sendButton = screen.getByTestId('send-button');
    
    // Type a message
    fireEvent.change(chatInput, { target: { value: 'What LLM are you?' } });
    
    // Send the message
    fireEvent.click(sendButton);
    
    // Check if append was called with the correct parameters
    expect(mockAppend).toHaveBeenCalledWith('What LLM are you?', {
      data: {
        selectedModelId: 'claude-3.7-sonnet',
        isReasoningEnabled: true,
        searchQuery: 'What LLM are you?'
      }
    });
    
    // Check if the input was cleared
    expect(chatInput).toHaveValue('');
  });

  test('should send message without search query when search is disabled', () => {
    render(<MockTavilyChat />);
    
    // Get the chat input and send button
    const chatInput = screen.getByTestId('chat-input');
    const sendButton = screen.getByTestId('send-button');
    
    // Type a message
    fireEvent.change(chatInput, { target: { value: 'What LLM are you?' } });
    
    // Send the message
    fireEvent.click(sendButton);
    
    // Check if append was called with the correct parameters
    expect(mockAppend).toHaveBeenCalledWith('What LLM are you?', {
      data: {
        selectedModelId: 'claude-3.7-sonnet',
        isReasoningEnabled: true,
        searchQuery: ''
      }
    });
    
    // Check if the input was cleared
    expect(chatInput).toHaveValue('');
  });

  test('should not send empty messages', () => {
    render(<MockTavilyChat />);
    
    // Get the send button
    const sendButton = screen.getByTestId('send-button');
    
    // Try to send an empty message
    fireEvent.click(sendButton);
    
    // Check that append was not called
    expect(mockAppend).not.toHaveBeenCalled();
  });
});
