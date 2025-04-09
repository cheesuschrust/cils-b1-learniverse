
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  
  // Check if user is an admin (simplified implementation)
  // In a real app, you would fetch roles from the database
  const isAdmin = user?.email?.includes('admin') || false;

  if (isLoading) {
    // Show loading indicator while checking auth status
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Verifying your credentials...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/auth/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    // Redirect to dashboard if admin access is required but user is not an admin
    return <Navigate to="/dashboard" replace />;
  }

  // Render children if all conditions pass
  return <>{children}</>;
};

export default ProtectedRoute;
