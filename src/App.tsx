
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { FlashcardsProvider } from '@/contexts/FlashcardsContext';
import { Toaster } from '@/components/ui/toaster';

// Auth Pages
import AuthLayout from '@/pages/auth/AuthLayout';
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';
import VerifyEmailPage from '@/pages/auth/VerifyEmailPage';

// Protected Pages
import DashboardPage from '@/pages/dashboard/DashboardPage';
import ReadingPage from '@/pages/learning/ReadingPage';
import WritingPage from '@/pages/learning/WritingPage';
import SpeakingPage from '@/pages/learning/SpeakingPage';
import ListeningPage from '@/pages/learning/ListeningPage';
import FlashcardsPage from '@/pages/learning/FlashcardsPage';
import UserProfilePage from '@/pages/profile/UserProfilePage';
import SubscriptionPage from '@/pages/subscription/SubscriptionPage';

// Components
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Layout Components
import MainLayout from '@/components/layout/MainLayout';
import LandingPage from '@/pages/LandingPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <FlashcardsProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Auth routes */}
            <Route path="/auth" element={<AuthLayout />}>
              <Route index element={<Navigate to="/auth/login" replace />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="signup" element={<SignupPage />} />
              <Route path="forgot-password" element={<ForgotPasswordPage />} />
              <Route path="reset-password" element={<ResetPasswordPage />} />
              <Route path="verify-email" element={<VerifyEmailPage />} />
            </Route>
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="profile" element={<UserProfilePage />} />
              <Route path="subscription" element={<SubscriptionPage />} />
              
              {/* Learning routes */}
              <Route path="reading" element={<ReadingPage />} />
              <Route path="writing" element={<WritingPage />} />
              <Route path="speaking" element={<SpeakingPage />} />
              <Route path="listening" element={<ListeningPage />} />
              <Route path="flashcards" element={<FlashcardsPage />} />
              
              {/* Premium routes */}
              <Route path="premium" element={
                <ProtectedRoute requirePremium>
                  <div className="container py-8">
                    <h1 className="text-3xl font-bold">Premium Content</h1>
                    <p className="mt-4">This is premium content only available to premium subscribers.</p>
                  </div>
                </ProtectedRoute>
              } />
            </Route>
            
            {/* Catch all - 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster />
        </FlashcardsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
