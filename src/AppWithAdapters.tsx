
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { HelmetWrapper } from '@/components/common/HelmetWrapper';
import { Toaster } from '@/components/ui/toaster';
import App from './App';

const AppWithAdapters: React.FC = () => {
  return (
    <Router>
      <HelmetWrapper>
        <AuthProvider>
          <App />
          <Toaster />
        </AuthProvider>
      </HelmetWrapper>
    </Router>
  );
};

export default AppWithAdapters;
