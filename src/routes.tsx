
import React, { Suspense } from 'react';
import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';

// Import pages
import HomePage from './pages/index';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';

// Lazy load other pages for better performance
const Flashcards = React.lazy(() => import('./pages/Flashcards'));
const MultipleChoice = React.lazy(() => import('./pages/MultipleChoice'));
const Writing = React.lazy(() => import('./pages/Writing'));
const Speaking = React.lazy(() => import('./pages/Speaking'));
const ItalianPractice = React.lazy(() => import('./pages/ItalianPractice'));
const CitizenshipTest = React.lazy(() => import('./pages/CitizenshipTest'));
const UserProfile = React.lazy(() => import('./pages/UserProfile'));
const Analytics = React.lazy(() => import('./pages/Analytics'));
const Support = React.lazy(() => import('./pages/Support'));

// Layout components
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Loading component to show while lazy-loaded components are being fetched
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="flex flex-col items-center gap-2">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

// Auth guard for protected routes
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Guest route - redirects to dashboard if already authenticated
interface GuestRouteProps {
  children: React.ReactNode;
}

const GuestRoute: React.FC<GuestRouteProps> = ({ children }) => {
  const { user } = useAuth();
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const Routes = () => {
  return (
    <RouterRoutes>
      {/* Public routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        
        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route 
            path="login" 
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            } 
          />
          <Route 
            path="signup" 
            element={
              <GuestRoute>
                <Signup />
              </GuestRoute>
            } 
          />
        </Route>
        
        {/* Protected routes */}
        <Route 
          path="dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="flashcards" 
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingFallback />}>
                <Flashcards />
              </Suspense>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="multiple-choice" 
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingFallback />}>
                <MultipleChoice />
              </Suspense>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="writing" 
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingFallback />}>
                <Writing />
              </Suspense>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="speaking" 
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingFallback />}>
                <Speaking />
              </Suspense>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="italian-practice" 
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingFallback />}>
                <ItalianPractice />
              </Suspense>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="citizenship-test" 
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingFallback />}>
                <CitizenshipTest />
              </Suspense>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="profile" 
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingFallback />}>
                <UserProfile />
              </Suspense>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="analytics" 
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingFallback />}>
                <Analytics />
              </Suspense>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="support" 
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingFallback />}>
                <Support />
              </Suspense>
            </ProtectedRoute>
          } 
        />
        
        <Route path="*" element={<NotFound />} />
      </Route>
    </RouterRoutes>
  );
};

export default Routes;
