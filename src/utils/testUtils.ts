
import React from 'react';
import { render, RenderOptions, RenderResult, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * Options for the custom render function
 */
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

  function AllTheProviders({ children }: { children: React.ReactNode }): JSX.Element {
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
 * Render a component with ThemeProvider
 */
export function renderWithTheme<P>(Component: React.ComponentType<P>, props: P): RenderResult {
  return render(
    <ThemeProvider>
      <Component {...props} />
    </ThemeProvider>
  );
}

/**
 * Safe render with error handling
 */
export const safeRender = <P extends object>(
  Component: React.ComponentType<P>, 
  props: P
): RenderResult => {
  try {
    return render(<Component {...props} />);
  } catch (error) {
    console.error('Render error:', error);
    throw error; // Re-throw for test failure
  }
};

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
export const waitForAsync = (): Promise<void> => new Promise(resolve => setTimeout(resolve, 0));

/**
 * Find element by test ID and assert existence
 */
export const getByTestIdAndAssert = (testId: string): HTMLElement => {
  const element = screen.getByTestId(testId);
  expect(element).toBeInTheDocument();
  return element;
};

/**
 * Click button by text or test ID
 */
export const clickButton = (textOrTestId: string): void => {
  try {
    // Try to find by text first
    const button = screen.getByRole('button', { name: textOrTestId });
    fireEvent.click(button);
  } catch (e) {
    // Fall back to test ID
    const button = screen.getByTestId(textOrTestId);
    fireEvent.click(button);
  }
};

/**
 * Fill input by label or test ID
 */
export const fillInput = (labelOrTestId: string, value: string): void => {
  try {
    // Try to find by label text first
    const input = screen.getByLabelText(labelOrTestId);
    fireEvent.change(input, { target: { value } });
  } catch (e) {
    // Fall back to test ID
    const input = screen.getByTestId(labelOrTestId);
    fireEvent.change(input, { target: { value } });
  }
};

/**
 * Render a component with props for testing
 */
export function renderWithProps<T>(Component: React.ComponentType<T>, props: T): RenderResult {
  return render(<Component {...props} />);
}

/**
 * Mock function with proper type annotations
 */
export const mockFunction = (param: string): string => {
  return `mocked_${param}`;
};
