
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AIModelPerformanceChart from '@/components/admin/charts/AIModelPerformanceChart';
import ContentTypeCard from '@/components/admin/analytics/ContentTypeCard';
import { RevenueTrendsCard, UserDistributionCard, UsersStatsCards } from '@/components/admin/analytics';

const AdminAnalytics: React.FC = () => {
  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="space-y-6">
        <Helmet>
          <title>Analytics - Admin</title>
        </Helmet>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Comprehensive insights into platform performance and user activity
            </p>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="ai">AI Performance</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <RevenueTrendsCard />
              <AIModelPerformanceChart height={350} />
              <UserDistributionCard />
            </div>
            
            <ContentTypeCard />
          </TabsContent>
          
          <TabsContent value="users" className="space-y-4">
            <UsersStatsCards />
            <UserDistributionCard />
          </TabsContent>
          
          <TabsContent value="content" className="space-y-4">
            <ContentTypeCard />
          </TabsContent>
          
          <TabsContent value="ai" className="space-y-4">
            <AIModelPerformanceChart height={400} />
          </TabsContent>
          
          <TabsContent value="revenue" className="space-y-4">
            <RevenueTrendsCard />
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
};

export default AdminAnalytics;
