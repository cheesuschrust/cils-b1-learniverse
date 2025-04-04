
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Spinner } from '@/components/ui/spinner';

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export const AuthGuard = ({
  children,
  requireAuth = true,
  redirectTo = '/login'
}: AuthGuardProps) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !user) {
        // Redirect to login if auth is required but user is not logged in
        navigate(redirectTo, { replace: true });
      } else if (!requireAuth && user) {
        // Redirect to dashboard if auth is not required but user is logged in
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, isLoading, requireAuth, redirectTo, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // Show children only if auth requirements are met
  if ((requireAuth && user) || (!requireAuth && !user)) {
    return <>{children}</>;
  }

  // This should not be visible as we redirect, but just in case
  return null;
};

export default AuthGuard;
