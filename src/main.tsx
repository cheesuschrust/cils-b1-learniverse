
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppWithAdapters from './AppWithAdapters';
import { Toaster } from '@/components/ui/toaster';
import './index.css';

// Create Query Client
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <AppWithAdapters />
        <Toaster />
      </HelmetProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
