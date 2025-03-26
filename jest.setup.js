
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Mock global objects
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

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

// Mock window.scrollTo
global.scrollTo = jest.fn();

// Mock localStorage
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    key: jest.fn(index => Object.keys(store)[index] || null),
    get length() {
      return Object.keys(store).length;
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock SpeechSynthesis API
const mockSpeechSynthesis = {
  speak: jest.fn(),
  cancel: jest.fn(),
  pause: jest.fn(),
  resume: jest.fn(),
  getVoices: jest.fn().mockReturnValue([
    {
      voiceURI: 'native',
      name: 'English Voice',
      lang: 'en-US',
      localService: true,
      default: true,
    },
    {
      voiceURI: 'native-italian',
      name: 'Italian Voice',
      lang: 'it-IT',
      localService: true,
      default: false,
    }
  ]),
  onvoiceschanged: null,
  pending: false,
  speaking: false,
  paused: false,
};

global.SpeechSynthesisUtterance = jest.fn().mockImplementation(() => ({
  text: '',
  voice: null,
  rate: 1,
  pitch: 1,
  volume: 1,
  lang: '',
  onstart: null,
  onend: null,
  onerror: null,
  onpause: null,
  onresume: null,
  onmark: null,
  onboundary: null,
}));

Object.defineProperty(window, 'speechSynthesis', {
  value: mockSpeechSynthesis,
});

// Suppress console errors in tests
jest.spyOn(console, 'error').mockImplementation(() => {});

// Add custom matchers to expect for Jest
expect.extend({
  toBeInTheDocument(received) {
    const pass = received !== null && received !== undefined;
    return {
      pass,
      message: () => `expected ${received} ${pass ? 'not ' : ''}to be in the document`,
    };
  },
  toHaveClass(received, className) {
    const pass = received && received.classList && received.classList.contains(className);
    return {
      pass,
      message: () => `expected ${received} ${pass ? 'not ' : ''}to have class ${className}`,
    };
  },
  toHaveAttribute(received, attr, value) {
    const hasAttr = received && received.hasAttribute && received.hasAttribute(attr);
    const pass = value !== undefined ? hasAttr && received.getAttribute(attr) === value : hasAttr;
    return {
      pass,
      message: () => `expected ${received} ${pass ? 'not ' : ''}to have attribute ${attr}${value !== undefined ? ` with value ${value}` : ''}`,
    };
  },
  toBeDisabled(received) {
    const pass = received && received.disabled === true;
    return {
      pass,
      message: () => `expected ${received} ${pass ? 'not ' : ''}to be disabled`,
    };
  },
  toHaveTextContent(received, text) {
    const pass = received && received.textContent && received.textContent.includes(text);
    return {
      pass,
      message: () => `expected ${received} ${pass ? 'not ' : ''}to have text content ${text}`,
    };
  },
});
