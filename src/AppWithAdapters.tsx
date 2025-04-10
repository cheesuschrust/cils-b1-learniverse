
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { HelmetWrapper } from '@/components/common/HelmetWrapper';
import { ToastProvider } from '@/hooks/use-toast';
import App from './App';

const AppWithAdapters: React.FC = () => {
  return (
    <Router>
      <HelmetWrapper>
        <ToastProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ToastProvider>
      </HelmetWrapper>
    </Router>
  );
};

export default AppWithAdapters;
