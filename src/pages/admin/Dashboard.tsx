import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import AdminNotificationCenter from '@/components/admin/AdminNotificationCenter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { FileText, Users, Bell, BarChart3, Calendar, Clock, CheckCircle, Info, AlertTriangle, ServerCrash } from 'lucide-react';
import HelpTooltip from '@/components/help/HelpTooltip';
import { useSystemLog } from '@/hooks/use-system-log';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { UserService } from '@/services/UserService';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { logSystemAction } = useSystemLog();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    premiumUsers: 0,
    totalLogs: 0,
    errorLogs: 0,
    warningLogs: 0,
    infoLogs: 0,
    recentLogs: []
  });
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        
        const { getAllUsers, getSystemLogs } = useAuth();
        const users = getAllUsers();
        const logs = getSystemLogs();
        
        const activeUsersCount = users.filter(user => user.status === 'active').length;
        const inactiveUsersCount = users.filter(user => user.status === 'inactive').length;
        const premiumUsersCount = users.filter(user => user.subscription === 'premium').length;
        
        const errorLogsCount = logs.filter(log => log.level === 'error').length;
        const warningLogsCount = logs.filter(log => log.level === 'warning').length;
        const infoLogsCount = logs.filter(log => log.level === 'info').length;
        
        const recentLogs = logs
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 5);
        
        setStats({
          totalUsers: users.length,
          activeUsers: activeUsersCount,
          inactiveUsers: inactiveUsersCount,
          premiumUsers: premiumUsersCount,
          totalLogs: logs.length,
          errorLogs: errorLogsCount,
          warningLogs: warningLogsCount,
          infoLogs: infoLogsCount,
          recentLogs: recentLogs
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
    logSystemAction('Viewed admin dashboard');
  }, []);
  
  return (
    <div className="container py-6">
      <Helmet>
        <title>Admin Dashboard | Language Learning Platform</title>
      </Helmet>
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <HelpTooltip 
            content="This dashboard gives you an overview of system activity, users, and notifications."
            className="mt-2"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className={isLoading ? "opacity-70" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500 font-medium">{stats.activeUsers} active</span> • 
              <span className="text-yellow-500 font-medium ml-1">{stats.inactiveUsers} inactive</span>
            </p>
          </CardContent>
        </Card>
        
        <Card className={isLoading ? "opacity-70" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Premium Subscriptions
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.premiumUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.totalUsers > 0 ? Math.round((stats.premiumUsers / stats.totalUsers) * 100) : 0}% of users
            </p>
          </CardContent>
        </Card>
        
        <Card className={isLoading ? "opacity-70" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              System Logs
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLogs}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-red-500 font-medium">{stats.errorLogs} errors</span> • 
              <span className="text-yellow-500 font-medium ml-1">{stats.warningLogs} warnings</span> • 
              <span className="text-blue-500 font-medium ml-1">{stats.infoLogs} info</span>
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Recent system notifications and alerts
              <HelpTooltip 
                content="This shows recent notifications from the system including file uploads, user activity, and system events."
                className="ml-1 inline-block"
              />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdminNotificationCenter />
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent System Logs</CardTitle>
            <CardDescription>
              Latest system events and activities
              <HelpTooltip 
                content="These are the most recent system log entries. Click on 'View All Logs' to see the complete log history and search for specific events."
                className="ml-1 inline-block"
              />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="all" className="flex items-center justify-center gap-1">
                  <FileText className="h-4 w-4" />
                  All
                </TabsTrigger>
                <TabsTrigger value="warnings" className="flex items-center justify-center gap-1">
                  <AlertTriangle className="h-4 w-4" />
                  Warnings
                </TabsTrigger>
                <TabsTrigger value="errors" className="flex items-center justify-center gap-1">
                  <ServerCrash className="h-4 w-4" />
                  Errors
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <span className="loading loading-spinner loading-md"></span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {stats.recentLogs.length > 0 ? (
                      stats.recentLogs.map((log: any) => (
                        <div key={log.id} className="flex items-start space-x-3">
                          {log.level === 'error' ? (
                            <ServerCrash className="h-5 w-5 text-red-500 mt-0.5" />
                          ) : log.level === 'warning' ? (
                            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                          ) : (
                            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                          )}
                          <div className="space-y-1">
                            <div className="font-medium">{log.action}</div>
                            <div className="text-sm text-muted-foreground">{log.details}</div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary">{log.category}</Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(log.timestamp).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">No logs found</div>
                    )}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="warnings">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <span className="loading loading-spinner loading-md"></span>
                  </div>
                ) : (
                  stats.recentLogs.filter((log: any) => log.level === 'warning').length > 0 ? (
                    stats.recentLogs.filter((log: any) => log.level === 'warning').map((log: any) => (
                      <div key={log.id} className="flex items-start space-x-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                        <div className="space-y-1">
                          <div className="font-medium">{log.action}</div>
                          <div className="text-sm text-muted-foreground">{log.details}</div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary">{log.category}</Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(log.timestamp).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">No warning logs found</div>
                  )
                )}
              </TabsContent>
              
              <TabsContent value="errors">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <span className="loading loading-spinner loading-md"></span>
                  </div>
                ) : (
                  stats.recentLogs.filter((log: any) => log.level === 'error').length > 0 ? (
                    stats.recentLogs.filter((log: any) => log.level === 'error').map((log: any) => (
                      <div key={log.id} className="flex items-start space-x-3">
                        <ServerCrash className="h-5 w-5 text-red-500 mt-0.5" />
                        <div className="space-y-1">
                          <div className="font-medium">{log.action}</div>
                          <div className="text-sm text-muted-foreground">{log.details}</div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary">{log.category}</Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(log.timestamp).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">No error logs found</div>
                  )
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
