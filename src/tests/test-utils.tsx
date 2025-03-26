
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '@/contexts/AuthContext';
import { UserPreferencesProvider } from '@/contexts/UserPreferencesContext';
import { AIUtilsProvider } from '@/contexts/AIUtilsContext';
import { NotificationsProvider } from '@/contexts/NotificationsContext';

// Import any other providers that your app uses

interface AllTheProvidersProps {
  children: React.ReactNode;
}

const AllTheProviders = ({ children }: AllTheProvidersProps) => {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <UserPreferencesProvider>
            <AIUtilsProvider>
              <NotificationsProvider>
                {children}
              </NotificationsProvider>
            </AIUtilsProvider>
          </UserPreferencesProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };
