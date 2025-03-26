import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import RootLayout from '@/layouts/RootLayout';
import UserManagement from '@/pages/admin/UserManagement';
import ContentPage from '@/pages/ContentPage';
import ContentUploader from '@/pages/admin/ContentUploader';

// Other imports as needed

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Helmet titleTemplate="%s | Learning App" defaultTitle="Learning App" />
            <Routes>
              <Route path="/" element={<RootLayout />}>
                <Route index element={<ContentPage />} />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/admin/content-uploader" element={<ContentUploader />} />
                {/* Add other routes as needed */}
              </Route>
            </Routes>
            <Toaster />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
};

export default App;
