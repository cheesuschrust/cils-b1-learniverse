
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface UsageStats {
  model: string;
  requests: number;
  quotaUsed: number;
  quotaTotal: number;
  averageLatency: number;
}

const modelStats: UsageStats[] = [
  {
    model: 'GPT-4o',
    requests: 24582,
    quotaUsed: 75,
    quotaTotal: 100,
    averageLatency: 284,
  },
  {
    model: 'GPT-4o-mini',
    requests: 86741,
    quotaUsed: 43,
    quotaTotal: 100,
    averageLatency: 124,
  },
  {
    model: 'Embedding Model',
    requests: 192653,
    quotaUsed: 28,
    quotaTotal: 100,
    averageLatency: 52,
  }
];

const ModelUsageCard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Model Usage</CardTitle>
        <CardDescription>Request counts and quota usage by model</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {modelStats.map((stat) => (
            <div key={stat.model} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="font-medium">{stat.model}</div>
                <div className="text-sm text-muted-foreground">{stat.requests.toLocaleString()} requests</div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div>Quota: {stat.quotaUsed}%</div>
                <div>Avg Latency: {stat.averageLatency}ms</div>
              </div>
              <Progress 
                value={stat.quotaUsed} 
                className="h-2" 
              />
            </div>
          ))}
          
          <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium mb-2">Total Monthly Usage</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-2 bg-muted rounded-md">
                <div className="text-2xl font-semibold">303,976</div>
                <div className="text-xs text-muted-foreground">Total Requests</div>
              </div>
              <div className="p-2 bg-muted rounded-md">
                <div className="text-2xl font-semibold">$312.84</div>
                <div className="text-xs text-muted-foreground">Monthly Cost</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelUsageCard;
