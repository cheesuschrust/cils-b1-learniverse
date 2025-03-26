
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
import { BarChart, LineChart, DonutChart } from '@/components/admin/charts';
import { DateRange } from '@/types/date';

// Import newly created components
import { 
  UsersStatsCards,
  UserTrendsChart,
  UserDistributionCard,
  ContentCategoriesCard,
  RevenueTrendsCard,
  AIPerformanceCard,
  GeographicalDistributionCard,
  ContentStatsCards,
  AIUsageCards,
  AIAccuracyMetricsCard,
  ModelUsageCard,
  PerformanceMetricsCard
} from '@/components/admin/analytics';

import { analyticsData } from '@/data/analyticsData';

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
              <BarChart 
                data={analyticsData.aiUsage.byDay}
                xKey="day"
                yKey="requests"
                color="#6366f1"
              />
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
