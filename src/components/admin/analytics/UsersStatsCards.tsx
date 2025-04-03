
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

interface UsersStatsCardsProps {
  period: string;
}

const UsersStatsCards: React.FC<UsersStatsCardsProps> = ({ period }) => {
  // This would normally come from an API call based on the period
  const userStats = {
    newUsers: period === '7d' ? 84 : period === '30d' ? 342 : 1248,
    activeUsers: period === '7d' ? 523 : period === '30d' ? 842 : 1937,
    retention: period === '7d' ? 72.4 : period === '30d' ? 68.4 : 64.2,
    churn: period === '7d' ? 4.2 : period === '30d' ? 5.2 : 6.8
  };
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">New Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{userStats.newUsers}</div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <ArrowUpIcon className="h-3 w-3 text-green-500 mr-1" />
            <span className="text-green-500 font-medium">12.5%</span>
            <span className="ml-1">from last {period}</span>
          </div>
          <Progress value={65} className="h-1 mt-2" />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Active Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{userStats.activeUsers}</div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <ArrowUpIcon className="h-3 w-3 text-green-500 mr-1" />
            <span className="text-green-500 font-medium">8.2%</span>
            <span className="ml-1">from last {period}</span>
          </div>
          <Progress value={78} className="h-1 mt-2" />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{userStats.retention}%</div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <ArrowUpIcon className="h-3 w-3 text-green-500 mr-1" />
            <span className="text-green-500 font-medium">2.1%</span>
            <span className="ml-1">from last {period}</span>
          </div>
          <Progress value={userStats.retention} className="h-1 mt-2" />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{userStats.churn}%</div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <ArrowDownIcon className="h-3 w-3 text-green-500 mr-1" />
            <span className="text-green-500 font-medium">0.8%</span>
            <span className="ml-1">from last {period}</span>
          </div>
          <Progress value={userStats.churn * 5} className="h-1 mt-2" />
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersStatsCards;
