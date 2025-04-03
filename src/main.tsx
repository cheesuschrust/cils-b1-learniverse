
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { IntlProvider } from '@/contexts/IntlContext';
import { supabase } from '@/integrations/supabase/client';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from '@/components/ui/toaster';
import App from './App';
import './index.css';

import EnhancedErrorBoundary from '@/components/EnhancedErrorBoundary';
import ServiceProvider from '@/contexts/ServiceContext';
import AIProvider from '@/contexts/AIContext';
import { FlashcardsProvider } from '@/contexts/FlashcardsContext';
import { NotificationsProvider } from '@/contexts/NotificationsContext';
import { QuizProvider } from '@/contexts/QuizContext';
import { GamificationProvider } from '@/contexts/GamificationContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <EnhancedErrorBoundary showDetails={true} reportErrors={true}>
      <HelmetProvider>
        <ThemeProvider>
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
    </EnhancedErrorBoundary>
  </React.StrictMode>
);
