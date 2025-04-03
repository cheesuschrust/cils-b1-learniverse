
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LineChart } from '@/components/admin/charts';

const AIAccuracyMetricsCard: React.FC = () => {
  // Mock data for AI accuracy over time
  const accuracyData = [
    { date: '2023-03-20', value: 78 },
    { date: '2023-03-27', value: 79 },
    { date: '2023-04-03', value: 81 },
    { date: '2023-04-10', value: 82 },
    { date: '2023-04-17', value: 84 },
    { date: '2023-04-24', value: 85 },
    { date: '2023-05-01', value: 87 },
    { date: '2023-05-08', value: 88 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">AI Accuracy Over Time</CardTitle>
        <CardDescription>Tracking improvements in model performance</CardDescription>
      </CardHeader>
      <CardContent>
        <LineChart data={accuracyData} xField="date" yField="value" height={250} />
        <div className="mt-4 flex items-center justify-between text-sm">
          <div>
            <div className="font-medium">Starting Accuracy</div>
            <div>78%</div>
          </div>
          <div>
            <div className="font-medium">Current Accuracy</div>
            <div className="text-green-500">88% (+10%)</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIAccuracyMetricsCard;
