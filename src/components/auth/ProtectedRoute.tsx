
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requiredRole?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false,
  requiredRole
}) => {
  const { user, isLoading, session } = useAuth();
  const isAuthenticated = !!user;
  
  // Check if user has admin role using a function that works with our context
  const checkIsAdmin = async () => {
    try {
      // This would call Supabase RPC function
      const { data, error } = await supabase.rpc('is_admin');
      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
  };

  // Check if user has a specific role
  const checkHasRole = async (role: string) => {
    try {
      const { data, error } = await supabase.rpc('has_role', { _role: role });
      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error(`Error checking role ${role}:`, error);
      return false;
    }
  };

  // Show loading UI while checking auth state
  if (isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <Skeleton className="h-12 w-1/3 mb-6" />
        <Skeleton className="h-4 w-full mb-4" />
        <Skeleton className="h-4 w-full mb-4" />
        <Skeleton className="h-4 w-3/4 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If requireAdmin is true and user is not admin, redirect to home
  if (requireAdmin) {
    const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);
    
    React.useEffect(() => {
      const verifyAdmin = async () => {
        const adminStatus = await checkIsAdmin();
        setIsAdmin(adminStatus);
      };
      
      verifyAdmin();
    }, []);
    
    // Still checking admin status
    if (isAdmin === null) {
      return (
        <div className="p-8 max-w-7xl mx-auto">
          <Skeleton className="h-12 w-1/3 mb-6" />
          <Skeleton className="h-4 w-full mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      );
    }
    
    // Not admin, redirect to home
    if (!isAdmin) {
      return <Navigate to="/" replace />;
    }
  }
  
  // If requiredRole is specified and user doesn't have that role, redirect to home
  if (requiredRole) {
    const [hasRole, setHasRole] = React.useState<boolean | null>(null);
    
    React.useEffect(() => {
      const verifyRole = async () => {
        const roleStatus = await checkHasRole(requiredRole);
        setHasRole(roleStatus);
      };
      
      verifyRole();
    }, [requiredRole]);
    
    // Still checking role
    if (hasRole === null) {
      return (
        <div className="p-8 max-w-7xl mx-auto">
          <Skeleton className="h-12 w-1/3 mb-6" />
          <Skeleton className="h-4 w-full mb-4" />
        </div>
      );
    }
    
    // Doesn't have required role, redirect to home
    if (!hasRole) {
      return <Navigate to="/" replace />;
    }
  }

  // If all checks pass, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
