
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Users, 
  UserPlus, 
  UserMinus,
  Activity,
  Award
} from 'lucide-react';

const UsersStatsCards: React.FC = () => {
  // Mock data for the chart
  const userData = [
    { name: 'Jan', new: 65, active: 240, churned: 20 },
    { name: 'Feb', new: 78, active: 290, churned: 18 },
    { name: 'Mar', new: 92, active: 350, churned: 22 },
    { name: 'Apr', new: 105, active: 410, churned: 25 },
    { name: 'May', new: 120, active: 490, churned: 15 },
    { name: 'Jun', new: 145, active: 580, churned: 20 },
  ];

  // Mock user statistics
  const userStats = {
    total: 5840,
    active: 4210,
    new: 720,
    retained: 85, // percentage
    churn: 3.2, // percentage
    engagement: 72, // percentage
    avgSessions: 14.3, // per month
    avgSessionLength: 18.5, // minutes
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Platform-wide registered users
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.active.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((userStats.active / userStats.total) * 100)}% of total users
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Users (30d)</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.new.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((userStats.new / userStats.total) * 100)}% growth rate
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.retained}%</div>
            <p className="text-xs text-muted-foreground">
              {userStats.churn}% monthly churn rate
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>User Growth</CardTitle>
          <CardDescription>Monthly new, active, and churned users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={userData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="new" fill="#3b82f6" name="New Users" />
                <Bar dataKey="active" fill="#22c55e" name="Active Users" />
                <Bar dataKey="churned" fill="#ef4444" name="Churned Users" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid gap-4 md:grid-cols-2 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>User Engagement</CardTitle>
            <CardDescription>Average session metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-md">
                <div className="text-sm text-muted-foreground">Engagement Rate</div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {userStats.engagement}%
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400">
                  +5.2% from last month
                </div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-md">
                <div className="text-sm text-muted-foreground">Avg. Sessions</div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {userStats.avgSessions}
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400">
                  Per user per month
                </div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-md col-span-2">
                <div className="text-sm text-muted-foreground">Avg. Session Length</div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {userStats.avgSessionLength} min
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400">
                  +2.1 minutes from last month
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Activity Heatmap</CardTitle>
            <CardDescription>User activity by time of day</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <div className="text-center p-8 border border-dashed rounded-md w-full">
              <p className="text-muted-foreground">Activity heatmap visualization would go here</p>
              <p className="text-xs text-muted-foreground mt-2">
                Shows when users are most active by hour and day of week
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default UsersStatsCards;
