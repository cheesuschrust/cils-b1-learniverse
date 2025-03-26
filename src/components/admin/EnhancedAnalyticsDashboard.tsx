
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, BarChart2, PieChart, Download, RefreshCw, Filter, User as UserIcon, BookOpen, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { BarChart, LineChart, ResponsiveContainer, Bar, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { DateRange } from '@/types/date';

// Import our custom components
import { UsersStatsCards } from '@/components/admin/analytics/UsersStatsCards';
import { UserDistributionCard } from '@/components/admin/analytics/UserDistributionCard';
import { ContentCategoriesCard } from '@/components/admin/analytics/ContentCategoriesCard';
import { RevenueTrendsCard } from '@/components/admin/analytics/RevenueTrendsCard';
import { AIPerformanceCard } from '@/components/admin/analytics/AIPerformanceCard';
import { GeographicalDistributionCard } from '@/components/admin/analytics/GeographicalDistributionCard';
import { ContentStatsCards } from '@/components/admin/analytics/ContentStatsCards';
import { AIUsageCards } from '@/components/admin/analytics/AIUsageCards';
import { AIAccuracyMetricsCard } from '@/components/admin/analytics/AIAccuracyMetricsCard';
import { ModelUsageCard } from '@/components/admin/analytics/ModelUsageCard';
import { PerformanceMetricsCard } from '@/components/admin/analytics/PerformanceMetricsCard';

// Define the data for the analytics dashboard
const analyticsData = {
  users: {
    total: 5428,
    active: 2875,
    newToday: 42,
    growth: 8.2,
    premium: 1345,
    free: 4083,
    retentionRate: 76,
    averageSessionTime: 28,
    lastMonthActive: [
      { date: '2023-01-01', users: 2450 },
      { date: '2023-01-02', users: 2490 },
      { date: '2023-01-03', users: 2650 },
      { date: '2023-01-04', users: 2700 },
      { date: '2023-01-05', users: 2710 },
      { date: '2023-01-06', users: 2690 },
      { date: '2023-01-07', users: 2800 },
      { date: '2023-01-08', users: 2820 },
      { date: '2023-01-09', users: 2750 },
      { date: '2023-01-10', users: 2790 },
      { date: '2023-01-11', users: 2840 },
      { date: '2023-01-12', users: 2875 }
    ],
    byPlan: [
      { name: 'Free', value: 4083 },
      { name: 'Basic', value: 782 },
      { name: 'Premium', value: 563 }
    ],
    byCountry: [
      { name: 'United States', value: 1856 },
      { name: 'Italy', value: 1245 },
      { name: 'United Kingdom', value: 734 },
      { name: 'Germany', value: 489 },
      { name: 'France', value: 456 },
      { name: 'Other', value: 648 }
    ]
  },
  content: {
    totalLessons: 345,
    completedLessons: 187594,
    flashcards: 4256,
    averageScore: 82.5,
    popularCategories: [
      { name: 'Vocabulary', value: 42 },
      { name: 'Grammar', value: 28 },
      { name: 'Conversation', value: 16 },
      { name: 'Reading', value: 14 }
    ],
    topPerformingContent: [
      { name: 'Basic Italian Greetings', completions: 3856, rating: 4.8 },
      { name: 'Present Tense Verbs', completions: 3245, rating: 4.7 },
      { name: 'Food and Dining Vocabulary', completions: 2987, rating: 4.9 },
      { name: 'Travel Phrases', completions: 2876, rating: 4.6 },
      { name: 'Numbers 1-100', completions: 2754, rating: 4.5 }
    ]
  },
  aiUsage: {
    totalProcessed: 127543,
    speechRecognition: 34567,
    textGeneration: 56789,
    translation: 23487,
    flashcardGeneration: 12700,
    accuracy: {
      overall: 92.5,
      speechRecognition: 89.4,
      textGeneration: 94.7,
      translation: 96.2,
      flashcardGeneration: 91.8
    },
    byDay: [
      { day: 'Monday', requests: 18456 },
      { day: 'Tuesday', requests: 21345 },
      { day: 'Wednesday', requests: 22567 },
      { day: 'Thursday', requests: 19876 },
      { day: 'Friday', requests: 17654 },
      { day: 'Saturday', requests: 15678 },
      { day: 'Sunday', requests: 12567 }
    ]
  },
  revenue: {
    totalMRR: 14876,
    growth: 12.4,
    conversionRate: 6.8,
    averageRevenue: 24.56,
    bySubscription: [
      { plan: 'Monthly Basic', count: 452, revenue: 4520 },
      { plan: 'Monthly Premium', count: 234, revenue: 3510 },
      { plan: 'Annual Basic', count: 178, revenue: 3204 },
      { plan: 'Annual Premium', count: 124, revenue: 3472 },
      { plan: 'Lifetime', count: 34, revenue: 170 }
    ],
    byMonth: [
      { month: 'Jan', revenue: 10245 },
      { month: 'Feb', revenue: 10876 },
      { month: 'Mar', revenue: 11567 },
      { month: 'Apr', revenue: 12345 },
      { month: 'May', revenue: 12987 },
      { month: 'Jun', revenue: 13456 },
      { month: 'Jul', revenue: 13987 },
      { month: 'Aug', revenue: 14567 },
      { month: 'Sep', revenue: 14876 }
    ]
  }
};

interface UserTrendsChartProps {
  data: { name: string; users: number; newUsers: number }[];
}

const UserTrendsChart: React.FC<UserTrendsChartProps> = ({ data }) => {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="users" name="Total Users" stroke="#3b82f6" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="newUsers" name="New Users" stroke="#22c55e" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

interface DatePickerWithRangeProps {
  date: DateRange;
  setDate: React.Dispatch<React.SetStateAction<DateRange>>;
}

const DatePickerWithRange: React.FC<DatePickerWithRangeProps> = ({ date, setDate }) => {
  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date as any}
            onSelect={(range) => setDate(range as DateRange)}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

const EnhancedAnalyticsDashboard: React.FC = () => {
  const [date, setDate] = useState<DateRange>({
    from: new Date(2023, 0, 1),
    to: new Date()
  });
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("30days");
  
  // Create data for user trends chart
  const userTrendsData = analyticsData.users.lastMonthActive.map((item) => ({
    name: format(new Date(item.date), "MMM d"),
    users: item.users,
    newUsers: Math.floor(item.users * 0.03)
  }));
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <div className="flex items-center gap-2">
          <DatePickerWithRange date={date} setDate={setDate} />
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="ai">AI Usage</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <UsersStatsCards data={analyticsData} />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>
                  Total users and new signups over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserTrendsChart data={userTrendsData} />
              </CardContent>
            </Card>
            
            <UserDistributionCard data={analyticsData.users.byPlan} totalUsers={analyticsData.users.total} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ContentCategoriesCard categories={analyticsData.content.popularCategories} />
            <RevenueTrendsCard data={analyticsData.revenue.byMonth} className="md:col-span-2" />
          </div>
          
          <AIPerformanceCard data={analyticsData.aiUsage} />
        </TabsContent>
        
        <TabsContent value="users" className="space-y-6">
          <UsersStatsCards data={analyticsData} showNewToday />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex justify-between">
                  <div>
                    <CardTitle>User Growth</CardTitle>
                    <CardDescription>
                      Total users and new signups over time
                    </CardDescription>
                  </div>
                  <Select defaultValue={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7days">Last 7 days</SelectItem>
                      <SelectItem value="30days">Last 30 days</SelectItem>
                      <SelectItem value="90days">Last 90 days</SelectItem>
                      <SelectItem value="year">Last year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <UserTrendsChart data={userTrendsData} />
              </CardContent>
            </Card>
            
            <UserDistributionCard 
              data={analyticsData.users.byPlan} 
              totalUsers={analyticsData.users.total} 
              showFooter
            />
          </div>
          
          <GeographicalDistributionCard data={analyticsData.users.byCountry} totalUsers={analyticsData.users.total} />
        </TabsContent>
        
        <TabsContent value="content" className="space-y-6">
          <ContentStatsCards data={analyticsData.content} />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ContentCategoriesCard categories={analyticsData.content.popularCategories} />
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Top Performing Content</CardTitle>
                <CardDescription>
                  Lessons with highest completion rates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.content.topPerformingContent.map((content, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-4">
                        <span>{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="font-medium">{content.name}</span>
                          <div className="flex items-center">
                            <span className="text-yellow-500 mr-1">★</span>
                            <span>{content.rating}</span>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {content.completions.toLocaleString()} completions
                        </div>
                        <Progress 
                          value={content.rating * 20} 
                          className="h-1 mt-2" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex justify-between">
                <div>
                  <CardTitle>Content Engagement</CardTitle>
                  <CardDescription>
                    User interaction with different content types
                  </CardDescription>
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center justify-center p-6 bg-muted rounded-lg">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-4">
                      <UserIcon className="h-12 w-12 text-primary opacity-75" />
                    </div>
                    <div className="text-lg font-medium">User Engagement</div>
                    <div className="text-3xl font-bold mt-2">76%</div>
                    <div className="text-sm text-muted-foreground mt-2">
                      Average completion rate
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center p-6 bg-muted rounded-lg">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-4">
                      <BookOpen className="h-12 w-12 text-primary opacity-75" />
                    </div>
                    <div className="text-lg font-medium">Material Effectiveness</div>
                    <div className="text-3xl font-bold mt-2">87%</div>
                    <div className="text-sm text-muted-foreground mt-2">
                      Content quality rating
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center p-6 bg-muted rounded-lg">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-4">
                      <Clock className="h-12 w-12 text-primary opacity-75" />
                    </div>
                    <div className="text-lg font-medium">Time Spent</div>
                    <div className="text-3xl font-bold mt-2">34 min</div>
                    <div className="text-sm text-muted-foreground mt-2">
                      Average per session
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ai" className="space-y-6">
          <AIUsageCards data={analyticsData.aiUsage} />
          
          <Card>
            <CardHeader>
              <CardTitle>AI Usage by Day</CardTitle>
              <CardDescription>
                Number of AI requests processed daily
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.aiUsage.byDay}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="requests" fill="#6366f1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <AIAccuracyMetricsCard accuracy={analyticsData.aiUsage.accuracy} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ModelUsageCard />
            <PerformanceMetricsCard />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAnalyticsDashboard;
