
import React, { useEffect } from 'react';
import { useRoutes, useLocation } from 'react-router-dom';
import routes from './routes';
import { useTheme } from '@/components/ui/theme-provider';
import { useAuth } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { setupNetworkListeners } from './serviceWorkerRegistration';
import { useToast } from '@/hooks/use-toast';
import { errorMonitoring } from '@/utils/errorMonitoring';
import { useSystemLog } from '@/hooks/use-system-log';
import { SkipToContent } from './components/accessibility/SkipToContent';
import { Helmet } from 'react-helmet-async';

// Add keyboard navigation handler
function KeyboardNavigationHandler() {
  useEffect(() => {
    // Function to handle keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Tab key to show focus outlines
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    };
    
    // Function to handle mouse events
    const handleMouseDown = () => {
      document.body.classList.remove('keyboard-navigation');
    };
    
    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleMouseDown);
    
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);
  
  return null;
}

// Scroll to top on page change component
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    // Only automatically scroll to top if the user hasn't scrolled down
    if (window.scrollY === 0) {
      window.scrollTo(0, 0);
    }
    
    // Find an element with id="content" to focus on route change
    const contentElement = document.getElementById('content');
    if (contentElement) {
      contentElement.focus();
    }
  }, [pathname]);
  
  return null;
}

// Page View Logger
function PageViewLogger() {
  const location = useLocation();
  const { logNavigation } = useSystemLog();
  
  useEffect(() => {
    // Log page view
    logNavigation(location.pathname);
    
    // Add page view to browser history for better back button behavior
    window.history.replaceState(
      { ...window.history.state, scrollY: window.scrollY },
      document.title
    );
  }, [location.pathname, logNavigation]);
  
  return null;
}

// Online/Offline Status Handler
function NetworkStatusHandler() {
  const { toast } = useToast();
  
  useEffect(() => {
    return setupNetworkListeners(
      // Online handler
      () => {
        toast({
          title: "Back online",
          description: "Your connection has been restored.",
        });
      },
      // Offline handler
      () => {
        toast({
          title: "You're offline",
          description: "Some features may be limited until your connection is restored.",
          variant: "destructive",
        });
      }
    );
  }, [toast]);
  
  return null;
}

// Error Boundary for uncaught error logging
class ErrorLogger extends React.Component<{ children: React.ReactNode }> {
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    errorMonitoring.captureError(error, info.componentStack, 'ui');
  }
  
  render() {
    return this.props.children;
  }
}

function App() {
  const routing = useRoutes(routes);
  const { theme } = useTheme();
  const { user } = useAuth();
  
  // Set data theme for dark mode
  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute('data-theme', theme);
    
    // Additional accessibility attributes
    root.setAttribute('lang', 'en');
  }, [theme]);
  
  return (
    <ErrorLogger>
      <Helmet>
        <meta name="theme-color" content={theme === 'dark' ? '#1a1b1e' : '#ffffff'} />
        <meta name="color-scheme" content={theme} />
      </Helmet>
      
      <SkipToContent />
      
      {/* Inject screen-reader only description of the current state */}
      <div className="sr-only" aria-live="polite">
        {user ? `You are logged in as ${user.email}` : 'You are not logged in'}
        {navigator.onLine ? '' : ' You are currently offline.'}
      </div>
      
      {/* Router outlet */}
      <main id="content" tabIndex={-1}>
        {routing}
      </main>
      
      {/* Helper components */}
      <KeyboardNavigationHandler />
      <ScrollToTop />
      <PageViewLogger />
      <NetworkStatusHandler />
      
      <Toaster />
    </ErrorLogger>
  );
}

export default App;
