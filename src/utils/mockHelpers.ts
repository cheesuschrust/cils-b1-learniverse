
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
  updatedAt: new Date(), // Required property
  lastLogin: new Date(),
  lastActive: new Date(),
  // Support both naming conventions
  first_name: 'Test',
  last_name: 'User',
  last_login: new Date(),
  last_active: new Date(),
  created_at: new Date(),
  updated_at: new Date(),
  preferences: {
    theme: 'light',
    emailNotifications: true,
    language: 'en',
    difficulty: 'intermediate',
    onboardingCompleted: true
  },
  subscription: 'free',
  status: 'active',
  preferredLanguage: 'english',
  preferred_language: 'english',
  displayName: 'Test User',
  name: 'Test User',
  isAdmin: false,
  photoURL: '',
  profileImage: '',
  avatar: '',
  phoneNumber: '',
  address: '',
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
 * This has been modified to be compatible with different ChatMessage interfaces
 */
export const createMockChatMessage = (overrides: Partial<any> = {}): any => ({
  id: 'test-message-id',
  content: 'Hello, this is a test message',
  text: 'Hello, this is a test message', // For compatibility
  isUser: true, // For compatibility
  timestamp: new Date(),
  ...overrides
});

/**
 * Create a mock chat session for testing
 * This has been modified to be compatible with different ChatSession interfaces
 */
export const createMockChatSession = (overrides: Partial<any> = {}): any => ({
  id: 'test-session-id',
  userId: 'test-user-id',
  title: 'Test Chat Session', // For compatibility
  createdAt: new Date(), // For compatibility
  updatedAt: new Date(), // For compatibility
  startedAt: new Date(), // For compatibility
  lastActivityAt: new Date(), // For compatibility
  resolved: false, // For compatibility
  escalatedToHuman: false, // For compatibility
  messages: [
    createMockChatMessage({
      id: 'test-message-id-1',
      isUser: true // For compatibility
    }),
    createMockChatMessage({
      id: 'test-message-id-2',
      isUser: false, // For compatibility
      content: 'Hello, how can I help you today?',
      text: 'Hello, how can I help you today?',
      timestamp: new Date(Date.now() + 1000)
    })
  ],
  ...overrides
});

/**
 * Create mock auth service for testing
 */
export const createMockAuthService = (): IAuthService => ({
  login: jest.fn().mockResolvedValue({ user: createMockUser() }),
  register: jest.fn().mockResolvedValue({ user: createMockUser() }),
  logout: jest.fn().mockResolvedValue(undefined),
  forgotPassword: jest.fn().mockResolvedValue(undefined),
  resetPassword: jest.fn().mockResolvedValue(undefined),
  verifyEmail: jest.fn().mockResolvedValue(undefined),
  testConnection: jest.fn().mockResolvedValue({ success: true, message: 'Connection successful' }),
  updateProfile: jest.fn().mockResolvedValue({ user: createMockUser() }),
  updatePassword: jest.fn().mockResolvedValue(undefined),
  refreshUser: jest.fn().mockResolvedValue(createMockUser()),
  signup: jest.fn().mockResolvedValue({ user: createMockUser() }),
  incrementDailyQuestionCount: jest.fn().mockResolvedValue(true),
  resendVerificationEmail: jest.fn().mockResolvedValue(true),
  socialLogin: jest.fn().mockResolvedValue(true)
});

/**
 * Create mock document service for testing
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
 * Setup mock service factory for testing
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
