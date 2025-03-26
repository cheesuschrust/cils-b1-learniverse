import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Bar, BarChart, Line, LineChart, DonutChart } from 'recharts';
import { DateRange } from '@/types/date';

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
    <LineChart
      width={600}
      height={300}
      data={data}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <defs>
        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
          <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
        </linearGradient>
        <linearGradient id="colorNewUsers" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
          <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
        </linearGradient>
      </defs>
      <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} />
      <Line type="monotone" dataKey="newUsers" stroke="#82ca9d" strokeWidth={2} />
    </LineChart>
  );
};

interface RevenueTrendsChartProps {
  data: { month: string; revenue: number }[];
}

const RevenueTrendsChart: React.FC<RevenueTrendsChartProps> = ({ data }) => {
  return (
    <BarChart
      width={600}
      height={300}
      data={data}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <Bar dataKey="revenue" fill="#8884d8" />
    </BarChart>
  );
};

interface AIUsageChartProps {
  data: { day: string; requests: number }[];
}

const AIUsageChart: React.FC<AIUsageChartProps> = ({ data }) => {
  return (
    <BarChart
      width={600}
      height={300}
      data={data}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <Bar dataKey="requests" fill="#6366f1" />
    </BarChart>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.users.total.toLocaleString()}</div>
                <div className="flex items-center mt-1">
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                    +{analyticsData.users.growth}%
                  </Badge>
                  <span className="text-xs text-muted-foreground ml-2">vs. last month</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.users.active.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {Math.round(analyticsData.users.active / analyticsData.users.total * 100)}% of total users
                </div>
                <Progress 
                  value={Math.round(analyticsData.users.active / analyticsData.users.total * 100)} 
                  className="h-1 mt-2" 
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Revenue (MRR)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${analyticsData.revenue.totalMRR.toLocaleString()}</div>
                <div className="flex items-center mt-1">
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                    +{analyticsData.revenue.growth}%
                  </Badge>
                  <span className="text-xs text-muted-foreground ml-2">vs. last month</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.revenue.conversionRate}%</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Free to paid conversions
                </div>
                <Progress 
                  value={analyticsData.revenue.conversionRate} 
                  className="h-1 mt-2" 
                />
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>
                  Total users and new signups over time
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <UserTrendsChart data={userTrendsData} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
                <CardDescription>
                  Users by subscription plan
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="h-52 w-full">
                  <div className="flex flex-col items-center justify-center h-full">
                    {analyticsData.users.byPlan.map((plan, index) => (
                      <div key={index} className="flex justify-between w-full text-sm my-1">
                        <span>{plan.name}</span>
                        <span>{Math.round(plan.value / analyticsData.users.total * 100)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Popular Categories</CardTitle>
                <CardDescription>
                  Most accessed content categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.content.popularCategories.map((category, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">{category.name}</span>
                        <span className="text-sm">{category.value}%</span>
                      </div>
                      <Progress value={category.value} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>
                  Monthly recurring revenue
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <RevenueTrendsChart data={analyticsData.revenue.byMonth} />
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>AI System Performance</CardTitle>
              <CardDescription>
                Accuracy metrics across different AI features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div>
                  <div className="text-center mb-2">
                    <span className="text-sm font-medium">Overall</span>
                    <div className="text-2xl font-bold">{analyticsData.aiUsage.accuracy.overall}%</div>
                  </div>
                  <Progress value={analyticsData.aiUsage.accuracy.overall} className="h-2" />
                </div>
                <div>
                  <div className="text-center mb-2">
                    <span className="text-sm font-medium">Speech</span>
                    <div className="text-2xl font-bold">{analyticsData.aiUsage.accuracy.speechRecognition}%</div>
                  </div>
                  <Progress value={analyticsData.aiUsage.accuracy.speechRecognition} className="h-2" />
                </div>
                <div>
                  <div className="text-center mb-2">
                    <span className="text-sm font-medium">Text</span>
                    <div className="text-2xl font-bold">{analyticsData.aiUsage.accuracy.textGeneration}%</div>
                  </div>
                  <Progress value={analyticsData.aiUsage.accuracy.textGeneration} className="h-2" />
                </div>
                <div>
                  <div className="text-center mb-2">
                    <span className="text-sm font-medium">Translation</span>
                    <div className="text-2xl font-bold">{analyticsData.aiUsage.accuracy.translation}%</div>
                  </div>
                  <Progress value={analyticsData.aiUsage.accuracy.translation} className="h-2" />
                </div>
                <div>
                  <div className="text-center mb-2">
                    <span className="text-sm font-medium">Flashcards</span>
                    <div className="text-2xl font-bold">{analyticsData.aiUsage.accuracy.flashcardGeneration}%</div>
                  </div>
                  <Progress value={analyticsData.aiUsage.accuracy.flashcardGeneration} className="h-2" />
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="flex justify-center">
                <AIUsageChart data={analyticsData.aiUsage.byDay} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.users.total.toLocaleString()}</div>
                <div className="flex items-center mt-1">
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                    +{analyticsData.users.newToday} today
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Premium Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.users.premium.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {Math.round(analyticsData.users.premium / analyticsData.users.total * 100)}% of total users
                </div>
                <Progress 
                  value={Math.round(analyticsData.users.premium / analyticsData.users.total * 100)} 
                  className="h-1 mt-2" 
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.users.retentionRate}%</div>
                <div className="text-xs text-muted-foreground mt-1">
                  30-day user retention
                </div>
                <Progress 
                  value={analyticsData.users.retentionRate} 
                  className="h-1 mt-2" 
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Session Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.users.averageSessionTime} min</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Time spent per session
                </div>
              </CardContent>
            </Card>
          </div>
          
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
              <CardContent className="flex justify-center">
                <UserTrendsChart data={userTrendsData} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>User Plans</CardTitle>
                <CardDescription>
                  Distribution by subscription
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="h-60 w-full">
                  <div className="flex flex-col justify-center h-full">
                    {analyticsData.users.byPlan.map((plan, index) => (
                      <div key={index} className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">{plan.name}</span>
                          <span>{plan.value.toLocaleString()} users</span>
                        </div>
                        <Progress 
                          value={Math.round(plan.value / analyticsData.users.total * 100)} 
                          className="h-2" 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <div className="w-full space-y-1">
                  {analyticsData.users.byPlan.map((plan, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{plan.name}</span>
                      <span>{Math.round(plan.value / analyticsData.users.total * 100)}%</span>
                    </div>
                  ))}
                </div>
              </CardFooter>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Geographical Distribution</CardTitle>
              <CardDescription>
                Users by country
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="space-y-4">
                    {analyticsData.users.byCountry.map((country, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">{country.name}</span>
                          <span className="text-sm">{Math.round(country.value / analyticsData.users.total * 100)}%</span>
                        </div>
                        <Progress 
                          value={Math.round(country.value / analyticsData.users.total * 100)} 
                          className="h-2" 
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-center items-center">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-2">Top Countries</p>
                    <div className="space-y-4">
                      {analyticsData.users.byCountry.slice(0, 3).map((country, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mr-4">
                            <span className="text-2xl">{index + 1}</span>
                          </div>
                          <div className="text-left">
                            <div className="font-medium">{country.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {country.value.toLocaleString()} users
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Lessons</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.content.totalLessons.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Available in the platform
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Lessons Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.content.completedLessons.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Total user completions
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Flashcards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.content.flashcards.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Available for practice
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.content.averageScore}%</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Average lesson completion score
                </div>
                <Progress 
                  value={analyticsData.content.averageScore} 
                  className="h-1 mt-2" 
                />
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Categories</CardTitle>
                <CardDescription>
                  Distribution by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <DonutChart
                    data={analyticsData.content.popularCategories}
                    category="value"
                    index="name"
                    valueFormatter={(value) => `${value}%`}
                    colors={["blue", "cyan", "indigo", "violet"]}
                    className="h-52"
                  />
                </div>
              </CardContent>
            </Card>
            
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
                      <UserIcon

