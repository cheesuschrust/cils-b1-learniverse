
import React, { useEffect } from "react";
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

  // Try to refresh the session when the component mounts
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      refreshSession();
    }
  }, [isAuthenticated, isLoading, refreshSession]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Verifying your session...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Store the current location to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && user?.role !== "admin") {
    // If admin access is required but user is not an admin
    toast({
      title: "Access Denied",
      description: "You need administrator privileges to access this page.",
      variant: "destructive",
    });
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
