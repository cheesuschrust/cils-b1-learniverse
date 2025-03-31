import React, { useEffect, useState, Suspense } from 'react';  
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';  
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
import Index from '@/pages/Index';
import { errorReporting, ErrorCategory, ErrorSeverity } from '@/utils/errorReporting';  
import './App.css';  

const LoadingScreen = () => (  
  <div className="flex min-h-screen items-center justify-center bg-gray-50">  
    <div className="text-center">  
      <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading your experience...</h2>  
      <p className="text-gray-500">Please wait while we prepare your learning environment.</p>  
    </div>  
  </div>  
);  

function App() {  
  const { user, loading, error } = useAuth();  
  const [showOnboarding, setShowOnboarding] = useState(false);  
  const location = useLocation();  
  
  useEffect(() => {  
    console.log("Auth state:", { user, loading, error });  
  }, [user, loading, error]);  
  
  useEffect(() => {  
    if (user && user.preferences?.onboardingCompleted === false) {  
      setShowOnboarding(true);  
    }  
  }, [user]);  
  
  useEffect(() => {  
    const pageName = location.pathname || '/';  
    console.log(`Page view: ${pageName}`);  
    
    const handleError = (error: Error) => {  
      errorReporting.captureError(  
        error,  
        ErrorSeverity.HIGH,  
        ErrorCategory.UNKNOWN,  
        { route: location.pathname }  
      );  
    };  
    
    window.addEventListener('error', (event) => handleError(event.error));  
    
    return () => {  
      window.removeEventListener('error', (event) => handleError(event.error));  
    };  
  }, [location]);  
  
  const handleOnboardingComplete = () => {  
    setShowOnboarding(false);  
  };  
  
  const handleFeedbackSubmit = async (feedback: { type: string; message: string }) => {  
    console.log('Feedback submitted:', feedback);  
    
    await new Promise(resolve => setTimeout(resolve, 1000));  
    
    return true;  
  };  

  if (error) {  
    return (  
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">  
        <div className="max-w-md rounded-lg bg-white p-8 shadow-md">  
          <h1 className="mb-4 text-2xl font-bold text-red-600">Authentication Error</h1>  
          <p className="mb-4 text-gray-700">{typeof error === 'string' ? error : (error as any)?.message || "An unknown authentication error occurred"}</p>  
          <p className="text-sm text-gray-500">  
            Please refresh the page or try again later. If the problem persists, contact support.  
          </p>  
        </div>  
      </div>  
    );  
  }  

  return (  
    <ThemeProvider defaultTheme="light">  
      <ErrorBoundary>  
        <AIUtilsProvider>  
          <GamificationProvider>  
            <div className="App">  
              <Suspense fallback={<LoadingScreen />}>  
                <Routes>  
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />  
                  <Route path="/signup" element={<Signup />} />  
                  <Route path="/email-verification/:token" element={<EmailVerification />} />  
                  
                  <Route element={<ProtectedRoute>  
                    <DashboardLayout />  
                  </ProtectedRoute>}>  
                    <Route path="/dashboard" element={  
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

                  <Route path="*" element={<NotFound />} />  
                </Routes>  
              </Suspense>  
              
              <OnboardingFlow   
                isOpen={showOnboarding}   
                onComplete={handleOnboardingComplete}   
              />  
              
              <FeedbackWidget onSubmit={handleFeedbackSubmit} />  
              
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
