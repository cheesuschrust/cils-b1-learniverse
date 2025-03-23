
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UsersRound, BookOpenText, Award, Clock, Check, AlertTriangle, BarChart as BarChartIcon } from 'lucide-react';
import { API } from '@/services/api';

const AdminDashboard = () => {
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [activeUsers, setActiveUsers] = useState<number>(0);
  const [totalContent, setTotalContent] = useState<number>(0);
  const [dailyUsers, setDailyUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch user statistics
        const usersCount = await API.users.getCount();
        const activeUsersCount = await API.users.getActive();
        const contentCount = await API.content.getCount();
        const userActivityData = await API.analytics.getDailyUsers();

        setTotalUsers(usersCount);
        setActiveUsers(activeUsersCount);
        setTotalContent(contentCount);
        setDailyUsers(userActivityData);
      } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Dummy data for various charts
  const performanceData = [
    { section: 'Grammar', score: 78 },
    { section: 'Vocabulary', score: 92 },
    { section: 'Reading', score: 65 },
    { section: 'Writing', score: 81 },
    { section: 'Listening', score: 73 },
    { section: 'Speaking', score: 69 },
  ];

  const completionData = [
    { name: 'Completed', value: 72 },
    { name: 'In Progress', value: 18 },
    { name: 'Not Started', value: 10 },
  ];

  const contentTypeData = [
    { name: 'Lessons', value: 40 },
    { name: 'Exercises', value: 30 },
    { name: 'Quizzes', value: 20 },
    { name: 'Media', value: 10 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#EC7063'];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-3xl font-bold">{isLoading ? '...' : totalUsers}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <UsersRound className="text-primary h-8 w-8" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-muted-foreground">+{Math.floor(Math.random() * 50) + 10} new this week</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-3xl font-bold">{isLoading ? '...' : activeUsers}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <Check className="text-green-600 h-8 w-8" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-muted-foreground">{Math.floor((activeUsers / totalUsers) * 100) || 0}% of total users</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Content</p>
                <p className="text-3xl font-bold">{isLoading ? '...' : totalContent}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <BookOpenText className="text-blue-600 h-8 w-8" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-muted-foreground">+{Math.floor(Math.random() * 20) + 5} added this month</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Completion Rate</p>
                <p className="text-3xl font-bold">{Math.floor(Math.random() * 30) + 65}%</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-full">
                <Award className="text-yellow-600 h-8 w-8" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-muted-foreground">+2% from last month</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
            <CardDescription>Daily active users over the past 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Clock className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={dailyUsers}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} name="Active Users" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Performance by Section</CardTitle>
            <CardDescription>Average user performance across learning sections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={performanceData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="section" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" fill="#8884d8" name="Avg. Score (%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>User Completion Status</CardTitle>
            <CardDescription>Percentage of courses completed by users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={completionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {completionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Content Distribution</CardTitle>
            <CardDescription>Distribution of content by type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={contentTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {contentTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-green-100 rounded-full">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">New user registered</p>
                  <p className="text-xs text-muted-foreground">maria.s@example.com - 15 minutes ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-blue-100 rounded-full">
                  <BookOpenText className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">New lesson published</p>
                  <p className="text-xs text-muted-foreground">Italian Verb Conjugation - 45 minutes ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">System warning</p>
                  <p className="text-xs text-muted-foreground">Storage usage at 80% - 2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-green-100 rounded-full">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Quiz completed</p>
                  <p className="text-xs text-muted-foreground">5 users completed "B2 Grammar Quiz" - 3 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-blue-100 rounded-full">
                  <BarChartIcon className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Analytics updated</p>
                  <p className="text-xs text-muted-foreground">Monthly report generated - 5 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
