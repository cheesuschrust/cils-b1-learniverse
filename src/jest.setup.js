
// Add any global setup needed for Jest tests
import '@testing-library/jest-dom';

// Mock IntersectionObserver which isn't available in test environment
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() { return []; }
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Suppress console errors and warnings during tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.error = (...args) => {
  // Check if this is a React-specific warning/error that we want to suppress during tests
  if (
    args[0]?.includes?.('Warning:') ||
    args[0]?.includes?.('Error:') ||
    (typeof args[0] === 'string' && args[0].includes('test'))
  ) {
    return;
  }
  originalConsoleError(...args);
};

console.warn = (...args) => {
  // Check if this is a warning we want to suppress during tests
  if (args[0]?.includes?.('Warning:')) {
    return;
  }
  originalConsoleWarn(...args);
};

// Clean up after all tests are done
afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});
