
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, LineChart, PieChart, AreaChart } from '@/components/ui/chart';
import { 
  Users, 
  CreditCard, 
  Activity, 
  TrendingUp, 
  BarChart3, 
  PieChart as PieChartIcon, 
  Calendar, 
  Download, 
  Layers, 
  Filter
} from 'lucide-react';

const mockUserData = {
  totalUsers: 5247,
  activeUsers: 3812,
  premiumUsers: 2209,
  newUsersThisMonth: 328,
  userGrowth: 8.5,
  retentionRate: 76.2,
  usersByCountry: [
    { name: 'United States', value: 32 },
    { name: 'Italy', value: 18 },
    { name: 'United Kingdom', value: 12 },
    { name: 'Germany', value: 10 },
    { name: 'France', value: 7 },
    { name: 'Other', value: 21 }
  ],
  usersBySubscription: [
    { name: 'Free', value: 58 },
    { name: 'Premium', value: 35 },
    { name: 'Educational', value: 7 }
  ],
  userActivity: [
    { name: 'Jan', users: 3100, newUsers: 250 },
    { name: 'Feb', users: 3250, newUsers: 220 },
    { name: 'Mar', users: 3400, newUsers: 200 },
    { name: 'Apr', users: 3500, newUsers: 180 },
    { name: 'May', users: 3650, newUsers: 210 },
    { name: 'Jun', users: 3800, newUsers: 240 },
    { name: 'Jul', users: 3950, newUsers: 280 },
    { name: 'Aug', users: 4100, newUsers: 270 },
    { name: 'Sep', users: 4300, newUsers: 290 },
    { name: 'Oct', users: 4550, newUsers: 320 },
    { name: 'Nov', users: 4800, newUsers: 340 },
    { name: 'Dec', users: 5100, newUsers: 350 }
  ]
};

const mockRevenueData = {
  totalRevenue: 125732.89,
  revenueThisMonth: 18429.55,
  revenueGrowth: 12.7,
  averageRevenuePerUser: 56.92,
  conversionRate: 8.2,
  churnRate: 4.5,
  revenueByPlan: [
    { name: 'Monthly Premium', value: 42 },
    { name: 'Annual Premium', value: 38 },
    { name: 'Educational', value: 20 }
  ],
  revenueOverTime: [
    { name: 'Jan', revenue: 8200 },
    { name: 'Feb', revenue: 8500 },
    { name: 'Mar', revenue: 9100 },
    { name: 'Apr', revenue: 9500 },
    { name: 'May', revenue: 10200 },
    { name: 'Jun', revenue: 11000 },
    { name: 'Jul', revenue: 11800 },
    { name: 'Aug', revenue: 12500 },
    { name: 'Sep', revenue: 13400 },
    { name: 'Oct', revenue: 14800 },
    { name: 'Nov', revenue: 16200 },
    { name: 'Dec', revenue: 18400 }
  ]
};

const mockContentData = {
  totalQuestions: 12483,
  totalFlashcards: 28742,
  totalListeningExercises: 547,
  totalSpeakingExercises: 328,
  questionCompletionRate: 68.3,
  flashcardMasteryRate: 42.7,
  popularCategories: [
    { name: 'Vocabulary', value: 45 },
    { name: 'Grammar', value: 25 },
    { name: 'Conversation', value: 20 },
    { name: 'Culture', value: 10 }
  ],
  contentEngagement: [
    { name: 'Jan', flashcards: 8500, questions: 6200, listening: 1800, speaking: 1200 },
    { name: 'Feb', flashcards: 9200, questions: 6500, listening: 2000, speaking: 1300 },
    { name: 'Mar', flashcards: 10100, questions: 7100, listening: 2200, speaking: 1400 },
    { name: 'Apr', flashcards: 11500, questions: 7800, listening: 2500, speaking: 1600 },
    { name: 'May', flashcards: 13200, questions: 8600, listening: 2800, speaking: 1800 },
    { name: 'Jun', flashcards: 15000, questions: 9500, listening: 3100, speaking: 2000 },
    { name: 'Jul', flashcards: 17200, questions: 10500, listening: 3500, speaking: 2300 },
    { name: 'Aug', flashcards: 19500, questions: 11600, listening: 3900, speaking: 2600 },
    { name: 'Sep', flashcards: 22000, questions: 12800, listening: 4300, speaking: 2900 },
    { name: 'Oct', flashcards: 24800, questions: 14100, listening: 4800, speaking: 3300 },
    { name: 'Nov', flashcards: 27500, questions: 15600, listening: 5300, speaking: 3700 },
    { name: 'Dec', flashcards: 30500, questions: 17200, listening: 5900, speaking: 4100 }
  ]
};

