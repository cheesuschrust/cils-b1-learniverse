
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { IntlProvider } from '@/contexts/IntlContext';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from '@/components/ui/toaster';
import App from './App';
import './index.css';

import GlobalErrorBoundary from '@/components/common/GlobalErrorBoundary';
import ServiceProvider from '@/contexts/ServiceContext';
import AIProvider from '@/contexts/AIContext';
import { FlashcardsProvider } from '@/contexts/FlashcardsContext';
import { NotificationsProvider } from '@/contexts/NotificationsContext';
import { QuizProvider } from '@/contexts/QuizContext';
import { GamificationProvider } from '@/contexts/GamificationContext';
import { registerServiceWorker } from './serviceWorkerRegistration';

// Register service worker
registerServiceWorker();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GlobalErrorBoundary>
      <HelmetProvider>
        <ThemeProvider defaultTheme="system" storageKey="ui-theme">
          <BrowserRouter>
            <AuthProvider>
              <ServiceProvider>
                <AIProvider>
                  <IntlProvider>
                    <FlashcardsProvider>
                      <NotificationsProvider>
                        <QuizProvider>
                          <GamificationProvider>
                            <App />
                            <Toaster />
                          </GamificationProvider>
                        </QuizProvider>
                      </NotificationsProvider>
                    </FlashcardsProvider>
                  </IntlProvider>
                </AIProvider>
              </ServiceProvider>
            </AuthProvider>
          </BrowserRouter>
        </ThemeProvider>
      </HelmetProvider>
    </GlobalErrorBoundary>
  </React.StrictMode>
);
