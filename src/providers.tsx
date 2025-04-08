
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { GamificationProvider } from '@/contexts/GamificationContext';

interface AppProvidersProps {
  children: React.ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <BrowserRouter>
      <GamificationProvider>
        {children}
      </GamificationProvider>
    </BrowserRouter>
  );
}