const mockAdData = {
  totalImpressions: 8542721,
  totalClicks: 287432,
  totalRevenue: 42873.52,
  clickThroughRate: 3.36,
  revenuePerMille: 5.02,
  adsByPosition: [
    { name: 'Sidebar', value: 45 },
    { name: 'Top', value: 32 },
    { name: 'Inline', value: 18 },
    { name: 'Bottom', value: 5 }
  ],
  adsByFormat: [
    { name: 'Banner', value: 58 },
    { name: 'Native', value: 25 },
    { name: 'Text', value: 17 }
  ],
  adPerformance: [
    { name: 'Jan', impressions: 650000, clicks: 21000, revenue: 3200 },
    { name: 'Feb', impressions: 680000, clicks: 22500, revenue: 3400 },
    { name: 'Mar', impressions: 710000, clicks: 23800, revenue: 3600 },
    { name: 'Apr', impressions: 750000, clicks: 25000, revenue: 3800 },
    { name: 'May', impressions: 790000, clicks: 26500, revenue: 4000 },
    { name: 'Jun', impressions: 820000, clicks: 27800, revenue: 4200 },
    { name: 'Jul', impressions: 860000, clicks: 29100, revenue: 4400 },
    { name: 'Aug', impressions: 890000, clicks: 30400, revenue: 4600 },
    { name: 'Sep', impressions: 920000, clicks: 31700, revenue: 4800 },
    { name: 'Oct', impressions: 950000, clicks: 33000, revenue: 5000 },
    { name: 'Nov', impressions: 980000, clicks: 34300, revenue: 5200 },
    { name: 'Dec', impressions: 1020000, clicks: 35600, revenue: 5400 }
  ]
};

const AdminAnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('year');
  
  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive insights into platform performance</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Last 24 Hours</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="quarter">Last 3 Months</SelectItem>
              <SelectItem value="year">Last 12 Months</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockUserData.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500 font-medium">+{mockUserData.userGrowth}%</span> from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Premium Users</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockUserData.premiumUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((mockUserData.premiumUsers / mockUserData.totalUsers) * 100)}% of total users
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mockRevenueData.revenueThisMonth.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500 font-medium">+{mockRevenueData.revenueGrowth}%</span> from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ad Revenue</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mockAdData.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              CTR: {mockAdData.clickThroughRate}% | RPM: ${mockAdData.revenuePerMille.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full mb-8">
          <TabsTrigger value="users" className="flex items-center justify-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="revenue" className="flex items-center justify-center gap-2">
            <CreditCard className="h-4 w-4" />
            Revenue
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center justify-center gap-2">
            <Layers className="h-4 w-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="ads" className="flex items-center justify-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Ads
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>Total users and new sign-ups over time</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart 
                  data={mockUserData.userActivity}
                  index="name"
                  categories={["users", "newUsers"]}
                  colors={["blue", "green"]}
                  valueFormatter={(value) => `${value.toLocaleString()} users`}
                  yAxisWidth={60}
                  className="h-80"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
                <CardDescription>Breakdown by subscription type and location</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-sm font-medium mb-3">By Subscription</h4>
                    <PieChart 
                      data={mockUserData.usersBySubscription}
                      index="name"
                      category="value"
                      valueFormatter={(value) => `${value}%`}
                      colors={["slate", "blue", "amber"]}
                      className="h-40"
                    />
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-3">By Country</h4>
                    <PieChart 
                      data={mockUserData.usersByCountry}
                      index="name"
                      category="value"
                      valueFormatter={(value) => `${value}%`}
                      colors={["blue", "green", "amber", "red", "purple", "slate"]}
                      className="h-40"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>User Activity Metrics</CardTitle>
                <CardDescription>Key user engagement and retention indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="border rounded-lg p-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Active Users</h4>
                    <p className="text-2xl font-bold mt-1">{mockUserData.activeUsers.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {Math.round((mockUserData.activeUsers / mockUserData.totalUsers) * 100)}% of total users
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="text-sm font-medium text-muted-foreground">New Users (30d)</h4>
                    <p className="text-2xl font-bold mt-1">{mockUserData.newUsersThisMonth.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {Math.round((mockUserData.newUsersThisMonth / mockUserData.totalUsers) * 100)}% growth
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Retention Rate</h4>
                    <p className="text-2xl font-bold mt-1">{mockUserData.retentionRate}%</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Average over 30 days
                    </p>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <h4 className="text-sm font-medium mb-4">Activity by Time of Day</h4>
                  <BarChart 
                    data={[
                      { hour: "12am", users: 120 },
                      { hour: "2am", users: 80 },
                      { hour: "4am", users: 60 },
                      { hour: "6am", users: 120 },
                      { hour: "8am", users: 280 },
                      { hour: "10am", users: 460 },
                      { hour: "12pm", users: 380 },
                      { hour: "2pm", users: 340 },
                      { hour: "4pm", users: 420 },
                      { hour: "6pm", users: 520 },
                      { hour: "8pm", users: 480 },
                      { hour: "10pm", users: 280 },
                    ]}
                    index="hour"
                    categories={["users"]}
                    colors={["blue"]}
                    valueFormatter={(value) => `${value} users`}
                    className="h-64"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="revenue">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Growth</CardTitle>
                <CardDescription>Monthly revenue over time</CardDescription>
              </CardHeader>
              <CardContent>
                <AreaChart 
                  data={mockRevenueData.revenueOverTime}
                  index="name"
                  categories={["revenue"]}
                  colors={["emerald"]}
                  valueFormatter={(value) => `$${value.toLocaleString()}`}
                  className="h-80"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Revenue Distribution</CardTitle>
                <CardDescription>Breakdown by subscription plan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-8">
                  <PieChart 
                    data={mockRevenueData.revenueByPlan}
                    index="name"
                    category="value"
                    valueFormatter={(value) => `${value}%`}
                    colors={["blue", "emerald", "amber"]}
                    className="h-64"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Conversion Rate</h4>
                    <p className="text-2xl font-bold mt-1">{mockRevenueData.conversionRate}%</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Free to premium users
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Avg. Revenue Per User</h4>
                    <p className="text-2xl font-bold mt-1">${mockRevenueData.averageRevenuePerUser}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Monthly ARPU
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Churn Rate</h4>
                    <p className="text-2xl font-bold mt-1">{mockRevenueData.churnRate}%</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Monthly subscriber loss
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Subscription Analysis</CardTitle>
                  <CardDescription>Conversion, retention, and lifetime value metrics</CardDescription>
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Plans</SelectItem>
                    <SelectItem value="monthly">Monthly Premium</SelectItem>
                    <SelectItem value="annual">Annual Premium</SelectItem>
                    <SelectItem value="educational">Educational</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <div className="border rounded-lg p-4">
                    <h4 className="text-sm font-medium text-muted-foreground">New Subscriptions</h4>
                    <p className="text-2xl font-bold mt-1">248</p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                      <span className="text-green-500 font-medium">+18%</span> from last month
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Upgrades</h4>
                    <p className="text-2xl font-bold mt-1">86</p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                      <span className="text-green-500 font-medium">+12%</span> from last month
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Cancellations</h4>
                    <p className="text-2xl font-bold mt-1">42</p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center">
                      <svg className="h-3 w-3 mr-1 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12l4-4m0 8l4-4" />
                      </svg>
                      <span className="text-amber-500 font-medium">-5%</span> from last month
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Avg. Lifetime Value</h4>
                    <p className="text-2xl font-bold mt-1">$284</p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                      <span className="text-green-500 font-medium">+8%</span> from last month
                    </p>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <h4 className="text-sm font-medium mb-4">Subscription Cohort Retention</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-4 font-medium">Cohort</th>
                          <th className="text-center py-2 px-4 font-medium">Month 1</th>
                          <th className="text-center py-2 px-4 font-medium">Month 2</th>
                          <th className="text-center py-2 px-4 font-medium">Month 3</th>
                          <th className="text-center py-2 px-4 font-medium">Month 6</th>
                          <th className="text-center py-2 px-4 font-medium">Month 12</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b hover:bg-muted/50">
                          <td className="py-2 px-4 font-medium">Jan 2023</td>
                          <td className="py-2 px-4 text-center">100%</td>
                          <td className="py-2 px-4 text-center">92%</td>
                          <td className="py-2 px-4 text-center">84%</td>
                          <td className="py-2 px-4 text-center">76%</td>
                          <td className="py-2 px-4 text-center">68%</td>
                        </tr>
                        <tr className="border-b hover:bg-muted/50">
                          <td className="py-2 px-4 font-medium">Feb 2023</td>
                          <td className="py-2 px-4 text-center">100%</td>
                          <td className="py-2 px-4 text-center">94%</td>
                          <td className="py-2 px-4 text-center">86%</td>
                          <td className="py-2 px-4 text-center">78%</td>
                          <td className="py-2 px-4 text-center">-</td>
                        </tr>
                        <tr className="border-b hover:bg-muted/50">
                          <td className="py-2 px-4 font-medium">Mar 2023</td>
                          <td className="py-2 px-4 text-center">100%</td>
                          <td className="py-2 px-4 text-center">91%</td>
                          <td className="py-2 px-4 text-center">85%</td>
                          <td className="py-2 px-4 text-center">-</td>
                          <td className="py-2 px-4 text-center">-</td>
                        </tr>
                        <tr className="border-b hover:bg-muted/50">
                          <td className="py-2 px-4 font-medium">Apr 2023</td>
                          <td className="py-2 px-4 text-center">100%</td>
                          <td className="py-2 px-4 text-center">93%</td>
                          <td className="py-2 px-4 text-center">-</td>
                          <td className="py-2 px-4 text-center">-</td>
                          <td className="py-2 px-4 text-center">-</td>
                        </tr>
                        <tr className="hover:bg-muted/50">
                          <td className="py-2 px-4 font-medium">May 2023</td>
                          <td className="py-2 px-4 text-center">100%</td>
                          <td className="py-2 px-4 text-center">-</td>
                          <td className="py-2 px-4 text-center">-</td>
                          <td className="py-2 px-4 text-center">-</td>
                          <td className="py-2 px-4 text-center">-</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="content">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Engagement</CardTitle>
                <CardDescription>Usage trends by content type</CardDescription>
              </CardHeader>
              <CardContent>
                <AreaChart 
                  data={mockContentData.contentEngagement}
                  index="name"
                  categories={["flashcards", "questions", "listening", "speaking"]}
                  colors={["blue", "amber", "green", "purple"]}
                  valueFormatter={(value) => `${value.toLocaleString()} uses`}
                  className="h-80"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Content Distribution</CardTitle>
                <CardDescription>Breakdown by category and completion rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-3">By Category</h4>
                  <PieChart 
                    data={mockContentData.popularCategories}
                    index="name"
                    category="value"
                    valueFormatter={(value) => `${value}%`}
                    colors={["blue", "amber", "green", "purple"]}
                    className="h-64"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Question Completion</h4>
                    <p className="text-2xl font-bold mt-1">{mockContentData.questionCompletionRate}%</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Average completion rate
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Flashcard Mastery</h4>
                    <p className="text-2xl font-bold mt-1">{mockContentData.flashcardMasteryRate}%</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Cards marked as mastered
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Content Performance</CardTitle>
                  <CardDescription>Most used and highest rated content</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Content type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="flashcards">Flashcards</SelectItem>
                      <SelectItem value="questions">Questions</SelectItem>
                      <SelectItem value="listening">Listening</SelectItem>
                      <SelectItem value="speaking">Speaking</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Title</th>
                        <th className="text-left py-3 px-4 font-medium">Type</th>
                        <th className="text-left py-3 px-4 font-medium">Category</th>
                        <th className="text-center py-3 px-4 font-medium">Uses</th>
                        <th className="text-center py-3 px-4 font-medium">Completion</th>
                        <th className="text-center py-3 px-4 font-medium">Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">Basic Italian Greetings</td>
                        <td className="py-3 px-4">Flashcards</td>
                        <td className="py-3 px-4">Vocabulary</td>
                        <td className="py-3 px-4 text-center">12,845</td>
                        <td className="py-3 px-4 text-center">92%</td>
                        <td className="py-3 px-4 text-center">4.8/5</td>
                      </tr>
                      <tr className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">Present Tense Conjugation</td>
                        <td className="py-3 px-4">Questions</td>
                        <td className="py-3 px-4">Grammar</td>
                        <td className="py-3 px-4 text-center">9,273</td>
                        <td className="py-3 px-4 text-center">78%</td>
                        <td className="py-3 px-4 text-center">4.5/5</td>
                      </tr>
                      <tr className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">Restaurant Conversations</td>
                        <td className="py-3 px-4">Listening</td>
                        <td className="py-3 px-4">Conversation</td>
                        <td className="py-3 px-4 text-center">7,521</td>
                        <td className="py-3 px-4 text-center">85%</td>
                        <td className="py-3 px-4 text-center">4.7/5</td>
                      </tr>
                      <tr className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">Numbers 1-100</td>
                        <td className="py-3 px-4">Flashcards</td>
                        <td className="py-3 px-4">Vocabulary</td>
                        <td className="py-3 px-4 text-center">7,218</td>
                        <td className="py-3 px-4 text-center">90%</td>
                        <td className="py-3 px-4 text-center">4.6/5</td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">Daily Routines</td>
                        <td className="py-3 px-4">Speaking</td>
                        <td className="py-3 px-4">Conversation</td>
                        <td className="py-3 px-4 text-center">6,932</td>
                        <td className="py-3 px-4 text-center">72%</td>
                        <td className="py-3 px-4 text-center">4.4/5</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="ads">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ad Performance</CardTitle>
                <CardDescription>Impressions, clicks, and revenue trends</CardDescription>
              </CardHeader>
              <CardContent>
                <AreaChart 
                  data={mockAdData.adPerformance}
                  index="name"
                  categories={["impressions"]}
                  colors={["blue"]}
                  valueFormatter={(value) => `${value.toLocaleString()}`}
                  className="h-80"
                />
                <div className="flex justify-center gap-6 mt-2">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-sm text-muted-foreground">Impressions</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-amber-500 mr-2"></div>
                    <span className="text-sm text-muted-foreground">Clicks (×30)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm text-muted-foreground">Revenue (×200)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Ad Distribution</CardTitle>
                <CardDescription>Breakdown by position and format</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-sm font-medium mb-3">By Position</h4>
                    <PieChart 
                      data={mockAdData.adsByPosition}
                      index="name"
                      category="value"
                      valueFormatter={(value) => `${value}%`}
                      colors={["blue", "green", "amber", "red"]}
                      className="h-40"
                    />
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-3">By Format</h4>
                    <PieChart 
                      data={mockAdData.adsByFormat}
                      index="name"
                      category="value"
                      valueFormatter={(value) => `${value}%`}
                      colors={["purple", "teal", "orange"]}
                      className="h-40"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                  <div className="border rounded-lg p-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Click-Through Rate</h4>
                    <p className="text-2xl font-bold mt-1">{mockAdData.clickThroughRate}%</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Industry avg: 2.8%
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Revenue Per 1000 Impressions</h4>
                    <p className="text-2xl font-bold mt-1">${mockAdData.revenuePerMille.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Industry avg: $4.30
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Top Performing Ads</CardTitle>
                  <CardDescription>Highest revenue and engagement ads</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by network" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Networks</SelectItem>
                      <SelectItem value="internal">Internal</SelectItem>
                      <SelectItem value="google">Google</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Ad Name</th>
                        <th className="text-left py-3 px-4 font-medium">Format</th>
                        <th className="text-left py-3 px-4 font-medium">Position</th>
                        <th className="text-center py-3 px-4 font-medium">Impressions</th>
                        <th className="text-center py-3 px-4 font-medium">Clicks</th>
                        <th className="text-center py-3 px-4 font-medium">CTR</th>
                        <th className="text-center py-3 px-4 font-medium">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">Premium Subscription Promotion</td>
                        <td className="py-3 px-4">Banner</td>
                        <td className="py-3 px-4">Top</td>
                        <td className="py-3 px-4 text-center">1,238,452</td>
                        <td className="py-3 px-4 text-center">52,893</td>
                        <td className="py-3 px-4 text-center">4.27%</td>
                        <td className="py-3 px-4 text-center">$7,402.53</td>
                      </tr>
                      <tr className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">Italian Culture Course</td>
                        <td className="py-3 px-4">Native</td>
                        <td className="py-3 px-4">Inline</td>
                        <td className="py-3 px-4 text-center">874,321</td>
                        <td className="py-3 px-4 text-center">32,159</td>
                        <td className="py-3 px-4 text-center">3.68%</td>
                        <td className="py-3 px-4 text-center">$5,873.21</td>
                      </tr>
                      <tr className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">Mobile App Download</td>
                        <td className="py-3 px-4">Banner</td>
                        <td className="py-3 px-4">Bottom</td>
                        <td className="py-3 px-4 text-center">692,784</td>
                        <td className="py-3 px-4 text-center">24,872</td>
                        <td className="py-3 px-4 text-center">3.59%</td>
                        <td className="py-3 px-4 text-center">$4,231.68</td>
                      </tr>
                      <tr className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">Italian Travel Packages</td>
                        <td className="py-3 px-4">Banner</td>
                        <td className="py-3 px-4">Sidebar</td>
                        <td className="py-3 px-4 text-center">583,921</td>
                        <td className="py-3 px-4 text-center">18,693</td>
                        <td className="py-3 px-4 text-center">3.20%</td>
                        <td className="py-3 px-4 text-center">$3,845.29</td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">Italian Cooking Class</td>
                        <td className="py-3 px-4">Native</td>
                        <td className="py-3 px-4">Inline</td>
                        <td className="py-3 px-4 text-center">421,573</td>
                        <td className="py-3 px-4 text-center">14,328</td>
                        <td className="py-3 px-4 text-center">3.40%</td>
                        <td className="py-3 px-4 text-center">$2,941.85</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAnalyticsDashboard;
