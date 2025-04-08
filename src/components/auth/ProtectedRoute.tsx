
import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Spinner } from '@/components/ui/spinner';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
  redirectTo = '/login'
}) => {
  const { user, isLoading } = useAuth();
  
  // While authentication state is loading, show a loading spinner
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" className="text-primary" />
      </div>
    );
  }
  
  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }
  
  // For admin pages, check if user has admin role
  // In a real implementation, this would check the user's roles in the database
  if (requireAdmin) {
    // Placeholder check - in a real app, this would query backend for admin status
    const isAdmin = user.user_metadata?.role === 'admin';
    
    if (!isAdmin) {
      return <Navigate to="/" replace />;
    }
  }
  
  // User is authenticated and has required permissions
  return <>{children}</>;
};

export default ProtectedRoute;
