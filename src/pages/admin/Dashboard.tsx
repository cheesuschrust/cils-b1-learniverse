
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import AdminNotificationCenter from '@/components/admin/AdminNotificationCenter';
import {
  BarChart3,
  Users,
  BookOpen,
  MessageCircle,
  BarChart,
  LineChart,
  TrendingUp,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  CircleCheck,
  CircleAlert,
  RefreshCcw,
  BadgeCheck,
  ShieldCheck,
  HeadphonesIcon
} from 'lucide-react';
import { DonutChart, LineChart as UILineChart } from '@/components/ui/chart';
import DatabaseService from '@/services/DatabaseService';

const AdminDashboard = () => {
  const [userStats, setUserStats] = useState({
    total: 0,
    active: 0,
    premium: 0,
    newThisMonth: 0,
    activeChange: 0,
    premiumChange: 0
  });
  
  const [learningStats, setLearningStats] = useState({
    totalLessons: 0,
    completedLessons: 0,
    flashcardsCreated: 0,
    averageScore: 0,
    learningTime: 0,
    learningTimeChange: 0
  });
  
  const [chatbotStats, setChatbotStats] = useState({
    totalSessions: 0,
    averageSessionLength: 0,
    satisfactionRate: 0,
    escalationRate: 0,
    totalMessages: 0,
    responseTime: 0
  });
  
  const [systemStatus, setSystemStatus] = useState({
    uptime: "99.98%",
    apiLatency: "128ms",
    errorRate: "0.02%",
    databaseSize: "2.8 GB",
    pendingJobs: 3,
    scheduledMaintenance: "None"
  });
  
  useEffect(() => {
    // Get database service instance
    const dbService = DatabaseService.getInstance();
    
    // Fetch users
    const fetchUsers = async () => {
      const users = await dbService.getUsers();
      const activeUsers = users.filter(user => user.status === 'active');
      const premiumUsers = users.filter(user => user.subscription === 'premium');
      const lastMonthDate = new Date();
      lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
      const newUsers = users.filter(user => user.createdAt > lastMonthDate);
      
      setUserStats({
        total: users.length,
        active: activeUsers.length,
        premium: premiumUsers.length,
        newThisMonth: newUsers.length,
        activeChange: 5, // Placeholder - would calculate from historical data
        premiumChange: 12 // Placeholder - would calculate from historical data
      });
    };
    
    // Fetch flashcards to calculate learning stats
    const fetchLearningStats = async () => {
      const flashcards = await dbService.getFlashcards();
      const flashcardSets = await dbService.getFlashcardSets();
      
      setLearningStats({
        totalLessons: 120, // Placeholder
        completedLessons: 85, // Placeholder
        flashcardsCreated: flashcards.length,
        averageScore: 78, // Placeholder
        learningTime: 4500, // Placeholder - minutes
        learningTimeChange: 15 // Placeholder - percentage
      });
    };
    
    // Fetch chatbot sessions
    const fetchChatbotStats = async () => {
      const chatSessions = await dbService.getChatSessions();
      const totalMessages = chatSessions.reduce((sum, session) => sum + session.messages.length, 0);
      
      setChatbotStats({
        totalSessions: chatSessions.length,
        averageSessionLength: chatSessions.length > 0 ? totalMessages / chatSessions.length : 0,
        satisfactionRate: 92, // Placeholder
        escalationRate: 8, // Placeholder
        totalMessages,
        responseTime: 1.2 // Placeholder - seconds
      });
    };
    
    // Fetch data
    fetchUsers();
    fetchLearningStats();
    fetchChatbotStats();
  }, []);
  
  // Prepare chart data
  const userGrowthData = [
    { name: 'Jan', users: 280 },
    { name: 'Feb', users: 300 },
    { name: 'Mar', users: 340 },
    { name: 'Apr', users: 380 },
    { name: 'May', users: 410 },
    { name: 'Jun', users: 490 },
    { name: 'Jul', users: 540 },
    { name: 'Aug', users: 580 },
    { name: 'Sep', users: 620 },
    { name: 'Oct', users: 650 },
    { name: 'Nov', users: 700 },
    { name: 'Dec', users: userStats.total }
  ];
  
  const userTypeData = [
    { name: 'Free Users', value: userStats.total - userStats.premium },
    { name: 'Premium', value: userStats.premium }
  ];
  
  const activityData = [
    { name: 'Mon', lessons: 45, quizzes: 32 },
    { name: 'Tue', lessons: 52, quizzes: 38 },
    { name: 'Wed', lessons: 49, quizzes: 30 },
    { name: 'Thu', lessons: 63, quizzes: 48 },
    { name: 'Fri', lessons: 51, quizzes: 36 },
    { name: 'Sat', lessons: 72, quizzes: 52 },
    { name: 'Sun', lessons: 55, quizzes: 40 }
  ];
  
  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Italian Learning App</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Overview of the platform's performance and metrics</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh Data
            </Button>
            <Button size="sm">
              <BarChart3 className="mr-2 h-4 w-4" />
              Full Analytics
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-4 md:w-[500px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                title="Total Users"
                value={userStats.total.toString()}
                icon={<Users className="h-5 w-5 text-blue-500" />}
                change={userStats.newThisMonth}
                changeLabel="new this month"
                positive
              />
              
              <MetricCard
                title="Premium Users"
                value={`${userStats.premium} (${Math.round((userStats.premium / Math.max(userStats.total, 1)) * 100)}%)`}
                icon={<BadgeCheck className="h-5 w-5 text-purple-500" />}
                change={userStats.premiumChange}
                changeLabel="this month"
                positive
              />
              
              <MetricCard
                title="Chatbot Sessions"
                value={chatbotStats.totalSessions.toString()}
                icon={<MessageCircle className="h-5 w-5 text-green-500" />}
                change={15}
                changeLabel="this week"
                positive
              />
              
              <MetricCard
                title="Flashcards Created"
                value={learningStats.flashcardsCreated.toString()}
                icon={<BookOpen className="h-5 w-5 text-orange-500" />}
                change={34}
                changeLabel="this week"
                positive
              />
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-1 lg:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">User Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <UILineChart 
                    data={userGrowthData}
                    index="name"
                    categories={["users"]}
                    colors={["blue"]}
                    valueFormatter={(value) => `${value} users`}
                    className="aspect-[2/1]"
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">User Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <DonutChart 
                    data={userTypeData}
                    index="name"
                    category="value"
                    valueFormatter={(value) => `${value} users`}
                    className="aspect-square mx-auto max-w-xs"
                    colors={["blue", "violet"]}
                  />
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Weekly Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <UILineChart 
                    data={activityData}
                    index="name"
                    categories={["lessons", "quizzes"]}
                    colors={["emerald", "amber"]}
                    valueFormatter={(value) => `${value} activities`}
                    className="aspect-[2/1]"
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Recent Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <AdminNotificationCenter />
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">System Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <StatusItem 
                    label="API Uptime" 
                    value={systemStatus.uptime} 
                    icon={<CircleCheck className="h-4 w-4 text-green-500" />}
                  />
                  <StatusItem 
                    label="API Latency" 
                    value={systemStatus.apiLatency} 
                    icon={<CircleCheck className="h-4 w-4 text-green-500" />}
                  />
                  <StatusItem 
                    label="Error Rate" 
                    value={systemStatus.errorRate} 
                    icon={<CircleCheck className="h-4 w-4 text-green-500" />}
                  />
                  <StatusItem 
                    label="Database Size" 
                    value={systemStatus.databaseSize} 
                    icon={<CircleAlert className="h-4 w-4 text-yellow-500" />}
                  />
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="w-full">View Details</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Chatbot Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Satisfaction Rate</span>
                      <span className="font-medium">{chatbotStats.satisfactionRate}%</span>
                    </div>
                    <Progress value={chatbotStats.satisfactionRate} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Escalation Rate</span>
                      <span className="font-medium">{chatbotStats.escalationRate}%</span>
                    </div>
                    <Progress value={chatbotStats.escalationRate} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Avg. Response Time</span>
                      <span className="font-medium">{chatbotStats.responseTime}s</span>
                    </div>
                    <Progress value={chatbotStats.responseTime * 20} className="h-2" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="w-full">Manage Chatbot</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Support Tickets</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <HeadphonesIcon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">Open Tickets</div>
                        <div className="text-xs text-muted-foreground">Last 7 days</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold">12</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">High Priority</span>
                      <span className="font-medium text-red-500">3</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Medium Priority</span>
                      <span className="font-medium text-amber-500">5</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Low Priority</span>
                      <span className="font-medium text-green-500">4</span>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <div className="text-sm font-medium">Average Response Time</div>
                    <div className="text-2xl font-bold">2.4 hours</div>
                    <div className="text-xs text-muted-foreground">-15% from last week</div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="w-full">View All Tickets</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="users" className="space-y-6">
            <h2 className="text-xl font-semibold">User Analytics</h2>
            <p className="text-muted-foreground">Detailed analytics about user engagement and behavior.</p>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                title="Active Users"
                value={userStats.active.toString()}
                icon={<Users className="h-5 w-5 text-blue-500" />}
                change={userStats.activeChange}
                changeLabel="this month"
                positive
              />
              
              <MetricCard
                title="New Signups"
                value={userStats.newThisMonth.toString()}
                icon={<TrendingUp className="h-5 w-5 text-green-500" />}
                change={23}
                changeLabel="vs last month"
                positive
              />
              
              <MetricCard
                title="Average Session"
                value="12m 32s"
                icon={<Clock className="h-5 w-5 text-purple-500" />}
                change={8}
                changeLabel="this month"
                positive
              />
              
              <MetricCard
                title="Churn Rate"
                value="3.2%"
                icon={<TrendingUp className="h-5 w-5 text-red-500" />}
                change={0.4}
                changeLabel="vs last month"
                positive={false}
              />
            </div>
            
            <Button>View Full User Analytics</Button>
          </TabsContent>
          
          <TabsContent value="content" className="space-y-6">
            <h2 className="text-xl font-semibold">Content Analytics</h2>
            <p className="text-muted-foreground">Detailed analytics about learning content and engagement.</p>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                title="Flashcard Sets"
                value="42"
                icon={<BookOpen className="h-5 w-5 text-amber-500" />}
                change={5}
                changeLabel="new sets"
                positive
              />
              
              <MetricCard
                title="Learning Time"
                value={`${Math.round(learningStats.learningTime / 60)} hrs`}
                icon={<Clock className="h-5 w-5 text-blue-500" />}
                change={learningStats.learningTimeChange}
                changeLabel="this month"
                positive
              />
              
              <MetricCard
                title="Lesson Completion"
                value={`${Math.round((learningStats.completedLessons / learningStats.totalLessons) * 100)}%`}
                icon={<CheckCircle className="h-5 w-5 text-green-500" />}
                change={8}
                changeLabel="this month"
                positive
              />
              
              <MetricCard
                title="Average Score"
                value={`${learningStats.averageScore}%`}
                icon={<BarChart className="h-5 w-5 text-purple-500" />}
                change={3}
                changeLabel="this month"
                positive
              />
            </div>
            
            <Button>View Content Management</Button>
          </TabsContent>
          
          <TabsContent value="system" className="space-y-6">
            <h2 className="text-xl font-semibold">System Health</h2>
            <p className="text-muted-foreground">Infrastructure and application performance metrics.</p>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                title="API Uptime"
                value={systemStatus.uptime}
                icon={<ShieldCheck className="h-5 w-5 text-green-500" />}
                change={0.01}
                changeLabel="vs last month"
                positive
              />
              
              <MetricCard
                title="API Latency"
                value={systemStatus.apiLatency}
                icon={<TrendingUp className="h-5 w-5 text-amber-500" />}
                change={15}
                changeLabel="ms improvement"
                positive
              />
              
              <MetricCard
                title="Error Rate"
                value={systemStatus.errorRate}
                icon={<AlertCircle className="h-5 w-5 text-red-500" />}
                change={0.01}
                changeLabel="this month"
                positive={false}
              />
              
              <MetricCard
                title="Database Size"
                value={systemStatus.databaseSize}
                icon={<HardDrive className="h-5 w-5 text-blue-500" />}
                change={0.3}
                changeLabel="GB increase"
                positive={false}
              />
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Background Jobs</CardTitle>
                  <CardDescription>Currently queued tasks in the system</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-muted rounded-md">
                      <div>
                        <div className="font-medium">Database Backup</div>
                        <div className="text-sm text-muted-foreground">Scheduled for 02:00 AM</div>
                      </div>
                      <Badge>Scheduled</Badge>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-muted rounded-md">
                      <div>
                        <div className="font-medium">Email Digest</div>
                        <div className="text-sm text-muted-foreground">Weekly user report</div>
                      </div>
                      <Badge>Queued</Badge>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-muted rounded-md">
                      <div>
                        <div className="font-medium">AI Model Training</div>
                        <div className="text-sm text-muted-foreground">Processing new examples</div>
                      </div>
                      <Badge variant="secondary">Processing</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>System Events</CardTitle>
                  <CardDescription>Recent system activities and alerts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-4 border-green-500 pl-3 py-1">
                      <div className="font-medium">Database Optimized</div>
                      <div className="text-sm text-muted-foreground">Today, 09:15 AM</div>
                    </div>
                    
                    <div className="border-l-4 border-amber-500 pl-3 py-1">
                      <div className="font-medium">High API Traffic Detected</div>
                      <div className="text-sm text-muted-foreground">Yesterday, 02:30 PM</div>
                    </div>
                    
                    <div className="border-l-4 border-red-500 pl-3 py-1">
                      <div className="font-medium">Failed Login Attempts</div>
                      <div className="text-sm text-muted-foreground">Yesterday, 11:42 AM</div>
                    </div>
                    
                    <div className="border-l-4 border-blue-500 pl-3 py-1">
                      <div className="font-medium">System Update Deployed</div>
                      <div className="text-sm text-muted-foreground">Aug 24, 2023, 06:00 AM</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex gap-3">
              <Button>System Settings</Button>
              <Button variant="outline">View System Logs</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

// Component for metric card
interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: number;
  changeLabel: string;
  positive: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  icon, 
  change, 
  changeLabel,
  positive 
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div className="rounded-full bg-primary/10 p-2">
            {icon}
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          {positive ? (
            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
          ) : (
            <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
          )}
          <span className={positive ? "text-green-500" : "text-red-500"}>
            {change}% 
          </span>
          <span className="ml-1 text-muted-foreground">{changeLabel}</span>
        </div>
      </CardContent>
    </Card>
  );
};

// Component for status item
interface StatusItemProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

const StatusItem: React.FC<StatusItemProps> = ({ label, value, icon }) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
};

export default AdminDashboard;
