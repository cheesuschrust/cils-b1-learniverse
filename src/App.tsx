import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { AuthProvider } from '@/contexts/EnhancedAuthContext';
import { NotificationsProvider } from '@/contexts/NotificationsContext';
import { Toaster } from '@/components/ui/toaster';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AIProvider } from '@/contexts/AIContext';
import ContentManagement from './pages/admin/ContentManagement';

const HomePage = lazy(() => import('@/pages/Home'));
const PricingPage = lazy(() => import('@/pages/Pricing'));
const ContactPage = lazy(() => import('@/pages/Contact'));
const AboutPage = lazy(() => import('@/pages/About'));
const TermsPage = lazy(() => import('@/pages/Terms'));
const PrivacyPage = lazy(() => import('@/pages/Privacy'));
const NotFoundPage = lazy(() => import('@/pages/NotFound'));
const LoginPage = lazy(() => import('@/pages/auth/Login'));
const RegisterPage = lazy(() => import('@/pages/auth/Register'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPassword'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPassword'));
const AuthCallbackPage = lazy(() => import('@/pages/auth/AuthCallback'));
const DashboardPage = lazy(() => import('@/pages/Dashboard'));
const ProfilePage = lazy(() => import('@/pages/Profile'));
const SettingsPage = lazy(() => import('@/pages/Settings'));
const FlashcardsPage = lazy(() => import('@/pages/Flashcards'));
const ReadingPage = lazy(() => import('@/pages/reading/index'));
const ReadingExercise = lazy(() => import('@/pages/reading/ReadingExercise'));
const ReadingPractice = lazy(() => import('@/pages/reading/practice'));
const ReadingHistory = lazy(() => import('@/pages/reading/history'));
const ListeningPage = lazy(() => import('@/pages/Listening'));
const SpeakingPage = lazy(() => import('@/pages/Speaking'));
const MockExamPage = lazy(() => import('@/pages/exam/MockExamPage'));
const AdminDashboardPage = lazy(() => import('@/pages/admin/Dashboard'));
const DailyQuestionPage = lazy(() => import('@/pages/DailyQuestion'));
const PracticePage = lazy(() => import('@/pages/Practice'));
const AchievementsPage = lazy(() => import('@/pages/Achievements'));
const ProgressPage = lazy(() => import('@/pages/Progress'));
const ChatPage = lazy(() => import('@/pages/Chat'));
const AITutorPage = lazy(() => import('@/pages/AITutor'));

function App() {
  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <SiteHeader />
              <Suspense fallback={<div>Loading...</div>}>
                <HomePage />
              </Suspense>
              <SiteFooter />
            </>
          }
        />
        <Route
          path="/pricing"
          element={
            <>
              <SiteHeader />
              <Suspense fallback={<div>Loading...</div>}>
                <PricingPage />
              </Suspense>
              <SiteFooter />
            </>
          }
        />
        <Route
          path="/contact"
          element={
            <>
              <SiteHeader />
              <Suspense fallback={<div>Loading...</div>}>
                <ContactPage />
              </Suspense>
              <SiteFooter />
            </>
          }
        />
        <Route
          path="/about"
          element={
            <>
              <SiteHeader />
              <Suspense fallback={<div>Loading...</div>}>
                <AboutPage />
              </Suspense>
              <SiteFooter />
            </>
          }
        />
        <Route
          path="/terms"
          element={
            <>
              <SiteHeader />
              <Suspense fallback={<div>Loading...</div>}>
                <TermsPage />
              </Suspense>
              <SiteFooter />
            </>
          }
        />
        <Route
          path="/privacy"
          element={
            <>
              <SiteHeader />
              <Suspense fallback={<div>Loading...</div>}>
                <PrivacyPage />
              </Suspense>
              <SiteFooter />
            </>
          }
        />
        <Route
          path="/auth/login"
          element={
            <>
              <SiteHeader />
              <Suspense fallback={<div>Loading...</div>}>
                <LoginPage />
              </Suspense>
              <SiteFooter />
            </>
          }
        />
        <Route
          path="/auth/register"
          element={
            <>
              <SiteHeader />
              <Suspense fallback={<div>Loading...</div>}>
                <RegisterPage />
              </Suspense>
              <SiteFooter />
            </>
          }
        />
        <Route
          path="/auth/forgot-password"
          element={
            <>
              <SiteHeader />
              <Suspense fallback={<div>Loading...</div>}>
                <ForgotPasswordPage />
              </Suspense>
              <SiteFooter />
            </>
          }
        />
        <Route
          path="/auth/reset-password"
          element={
            <>
              <SiteHeader />
              <Suspense fallback={<div>Loading...</div>}>
                <ResetPasswordPage />
              </Suspense>
              <SiteFooter />
            </>
          }
        />
        <Route
          path="/auth/callback"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <AuthCallbackPage />
            </Suspense>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Suspense fallback={<div>Loading...</div>}>
                  <DashboardPage />
                </Suspense>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Suspense fallback={<div>Loading...</div>}>
                  <ProfilePage />
                </Suspense>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Suspense fallback={<div>Loading...</div>}>
                  <SettingsPage />
                </Suspense>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/flashcards"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Suspense fallback={<div>Loading...</div>}>
                  <FlashcardsPage />
                </Suspense>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        {/* Reading Section */}
        <Route path="/reading" element={<ReadingPage />} />
        <Route path="/reading/exercise/:exerciseId" element={<ReadingExercise />} />
        <Route path="/reading/practice" element={<ReadingPractice />} />
        <Route path="/reading/history" element={<ReadingHistory />} />
        <Route
          path="/listening"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Suspense fallback={<div>Loading...</div>}>
                  <ListeningPage />
                </Suspense>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/speaking"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Suspense fallback={<div>Loading...</div>}>
                  <SpeakingPage />
                </Suspense>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/exams"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Suspense fallback={<div>Loading...</div>}>
                  <MockExamPage />
                </Suspense>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requireAdmin={true}>
              <DashboardLayout>
                <Suspense fallback={<div>Loading...</div>}>
                  <AdminDashboardPage />
                </Suspense>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/daily-question"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Suspense fallback={<div>Loading...</div>}>
                  <DailyQuestionPage />
                </Suspense>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        {/*<Route
          path="/learning"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Suspense fallback={<div>Loading...</div>}>
                  <LearningPage />
                </Suspense>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />*/}
        <Route
          path="/practice"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Suspense fallback={<div>Loading...</div>}>
                  <PracticePage />
                </Suspense>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/achievements"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Suspense fallback={<div>Loading...</div>}>
                  <AchievementsPage />
                </Suspense>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Suspense fallback={<div>Loading...</div>}>
                  <ProgressPage />
                </Suspense>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Suspense fallback={<div>Loading...</div>}>
                  <ChatPage />
                </Suspense>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-tutor"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Suspense fallback={<div>Loading...</div>}>
                  <AITutorPage />
                </Suspense>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/content-management"
          element={<ContentManagement />}
        />
        <Route
          path="*"
          element={
            <>
              <SiteHeader />
              <Suspense fallback={<div>Loading...</div>}>
                <NotFoundPage />
              </Suspense>
              <SiteFooter />
            </>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
