
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);
  const [loading, setLoading] = React.useState(requireAdmin);
  
  React.useEffect(() => {
    const checkAdminStatus = async () => {
      if (requireAdmin && user) {
        try {
          const { data, error } = await supabase.rpc('is_admin');
          
          if (error) {
            console.error('Error checking admin status:', error);
            setIsAdmin(false);
          } else {
            setIsAdmin(!!data);
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        } finally {
          setLoading(false);
        }
      }
    };

    checkAdminStatus();
  }, [user, requireAdmin]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
