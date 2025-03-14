// Mock for @ai-sdk/react
const useChat = jest.fn().mockReturnValue({
  messages: [],
  append: jest.fn(),
  isLoading: false,
  input: '',
  setInput: jest.fn(),
  handleSubmit: jest.fn(),
  reload: jest.fn(),
  stop: jest.fn(),
  error: null,
  data: null,
});

module.exports = {
  useChat,
};
