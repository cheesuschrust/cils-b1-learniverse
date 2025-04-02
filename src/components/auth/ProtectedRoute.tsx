
import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requirePremium?: boolean;
}

const ProtectedRoute = ({
  children,
  requireAuth = true,
  requirePremium = false
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, isPremium } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        // Redirect to login if not authenticated
        navigate('/auth/login', {
          state: { from: location.pathname }
        });
      } else if (requirePremium && !isPremium) {
        // Redirect to premium subscription page if premium content is requested
        navigate('/subscription', {
          state: { from: location.pathname }
        });
      }
    }
  }, [isAuthenticated, isLoading, isPremium, navigate, location.pathname, requireAuth, requirePremium]);

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // If not authenticated and we require auth, don't render children
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // If not premium and we require premium, don't render children
  if (requirePremium && !isPremium) {
    return null;
  }

  // Render children if all conditions are met
  return <>{children}</>;
};

export default ProtectedRoute;
