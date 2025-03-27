
import { User, UserRole } from '@/types/user';
import { DocumentMeta, ParsedDocument } from '@/types/document';
import { IAuthService } from '@/types/service';
import { ServiceFactory } from '@/services/ServiceFactory';

/**
 * Create a mock user for testing
 */
export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: 'test-user-id',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  username: 'testuser',
  role: 'user' as UserRole,
  isVerified: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastLogin: new Date(),
  lastActive: new Date(),
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
  displayName: 'Test User',
  photoURL: '',
  phoneNumber: '',
  address: '',
  avatar: '',
  name: 'Test User',
  isAdmin: false,
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
 * Setup mock service factory for testing
 */
export const setupMockServiceFactory = (): void => {
  const factory = ServiceFactory.getInstance();
  factory.injectServices({
    authService: createMockAuthService(),
    documentService: {
      uploadDocument: jest.fn().mockResolvedValue({ path: '/test.pdf', url: 'https://example.com/test.pdf' }),
      parseDocumentContent: jest.fn().mockResolvedValue(createMockParsedDocument()),
      saveDocumentMetadata: jest.fn().mockResolvedValue('document-id')
    }
  });
};
