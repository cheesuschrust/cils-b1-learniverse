
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LineChart } from '@/components/admin/charts';

const RevenueTrendsCard: React.FC = () => {
  // Mock data for revenue over time
  const revenueData = [
    { date: '2023-03-01', value: 12450 },
    { date: '2023-04-01', value: 14230 },
    { date: '2023-05-01', value: 15640 },
    { date: '2023-06-01', value: 17850 },
    { date: '2023-07-01', value: 19340 },
    { date: '2023-08-01', value: 22150 },
    { date: '2023-09-01', value: 24680 },
    { date: '2023-10-01', value: 27320 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Revenue Trends</CardTitle>
        <CardDescription>Monthly revenue from subscriptions</CardDescription>
      </CardHeader>
      <CardContent>
        <LineChart data={revenueData} xField="date" yField="value" height={250} />
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium">Current Month Revenue</div>
            <div className="text-2xl font-bold">$27,320</div>
            <div className="text-xs text-green-500">+10.7% from last month</div>
          </div>
          <div>
            <div className="text-sm font-medium">Projected Annual</div>
            <div className="text-2xl font-bold">$328,000</div>
            <div className="text-xs text-green-500">+35.2% YoY</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueTrendsCard;
