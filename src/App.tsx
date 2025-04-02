
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import EnhancedAuthLayout from './layouts/EnhancedAuthLayout';
import routes from './routes';
import EnhancedErrorBoundary from './components/common/EnhancedErrorBoundary';
import FeedbackWidget from './components/feedback/FeedbackWidget';
import { AIUtilsProvider } from './contexts/AIUtilsContext';
import { AuthProvider } from './contexts/EnhancedAuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import UnauthorizedPage from './pages/auth/UnauthorizedPage';

// Learning Pages
import DashboardPage from './pages/dashboard/DashboardPage';
import FlashcardsPage from './pages/learning/FlashcardsPage';
import ListeningPage from './pages/learning/ListeningPage';
import ReadingPage from './pages/learning/ReadingPage';
import WritingPage from './pages/learning/WritingPage';
import SpeakingPage from './pages/learning/SpeakingPage';

// Import global styles
import './styles/card-flip.css';

function App() {
  const handleFeedbackSubmit = (feedback: { type: string; message: string }) => {
    // In a real app, this would send the feedback to a server
    console.log('Feedback submitted:', feedback);
  };

  return (
    <EnhancedErrorBoundary>
      <AuthProvider>
        <AIUtilsProvider>
          <Routes>
            {/* Auth Routes */}
            <Route path="/auth" element={<EnhancedAuthLayout />}>
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="forgot-password" element={<ForgotPasswordPage />} />
              <Route path="reset-password" element={<ResetPasswordPage />} />
            </Route>
            
            {/* Unauthorized Page */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={
                <MainLayout>
                  <DashboardPage />
                </MainLayout>
              } />
              
              <Route path="/flashcards" element={
                <MainLayout>
                  <FlashcardsPage />
                </MainLayout>
              } />
              
              <Route path="/listening" element={
                <MainLayout>
                  <ListeningPage />
                </MainLayout>
              } />
              
              <Route path="/reading" element={
                <MainLayout>
                  <ReadingPage />
                </MainLayout>
              } />
              
              <Route path="/writing" element={
                <MainLayout>
                  <WritingPage />
                </MainLayout>
              } />
              
              <Route path="/speaking" element={
                <MainLayout>
                  <SpeakingPage />
                </MainLayout>
              } />
              
              <Route path="/progress" element={
                <MainLayout>
                  <div>Progress Content</div>
                </MainLayout>
              } />
            </Route>
            
            {/* Public Routes */}
            <Route path="/" element={
              <MainLayout>
                {routes.find(route => route.path === '/')?.element}
              </MainLayout>
            } />
            
            <Route path="/about" element={
              <MainLayout>
                <div>About Content</div>
              </MainLayout>
            } />
            
            <Route path="/contact" element={
              <MainLayout>
                <div>Contact Content</div>
              </MainLayout>
            } />
            
            <Route path="/terms" element={
              <MainLayout>
                <div>Terms Content</div>
              </MainLayout>
            } />
            
            <Route path="/privacy" element={
              <MainLayout>
                <div>Privacy Content</div>
              </MainLayout>
            } />
            
            {/* 404 Page */}
            <Route path="*" element={
              <MainLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                  <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
                  <p className="mt-4 text-muted-foreground">The page you're looking for doesn't exist.</p>
                </div>
              </MainLayout>
            } />
          </Routes>
          <FeedbackWidget onSubmit={handleFeedbackSubmit} />
        </AIUtilsProvider>
      </AuthProvider>
    </EnhancedErrorBoundary>
  );
}

export default App;
