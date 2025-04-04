
import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { Spinner } from '@/components/ui/spinner';

// Layouts
const MainLayout = lazy(() => import('@/layouts/MainLayout'));

// Pages
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const SpeakingPage = lazy(() => import('@/pages/SpeakingPage'));
const ItalianCitizenshipTest = lazy(() => import('@/pages/ItalianCitizenshipTest'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const SignupPage = lazy(() => import('@/pages/auth/SignupPage'));

// Loading fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <Spinner size="lg" />
  </div>
);

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="italianmaster-theme">
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Main App Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="speaking" element={<SpeakingPage />} />
            <Route path="italian-citizenship-test" element={<ItalianCitizenshipTest />} />
            
            {/* Add more routes here */}
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </Suspense>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
