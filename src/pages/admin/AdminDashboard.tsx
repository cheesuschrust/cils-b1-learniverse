
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { BarChart3, Users, FileText, ArrowUpRight, AlertCircle, Bot, CreditCard } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface DashboardStat {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
}

interface SystemStatus {
  service: string;
  status: 'operational' | 'degraded' | 'outage';
  uptime: number;
}

const AdminDashboard: React.FC = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch user count
        const { count: userCount, error: userError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });
          
        if (userError) throw userError;
        
        // Fetch content count
        const { count: contentCount, error: contentError } = await supabase
          .from('content_items')
          .select('*', { count: 'exact', head: true });
          
        if (contentError) throw contentError;
        
        // Fetch AI model performance average
        const { data: aiData, error: aiError } = await supabase
          .from('ai_model_performance')
          .select('accuracy')
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (aiError) throw aiError;
        
        // Fetch subscription data
        const { data: subscriptionData, error: subError } = await supabase
          .from('users')
          .select('subscription_tier')
          .not('subscription_tier', 'eq', 'free');
          
        if (subError) throw subError;
        
        // Set the dashboard stats
        setStats([
          {
            title: 'Total Users',
            value: userCount || 0,
            icon: <Users className="h-8 w-8 text-blue-500" />,
          },
          {
            title: 'Content Items',
            value: contentCount || 0, 
            icon: <FileText className="h-8 w-8 text-purple-500" />,
          },
          {
            title: 'AI Accuracy',
            value: aiData && aiData.length > 0 ? `${(aiData[0].accuracy * 100).toFixed(1)}%` : 'N/A',
            icon: <Bot className="h-8 w-8 text-green-500" />,
          },
          {
            title: 'Paid Subscriptions',
            value: subscriptionData?.length || 0,
            icon: <CreditCard className="h-8 w-8 text-amber-500" />,
          },
        ]);
        
        // Set system status (mock data for now)
        setSystemStatus([
          { service: 'API Server', status: 'operational', uptime: 99.98 },
          { service: 'Database', status: 'operational', uptime: 99.99 },
          { service: 'AI Models', status: 'operational', uptime: 99.95 },
          { service: 'Authentication', status: 'operational', uptime: 100 },
          { service: 'Storage', status: 'operational', uptime: 99.99 },
        ]);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [toast]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-500';
      case 'degraded': return 'bg-yellow-500';
      case 'outage': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="space-y-6">
        <Helmet>
          <title>Admin Dashboard - CILS Italian Citizenship</title>
        </Helmet>
        
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Badge variant="outline" className="text-sm">
            Admin Panel
          </Badge>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 w-16 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                  <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </CardContent>
              </Card>
            ))
          ) : (
            stats.map((stat, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">{stat.value}</div>
                    {stat.icon}
                  </div>
                  {stat.change !== undefined && (
                    <p className={`text-xs mt-2 flex items-center ${stat.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      {stat.change > 0 ? '+' : ''}{stat.change}% from last month
                    </p>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
        
        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <AlertCircle className="mr-2 h-5 w-5 text-muted-foreground" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemStatus.map((service, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`h-3 w-3 rounded-full mr-3 ${getStatusColor(service.status)}`}></div>
                    <div>{service.service}</div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-muted-foreground">{service.uptime}% uptime</span>
                    <Badge variant={service.status === 'operational' ? 'outline' : 'destructive'} className="capitalize">
                      {service.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <BarChart3 className="mr-2 h-5 w-5 text-muted-foreground" />
              Platform Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-medium">API Requests</div>
                  <div className="text-sm text-muted-foreground">16,324 / 20,000</div>
                </div>
                <Progress value={81} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-medium">Storage Usage</div>
                  <div className="text-sm text-muted-foreground">4.2 GB / 10 GB</div>
                </div>
                <Progress value={42} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-medium">AI Credits</div>
                  <div className="text-sm text-muted-foreground">724 / 1,000</div>
                </div>
                <Progress value={72} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
        
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;
