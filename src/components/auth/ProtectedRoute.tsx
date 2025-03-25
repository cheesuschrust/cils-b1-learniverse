
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  adminOnly?: boolean; // Adding adminOnly as an alias for requireAdmin
}

/**
 * ProtectedRoute component
 * 
 * Ensures routes are only accessible by authenticated users with appropriate permissions.
 * Redirects unauthorized users to the login page, storing the current location for return after login.
 * Can restrict routes to admin users only.
 * 
 * @param {React.ReactNode} children - Components to render if access is granted
 * @param {boolean} requireAdmin - Whether the route requires admin access
 * @param {boolean} adminOnly - Alias for requireAdmin for readability
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false,
  adminOnly = false // Default value
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  // Use either requireAdmin or adminOnly for consistency
  const needsAdminRole = requireAdmin || adminOnly;

  // Show loading state while checking authentication
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    // Redirect to login and store the current location in state to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If admin access is required, check if the user is an admin
  if (needsAdminRole && user?.role !== 'admin') {
    // Redirect to dashboard if user is not an admin
    return <Navigate to="/dashboard" replace />;
  }

  // User is authenticated and has appropriate role, render children
  return <>{children}</>;
};

export default ProtectedRoute;
