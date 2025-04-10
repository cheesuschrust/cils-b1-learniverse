
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { HelmetWrapper } from '@/components/common/HelmetWrapper';
import App from './App';

const AppWithAdapters: React.FC = () => {
  return (
    <Router>
      <HelmetWrapper>
        <AuthProvider>
          <App />
        </AuthProvider>
      </HelmetWrapper>
    </Router>
  );
};

export default AppWithAdapters;
