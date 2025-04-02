
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { HelmetProvider } from 'react-helmet-async';
import EnhancedErrorBoundary from '@/components/common/EnhancedErrorBoundary';
import App from './App';
import './index.css';

// Create a client for React Query with updated options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Create a context for React Helmet Async
const helmetContext = {};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <EnhancedErrorBoundary
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
          <div className="max-w-md w-full p-6 bg-card text-card-foreground shadow-lg rounded-lg border">
            <h2 className="text-2xl font-bold mb-4 text-destructive">Application Error</h2>
            <p className="mb-4">Sorry, the application encountered an unexpected error.</p>
            <p className="text-sm text-muted-foreground mb-4">Please refresh the page to try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      }
      showDetails={true}
      reportErrors={true}
    >
      <HelmetProvider context={helmetContext}>
        <ThemeProvider defaultTheme="system" storageKey="cils-theme">
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </QueryClientProvider>
        </ThemeProvider>
      </HelmetProvider>
    </EnhancedErrorBoundary>
  </React.StrictMode>
);
