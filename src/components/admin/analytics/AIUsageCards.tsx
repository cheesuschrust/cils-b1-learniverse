
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface AIUsageCardsProps {
  period: string;
}

const AIUsageCards: React.FC<AIUsageCardsProps> = ({ period }) => {
  // This would normally come from an API call based on the period
  const aiUsage = {
    totalRequests: period === '7d' ? 87463 : period === '30d' ? 324589 : 986732,
    avgLatency: period === '7d' ? 142 : period === '30d' ? 156 : 174,
    errorRate: period === '7d' ? 1.2 : period === '30d' ? 1.8 : 2.3,
    costPerDay: period === '7d' ? 24.86 : period === '30d' ? 22.14 : 19.37
  };
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total AI Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{aiUsage.totalRequests.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground mt-1">
            Over the last {period === '7d' ? '7 days' : period === '30d' ? '30 days' : '90 days'}
          </div>
          <Progress value={75} className="h-1 mt-2" />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{aiUsage.avgLatency}ms</div>
          <div className="text-xs text-muted-foreground mt-1">
            Target: &lt;200ms
          </div>
          <Progress value={(aiUsage.avgLatency / 200) * 100} className="h-1 mt-2" indicatorClassName="bg-green-500" />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{aiUsage.errorRate}%</div>
          <div className="text-xs text-muted-foreground mt-1">
            Target: &lt;5%
          </div>
          <Progress value={(aiUsage.errorRate / 5) * 100} className="h-1 mt-2" indicatorClassName="bg-green-500" />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Avg Cost per Day</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${aiUsage.costPerDay}</div>
          <div className="text-xs text-muted-foreground mt-1">
            Budget: $30/day
          </div>
          <Progress value={(aiUsage.costPerDay / 30) * 100} className="h-1 mt-2" indicatorClassName="bg-blue-500" />
        </CardContent>
      </Card>
    </div>
  );
};

export default AIUsageCards;
