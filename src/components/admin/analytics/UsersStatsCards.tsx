
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, Percent, Award, UserCheck } from "lucide-react";

type UsersStatsCardsProps = {
  data: {
    total: number;
    active: number;
    growth: number;
    premium: number;
    newToday?: number;
  }
};

const UsersStatsCards: React.FC<UsersStatsCardsProps> = ({ data }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.total.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {data.newToday ? `+${data.newToday} today` : ''}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.active.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {data.total > 0 ? 
              `${Math.round((data.active / data.total) * 100)}% of total users` : 
              '0% of total users'}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">User Growth</CardTitle>
          <UserPlus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.growth}%</div>
          <p className="text-xs text-muted-foreground">
            Based on time period
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Premium Users</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.premium.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {data.total > 0 ? 
              `${Math.round((data.premium / data.total) * 100)}% of total users` : 
              '0% of total users'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersStatsCards;
