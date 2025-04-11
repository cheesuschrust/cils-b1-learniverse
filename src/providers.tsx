
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { GamificationProvider } from '@/contexts/GamificationContext';
import { AuthProvider } from '@/contexts/AuthProvider';
import GlobalErrorBoundary from '@/components/common/GlobalErrorBoundary';

interface AppProvidersProps {
  children: React.ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <GlobalErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <GamificationProvider>
            {children}
          </GamificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </GlobalErrorBoundary>
  );
}
