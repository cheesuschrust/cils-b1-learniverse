
import React from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a custom render method that includes providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  route?: string;
  initialEntries?: string[];
}

/**
 * Custom render function that wraps the component with all required providers
 */
export function renderWithProviders(
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
): RenderResult {
  const {
    route = '/',
    initialEntries = [route],
    ...renderOptions
  } = options;

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  function AllTheProviders({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            <MemoryRouter initialEntries={initialEntries}>
              <Routes>
                <Route path={route} element={children} />
              </Routes>
            </MemoryRouter>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    );
  }

  return render(ui, { wrapper: AllTheProviders, ...renderOptions });
}

/**
 * Mock implementations for commonly used hooks and services
 */
export const mockServices = {
  authService: {
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
    verifyEmail: jest.fn(),
    testConnection: jest.fn().mockResolvedValue({ success: true, message: 'Connection successful' }),
  },
  documentService: {
    uploadDocument: jest.fn(),
    parseDocumentContent: jest.fn(),
    saveDocumentMetadata: jest.fn(),
  }
};

/**
 * Helper to create a mock event object
 */
export const createMockEvent = (
  overrides: Partial<Event> = {}
): Partial<Event> => ({
  preventDefault: jest.fn(),
  stopPropagation: jest.fn(),
  ...overrides,
});

/**
 * Helper to wait for async operations
 */
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0));
