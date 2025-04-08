
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, FileText, CreditCard, Activity, Coffee, BookOpen } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  
  const stats = [
    {
      title: "Total Users",
      value: "1,243",
      description: "Active users this month",
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      change: "+12%"
    },
    {
      title: "Premium Subscribers",
      value: "349",
      description: "28% of total users",
      icon: <CreditCard className="h-4 w-4 text-muted-foreground" />,
      change: "+5%"
    },
    {
      title: "Total Questions",
      value: "2,845",
      description: "Across all categories",
      icon: <FileText className="h-4 w-4 text-muted-foreground" />,
      change: "+23%"
    },
    {
      title: "Daily Active Users",
      value: "523",
      description: "42% of total users",
      icon: <Activity className="h-4 w-4 text-muted-foreground" />,
      change: "+8%"
    }
  ];
  
  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your admin dashboard, {user?.email?.split('@')[0] || 'Admin'}
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  {stat.description}
                  <span className="text-green-500 ml-1">{stat.change}</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest user activities on the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">New flashcard set created</p>
                        <p className="text-xs text-muted-foreground">By user123 • 12 minutes ago</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <CreditCard className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">New premium subscription</p>
                        <p className="text-xs text-muted-foreground">By maria85 • 47 minutes ago</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Coffee className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Streak milestone (30 days)</p>
                        <p className="text-xs text-muted-foreground">By john_doe • 2 hours ago</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Content Stats</CardTitle>
                  <CardDescription>Usage across different content types</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm">Flashcards</p>
                      <p className="text-sm font-medium">78%</p>
                    </div>
                    <div className="bg-muted h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm">Reading Practice</p>
                      <p className="text-sm font-medium">63%</p>
                    </div>
                    <div className="bg-muted h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: '63%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm">Listening Practice</p>
                      <p className="text-sm font-medium">52%</p>
                    </div>
                    <div className="bg-muted h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: '52%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm">Speaking Practice</p>
                      <p className="text-sm font-medium">45%</p>
                    </div>
                    <div className="bg-muted h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <button className="w-full flex items-center justify-between p-2 text-sm rounded-md hover:bg-accent transition-colors">
                    <span className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Manage Users
                    </span>
                    <span>→</span>
                  </button>
                  <button className="w-full flex items-center justify-between p-2 text-sm rounded-md hover:bg-accent transition-colors">
                    <span className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Add New Content
                    </span>
                    <span>→</span>
                  </button>
                  <button className="w-full flex items-center justify-between p-2 text-sm rounded-md hover:bg-accent transition-colors">
                    <span className="flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      View Analytics
                    </span>
                    <span>→</span>
                  </button>
                  <button className="w-full flex items-center justify-between p-2 text-sm rounded-md hover:bg-accent transition-colors">
                    <span className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Subscription Reports
                    </span>
                    <span>→</span>
                  </button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="p-6 bg-muted/20 rounded-md">
            <p className="text-center text-muted-foreground">Detailed analytics will be displayed here.</p>
          </TabsContent>
          
          <TabsContent value="reports" className="p-6 bg-muted/20 rounded-md">
            <p className="text-center text-muted-foreground">System reports will be displayed here.</p>
          </TabsContent>
          
          <TabsContent value="notifications" className="p-6 bg-muted/20 rounded-md">
            <p className="text-center text-muted-foreground">System notifications will be displayed here.</p>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;
