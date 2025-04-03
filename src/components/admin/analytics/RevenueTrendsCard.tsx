
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LineChart } from '@/components/admin/charts';

const RevenueTrendsCard: React.FC = () => {
  // Mock data for revenue trends
  const revenueData = [
    { date: '2023-03-01', subscription: 28450, oneTime: 3200 },
    { date: '2023-04-01', subscription: 31280, oneTime: 2800 },
    { date: '2023-05-01', subscription: 34120, oneTime: 3600 },
    { date: '2023-06-01', subscription: 36980, oneTime: 2950 },
    { date: '2023-07-01', subscription: 39240, oneTime: 3650 },
    { date: '2023-08-01', subscription: 42350, oneTime: 4100 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Trends</CardTitle>
        <CardDescription>Monthly recurring and one-time revenue</CardDescription>
      </CardHeader>
      <CardContent>
        <LineChart 
          data={revenueData} 
          xField="date" 
          yField={['subscription', 'oneTime']} 
          height={300}
          showLegend={true}
          lineColor={['#2563eb', '#10b981']}
        />
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-md">
            <div className="text-sm text-muted-foreground">MRR</div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              $42,350
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400">
              +7.9% from last month
            </div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-950 p-3 rounded-md">
            <div className="text-sm text-muted-foreground">ARR</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              $508,200
            </div>
            <div className="text-xs text-green-600 dark:text-green-400">
              +7.9% from last month
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueTrendsCard;
