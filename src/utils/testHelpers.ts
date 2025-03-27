
import React from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { User, UserRole } from '@/types/user';
import { DocumentMeta, ParsedDocument } from '@/types/document';
import { ServiceFactory } from '@/services/ServiceFactory';
import { IAuthService } from '@/types/service';

/**
 * Options for the custom render function
 */
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  route?: string;
  initialEntries?: string[];
  withAuth?: boolean;
  withTheme?: boolean;
  withQuery?: boolean;
  withRouter?: boolean;
}

/**
 * Enhanced render function with all providers
 */
export function renderWithProviders(
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
): RenderResult {
  const {
    route = '/',
    initialEntries = [route],
    withAuth = true,
    withTheme = true,
    withQuery = true,
    withRouter = true,
    ...renderOptions
  } = options;

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  // Create a component wrapper with configurable providers
  const Wrapper = ({ children }: { children: React.ReactNode }): JSX.Element => {
    let wrappedElement = <>{children}</>;

    // Apply providers in the correct order
    if (withAuth) {
      wrappedElement = <AuthProvider>{wrappedElement}</AuthProvider>;
    }

    if (withTheme) {
      wrappedElement = <ThemeProvider>{wrappedElement}</ThemeProvider>;
    }

    if (withQuery) {
      wrappedElement = (
        <QueryClientProvider client={queryClient}>{wrappedElement}</QueryClientProvider>
      );
    }

    if (withRouter) {
      wrappedElement = (
        <MemoryRouter initialEntries={initialEntries}>
          <Routes>
            <Route path={route} element={wrappedElement} />
          </Routes>
        </MemoryRouter>
      );
    }

    return wrappedElement;
  };

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

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
 * Create mock auth service for testing
 */
export const createMockAuthService = (): IAuthService => ({
  login: jest.fn().mockResolvedValue({ user: createMockUser() }),
  register: jest.fn().mockResolvedValue({ user: createMockUser() }),
  logout: jest.fn().mockResolvedValue(undefined),
  forgotPassword: jest.fn().mockResolvedValue(undefined),
  resetPassword: jest.fn().mockResolvedValue(undefined),
  verifyEmail: jest.fn().mockResolvedValue(undefined),
  testConnection: jest.fn().mockResolvedValue({ success: true, message: 'Connection successful' })
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

/**
 * Wait for any pending promises
 */
export const flushPromises = (): Promise<void> => new Promise(resolve => setTimeout(resolve, 0));

/**
 * Mock event creation
 */
export const createMockEvent = (
  overrides: Partial<Event | React.SyntheticEvent> = {}
): Partial<Event | React.SyntheticEvent> => ({
  preventDefault: jest.fn(),
  stopPropagation: jest.fn(),
  ...overrides
});

/**
 * Mock Component for testing
 */
export const MockComponent: React.FC<{prop?: string}> = ({prop}) => (
  <div data-testid="mock">{prop}</div>
);

/**
 * Example regex pattern with proper termination
 */
export const mockRegex = /pattern/;

/**
 * Complex mock component with proper JSX structure
 */
export const ComplexMock: React.FC = () => (
  <div>
    <span>Test</span>
  </div>
);

// Re-export testing utilities for convenience
export * from '@testing-library/react';
