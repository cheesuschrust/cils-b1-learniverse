
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { EnhancedAuthProvider } from '@/contexts/EnhancedAuthContext';
import LoginPage from '@/pages/Login';
import SignupPage from '@/pages/Signup';
import CitizenshipTest from '@/pages/CitizenshipTest';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Dashboard from '@/pages/Dashboard';
import { ThemeProvider } from '@/components/theme-provider';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <EnhancedAuthProvider>
        <Toaster />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/citizenship-test" 
            element={
              <ProtectedRoute>
                <CitizenshipTest />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </EnhancedAuthProvider>
    </ThemeProvider>
  );
}

export default App;
