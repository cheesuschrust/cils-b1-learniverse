
import { User, UserRole } from '@/types/user';
import { DocumentMeta, ParsedDocument } from '@/types/document';
import { ChatMessage, ChatSession } from '@/types/chatbot';
import { ServiceFactory } from '@/services/ServiceFactory';
import { IAuthService, AuthResponse, IDocumentService } from '@/types/service';

/**
 * Create a mock user for testing
 */
export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: 'test-user-id',
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  username: 'testuser',
  role: 'user' as UserRole,
  isVerified: true,
  createdAt: new Date(),
  lastLogin: new Date(),
  lastActive: new Date(),
  preferences: {
    theme: 'light',
    emailNotifications: true,
    language: 'en',
    difficulty: 'intermediate'
  },
  subscription: 'free',
  status: 'active',
  preferredLanguage: 'english',
  dailyQuestionCounts: {
    flashcards: 0,
    multipleChoice: 0,
    listening: 0,
    writing: 0,
    speaking: 0
  },
  metrics: {
    totalQuestions: 0,
    correctAnswers: 0,
    streak: 0
  },
  ...overrides
});

/**
 * Create a mock document for testing
 */
export const createMockDocument = (overrides: Partial<DocumentMeta> = {}): DocumentMeta => ({
  id: 'test-doc-id',
  title: 'Test Document',
  type: 'pdf',
  size: 1024,
  uploadedBy: 'test-user-id',
  contentType: 'flashcards',
  language: 'english',
  createdAt: new Date().toISOString(),
  ...overrides
});

/**
 * Create a mock parsed document for testing
 */
export const createMockParsedDocument = (overrides: Partial<ParsedDocument> = {}): ParsedDocument => ({
  text: 'This is a test document content.',
  metadata: {
    title: 'Test Document',
    author: 'Test Author',
    creationDate: new Date().toISOString(),
    pageCount: 1,
    wordCount: 6,
    keyTerms: ['test'],
    language: 'english'
  },
  sections: [
    {
      title: 'Introduction',
      content: 'This is the introduction of the test document.',
      level: 1
    }
  ],
  ...overrides
});

/**
 * Create a mock chat message for testing
 */
export const createMockChatMessage = (overrides: Partial<ChatMessage> = {}): ChatMessage => ({
  id: 'test-message-id',
  role: 'user',
  content: 'Hello, this is a test message',
  timestamp: new Date(),
  ...overrides
});

/**
 * Create a mock chat session for testing
 */
export const createMockChatSession = (overrides: Partial<ChatSession> = {}): ChatSession => ({
  id: 'test-session-id',
  userId: 'test-user-id',
  title: 'Test Chat Session',
  createdAt: new Date(),
  updatedAt: new Date(),
  messages: [
    createMockChatMessage(),
    createMockChatMessage({
      id: 'test-message-id-2',
      role: 'assistant',
      content: 'Hello, how can I help you today?',
      timestamp: new Date(Date.now() + 1000)
    })
  ],
  ...overrides
});

/**
 * Create a mock auth service for testing
 */
export const createMockAuthService = (overrides: Partial<IAuthService> = {}): IAuthService => ({
  login: jest.fn().mockResolvedValue({ 
    user: createMockUser() 
  } as AuthResponse),
  register: jest.fn().mockResolvedValue({ 
    user: createMockUser() 
  } as AuthResponse),
  logout: jest.fn().mockResolvedValue(undefined),
  forgotPassword: jest.fn().mockResolvedValue(undefined),
  resetPassword: jest.fn().mockResolvedValue(undefined),
  verifyEmail: jest.fn().mockResolvedValue(undefined),
  testConnection: jest.fn().mockResolvedValue({ 
    success: true, 
    message: 'Connection successful' 
  }),
  ...overrides
});

/**
 * Create a mock document service for testing
 */
export const createMockDocumentService = (overrides: Partial<IDocumentService> = {}): IDocumentService => ({
  uploadDocument: jest.fn().mockResolvedValue({ 
    path: '/documents/test.pdf', 
    url: 'https://example.com/documents/test.pdf' 
  }),
  parseDocumentContent: jest.fn().mockResolvedValue(createMockParsedDocument()),
  saveDocumentMetadata: jest.fn().mockResolvedValue('test-doc-id'),
  ...overrides
});

/**
 * Create a mock service factory for testing
 */
export const createMockServiceFactory = (): ServiceFactory => {
  const factory = ServiceFactory.getInstance();
  factory.injectServices({
    authService: createMockAuthService(),
    documentService: createMockDocumentService()
  });
  return factory;
};

/**
 * Wait for all pending promises to resolve
 */
export const flushPromises = (): Promise<void> => new Promise(resolve => setImmediate(resolve));

/**
 * Create a mock event object
 */
export const createMockEvent = (
  overrides: Partial<Event | React.SyntheticEvent> = {}
): Partial<Event | React.SyntheticEvent> => ({
  preventDefault: jest.fn(),
  stopPropagation: jest.fn(),
  ...overrides
});

/**
 * Mock local storage for testing
 */
export const mockLocalStorage = () => {
  const store: Record<string, string> = {};
  
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => {
        delete store[key];
      });
    })
  };
};

/**
 * Mock the window.matchMedia function for testing
 */
export const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
};
