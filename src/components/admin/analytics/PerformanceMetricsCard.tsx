
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';

export const PerformanceMetricsCard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
        <CardDescription>
          System performance for AI processing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Average Inference Time</Label>
            <div className="flex items-center">
              <div className="flex-1">
                <Progress value={70} className="h-3" />
              </div>
              <span className="ml-4 font-medium">84ms</span>
            </div>
          </div>
          
          <div>
            <Label className="mb-2 block">Resource Utilization</Label>
            <div className="flex items-center">
              <div className="flex-1">
                <Progress value={45} className="h-3" />
              </div>
              <span className="ml-4 font-medium">45%</span>
            </div>
          </div>
          
          <div>
            <Label className="mb-2 block">Cache Hit Rate</Label>
            <div className="flex items-center">
              <div className="flex-1">
                <Progress value={85} className="h-3" />
              </div>
              <span className="ml-4 font-medium">85%</span>
            </div>
          </div>
          
          <div>
            <Label className="mb-2 block">Browser Compatibility</Label>
            <div className="flex items-center">
              <div className="flex-1">
                <Progress value={92} className="h-3" />
              </div>
              <span className="ml-4 font-medium">92%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
