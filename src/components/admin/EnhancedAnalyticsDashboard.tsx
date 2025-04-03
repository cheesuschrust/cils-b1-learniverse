
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  UsersStatsCards, 
  ContentStatsCards, 
  AIPerformanceCard, 
  AIAccuracyMetricsCard,
  ModelUsageCard,
  AIUsageCards,
  RevenueTrendsCard,
  UserDistributionCard
} from './analytics';

const EnhancedAnalyticsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    users: {
      total: 0,
      active: 0,
      new: 0,
      premium: 0,
      retention: 0,
      churn: 0
    },
    content: {
      totalItems: 0,
      published: 0,
      draft: 0,
      engagement: 0,
      topCategories: []
    },
    ai: {
      accuracy: 0,
      usage: 0,
      responseTime: 0,
      errorRate: 0,
      satisfaction: 0
    },
    revenue: {
      monthly: 0,
      annual: 0,
      growth: 0,
      arpu: 0
    }
  });

  const { toast } = useToast();

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, these would be separate API calls to fetch different metrics
        // For now, simulate API responses with a delay
        
        // Fetch user statistics
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*');
          
        if (userError) throw userError;
        
        // Fetch content statistics
        const { data: contentData, error: contentError } = await supabase
          .from('content_items')
          .select('*');
          
        if (contentError) throw contentError;
        
        // Fetch AI performance metrics
        const { data: aiData, error: aiError } = await supabase
          .from('ai_model_performance')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (aiError) throw aiError;

        // Process the data and update state
        setAnalyticsData({
          users: {
            total: userData?.length || 0,
            active: userData?.filter(u => u.status === 'active')?.length || 0,
            new: userData?.filter(u => {
              const createdDate = new Date(u.created_at);
              const thirtyDaysAgo = new Date();
              thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
              return createdDate > thirtyDaysAgo;
            })?.length || 0,
            premium: userData?.filter(u => u.subscription_tier === 'premium')?.length || 0,
            retention: 85, // Example - this would come from a proper calculation
            churn: 15 // Example - this would come from a proper calculation
          },
          content: {
            totalItems: contentData?.length || 0,
            published: contentData?.filter(c => c.status === 'published')?.length || 0,
            draft: contentData?.filter(c => c.status === 'draft')?.length || 0,
            engagement: 78, // Example - this would come from a proper calculation
            topCategories: [
              { name: 'Vocabulary', count: 120 },
              { name: 'Grammar', count: 85 },
              { name: 'Culture', count: 65 }
            ] // Example - this would come from processed data
          },
          ai: {
            accuracy: aiData?.[0]?.accuracy || 0,
            usage: 8750, // Example - this would come from a proper calculation
            responseTime: 1.2, // seconds
            errorRate: 3.5, // percentage
            satisfaction: 87 // percentage
          },
          revenue: {
            monthly: 42350,
            annual: 508200,
            growth: 7.9,
            arpu: 29.99
          }
        });
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        toast({
          title: "Error",
          description: "Failed to load analytics data. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnalyticsData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Comprehensive insights into platform performance and user activity.</p>
        </div>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="ai">AI Performance</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? 'Loading...' : analyticsData.users.total.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  +{isLoading ? '...' : analyticsData.users.new} in the last 30 days
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Content Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? 'Loading...' : analyticsData.content.totalItems.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {isLoading ? '...' : analyticsData.content.published} published items
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? 'Loading...' : `${analyticsData.ai.accuracy}%`}
                </div>
                <p className="text-xs text-muted-foreground">
                  {isLoading ? '...' : analyticsData.ai.usage.toLocaleString()} AI responses generated
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? 'Loading...' : `$${analyticsData.revenue.monthly.toLocaleString()}`}
                </div>
                <p className="text-xs text-muted-foreground">
                  +{isLoading ? '...' : analyticsData.revenue.growth}% from previous month
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <RevenueTrendsCard />
            <AIAccuracyMetricsCard />
            <UserDistributionCard />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <AIPerformanceCard />
            <ContentStatsCards />
          </div>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <UsersStatsCards />
          <UserDistributionCard />
        </TabsContent>
        
        <TabsContent value="content" className="space-y-4">
          <ContentStatsCards />
        </TabsContent>
        
        <TabsContent value="ai" className="space-y-4">
          <AIPerformanceCard />
          <div className="grid gap-4 md:grid-cols-2">
            <AIAccuracyMetricsCard />
            <ModelUsageCard />
          </div>
          <AIUsageCards />
        </TabsContent>
        
        <TabsContent value="revenue" className="space-y-4">
          <RevenueTrendsCard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAnalyticsDashboard;
