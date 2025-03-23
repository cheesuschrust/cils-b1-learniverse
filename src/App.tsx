
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { UserPreferencesProvider } from '@/contexts/UserPreferencesContext';
import { Toaster } from '@/components/ui/toaster';
import NotFound from '@/pages/NotFound';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import ResetPassword from '@/pages/ResetPassword';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import AppLayout from '@/components/layout/AppLayout';
import LandingPage from '@/pages/LandingPage';
import AdminLayout from '@/components/layout/AdminLayout';
import AdminDashboard from '@/pages/admin/Dashboard';
import UserManagement from '@/pages/admin/UserManagement';
import ContentAnalysis from '@/pages/admin/ContentAnalysis';
import FileUploader from '@/pages/admin/FileUploader';
import EmailSettings from '@/pages/admin/EmailSettings';
import AdminSettings from '@/pages/admin/Settings';
import SupportPage from '@/pages/SupportPage';
import AdminSupportPage from '@/pages/admin/SupportPage';
import UserGuides from '@/pages/help/UserGuides';
import AdminGuide from '@/pages/admin/AdminGuide';
import QuestionBrowser from '@/pages/questions/QuestionBrowser';
import QuestionEditor from '@/pages/admin/QuestionEditor';
import Vocabulary from '@/pages/learning/Vocabulary';
import Grammar from '@/pages/learning/Grammar';
import ReadingComprehension from '@/pages/learning/ReadingComprehension';
import ListeningComprehension from '@/pages/learning/ListeningComprehension';
import WritingPractice from '@/pages/Writing';
import SpeakingPractice from '@/pages/Speaking';
import MockExam from '@/pages/exams/MockExam';
import ExamResults from '@/pages/exams/ExamResults';
import { Loader2 } from 'lucide-react';
import Flashcards from '@/pages/Flashcards';
import MultipleChoice from '@/pages/MultipleChoice';
import Listening from '@/pages/Listening';
import SystemLogs from '@/pages/admin/SystemLogs';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Admin route component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }
  
  if (!user || user.role !== 'admin') {
    return <Navigate to="/app/dashboard" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  // Listen for online/offline status
  useEffect(() => {
    const handleOnline = () => {
      console.log('Network connection restored');
    };
    
    const handleOffline = () => {
      console.log('Network connection lost');
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <UserPreferencesProvider>
            <BrowserRouter>
              <Helmet>
                <title>CILS B1 Learning Platform</title>
                <meta name="description" content="Prepare for the CILS B1 exam with comprehensive tools and resources." />
              </Helmet>
              
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                
                {/* Protected app routes */}
                <Route path="/app" element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }>
                  {/* Main routes */}
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="support" element={<SupportPage />} />
                  <Route path="guides" element={<UserGuides />} />
                  
                  {/* Learning routes */}
                  <Route path="vocabulary" element={<Vocabulary />} />
                  <Route path="grammar" element={<Grammar />} />
                  <Route path="reading" element={<ReadingComprehension />} />
                  <Route path="listening" element={<Listening />} />
                  
                  {/* Practice routes */}
                  <Route path="writing" element={<WritingPractice />} />
                  <Route path="speaking" element={<SpeakingPractice />} />
                  
                  {/* Question browser */}
                  <Route path="questions" element={<QuestionBrowser />} />
                  
                  {/* Interactive learning */}
                  <Route path="flashcards" element={<Flashcards />} />
                  <Route path="multiple-choice" element={<MultipleChoice />} />
                  
                  {/* Exam routes */}
                  <Route path="exams/mock" element={<MockExam />} />
                  <Route path="exams/results/:examId" element={<ExamResults />} />
                </Route>
                
                {/* Admin routes */}
                <Route path="/admin" element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="users" element={<UserManagement />} />
                  <Route path="content-analysis" element={<ContentAnalysis />} />
                  <Route path="file-uploader" element={<FileUploader />} />
                  <Route path="email-settings" element={<EmailSettings />} />
                  <Route path="settings" element={<AdminSettings />} />
                  <Route path="support" element={<AdminSupportPage />} />
                  <Route path="guide" element={<AdminGuide />} />
                  <Route path="questions/editor" element={<QuestionEditor />} />
                  <Route path="system-logs" element={<SystemLogs />} />
                </Route>
                
                {/* Redirect old dashboard path to new one */}
                <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
                
                {/* 404 route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              
              <Toaster />
            </BrowserRouter>
          </UserPreferencesProvider>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
