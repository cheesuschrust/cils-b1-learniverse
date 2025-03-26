
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, LineChart, PieChart } from '@/components/ui/charts';
import { DownloadIcon, RefreshCcw } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import UsersStatsCards from './analytics/UsersStatsCards';
import ContentStatsCards from './analytics/ContentStatsCards';

const EnhancedAnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({
    total: 0,
    active: 0,
    growth: 0,
    premium: 0,
    newToday: 0
  });
  
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [questionUsageData, setQuestionUsageData] = useState([]);
  const [subscriptionData, setSubscriptionData] = useState([]);
  const [contentTypeData, setContentTypeData] = useState([]);
  
  // Load analytics data
  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);
  
  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Get user summary data
      await fetchUserSummary();
      
      // Get user growth data
      await fetchUserGrowthData();
      
      // Get content usage data
      await fetchContentUsageData();
      
      // Get content type distribution
      await fetchContentTypeDistribution();
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchUserSummary = async () => {
    // Get the date range
    const fromDate = getDateRangeStart(timeRange);
    
    // Get total users
    const { count: totalCount, error: totalError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
    
    // Get active users (users who logged in within the time range)
    const { count: activeCount, error: activeError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('last_active', fromDate.toISOString());
    
    // Get premium users
    const { count: premiumCount, error: premiumError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('subscription', 'premium');
    
    // Get new users in time range
    const { count: newCount, error: newError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', fromDate.toISOString());
    
    // Get new users today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { count: todayCount, error: todayError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString());
    
    // Calculate growth percentage (new users in time range / total users)
    const growthPercentage = totalCount > 0 ? Math.round((newCount / totalCount) * 100) : 0;
    
    setUserData({
      total: totalCount || 0,
      active: activeCount || 0,
      growth: growthPercentage,
      premium: premiumCount || 0,
      newToday: todayCount || 0
    });
  };
  
  const fetchUserGrowthData = async () => {
    // Get the date range
    const fromDate = getDateRangeStart(timeRange);
    const toDate = new Date();
    
    // Calculate interval based on timeRange (daily for 7d and 30d, weekly for 90d, monthly for 1y)
    const interval = timeRange === '1y' ? 'month' : timeRange === '90d' ? 'week' : 'day';
    
    // Format SQL based on interval
    let timeFormat;
    if (interval === 'day') {
      timeFormat = 'YYYY-MM-DD';
    } else if (interval === 'week') {
      timeFormat = 'YYYY-"W"IW';
    } else {
      timeFormat = 'YYYY-MM';
    }
    
    // Get user sign-ups grouped by date
    const { data, error } = await supabase
      .rpc('get_user_growth', {
        from_date: fromDate.toISOString(),
        to_date: toDate.toISOString(),
        interval_type: interval,
        time_format: timeFormat
      });
    
    if (error) {
      console.error('Error fetching user growth data:', error);
      setUserGrowthData([]);
    } else {
      // Format data for chart
      const formattedData = data.map(item => ({
        name: item.time_period,
        users: item.count,
        newUsers: item.count
      }));
      
      setUserGrowthData(formattedData);
    }
  };
  
  const fetchContentUsageData = async () => {
    // Get the date range
    const fromDate = getDateRangeStart(timeRange);
    
    // Get question usage data
    const { data, error } = await supabase
      .from('usage_tracking')
      .select('question_type, count')
      .gte('date', fromDate.toISOString())
      .order('question_type');
    
    if (error) {
      console.error('Error fetching question usage data:', error);
      setQuestionUsageData([]);
    } else {
      // Group by question_type and sum counts
      const grouped = data.reduce((acc, curr) => {
        if (!acc[curr.question_type]) {
          acc[curr.question_type] = 0;
        }
        acc[curr.question_type] += curr.count;
        return acc;
      }, {});
      
      // Format for chart
      const formattedData = Object.entries(grouped).map(([type, count]) => ({
        name: type.charAt(0).toUpperCase() + type.slice(1),
        value: count
      }));
      
      setQuestionUsageData(formattedData);
    }
    
    // Get subscription data
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from('users')
      .select('subscription')
      .order('subscription');
    
    if (subscriptionError) {
      console.error('Error fetching subscription data:', subscriptionError);
      setSubscriptionData([]);
    } else {
      // Group by subscription
      const grouped = subscriptionData.reduce((acc, curr) => {
        if (!acc[curr.subscription]) {
          acc[curr.subscription] = 0;
        }
        acc[curr.subscription]++;
        return acc;
      }, {});
      
      // Format for chart
      const formattedData = Object.entries(grouped).map(([type, count]) => ({
        name: type.charAt(0).toUpperCase() + type.slice(1),
        value: count
      }));
      
      setSubscriptionData(formattedData);
    }
  };
  
  const fetchContentTypeDistribution = async () => {
    // Get content type distribution
    const { data, error } = await supabase
      .from('content')
      .select('content_type')
      .order('content_type');
    
    if (error) {
      console.error('Error fetching content type data:', error);
      setContentTypeData([]);
    } else {
      // Group by content_type
      const grouped = data.reduce((acc, curr) => {
        if (!acc[curr.content_type]) {
          acc[curr.content_type] = 0;
        }
        acc[curr.content_type]++;
        return acc;
      }, {});
      
      // Format for chart
      const formattedData = Object.entries(grouped).map(([type, count]) => ({
        name: type.charAt(0).toUpperCase() + type.slice(1),
        value: count
      }));
      
      setContentTypeData(formattedData);
    }
  };
  
  const getDateRangeStart = (range) => {
    const date = new Date();
    switch (range) {
      case '7d':
        date.setDate(date.getDate() - 7);
        break;
      case '30d':
        date.setDate(date.getDate() - 30);
        break;
      case '90d':
        date.setDate(date.getDate() - 90);
        break;
      case '1y':
        date.setFullYear(date.getFullYear() - 1);
        break;
      default:
        date.setDate(date.getDate() - 30);
    }
    return date;
  };
  
  const handleRefresh = () => {
    loadAnalyticsData();
  };
  
  const handleExport = () => {
    // In a real implementation, this would generate a CSV or PDF report
    console.log('Exporting analytics data');
    alert('Analytics data export initiated. Check your email for the report.');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <DownloadIcon className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="users">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-6">
          <UsersStatsCards data={userData} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>New user registrations over time</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <LineChart
                  data={userGrowthData}
                  index="name"
                  categories={["users"]}
                  colors={["blue", "green"]}
                  valueFormatter={(value) => `${value} users`}
                  className="h-72"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Subscription Distribution</CardTitle>
                <CardDescription>Free vs Premium users</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <PieChart
                  data={subscriptionData}
                  index="name"
                  valueFormatter={(value) => `${value} users`}
                  className="h-72"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="content" className="space-y-6">
          <ContentStatsCards />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Feature Usage</CardTitle>
                <CardDescription>Questions attempted by type</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <BarChart
                  data={questionUsageData}
                  index="name"
                  categories={["value"]}
                  colors={["blue"]}
                  valueFormatter={(value) => `${value} uses`}
                  className="h-72"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Content Distribution</CardTitle>
                <CardDescription>Content items by type</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <PieChart
                  data={contentTypeData}
                  index="name"
                  valueFormatter={(value) => `${value} items`}
                  className="h-72"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAnalyticsDashboard;
