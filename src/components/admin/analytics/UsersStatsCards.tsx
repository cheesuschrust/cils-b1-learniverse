
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface UsersStatsCardsProps {
  data: {
    users: {
      total: number;
      active: number;
      growth: number;
      premium: number;
      newToday?: number;
    };
  };
  showNewToday?: boolean;
}

export const UsersStatsCards: React.FC<UsersStatsCardsProps> = ({ 
  data, 
  showNewToday = false 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.users.total.toLocaleString()}</div>
          <div className="flex items-center mt-1">
            {showNewToday && data.users.newToday ? (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                +{data.users.newToday} today
              </Badge>
            ) : (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                +{data.users.growth}%
              </Badge>
            )}
            {!showNewToday && <span className="text-xs text-muted-foreground ml-2">vs. last month</span>}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Active Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.users.active.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {Math.round(data.users.active / data.users.total * 100)}% of total users
          </div>
          <Progress 
            value={Math.round(data.users.active / data.users.total * 100)} 
            className="h-1 mt-2" 
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Premium Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.users.premium.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {Math.round(data.users.premium / data.users.total * 100)}% of total users
          </div>
          <Progress 
            value={Math.round(data.users.premium / data.users.total * 100)} 
            className="h-1 mt-2" 
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.users.retentionRate || 76}%</div>
          <div className="text-xs text-muted-foreground mt-1">
            30-day user retention
          </div>
          <Progress 
            value={data.users.retentionRate || 76} 
            className="h-1 mt-2" 
          />
        </CardContent>
      </Card>
    </div>
  );
};
