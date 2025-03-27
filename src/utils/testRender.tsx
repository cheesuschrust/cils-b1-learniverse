
import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
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
): ReturnType<typeof render> {
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

// Re-export testing utilities for convenience
export * from '@testing-library/react';
