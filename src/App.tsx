
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './App.css';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/Footer';

// Main Pages
import Dashboard from './components/Dashboard';
import HomePage from './pages/HomePage';
import FeaturePage from './pages/FeaturePage';
import PricingPage from './pages/PricingPage';
import PrivacyPage from './pages/PrivacyPage';
import CheckoutPage from './pages/CheckoutPage';

// Learning Pages
import ExamPrepDashboard from './pages/exam/ExamPrepDashboard';
import FlashcardsPage from './pages/learning/FlashcardsPage';
import ListeningPracticePage from './pages/learning/ListeningPracticePage';
import ReadingPracticePage from './pages/learning/ReadingPracticePage';
import WritingExercisePage from './pages/learning/WritingExercisePage';
import SpeakingPracticePage from './pages/learning/SpeakingPracticePage';
import MockExamPage from './pages/exam/MockExamPage';
import StudyPlanPage from './pages/exam/StudyPlanPage';

// Gamification
import GamificationDashboard from './pages/dashboard/GamificationDashboard';

// User Pages
import ProfilePage from './pages/user/ProfilePage';
import SettingsPage from './pages/user/SettingsPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import AuthCallback from './pages/auth/AuthCallback';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import ContentManagement from './pages/admin/ContentManagement';
import AIConfigurator from './pages/admin/AIConfigurator';
import AnalyticsDashboard from './pages/admin/AnalyticsDashboard';
import SubscriptionManagement from './pages/admin/SubscriptionManagement';
import SupportTickets from './pages/admin/SupportTickets';

// Contexts
import { ExamProvider } from './contexts/ExamContext';
import { AuthProvider } from './contexts/EnhancedAuthContext';
import AIModelProvider from './contexts/AIModelContext';

// Auth Components
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <ExamProvider>
            <AIModelProvider>
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  <Routes>
                    {/* Marketing Pages */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/features" element={<FeaturePage />} />
                    <Route path="/pricing" element={<PricingPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    
                    {/* Auth Pages */}
                    <Route path="/auth/login" element={<LoginPage />} />
                    <Route path="/auth/register" element={<RegisterPage />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                    
                    {/* Protected Routes */}
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/gamification" element={
                      <ProtectedRoute>
                        <GamificationDashboard />
                      </ProtectedRoute>
                    } />
                    
                    {/* Learning Pages */}
                    <Route path="/exam-prep" element={
                      <ProtectedRoute>
                        <ExamPrepDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/flashcards" element={
                      <ProtectedRoute>
                        <FlashcardsPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/practice/listening" element={
                      <ProtectedRoute>
                        <ListeningPracticePage />
                      </ProtectedRoute>
                    } />
                    <Route path="/practice/reading" element={
                      <ProtectedRoute>
                        <ReadingPracticePage />
                      </ProtectedRoute>
                    } />
                    <Route path="/practice/writing" element={
                      <ProtectedRoute>
                        <WritingExercisePage />
                      </ProtectedRoute>
                    } />
                    <Route path="/practice/speaking" element={
                      <ProtectedRoute>
                        <SpeakingPracticePage />
                      </ProtectedRoute>
                    } />
                    <Route path="/mock-exam" element={
                      <ProtectedRoute>
                        <MockExamPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/study-plan" element={
                      <ProtectedRoute>
                        <StudyPlanPage />
                      </ProtectedRoute>
                    } />
                    
                    {/* User Pages */}
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    } />
                    <Route path="/settings" element={
                      <ProtectedRoute>
                        <SettingsPage />
                      </ProtectedRoute>
                    } />
                    
                    {/* Admin Pages */}
                    <Route path="/admin" element={
                      <ProtectedRoute requireAdmin>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/users" element={
                      <ProtectedRoute requireAdmin>
                        <UserManagement />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/content" element={
                      <ProtectedRoute requireAdmin>
                        <ContentManagement />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/ai" element={
                      <ProtectedRoute requireAdmin>
                        <AIConfigurator />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/analytics" element={
                      <ProtectedRoute requireAdmin>
                        <AnalyticsDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/subscriptions" element={
                      <ProtectedRoute requireAdmin>
                        <SubscriptionManagement />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/support" element={
                      <ProtectedRoute requireAdmin>
                        <SupportTickets />
                      </ProtectedRoute>
                    } />
                  </Routes>
                </main>
                <Footer />
              </div>
            </AIModelProvider>
          </ExamProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
