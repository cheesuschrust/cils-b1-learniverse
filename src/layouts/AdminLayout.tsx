
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, FileText, BarChart, Settings, Database,
  Package, LifeBuoy, AlertCircle, Home, Bot, CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const AdminLayout: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-md p-4 flex flex-col">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-primary">Admin Dashboard</h1>
        </div>
        
        <nav className="flex-1 space-y-1">
          <Link to="/">
            <Button variant="ghost" className="w-full justify-start">
              <Home className="mr-2 h-5 w-5" />
              Return to App
            </Button>
          </Link>
          
          <Link to="/admin">
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-2 h-5 w-5" />
              Dashboard
            </Button>
          </Link>
          
          <Link to="/admin/users">
            <Button variant="ghost" className="w-full justify-start">
              <Users className="mr-2 h-5 w-5" />
              User Management
            </Button>
          </Link>
          
          <Link to="/admin/content">
            <Button variant="ghost" className="w-full justify-start">
              <FileText className="mr-2 h-5 w-5" />
              Content Management
            </Button>
          </Link>

          <Link to="/admin/ai-management">
            <Button variant="ghost" className="w-full justify-start">
              <Bot className="mr-2 h-5 w-5" />
              AI Management
            </Button>
          </Link>
          
          <Link to="/admin/subscriptions">
            <Button variant="ghost" className="w-full justify-start">
              <CreditCard className="mr-2 h-5 w-5" />
              Subscriptions
            </Button>
          </Link>
          
          <Link to="/admin/analytics">
            <Button variant="ghost" className="w-full justify-start">
              <BarChart className="mr-2 h-5 w-5" />
              Analytics
            </Button>
          </Link>
          
          <Link to="/admin/support-tickets">
            <Button variant="ghost" className="w-full justify-start">
              <LifeBuoy className="mr-2 h-5 w-5" />
              Support Tickets
            </Button>
          </Link>
          
          <Link to="/admin/system-health">
            <Button variant="ghost" className="w-full justify-start">
              <AlertCircle className="mr-2 h-5 w-5" />
              System Health
            </Button>
          </Link>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1 p-8 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
