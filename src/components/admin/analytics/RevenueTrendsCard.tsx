
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart } from '@/components/admin/charts';

interface RevenueTrendsCardProps {
  data: { month: string; revenue: number }[];
  className?: string;
}

export const RevenueTrendsCard: React.FC<RevenueTrendsCardProps> = ({ data, className = '' }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Revenue Trends</CardTitle>
        <CardDescription>
          Monthly recurring revenue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BarChart
          data={data}
          xKey="month"
          yKey="revenue"
          color="#3b82f6"
        />
      </CardContent>
    </Card>
  );
};
