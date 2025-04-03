
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { Spinner } from '@/components/ui/spinner';
import useOnlineStatus from '@/hooks/useOnlineStatus';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requiredRole?: string;
  requirePremium?: boolean;
  offlineAccessible?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false,
  requiredRole,
  requirePremium = false,
  offlineAccessible = false
}) => {
  const { user, isLoading, userRole, isPremium, isAuthenticated, refreshUserProfile } = useAuth();
  const location = useLocation();
  const isOnline = useOnlineStatus();
  const [hasOfflineAccess, setHasOfflineAccess] = useState<boolean>(false);
  
  // Check if user previously accessed this route while online (for offline access)
  useEffect(() => {
    if (offlineAccessible && location.pathname) {
      try {
        // Get offline accessible routes from localStorage
        const offlineRoutes = JSON.parse(localStorage.getItem('offlineAccessibleRoutes') || '[]');
        setHasOfflineAccess(offlineRoutes.includes(location.pathname));
        
        // If user is online and authenticated, add this route to offline accessible routes
        if (isOnline && isAuthenticated && offlineAccessible) {
          if (!offlineRoutes.includes(location.pathname)) {
            offlineRoutes.push(location.pathname);
            localStorage.setItem('offlineAccessibleRoutes', JSON.stringify(offlineRoutes));
          }
        }
      } catch (error) {
        console.error('Error checking offline access:', error);
        setHasOfflineAccess(false);
      }
    }
  }, [offlineAccessible, isOnline, isAuthenticated, location.pathname]);

  // Refresh user profile on mount to ensure we have the latest data
  useEffect(() => {
    if (isAuthenticated && isOnline) {
      refreshUserProfile();
    }
  }, [isAuthenticated, refreshUserProfile, isOnline]);
  
  // Show loading UI while checking auth state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Spinner size="lg" className="mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Offline mode handling
  if (!isOnline) {
    // If route is accessible offline and user had previous access
    if (offlineAccessible && hasOfflineAccess) {
      return (
        <>
          <Alert variant="warning" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Offline Mode</AlertTitle>
            <AlertDescription>
              You're viewing cached content. Some features may be limited until you're back online.
            </AlertDescription>
          </Alert>
          {children}
        </>
      );
    } else {
      // Not accessible offline
      return (
        <div className="container mx-auto py-8 px-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Internet Connection Required</AlertTitle>
            <AlertDescription>
              This section requires an internet connection. Please connect to the internet and try again.
            </AlertDescription>
          </Alert>
        </div>
      );
    }
  }

  // If not authenticated, redirect to login with return URL
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If requireAdmin is true and user is not admin, redirect to home
  if (requireAdmin && userRole !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  // If requiredRole is specified and user doesn't have that role, redirect to home
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // If requirePremium is true and user is not premium, redirect to subscription page
  if (requirePremium && !isPremium) {
    return <Navigate to="/subscription" state={{ from: location.pathname }} replace />;
  }

  // If all checks pass, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
