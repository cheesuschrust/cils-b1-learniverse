
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { user, isAuthenticated, isLoading, refreshSession } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  const [hasShownToast, setHasShownToast] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(true);

  // Try to refresh the session when the component mounts
  useEffect(() => {
    const checkAuthentication = async () => {
      setIsRefreshing(true);
      if (!isAuthenticated && !isLoading) {
        try {
          await refreshSession();
        } catch (error) {
          console.error("Error refreshing session:", error);
        }
      }
      setIsRefreshing(false);
    };
    
    checkAuthentication();
  }, [isAuthenticated, isLoading, refreshSession]);

  // Handle toast notifications in useEffect, not during render
  useEffect(() => {
    // Only show notifications if we're done loading and not authenticated
    if (!isLoading && !isRefreshing && !isAuthenticated && !hasShownToast) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access this page.",
        variant: "destructive",
      });
      setHasShownToast(true);
    }

    // Show admin access denied toast if needed
    if (!isLoading && !isRefreshing && isAuthenticated && requireAdmin && user?.role !== "admin" && !hasShownToast) {
      toast({
        title: "Access Denied",
        description: "You need administrator privileges to access this page.",
        variant: "destructive",
      });
      setHasShownToast(true);
    }
  }, [isLoading, isRefreshing, isAuthenticated, user, requireAdmin, toast, hasShownToast]);

  // Show loading state while checking authentication
  if (isLoading || isRefreshing) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Verifying your session...</span>
      </div>
    );
  }

  // For additional security, verify authentication before allowing access to protected routes
  if (!isAuthenticated) {
    // Store the current location to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && user?.role !== "admin") {
    // If admin access is required but user is not an admin
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
