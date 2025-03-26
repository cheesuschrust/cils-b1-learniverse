
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationsProvider } from '@/contexts/NotificationsContext';
import { GamificationProvider } from '@/contexts/GamificationContext';
import { UserPreferencesProvider } from '@/contexts/UserPreferencesContext';

// Pages
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Flashcards from './pages/Flashcards';
import MultipleChoice from './pages/MultipleChoice';
import Listening from './pages/Listening';
import Speaking from './pages/Speaking';
import Writing from './pages/Writing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';
import Achievements from './pages/Achievements';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import ContentUploader from './pages/admin/ContentUploader';
import AIManagement from './pages/admin/AIManagement';
import SystemSettings from './pages/admin/SystemSettings';
import SupportTickets from './pages/admin/SupportTickets';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UserPreferencesProvider>
          <NotificationsProvider>
            <GamificationProvider>
              <Router>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  
                  {/* Protected routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/flashcards" element={<Flashcards />} />
                    <Route path="/multiple-choice" element={<MultipleChoice />} />
                    <Route path="/listening" element={<Listening />} />
                    <Route path="/speaking" element={<Speaking />} />
                    <Route path="/writing" element={<Writing />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/achievements" element={<Achievements />} />
                  </Route>
                  
                  {/* Admin routes */}
                  <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']} />}>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="content" element={<ContentUploader />} />
                    <Route path="ai" element={<AIManagement />} />
                    <Route path="settings" element={<SystemSettings />} />
                    <Route path="support" element={<SupportTickets />} />
                  </Route>
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <ScrollToTop />
              </Router>
              <Toaster />
            </GamificationProvider>
          </NotificationsProvider>
        </UserPreferencesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

// Helper component to scroll to top on page changes
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

export default App;
