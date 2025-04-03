
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowUpRight, ArrowDownRight, Users, UserPlus, UserCheck, UserMinus } from 'lucide-react';

interface UsersStatsCardsProps {
  period: string;
}

const UsersStatsCards: React.FC<UsersStatsCardsProps> = ({ period }) => {
  // Mock data - in a real app, this would come from API
  const stats = {
    totalUsers: 2735,
    newUsers: 124,
    activeUsers: 842,
    retention: 68.4,
    churn: 5.2
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            Total Users
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
            <span className="text-green-500 font-medium">12.5%</span>
            <span className="ml-1">from last {period === '7d' ? 'week' : 'month'}</span>
          </div>
          <Progress value={78} className="h-1 mt-2" />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            New Users
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.newUsers}</div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
            <span className="text-green-500 font-medium">8.2%</span>
            <span className="ml-1">from last {period === '7d' ? 'week' : 'month'}</span>
          </div>
          <Progress value={65} className="h-1 mt-2" />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            Active Users
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeUsers}</div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
            <span className="text-green-500 font-medium">4.3%</span>
            <span className="ml-1">from last {period === '7d' ? 'week' : 'month'}</span>
          </div>
          <Progress value={70} className="h-1 mt-2" />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            User Retention
            <Badge variant="outline">{stats.retention}%</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-xs font-medium">Churn Rate</div>
            <div className="flex items-center">
              <ArrowDownRight className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-xs text-green-500">{stats.churn}%</span>
            </div>
          </div>
          <Progress value={stats.retention} className="h-3 mt-2" />
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersStatsCards;
