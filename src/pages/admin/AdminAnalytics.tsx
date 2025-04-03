
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Card, 
  CardContent, 
  CardDescription,
  CardHeader, 
  CardTitle
} from '@/components/ui/card';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import {
  BarChart,
  LineChart,
  DonutChart
} from '@/components/admin/charts';
import {
  UserDistributionCard,
  UsersStatsCards,
  ContentStatsCards,
  AIPerformanceCard,
  AIAccuracyMetricsCard,
  ModelUsageCard,
  AIUsageCards,
  RevenueTrendsCard
} from '@/components/admin/analytics';
import { 
  BarChart3, 
  LineChart as LineChartIcon, 
  PieChart, 
  Download, 
  RefreshCw, 
  Calendar,
  Users,
  Bot,
  FileText,
  Clock
} from 'lucide-react';

const periods = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "year", label: "Last year" },
  { value: "all", label: "All time" },
];

const AdminAnalytics: React.FC = () => {
  const [period, setPeriod] = useState("30d");
  const { toast } = useToast();
  
  const userStats = {
    newUsers: 124,
    activeUsers: 842,
    retention: 68.4,
    churn: 5.2
  };
  
  const activityData = [
    { date: '2023-04-01', count: 145 },
    { date: '2023-04-02', count: 132 },
    { date: '2023-04-03', count: 164 },
    { date: '2023-04-04', count: 187 },
    { date: '2023-04-05', count: 203 },
    { date: '2023-04-06', count: 185 },
    { date: '2023-04-07', count: 198 },
    { date: '2023-04-08', count: 223 },
    { date: '2023-04-09', count: 242 },
    { date: '2023-04-10', count: 205 },
    { date: '2023-04-11', count: 194 },
    { date: '2023-04-12', count: 216 },
    { date: '2023-04-13', count: 231 },
    { date: '2023-04-14', count: 256 }
  ];
  
  const contentCreationData = [
    { date: '2023-04-01', admin: 5, user: 12 },
    { date: '2023-04-02', admin: 3, user: 10 },
    { date: '2023-04-03', admin: 7, user: 15 },
    { date: '2023-04-04', admin: 4, user: 17 },
    { date: '2023-04-05', admin: 6, user: 19 },
    { date: '2023-04-06', admin: 8, user: 14 },
    { date: '2023-04-07', admin: 5, user: 16 }
  ];
  
  const userDistributionData = [
    { name: 'Free', value: 68 },
    { name: 'Premium', value: 24 },
    { name: 'Instructor', value: 8 }
  ];
  
  const aiPerformanceData = [
    { name: 'Flashcards', accuracy: 94, questions: 1265 },
    { name: 'Multiple Choice', accuracy: 88, questions: 987 },
    { name: 'Reading', accuracy: 79, questions: 654 },
    { name: 'Writing', accuracy: 82, questions: 432 },
    { name: 'Speaking', accuracy: 75, questions: 321 }
  ];

  const handleDownloadReport = () => {
    toast({
      title: "Report Generated",
      description: "Analytics data has been exported to CSV format.",
    });
  };
  
  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="space-y-6">
        <Helmet>
          <title>Analytics Dashboard - Admin</title>
        </Helmet>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Monitor platform metrics and user activity
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[180px]">
                <Calendar className="mr-2 h-4 w-4 opacity-50" />
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                {periods.map((period) => (
                  <SelectItem key={period.value} value={period.value}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon" onClick={handleDownloadReport}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center justify-center">
              <BarChart3 className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center justify-center">
              <Users className="mr-2 h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center justify-center">
              <FileText className="mr-2 h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center justify-center">
              <Bot className="mr-2 h-4 w-4" />
              AI Performance
            </TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2,735</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    +12.5% from last month
                  </p>
                  <Progress value={78} className="h-1 mt-2" />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">842</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    +5.2% from last week
                  </p>
                  <Progress value={62} className="h-1 mt-2" />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Content Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3,921</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    +32 in the last 7 days
                  </p>
                  <Progress value={84} className="h-1 mt-2" />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">AI Accuracy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">87.5%</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    +2.3% from last month
                  </p>
                  <Progress value={87.5} className="h-1 mt-2" />
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">User Activity</CardTitle>
                  <CardDescription>Daily active users over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <LineChart 
                    data={activityData}
                    xField="date"
                    yField="count"
                    height={250}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Subscription Distribution</CardTitle>
                  <CardDescription>Users by subscription tier</CardDescription>
                </CardHeader>
                <CardContent>
                  <DonutChart 
                    data={userDistributionData}
                    height={250}
                  />
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Content Creation</CardTitle>
                  <CardDescription>New content items by source</CardDescription>
                </CardHeader>
                <CardContent>
                  <BarChart 
                    data={contentCreationData}
                    height={300}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <UsersStatsCards period={period} />
            <UserDistributionCard />
          </TabsContent>
          
          {/* Content Tab */}
          <TabsContent value="content" className="space-y-4">
            <ContentStatsCards period={period} />
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Content Performance</CardTitle>
                <CardDescription>Usage and engagement metrics by content type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">Flashcards</div>
                        <div className="text-sm text-muted-foreground">14,532 views • 87% completion</div>
                      </div>
                      <div className="font-medium">8.7/10</div>
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">Multiple Choice</div>
                        <div className="text-sm text-muted-foreground">9,845 views • 82% completion</div>
                      </div>
                      <div className="font-medium">8.2/10</div>
                    </div>
                    <Progress value={82} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">Reading</div>
                        <div className="text-sm text-muted-foreground">7,423 views • 76% completion</div>
                      </div>
                      <div className="font-medium">7.8/10</div>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">Writing</div>
                        <div className="text-sm text-muted-foreground">5,218 views • 68% completion</div>
                      </div>
                      <div className="font-medium">7.5/10</div>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">Speaking</div>
                        <div className="text-sm text-muted-foreground">4,329 views • 62% completion</div>
                      </div>
                      <div className="font-medium">7.2/10</div>
                    </div>
                    <Progress value={72} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* AI Tab */}
          <TabsContent value="ai" className="space-y-4">
            <AIUsageCards period={period} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AIPerformanceCard data={aiPerformanceData} />
              <AIAccuracyMetricsCard />
            </div>
            <ModelUsageCard />
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
};

export default AdminAnalytics;
