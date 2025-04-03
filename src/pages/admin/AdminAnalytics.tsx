
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Calendar, 
  BarChart2, 
  PieChart as PieChartIcon,
  TrendingUp,
  Users,
  FileText,
  BookOpen, 
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  ChevronDown
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const AdminAnalytics = () => {
  const [dateRange, setDateRange] = useState('30d');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const userEngagementData = [
    { date: '2023-01-01', activeUsers: 120, sessionsPerUser: 2.5, avgSessionTime: 18 },
    { date: '2023-02-01', activeUsers: 145, sessionsPerUser: 2.8, avgSessionTime: 20 },
    { date: '2023-03-01', activeUsers: 165, sessionsPerUser: 3.1, avgSessionTime: 22 },
    { date: '2023-04-01', activeUsers: 210, sessionsPerUser: 3.4, avgSessionTime: 25 },
    { date: '2023-05-01', activeUsers: 250, sessionsPerUser: 3.6, avgSessionTime: 26 },
    { date: '2023-06-01', activeUsers: 280, sessionsPerUser: 3.7, avgSessionTime: 28 },
  ];
  
  const subscriptionData = [
    { name: 'Free', value: 65 },
    { name: 'Premium', value: 25 },
    { name: 'Institutional', value: 10 },
  ];
  
  const COLORS = ['#a3a3a3', '#3b82f6', '#10b981'];
  
  const contentPerformanceData = [
    { category: 'Grammar', completionRate: 78, avgScore: 82, userEngagement: 65 },
    { category: 'Vocabulary', completionRate: 85, avgScore: 76, userEngagement: 72 },
    { category: 'Reading', completionRate: 62, avgScore: 70, userEngagement: 58 },
    { category: 'Listening', completionRate: 51, avgScore: 68, userEngagement: 45 },
    { category: 'Culture', completionRate: 73, avgScore: 85, userEngagement: 70 },
  ];
  
  const conversionData = [
    { name: 'Site Visits', value: 100 },
    { name: 'Account Creation', value: 65 },
    { name: 'Lesson Start', value: 45 },
    { name: 'Lesson Completion', value: 38 },
    { name: 'Premium Trial', value: 15 },
    { name: 'Subscription', value: 8 },
  ];
  
  return (
    <div className="space-y-6">
      <Helmet>
        <title>Analytics Dashboard - Admin</title>
      </Helmet>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        
        <div className="flex flex-wrap gap-2">
          <Select 
            value={dateRange} 
            onValueChange={setDateRange}
          >
            <SelectTrigger className="w-[150px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="6m">Last 6 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <Download className="mr-1 h-4 w-4" />
                Export
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Export Format</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Export as Excel
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="outline" onClick={() => {}}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Users" 
          value="1,245"
          description="+12.5% from last period"
          icon={<Users className="h-4 w-4" />}
          trend="up"
        />
        
        <StatsCard 
          title="Active Users" 
          value="867"
          description="69.6% active rate"
          icon={<Users className="h-4 w-4" />}
          trend="up"
        />
        
        <StatsCard 
          title="Content Items" 
          value="324"
          description="+8 new items this month"
          icon={<FileText className="h-4 w-4" />}
          trend="up"
        />
        
        <StatsCard 
          title="Conversion Rate" 
          value="8.2%"
          description="-0.5% from last period"
          icon={<TrendingUp className="h-4 w-4" />}
          trend="down"
        />
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="engagement">User Engagement</TabsTrigger>
          <TabsTrigger value="content">Content Performance</TabsTrigger>
          <TabsTrigger value="conversion">Conversion</TabsTrigger>
          <TabsTrigger value="ai">AI Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>New user registrations over time</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={userEngagementData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="activeUsers" 
                        name="Active Users" 
                        stroke="#3b82f6" 
                        strokeWidth={2} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Subscription Distribution</CardTitle>
                <CardDescription>User subscription breakdown</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[300px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={subscriptionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {subscriptionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Content Usage Overview</CardTitle>
              <CardDescription>Performance metrics by content category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={contentPerformanceData} barSize={30}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completionRate" name="Completion Rate (%)" fill="#3b82f6" />
                    <Bar dataKey="avgScore" name="Average Score (%)" fill="#10b981" />
                    <Bar dataKey="userEngagement" name="User Engagement (%)" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Content</CardTitle>
                <CardDescription>Most popular content items</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Italian Greetings Basics</p>
                        <p className="text-xs text-muted-foreground">Vocabulary • Beginner</p>
                      </div>
                      <Badge variant="outline">3.2k views</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>User Activity</CardTitle>
                <CardDescription>Activity patterns by time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Most active day</h4>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold">Tuesday</p>
                      <Badge variant="outline">24% of activity</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Peak hours</h4>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold">6pm - 9pm</p>
                      <Badge variant="outline">35% of activity</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Average session</h4>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold">24 minutes</p>
                      <Badge variant="default">+2m from last month</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
                <CardDescription>User journey through conversion</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {conversionData.map((item, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{item.name}</span>
                        <span>{item.value}%</span>
                      </div>
                      <Progress value={item.value} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Engagement Metrics</CardTitle>
              <CardDescription>Detailed metrics on user engagement over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userEngagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="sessionsPerUser" 
                      name="Sessions Per User" 
                      stroke="#3b82f6" 
                      strokeWidth={2} 
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="avgSessionTime" 
                      name="Avg. Session Time (min)" 
                      stroke="#10b981" 
                      strokeWidth={2} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Retention Analysis</CardTitle>
                <CardDescription>User retention week over week</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cohort</TableHead>
                      <TableHead>Week 1</TableHead>
                      <TableHead>Week 2</TableHead>
                      <TableHead>Week 3</TableHead>
                      <TableHead>Week 4</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {['June 1-7', 'June 8-14', 'June 15-21', 'June 22-28'].map((week, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{week}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-600">100%</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">{80 - i * 5}%</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-amber-500">{65 - i * 7}%</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={i < 2 ? "bg-amber-600" : "bg-red-500"}>
                            {52 - i * 8}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>User Segments</CardTitle>
                <CardDescription>User engagement by segment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">New Users (0-7 days)</h4>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Completion Rate</span>
                      <span>45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Regular Users (8-30 days)</h4>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Completion Rate</span>
                      <span>72%</span>
                    </div>
                    <Progress value={72} className="h-2" />
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Power Users (31+ days)</h4>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Completion Rate</span>
                      <span>88%</span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Premium Users</h4>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Completion Rate</span>
                      <span>92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Activity Heatmap</CardTitle>
              <CardDescription>User activity patterns by day and hour</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[350px] flex items-center justify-center">
                <p className="text-muted-foreground">Connect to real activity data to display heatmap</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Performance Metrics</CardTitle>
              <CardDescription>Metrics for different content categories</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Avg. Completion</TableHead>
                    <TableHead>Avg. Score</TableHead>
                    <TableHead>User Satisfaction</TableHead>
                    <TableHead>Usage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contentPerformanceData.map((category, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{category.category}</TableCell>
                      <TableCell>{10 + i * 5}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className={
                            category.completionRate >= 75 ? "text-green-600" : 
                            category.completionRate >= 60 ? "text-amber-600" : "text-red-600"
                          }>
                            {category.completionRate}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className={
                            category.avgScore >= 80 ? "text-green-600" : 
                            category.avgScore >= 70 ? "text-amber-600" : "text-red-600"
                          }>
                            {category.avgScore}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {Array.from({ length: 5 }).map((_, j) => (
                          <span key={j} className={`text-lg ${j < Math.round(category.avgScore / 20) ? 'text-yellow-500' : 'text-gray-300'}`}>
                            ★
                          </span>
                        ))}
                      </TableCell>
                      <TableCell>
                        <div className="w-24 h-2 bg-gray-200 rounded overflow-hidden">
                          <div 
                            className="h-full bg-blue-600"
                            style={{ width: `${category.userEngagement}%` }}
                          />
                        </div>
                        <span className="text-xs">{category.userEngagement}%</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Content Growth</CardTitle>
                <CardDescription>Content items over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Total Content Items</span>
                    <Badge variant="outline" className="text-xl font-bold">324</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Last Month</p>
                      <div className="flex items-center">
                        <p className="text-xl font-bold">+12</p>
                        <ArrowUpRight className="h-4 w-4 text-green-600 ml-1" />
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Last Week</p>
                      <div className="flex items-center">
                        <p className="text-xl font-bold">+3</p>
                        <ArrowUpRight className="h-4 w-4 text-green-600 ml-1" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Active</p>
                        <p className="text-xl font-bold">296</p>
                        <p className="text-xs text-muted-foreground">91% of total</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Drafts</p>
                        <p className="text-xl font-bold">28</p>
                        <p className="text-xs text-muted-foreground">9% of total</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Lesson Difficulty</CardTitle>
                <CardDescription>Completion rates by difficulty</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Beginner</span>
                      <span className="text-green-600">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Intermediate</span>
                      <span className="text-green-600">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Advanced</span>
                      <span className="text-amber-600">64%</span>
                    </div>
                    <Progress value={64} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Expert</span>
                      <span className="text-red-600">42%</span>
                    </div>
                    <Progress value={42} className="h-2" />
                  </div>
                </div>
                
                <div className="pt-4 mt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Drop-off Points</h4>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>Verb Conjugation</TableCell>
                        <TableCell className="text-red-600">32% drop-off</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Subjunctive Tense</TableCell>
                        <TableCell className="text-red-600">28% drop-off</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Content Distribution</CardTitle>
                <CardDescription>Content items by type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Lessons', value: 120 },
                          { name: 'Exercises', value: 85 },
                          { name: 'Quizzes', value: 65 },
                          { name: 'Flashcards', value: 45 },
                          { name: 'Media', value: 9 },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {[
                          '#3b82f6',
                          '#10b981',
                          '#f59e0b',
                          '#ef4444',
                          '#8b5cf6',
                        ].map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mt-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                    <span>Lessons</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                    <span>Exercises</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 bg-amber-500 rounded-full"></div>
                    <span>Quizzes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                    <span>Flashcards</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 bg-purple-500 rounded-full"></div>
                    <span>Media</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="conversion" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
                <CardDescription>User journey through conversion steps</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={conversionData}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis 
                        type="category" 
                        dataKey="name" 
                        width={120}
                      />
                      <Tooltip />
                      <Bar dataKey="value" name="Percentage" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Conversion Metrics</CardTitle>
                <CardDescription>Key conversion performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Free to Premium</h4>
                    <div className="flex items-center">
                      <p className="text-2xl font-bold">8.2%</p>
                      <Badge variant="destructive" className="ml-2">-0.5%</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">vs. last period</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Signup to First Lesson</h4>
                    <div className="flex items-center">
                      <p className="text-2xl font-bold">68.5%</p>
                      <Badge variant="default" className="ml-2">+2.3%</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">vs. last period</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Trial to Paid</h4>
                    <div className="flex items-center">
                      <p className="text-2xl font-bold">54.7%</p>
                      <Badge variant="default" className="ml-2">+1.8%</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">vs. last period</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Churn Rate</h4>
                    <div className="flex items-center">
                      <p className="text-2xl font-bold">4.2%</p>
                      <Badge variant="destructive" className="ml-2">+0.3%</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">vs. last period</p>
                  </div>
                </div>
                
                <div className="pt-6 mt-6 border-t">
                  <h4 className="text-sm font-medium mb-4">Conversion by Traffic Source</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Source</TableHead>
                        <TableHead>Visitors</TableHead>
                        <TableHead>Conversion</TableHead>
                        <TableHead>Trend</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Organic Search</TableCell>
                        <TableCell>2,845</TableCell>
                        <TableCell>5.2%</TableCell>
                        <TableCell><ArrowUpRight className="h-4 w-4 text-green-600" /></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Direct</TableCell>
                        <TableCell>1,752</TableCell>
                        <TableCell>9.8%</TableCell>
                        <TableCell><ArrowUpRight className="h-4 w-4 text-green-600" /></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Referral</TableCell>
                        <TableCell>1,245</TableCell>
                        <TableCell>12.3%</TableCell>
                        <TableCell><ArrowUpRight className="h-4 w-4 text-green-600" /></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Social</TableCell>
                        <TableCell>843</TableCell>
                        <TableCell>3.5%</TableCell>
                        <TableCell><ArrowDownRight className="h-4 w-4 text-red-600" /></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Subscription Growth</CardTitle>
              <CardDescription>Premium subscriptions over time</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { month: 'Jan', monthly: 45, yearly: 12 },
                      { month: 'Feb', monthly: 52, yearly: 15 },
                      { month: 'Mar', monthly: 61, yearly: 18 },
                      { month: 'Apr', monthly: 67, yearly: 22 },
                      { month: 'May', monthly: 75, yearly: 27 },
                      { month: 'Jun', monthly: 85, yearly: 32 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="monthly" 
                      name="Monthly Plans" 
                      stroke="#3b82f6" 
                      strokeWidth={2} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="yearly" 
                      name="Yearly Plans" 
                      stroke="#10b981" 
                      strokeWidth={2} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Metrics</CardTitle>
                <CardDescription>Monthly recurring revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Recurring Revenue</p>
                    <div className="flex items-center">
                      <p className="text-2xl font-bold">$13,245</p>
                      <Badge variant="default" className="ml-2">+12.3%</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Annual Recurring Revenue</p>
                    <div className="flex items-center">
                      <p className="text-2xl font-bold">$158,940</p>
                      <Badge variant="default" className="ml-2">+15.7%</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Average Revenue Per User</p>
                    <div className="flex items-center">
                      <p className="text-2xl font-bold">$56.48</p>
                      <Badge variant="default" className="ml-2">+2.5%</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Acquisition Cost</CardTitle>
                <CardDescription>Cost per customer acquisition</CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <div className="flex items-center mb-4">
                    <p className="text-3xl font-bold">$24.52</p>
                    <Badge variant="outline" className="ml-2">
                      <span className="text-green-600">-$2.18</span>
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-6">Average cost to acquire a new customer</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Organic Acquisition</span>
                      <span className="font-medium">$12.34</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Paid Acquisition</span>
                      <span className="font-medium">$36.75</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Referral Acquisition</span>
                      <span className="font-medium">$8.21</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Plan Distribution</CardTitle>
                <CardDescription>Subscription plan breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Monthly Basic ($9.99)</span>
                      <span>58%</span>
                    </div>
                    <Progress value={58} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Monthly Premium ($19.99)</span>
                      <span>25%</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Annual Basic ($99.99)</span>
                      <span>12%</span>
                    </div>
                    <Progress value={12} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Annual Premium ($199.99)</span>
                      <span>5%</span>
                    </div>
                    <Progress value={5} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Model Performance</CardTitle>
              <CardDescription>Accuracy and confidence trends over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { month: 'Jan', accuracy: 85, confidence: 72 },
                      { month: 'Feb', accuracy: 87, confidence: 75 },
                      { month: 'Mar', accuracy: 86, confidence: 74 },
                      { month: 'Apr', accuracy: 89, confidence: 78 },
                      { month: 'May', accuracy: 91, confidence: 82 },
                      { month: 'Jun', accuracy: 93, confidence: 85 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="accuracy" 
                      name="Accuracy %" 
                      stroke="#3b82f6" 
                      strokeWidth={2} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="confidence" 
                      name="Confidence %" 
                      stroke="#10b981" 
                      strokeWidth={2} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Model Metrics</CardTitle>
                <CardDescription>Current AI model performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Overall Accuracy</p>
                    <div className="flex items-center">
                      <p className="text-2xl font-bold">93.2%</p>
                      <Badge variant="default" className="ml-2">+2.1%</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Confidence Score</p>
                    <div className="flex items-center">
                      <p className="text-2xl font-bold">85.7%</p>
                      <Badge variant="default" className="ml-2">+3.5%</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Response Time</p>
                    <div className="flex items-center">
                      <p className="text-2xl font-bold">0.47s</p>
                      <Badge variant="default" className="ml-2">-0.08s</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Error Rate</p>
                    <div className="flex items-center">
                      <p className="text-2xl font-bold">2.3%</p>
                      <Badge variant="default" className="ml-2">-1.2%</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Error Analysis</CardTitle>
                <CardDescription>Top error categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Grammar Classification</span>
                      <span>38%</span>
                    </div>
                    <Progress value={38} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Word Sense Disambiguation</span>
                      <span>30%</span>
                    </div>
                    <Progress value={30} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Cultural Context</span>
                      <span>20%</span>
                    </div>
                    <Progress value={20} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Idiomatic Expressions</span>
                      <span>12%</span>
                    </div>
                    <Progress value={12} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>User Satisfaction</CardTitle>
                <CardDescription>User feedback on AI responses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Helpful', value: 78 },
                          { name: 'Somewhat Helpful', value: 15 },
                          { name: 'Not Helpful', value: 7 },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        <Cell fill="#10b981" />
                        <Cell fill="#f59e0b" />
                        <Cell fill="#ef4444" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm font-medium">User Satisfaction Score</span>
                  <Badge variant="default" className="text-base">
                    4.2/5
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Content Type Performance</CardTitle>
              <CardDescription>AI performance across different content types</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Content Type</TableHead>
                    <TableHead>Accuracy</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Response Time</TableHead>
                    <TableHead>User Rating</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Grammar Exercises</TableCell>
                    <TableCell className="text-green-600">94.8%</TableCell>
                    <TableCell>87.2%</TableCell>
                    <TableCell>0.42s</TableCell>
                    <TableCell>4.5/5</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Vocabulary Questions</TableCell>
                    <TableCell className="text-green-600">93.5%</TableCell>
                    <TableCell>90.1%</TableCell>
                    <TableCell>0.38s</TableCell>
                    <TableCell>4.4/5</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Conversation Analysis</TableCell>
                    <TableCell className="text-green-600">90.2%</TableCell>
                    <TableCell>82.4%</TableCell>
                    <TableCell>0.56s</TableCell>
                    <TableCell>4.2/5</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Cultural Context</TableCell>
                    <TableCell className="text-amber-600">85.1%</TableCell>
                    <TableCell>78.3%</TableCell>
                    <TableCell>0.61s</TableCell>
                    <TableCell>3.9/5</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: string;
  description?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

const StatsCard = ({
  title,
  value,
  description,
  icon,
  trend
}: StatsCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="bg-primary/10 p-2 rounded-full">
            {icon}
          </div>
          {trend && (
            <div className={`${trend === 'up' ? 'text-green-600' : 'text-red-600'} flex items-center`}>
              {trend === 'up' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
            </div>
          )}
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminAnalytics;
