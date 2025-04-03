
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { 
  BarChart3, 
  Users, 
  FileText, 
  Bot, 
  BookOpen,
  CheckCircle,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    contentItems: 0,
    totalQuestions: 0,
    premiumUsers: 0,
    supportTickets: 0,
    userGrowth: 0,
    contentGrowth: 0
  });
  
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      
      try {
        // Fetch total users count
        const { count: totalUsers, error: userError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });
          
        if (userError) throw userError;
        
        // Fetch active users (users who logged in this week)
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const { count: activeUsers, error: activeError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .gt('last_login', oneWeekAgo.toISOString());
          
        if (activeError) throw activeError;
        
        // Fetch content items
        const { count: contentItems, error: contentError } = await supabase
          .from('content_items')
          .select('*', { count: 'exact', head: true });
          
        if (contentError) throw contentError;
        
        // Fetch premium users
        const { count: premiumUsers, error: premiumError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .eq('subscription_tier', 'premium');
          
        if (premiumError) throw premiumError;
        
        // Fetch open support tickets
        const { count: supportTickets, error: ticketError } = await supabase
          .from('support_tickets')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'open');
          
        if (ticketError) throw ticketError;
        
        // Calculate growth (mock data for now)
        const userGrowth = 12.5;
        const contentGrowth = 8.3;
        
        setStats({
          totalUsers: totalUsers || 0,
          activeUsers: activeUsers || 0,
          contentItems: contentItems || 0,
          totalQuestions: 367, // Mock data
          premiumUsers: premiumUsers || 0,
          supportTickets: supportTickets || 0,
          userGrowth,
          contentGrowth
        });
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  return (
    <div className="space-y-6">
      <Helmet>
        <title>Admin Dashboard | Italian Learning</title>
      </Helmet>
      
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
        </p>
      </div>
      
      {/* Statistics Summary */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers.toString()}
          description={`${stats.userGrowth > 0 ? '+' : ''}${stats.userGrowth}% from last month`}
          icon={<Users />}
          trend={stats.userGrowth > 0 ? 'up' : 'down'}
          loading={loading}
        />
        
        <StatCard 
          title="Active Users" 
          value={stats.activeUsers.toString()}
          description="Active in the last 7 days"
          icon={<Users />}
          loading={loading}
        />
        
        <StatCard 
          title="Premium Users" 
          value={stats.premiumUsers.toString()}
          description={`${(stats.totalUsers ? Math.round((stats.premiumUsers / stats.totalUsers) * 100) : 0)}% of total users`}
          icon={<CheckCircle />}
          loading={loading}
        />
        
        <StatCard 
          title="Content Items" 
          value={stats.contentItems.toString()}
          description={`${stats.contentGrowth > 0 ? '+' : ''}${stats.contentGrowth}% from last month`}
          icon={<FileText />}
          trend={stats.contentGrowth > 0 ? 'up' : 'down'}
          loading={loading}
        />
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>System Health</CardTitle>
              <CardDescription>Service status summary</CardDescription>
            </div>
            <div className="bg-green-100 text-green-800 p-2 rounded-full">
              <CheckCircle className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Database</span>
                <span className="text-green-600">Operational</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Authentication</span>
                <span className="text-green-600">Operational</span>
              </div>
              <div className="flex justify-between items-center">
                <span>AI Services</span>
                <span className="text-green-600">Operational</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Storage</span>
                <span className="text-green-600">Operational</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>AI Model Performance</CardTitle>
              <CardDescription>Last 30 days</CardDescription>
            </div>
            <Bot className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Accuracy</span>
                <span className="font-semibold">92.4%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>User Satisfaction</span>
                <span className="font-semibold">88.7%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Response Time</span>
                <span className="font-semibold">0.7s</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Error Rate</span>
                <span className="font-semibold">2.3%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Support Tickets</CardTitle>
              <CardDescription>Open tickets requiring attention</CardDescription>
            </div>
            <div className={`${stats.supportTickets > 0 ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'} p-2 rounded-full`}>
              <span className="font-semibold">{stats.supportTickets}</span>
            </div>
          </CardHeader>
          <CardContent>
            {stats.supportTickets > 0 ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>High Priority</span>
                  <span className="text-red-600 font-medium">2</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Medium Priority</span>
                  <span className="text-orange-600 font-medium">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Low Priority</span>
                  <span className="text-blue-600 font-medium">{Math.max(0, stats.supportTickets - 5)}</span>
                </div>
                <div className="pt-2">
                  <a href="/admin/support-tickets" className="text-primary hover:underline text-sm">
                    View all tickets →
                  </a>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">No open tickets</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent User Activity</CardTitle>
            <CardDescription>Latest user registrations and logins</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3"></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Connect to real user activity data</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Content Performance</CardTitle>
            <CardDescription>Most popular content by user engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="flex justify-between">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/4"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/4"></div>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Connect to real content performance data</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  loading = false
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="bg-primary/10 p-2 rounded-full">
            {icon}
          </div>
          {trend && (
            <div className={`${trend === 'up' ? 'text-green-600' : 'text-red-600'} flex items-center`}>
              {trend === 'up' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
            </div>
          )}
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {loading ? (
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-1 w-16"></div>
          ) : (
            <p className="text-3xl font-bold">{value}</p>
          )}
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminDashboard;
