
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '@/contexts/AuthContext';
import App from './App';

const AppWithAdapters: React.FC = () => {
  return (
    <Router>
      <HelmetProvider context={{}}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </HelmetProvider>
    </Router>
  );
};

export default AppWithAdapters;
