
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

/**
 * Options for customRender function
 */
export interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  route?: string;
  initialEntries?: string[];
  withAuth?: boolean;
  withTheme?: boolean;
  withRouter?: boolean;
  withQuery?: boolean;
  queryClient?: QueryClient;
}

/**
 * Custom render function with all necessary providers
 */
export function customRender(
  ui: ReactElement,
  options: CustomRenderOptions = {}
) {
  const {
    route = '/',
    initialEntries = [route],
    withAuth = true,
    withTheme = true,
    withRouter = true,
    withQuery = true,
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    }),
    ...renderOptions
  } = options;

  // Create wrapper with all providers
  function AllTheProviders({ children }: { children: React.ReactNode }) {
    let wrappedElement = <>{children}</>;

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
  }

  return {
    ...render(ui, { wrapper: AllTheProviders, ...renderOptions }),
    // Additional test utilities
    queryClient,
    // Reset mocks helper
    resetMocks: () => {
      jest.clearAllMocks();
    }
  };
}

// Re-export everything from testing-library
export * from '@testing-library/react';

// Export the customRender as render
export { customRender as render };
