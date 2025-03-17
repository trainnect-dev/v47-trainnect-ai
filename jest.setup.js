// This file is used to set up the testing environment for Jest
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Mock console.error and console.warn to keep test output clean
// but still capture the messages for assertion if needed
global.originalConsoleError = console.error;
global.originalConsoleWarn = console.warn;

console.error = (...args) => {
  global.lastConsoleError = args;
};

console.warn = (...args) => {
  global.lastConsoleWarn = args;
};

// Mock URL.createObjectURL for file previews
if (typeof window !== 'undefined') {
  window.URL.createObjectURL = jest.fn(() => 'mock-url');
  window.URL.revokeObjectURL = jest.fn();
}

// Mock ResizeObserver
if (typeof window !== 'undefined') {
  window.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
}

// Mock IntersectionObserver
if (typeof window !== 'undefined') {
  window.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
}

// We'll handle cleanup in individual test files instead
// since afterAll is not available in the setup file
