
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
import SignupPage from './pages/auth/SignupPage';

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
import { AuthProvider } from './contexts/AuthContext';
import AIModelProvider from './contexts/AIModelContext';

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
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    
                    {/* User Dashboard */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/gamification" element={<GamificationDashboard />} />
                    
                    {/* Learning Pages */}
                    <Route path="/exam-prep" element={<ExamPrepDashboard />} />
                    <Route path="/flashcards" element={<FlashcardsPage />} />
                    <Route path="/practice/listening" element={<ListeningPracticePage />} />
                    <Route path="/practice/reading" element={<ReadingPracticePage />} />
                    <Route path="/practice/writing" element={<WritingExercisePage />} />
                    <Route path="/practice/speaking" element={<SpeakingPracticePage />} />
                    <Route path="/mock-exam" element={<MockExamPage />} />
                    <Route path="/study-plan" element={<StudyPlanPage />} />
                    
                    {/* User Pages */}
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    
                    {/* Admin Pages */}
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/users" element={<UserManagement />} />
                    <Route path="/admin/content" element={<ContentManagement />} />
                    <Route path="/admin/ai" element={<AIConfigurator />} />
                    <Route path="/admin/analytics" element={<AnalyticsDashboard />} />
                    <Route path="/admin/subscriptions" element={<SubscriptionManagement />} />
                    <Route path="/admin/support" element={<SupportTickets />} />
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
