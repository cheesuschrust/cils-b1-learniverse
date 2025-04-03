
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const ModelUsageCard: React.FC = () => {
  const models = [
    { name: 'Italian Language Model', requests: 42640, quota: 50000, percentage: 85.28 },
    { name: 'Speech Recognition', requests: 12845, quota: 20000, percentage: 64.22 },
    { name: 'Translation Model', requests: 8956, quota: 10000, percentage: 89.56 },
    { name: 'Writing Assessment', requests: 3542, quota: 5000, percentage: 70.84 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">AI Model Usage</CardTitle>
        <CardDescription>API requests and quota utilization</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {models.map((model, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center">
                    <span className="font-medium">{model.name}</span>
                    {model.percentage > 90 ? (
                      <Badge variant="destructive" className="ml-2">Near Limit</Badge>
                    ) : model.percentage > 75 ? (
                      <Badge variant="default" className="ml-2 bg-amber-500">High Usage</Badge>
                    ) : (
                      <Badge variant="outline" className="ml-2">Normal</Badge>
                    )}
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-0.5">
                    <div>{model.requests.toLocaleString()} / {model.quota.toLocaleString()}</div>
                    <div>{model.percentage.toFixed(1)}%</div>
                  </div>
                </div>
              </div>
              <Progress 
                value={model.percentage} 
                className="h-2" 
                indicatorClassName={model.percentage > 90 ? 'bg-red-500' : model.percentage > 75 ? 'bg-amber-500' : ''}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelUsageCard;
