
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { Spinner } from '@/components/ui/spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requiredRole?: string;
  requirePremium?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false,
  requiredRole,
  requirePremium = false
}) => {
  const { user, isLoading, userRole, isPremium, isAuthenticated, refreshUserProfile } = useAuth();
  const location = useLocation();

  // Refresh user profile on mount to ensure we have the latest data
  useEffect(() => {
    if (isAuthenticated) {
      refreshUserProfile();
    }
  }, [isAuthenticated, refreshUserProfile]);
  
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
