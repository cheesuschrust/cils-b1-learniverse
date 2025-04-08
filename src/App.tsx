
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { AIUtilsProvider } from '@/contexts/AIUtilsContext';
import { AIProvider } from '@/contexts/AIContext';
import { HelmetProvider } from 'react-helmet-async';
import AppRoutes from '@/routes';

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <AIProvider>
              <AIUtilsProvider>
                <AppRoutes />
                <Toaster />
              </AIUtilsProvider>
            </AIProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
};

export default App;
