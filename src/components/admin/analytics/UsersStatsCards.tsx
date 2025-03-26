
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface UsersStatsCardsProps {
  data: any;
  showNewToday?: boolean;
}

export const UsersStatsCards: React.FC<UsersStatsCardsProps> = ({ data, showNewToday = false }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.users.total.toLocaleString()}</div>
          <div className="flex items-center mt-1">
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
              {showNewToday ? `+${data.users.newToday} today` : `+${data.users.growth}%`}
            </Badge>
            {!showNewToday && <span className="text-xs text-muted-foreground ml-2">vs. last month</span>}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">{showNewToday ? 'Premium Users' : 'Active Users'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {showNewToday 
              ? data.users.premium.toLocaleString() 
              : data.users.active.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {Math.round((showNewToday ? data.users.premium : data.users.active) / data.users.total * 100)}% of total users
          </div>
          <Progress 
            value={Math.round((showNewToday ? data.users.premium : data.users.active) / data.users.total * 100)} 
            className="h-1 mt-2" 
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">{showNewToday ? 'Retention Rate' : 'Revenue (MRR)'}</CardTitle>
        </CardHeader>
        <CardContent>
          {showNewToday ? (
            <>
              <div className="text-2xl font-bold">{data.users.retentionRate}%</div>
              <div className="text-xs text-muted-foreground mt-1">
                30-day user retention
              </div>
              <Progress 
                value={data.users.retentionRate} 
                className="h-1 mt-2" 
              />
            </>
          ) : (
            <>
              <div className="text-2xl font-bold">${data.revenue.totalMRR.toLocaleString()}</div>
              <div className="flex items-center mt-1">
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  +{data.revenue.growth}%
                </Badge>
                <span className="text-xs text-muted-foreground ml-2">vs. last month</span>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">{showNewToday ? 'Avg. Session Time' : 'Conversion Rate'}</CardTitle>
        </CardHeader>
        <CardContent>
          {showNewToday ? (
            <>
              <div className="text-2xl font-bold">{data.users.averageSessionTime} min</div>
              <div className="text-xs text-muted-foreground mt-1">
                Time spent per session
              </div>
            </>
          ) : (
            <>
              <div className="text-2xl font-bold">{data.revenue.conversionRate}%</div>
              <div className="text-xs text-muted-foreground mt-1">
                Free to paid conversions
              </div>
              <Progress 
                value={data.revenue.conversionRate} 
                className="h-1 mt-2" 
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
