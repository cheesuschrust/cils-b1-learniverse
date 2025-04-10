
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '@/contexts/AuthContext';
import App from './App';

const AppWithAdapters: React.FC = () => {
  return (
    <HelmetProvider>
      <Router>
        <AuthProvider>
          <App />
        </AuthProvider>
      </Router>
    </HelmetProvider>
  );
};

export default AppWithAdapters;
