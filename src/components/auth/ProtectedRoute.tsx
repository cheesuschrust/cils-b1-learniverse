
import React, { useEffect, useState, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const refreshAttempted = useRef(false);
  const lastRefreshTime = useRef<number>(0);

  // Try to refresh the session when the component mounts, but only once
  useEffect(() => {
    const checkAuthentication = async () => {
      // Don't refresh too frequently - add 10 second minimum between refreshes
      const now = Date.now();
      const timeSinceLastRefresh = now - lastRefreshTime.current;
      const minRefreshInterval = 10000; // 10 seconds
      
      if (refreshAttempted.current && timeSinceLastRefresh < minRefreshInterval) {
        setIsRefreshing(false);
        return;
      }
      
      setIsRefreshing(true);
      refreshAttempted.current = true;
      lastRefreshTime.current = now;
      
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
    
    // Setup interval to periodically check authentication on active routes
    const intervalId = setInterval(() => {
      if (isAuthenticated) {
        refreshSession().catch(err => console.error("Background refresh error:", err));
      }
    }, 300000); // Check every 5 minutes
    
    // Clean up function
    return () => {
      clearInterval(intervalId);
    };
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
