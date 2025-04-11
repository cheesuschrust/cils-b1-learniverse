
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/EnhancedAuthContext';
import './index.css';
import './adapters';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <App />
        <Toaster />
      </AuthProvider>
    </HelmetProvider>
  </React.StrictMode>
);
