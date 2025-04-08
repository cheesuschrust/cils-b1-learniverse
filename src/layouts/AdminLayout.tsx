
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import AdminNavigation from '@/components/navigation/AdminNavigation';
import AdminHeader from '@/components/layout/AdminHeader';

const AdminLayout: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const { data, error } = await supabase.rpc('is_admin');
        
        if (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
          navigate('/');
          return;
        }
        
        setIsAdmin(!!data);
        if (!data) {
          navigate('/');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user, navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex">
            <div className="w-64 mr-8">
              <Skeleton className="h-12 w-full mb-6" />
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full mb-2" />
              ))}
            </div>
            <div className="flex-1">
              <Skeleton className="h-16 w-full mb-8" />
              <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-40 w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isAdmin === false) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AdminHeader toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <div className={`fixed md:relative w-64 h-[calc(100vh-4rem)] shadow-md transition-all duration-300 ease-in-out z-20 top-16 ${
          isSidebarOpen ? 'left-0' : '-left-64 md:left-0'
        }`}>
          <div className="h-full bg-background border-r overflow-y-auto p-4">
            <AdminNavigation />
            
            <div className="mt-auto pt-4 border-t border-border">
              <Link to="/">
                <Button variant="outline" className="w-full justify-start">
                  <Home className="mr-2 h-5 w-5" />
                  Return to App
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 p-4 md:p-8 overflow-auto ml-0 md:ml-64">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
