
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import AppRoutes from '@/routes';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { UserPreferencesProvider } from '@/contexts/UserPreferencesContext';
import { NotificationsProvider } from '@/contexts/NotificationsContext';
import { ThemeProvider } from '@/components/theme-provider';
import CookieConsentBanner from '@/components/common/CookieConsentBanner';

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <LanguageProvider>
        <UserPreferencesProvider>
          <AuthProvider>
            <NotificationsProvider>
              <BrowserRouter>
                <AppRoutes />
                <Toaster />
                <CookieConsentBanner />
              </BrowserRouter>
            </NotificationsProvider>
          </AuthProvider>
        </UserPreferencesProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
