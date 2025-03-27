
import { AuthService } from '@/services/AuthService';
import DocumentService from '@/services/DocumentService';
import { User } from '@/types/user';
import { DocumentMeta, ParsedDocument, DocumentUploadResult } from '@/types/document';
import { IAuthService, LoginCredentials, RegisterData, AuthResponse } from '@/types/service';
import { ServiceFactory } from '@/services/ServiceFactory';

/**
 * Mock implementation of AuthService
 */
export const MockAuthService: IAuthService = {
  login: jest.fn().mockImplementation(async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return {
      user: {
        id: 'mock-user-id',
        email: credentials.email,
        firstName: 'Test',
        lastName: 'User',
        username: 'testuser',
        role: 'user',
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
        }
      },
      token: 'mock-jwt-token'
    };
  }),
  
  register: jest.fn().mockImplementation(async (data: RegisterData): Promise<AuthResponse> => {
    return {
      user: {
        id: 'mock-user-id',
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.email.split('@')[0],
        role: 'user',
        isVerified: false,
        createdAt: new Date(),
        lastLogin: new Date(),
        lastActive: new Date(),
        preferences: {
          theme: 'light',
          emailNotifications: true,
          language: 'en',
          difficulty: 'beginner'
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
        }
      },
      token: 'mock-jwt-token'
    };
  }),
  
  logout: jest.fn().mockResolvedValue(undefined),
  
  forgotPassword: jest.fn().mockResolvedValue(undefined),
  
  resetPassword: jest.fn().mockResolvedValue(undefined),
  
  verifyEmail: jest.fn().mockResolvedValue(undefined),
  
  testConnection: jest.fn().mockResolvedValue({ 
    success: true, 
    message: 'Auth service connection test successful' 
  })
};

/**
 * Mock implementation of DocumentService
 */
export const MockDocumentService = {
  uploadDocument: jest.fn().mockImplementation(
    async (file: File, userId: string): Promise<DocumentUploadResult> => {
      return {
        success: true,
        documentId: 'mock-document-id',
        path: `/documents/${userId}/${file.name}`,
        url: `https://example.com/documents/${userId}/${file.name}`
      };
    }
  ),
  
  parseDocumentContent: jest.fn().mockImplementation(
    async (content: string, fileType: string): Promise<ParsedDocument> => {
      return {
        text: content,
        metadata: {
          title: 'Mock Document',
          author: 'Test User',
          creationDate: new Date().toISOString(),
          pageCount: 5,
          wordCount: content.split(' ').length,
          keyTerms: ['mock', 'test', 'document'],
          language: 'english'
        },
        sections: [
          {
            title: 'Introduction',
            content: 'This is the introduction section of the mock document.',
            level: 1
          },
          {
            title: 'Main Content',
            content: 'This is the main content section of the mock document.',
            level: 1
          },
          {
            title: 'Conclusion',
            content: 'This is the conclusion section of the mock document.',
            level: 1
          }
        ]
      };
    }
  ),
  
  saveDocumentMetadata: jest.fn().mockImplementation(
    async (
      meta: Omit<DocumentMeta, 'id' | 'createdAt'>,
      parsedContent: ParsedDocument
    ): Promise<string> => {
      return 'mock-document-id';
    }
  )
};

/**
 * Set up and inject mock services for testing
 */
export const setupMockServices = (): void => {
  // Get the service factory instance
  const serviceFactory = ServiceFactory.getInstance();
  
  // Inject mock services
  serviceFactory.injectServices({
    authService: MockAuthService,
    documentService: MockDocumentService
  });
};

/**
 * Reset services to their original implementations
 */
export const resetServices = (): void => {
  ServiceFactory.resetInstance();
};
