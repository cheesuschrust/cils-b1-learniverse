
import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import NotFound from '@/pages/NotFound';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminLayout from '@/layouts/AdminLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import UserManagement from '@/pages/admin/UserManagement';
import AIManagement from '@/pages/admin/AIManagement';
import UserProfile from '@/pages/UserProfile';
import EmailVerification from '@/pages/EmailVerification';
import FlashcardsPage from '@/pages/Flashcards';
import MultipleChoicePage from '@/pages/MultipleChoice';
import WritingPage from '@/pages/Writing';
import SpeakingPage from '@/pages/Speaking';
import ListeningPage from '@/pages/Listening';
import Analytics from '@/pages/Analytics';
import Achievements from '@/pages/Achievements';
import Settings from '@/pages/Settings';
import AIAssistant from '@/pages/AIAssistant';
import { Toaster } from '@/components/ui/toaster';
import { AIUtilsProvider } from '@/contexts/AIUtilsContext';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { GamificationProvider } from '@/contexts/GamificationContext';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import FeedbackWidget from '@/components/feedback/FeedbackWidget';
import HelpDocumentation from '@/components/help/HelpDocumentation';
import { useAuth } from '@/contexts/AuthContext';
import { errorReporting, ErrorCategory, ErrorSeverity } from '@/utils/errorReporting';
import './App.css';

function App() {
  const { user } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const location = useLocation();
  
  // Check if the user needs to see onboarding
  useEffect(() => {
    if (user && user.completed_onboarding === false) {
      setShowOnboarding(true);
    }
  }, [user]);
  
  // Track page views for analytics
  useEffect(() => {
    // Log page view for analytics
    const pageName = location.pathname || '/';
    console.log(`Page view: ${pageName}`);
    
    // In a real app, you would call your analytics service here
    // Example: analytics.logPageView(pageName);
    
    // Reset any error states when navigating
    const handleError = (error: Error) => {
      errorReporting.captureError(
        error,
        ErrorSeverity.HIGH,
        ErrorCategory.UNKNOWN,
        { route: location.pathname }
      );
    };
    
    // Listen for errors
    window.addEventListener('error', (event) => handleError(event.error));
    
    return () => {
      window.removeEventListener('error', (event) => handleError(event.error));
    };
  }, [location]);
  
  // Handle onboarding completion
  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };
  
  // Handle feedback submission
  const handleFeedbackSubmit = async (feedback: { type: string; message: string }) => {
    // In a real app, you would send this to your backend
    console.log('Feedback submitted:', feedback);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return true;
  };

  return (
    <ThemeProvider defaultTheme="light">
      <ErrorBoundary>
        <AIUtilsProvider>
          <GamificationProvider>
            <div className="App">
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/email-verification/:token" element={<EmailVerification />} />
                <Route path="*" element={<NotFound />} />

                {/* Protected routes */}
                <Route element={<ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>}>
                  <Route path="/" element={
                    <ErrorBoundary>
                      <Dashboard />
                    </ErrorBoundary>
                  } />
                  <Route path="/profile" element={
                    <ErrorBoundary>
                      <UserProfile />
                    </ErrorBoundary>
                  } />
                  <Route path="/flashcards" element={
                    <ErrorBoundary>
                      <FlashcardsPage />
                    </ErrorBoundary>
                  } />
                  <Route path="/multiple-choice" element={
                    <ErrorBoundary>
                      <MultipleChoicePage />
                    </ErrorBoundary>
                  } />
                  <Route path="/writing" element={
                    <ErrorBoundary>
                      <WritingPage />
                    </ErrorBoundary>
                  } />
                  <Route path="/speaking" element={
                    <ErrorBoundary>
                      <SpeakingPage />
                    </ErrorBoundary>
                  } />
                  <Route path="/listening" element={
                    <ErrorBoundary>
                      <ListeningPage />
                    </ErrorBoundary>
                  } />
                  <Route path="/analytics" element={
                    <ErrorBoundary>
                      <Analytics />
                    </ErrorBoundary>
                  } />
                  <Route path="/achievements" element={
                    <ErrorBoundary>
                      <Achievements />
                    </ErrorBoundary>
                  } />
                  <Route path="/settings" element={
                    <ErrorBoundary>
                      <Settings />
                    </ErrorBoundary>
                  } />
                  <Route path="/ai-assistant" element={
                    <ErrorBoundary>
                      <AIAssistant />
                    </ErrorBoundary>
                  } />
                </Route>

                {/* Admin routes */}
                <Route element={<ProtectedRoute allowedRoles={["admin"]}>
                  <AdminLayout />
                </ProtectedRoute>}>
                  <Route path="/admin/users" element={
                    <ErrorBoundary>
                      <UserManagement />
                    </ErrorBoundary>
                  } />
                  <Route path="/admin/ai" element={
                    <ErrorBoundary>
                      <AIManagement />
                    </ErrorBoundary>
                  } />
                </Route>

                {/* NotFound route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              
              {/* Onboarding flow */}
              <OnboardingFlow 
                isOpen={showOnboarding} 
                onComplete={handleOnboardingComplete} 
              />
              
              {/* Feedback widget */}
              <FeedbackWidget onSubmit={handleFeedbackSubmit} />
              
              {/* Help Documentation (visible on all pages) */}
              <HelpDocumentation />
              
              <Toaster />
            </div>
          </GamificationProvider>
        </AIUtilsProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
