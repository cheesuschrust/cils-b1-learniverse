
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
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
  Clock,
  ArrowUpRight,
  TrendingUp,
  DollarSign,
  Activity
} from 'lucide-react';

interface EnhancedAnalyticsDashboardProps {
  // Props if needed
}

const EnhancedAnalyticsDashboard: React.FC<EnhancedAnalyticsDashboardProps> = () => {
  const [period, setPeriod] = useState("30d");
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  const handleDownloadReport = () => {
    // This would trigger report generation
    toast({
      title: "Report Generated",
      description: "Analytics report has been generated and downloaded.",
    });
  };
  
  // Sample data
  const summaryCards = [
    {
      title: "Total Users",
      value: "24,832",
      change: "+12.5%",
      isUp: true,
      icon: <Users className="h-4 w-4" />
    },
    {
      title: "Content Items",
      value: "8,294",
      change: "+23.1%",
      isUp: true,
      icon: <FileText className="h-4 w-4" />
    },
    {
      title: "AI Accuracy",
      value: "92.7%",
      change: "+3.2%",
      isUp: true,
      icon: <Bot className="h-4 w-4" />
    },
    {
      title: "Monthly Revenue",
      value: "$42,891",
      change: "+18.4%",
      isUp: true,
      icon: <DollarSign className="h-4 w-4" />
    },
  ];

  const periods = [
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "90d", label: "Last 90 days" },
    { value: "year", label: "Last year" },
    { value: "all", label: "All time" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Enhanced Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive platform metrics and insights
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
          
          <Button variant="outline" onClick={handleDownloadReport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {summaryCards.map((card, idx) => (
          <Card key={idx}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                {card.icon}
                <span className="ml-2">{card.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <div className="flex items-center mt-1 text-xs">
                <span className={card.isUp ? 'text-green-500' : 'text-red-500'}>
                  {card.change}
                  {card.isUp ? (
                    <ArrowUpRight className="inline h-3 w-3 ml-1" />
                  ) : (
                    <TrendingUp className="inline h-3 w-3 ml-1" />
                  )}
                </span>
                <span className="text-muted-foreground ml-1">
                  from last period
                </span>
              </div>
              <Progress value={70} className="h-1 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center justify-center">
            <Activity className="mr-2 h-4 w-4" />
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
          <TabsTrigger value="revenue" className="flex items-center justify-center">
            <DollarSign className="mr-2 h-4 w-4" />
            Revenue
          </TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>Monthly new signups and activations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full bg-muted/20 rounded-md flex items-center justify-center">
                  {/* Placeholder for the line chart component */}
                  <p className="text-muted-foreground">User growth visualization</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Content Engagement</CardTitle>
                <CardDescription>Most engaged content types and completion rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full bg-muted/20 rounded-md flex items-center justify-center">
                  {/* Placeholder for the bar chart component */}
                  <p className="text-muted-foreground">Content engagement visualization</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Platform Activity Timeline</CardTitle>
                <CardDescription>Hourly distribution of platform usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full bg-muted/20 rounded-md flex items-center justify-center">
                  {/* Placeholder for the timeline component */}
                  <p className="text-muted-foreground">Platform activity visualization</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <UsersStatsCards period={period} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UserDistributionCard />
            <Card>
              <CardHeader>
                <CardTitle>User Retention</CardTitle>
                <CardDescription>Cohort analysis of user retention rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full bg-muted/20 rounded-md flex items-center justify-center">
                  {/* Placeholder for the retention chart component */}
                  <p className="text-muted-foreground">Retention visualization</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Content Tab */}
        <TabsContent value="content" className="space-y-4">
          <ContentStatsCards period={period} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Content Performance</CardTitle>
                <CardDescription>User engagement metrics by content type</CardDescription>
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
                    <Progress value={76} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Content Trends</CardTitle>
                <CardDescription>Usage patterns over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full bg-muted/20 rounded-md flex items-center justify-center">
                  {/* Placeholder for the content trends chart */}
                  <p className="text-muted-foreground">Content trends visualization</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* AI Tab */}
        <TabsContent value="ai" className="space-y-4">
          <AIUsageCards period={period} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AIPerformanceCard data={[
              { name: 'Flashcards', accuracy: 94, questions: 1265 },
              { name: 'Multiple Choice', accuracy: 88, questions: 987 },
              { name: 'Reading', accuracy: 79, questions: 654 },
              { name: 'Writing', accuracy: 82, questions: 432 },
              { name: 'Speaking', accuracy: 75, questions: 321 }
            ]} />
            <AIAccuracyMetricsCard />
          </div>
          <ModelUsageCard />
        </TabsContent>
        
        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$42,891</div>
                <p className="text-xs text-muted-foreground mt-1">
                  +18.4% from last month
                </p>
                <Progress value={84} className="h-1 mt-2" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3,287</div>
                <p className="text-xs text-muted-foreground mt-1">
                  +5.2% from last week
                </p>
                <Progress value={72} className="h-1 mt-2" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">LTV</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$127.54</div>
                <p className="text-xs text-muted-foreground mt-1">
                  +3.2% from last month
                </p>
                <Progress value={68} className="h-1 mt-2" />
              </CardContent>
            </Card>
          </div>
          
          <RevenueTrendsCard />
          
          <Card>
            <CardHeader>
              <CardTitle>Subscription Distribution</CardTitle>
              <CardDescription>Active subscriptions by plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Premium Monthly</div>
                      <div className="font-medium">1,842 users</div>
                    </div>
                    <Progress value={56} className="h-2" />
                    <div className="text-xs text-muted-foreground">56% of subscriptions • $18,420/mo</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Premium Annual</div>
                      <div className="font-medium">964 users</div>
                    </div>
                    <Progress value={29} className="h-2" />
                    <div className="text-xs text-muted-foreground">29% of subscriptions • $14,460/mo</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Instructor</div>
                      <div className="font-medium">481 users</div>
                    </div>
                    <Progress value={15} className="h-2" />
                    <div className="text-xs text-muted-foreground">15% of subscriptions • $9,620/mo</div>
                  </div>
                </div>
                
                <div className="h-[200px] w-full bg-muted/20 rounded-md flex items-center justify-center">
                  {/* Placeholder for the donut chart */}
                  <p className="text-muted-foreground">Subscription distribution chart</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAnalyticsDashboard;
