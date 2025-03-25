
import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Users, 
  BookOpen, 
  Clock, 
  Award, 
  TrendingUp, 
  MessageSquare,
  Activity,
  Calendar,
  Download,
  BarChart2
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Mock data
const userActivityData = [
  { date: 'Mon', active: 120, new: 15 },
  { date: 'Tue', active: 132, new: 23 },
  { date: 'Wed', active: 101, new: 17 },
  { date: 'Thu', active: 134, new: 19 },
  { date: 'Fri', active: 90, new: 25 },
  { date: 'Sat', active: 230, new: 32 },
  { date: 'Sun', active: 210, new: 27 },
];

const contentUsageData = [
  { name: 'Flashcards', value: 45 },
  { name: 'Listening', value: 20 },
  { name: 'Speaking', value: 15 },
  { name: 'Writing', value: 10 },
  { name: 'Multiple Choice', value: 10 },
];

const contentColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'];

const learningProgressData = [
  { month: 'Jan', beginner: 400, intermediate: 240, advanced: 60 },
  { month: 'Feb', beginner: 380, intermediate: 260, advanced: 80 },
  { month: 'Mar', beginner: 350, intermediate: 290, advanced: 120 },
  { month: 'Apr', beginner: 300, intermediate: 320, advanced: 180 },
  { month: 'May', beginner: 280, intermediate: 330, advanced: 190 },
  { month: 'Jun', beginner: 250, intermediate: 340, advanced: 210 },
];

const userRetentionData = [
  { day: '1', retention: 100 },
  { day: '3', retention: 80 },
  { day: '7', retention: 70 },
  { day: '14', retention: 55 },
  { day: '30', retention: 40 },
  { day: '60', retention: 35 },
  { day: '90', retention: 30 },
];

const AdminAnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  
  const statsCards = [
    {
      title: 'Total Users',
      value: '1,248',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
    },
    {
      title: 'Active Users',
      value: '945',
      change: '+7.6%',
      trend: 'up',
      icon: Activity,
    },
    {
      title: 'Study Sessions',
      value: '3,427',
      change: '+24.3%',
      trend: 'up',
      icon: BookOpen,
    },
    {
      title: 'Avg. Session Time',
      value: '18m 24s',
      change: '+2.1%',
      trend: 'up',
      icon: Clock,
    },
  ];
  
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <div className="flex items-center gap-4">
          <Select
            value={timeRange}
            onValueChange={setTimeRange}
          >
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="12m">Last 12 Months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="flex items-center justify-between pt-6">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className={`text-xs flex items-center ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  <TrendingUp className={`h-3 w-3 mr-1 ${stat.trend === 'up' ? '' : 'rotate-180'}`} />
                  {stat.change} from previous period
                </p>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Activity Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-primary" />
              User Activity
            </CardTitle>
            <CardDescription>
              Daily active users and new registrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="active" fill="#8884d8" name="Active Users" />
                <Bar dataKey="new" fill="#82ca9d" name="New Users" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Content Usage Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart2 className="h-5 w-5 mr-2 text-primary" />
              Content Usage
            </CardTitle>
            <CardDescription>
              Distribution of content usage by feature
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={contentUsageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {contentUsageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={contentColors[index % contentColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="progress">
        <TabsList>
          <TabsTrigger value="progress">Learning Progress</TabsTrigger>
          <TabsTrigger value="retention">User Retention</TabsTrigger>
          <TabsTrigger value="engagement">Engagement Metrics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-primary" />
                User Learning Progress
              </CardTitle>
              <CardDescription>
                Distribution of users by proficiency level over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={learningProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="beginner" stackId="a" fill="#ffc658" name="Beginner" />
                  <Bar dataKey="intermediate" stackId="a" fill="#82ca9d" name="Intermediate" />
                  <Bar dataKey="advanced" stackId="a" fill="#8884d8" name="Advanced" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Users are progressing steadily with 15% moving from beginner to intermediate monthly.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="retention">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary" />
                User Retention
              </CardTitle>
              <CardDescription>
                Percentage of users returning after registration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={userRetentionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" label={{ value: 'Days After Registration', position: 'insideBottomRight', offset: -5 }} />
                  <YAxis label={{ value: 'Retention %', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Retention']} />
                  <Line type="monotone" dataKey="retention" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                30-day retention rate is 40%, which is 5% higher than the previous quarter.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="engagement">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                Engagement Metrics
              </CardTitle>
              <CardDescription>
                Key engagement metrics across features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <BookOpen className="h-8 w-8 mx-auto text-primary mb-2" />
                      <h3 className="text-sm font-medium">Cards Reviewed</h3>
                      <p className="text-2xl font-bold mt-1">78,924</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        +12.3% from last period
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <MessageSquare className="h-8 w-8 mx-auto text-primary mb-2" />
                      <h3 className="text-sm font-medium">Speaking Exercises</h3>
                      <p className="text-2xl font-bold mt-1">23,156</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        +18.7% from last period
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Award className="h-8 w-8 mx-auto text-primary mb-2" />
                      <h3 className="text-sm font-medium">Quizzes Completed</h3>
                      <p className="text-2xl font-bold mt-1">12,845</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        +9.5% from last period
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Clock className="h-8 w-8 mx-auto text-primary mb-2" />
                      <h3 className="text-sm font-medium">Avg. Daily Study</h3>
                      <p className="text-2xl font-bold mt-1">24 min</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        +3.2% from last period
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-3">Recent Usage Trends</h3>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <ul className="space-y-2">
                    <li className="text-sm flex justify-between items-center">
                      <span>Users studying daily for 7+ days</span>
                      <span className="font-medium text-green-600">+23%</span>
                    </li>
                    <li className="text-sm flex justify-between items-center">
                      <span>Completion rate of listening exercises</span>
                      <span className="font-medium text-green-600">+15%</span>
                    </li>
                    <li className="text-sm flex justify-between items-center">
                      <span>Average flashcards mastered per user</span>
                      <span className="font-medium text-green-600">+10%</span>
                    </li>
                    <li className="text-sm flex justify-between items-center">
                      <span>Mobile app usage</span>
                      <span className="font-medium text-green-600">+42%</span>
                    </li>
                    <li className="text-sm flex justify-between items-center">
                      <span>Evening study sessions (7-11pm)</span>
                      <span className="font-medium text-green-600">+28%</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAnalyticsDashboard;
