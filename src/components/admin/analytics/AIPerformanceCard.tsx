
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const AIPerformanceCard: React.FC = () => {
  // Mock data for AI performance over time
  const performanceData = [
    { date: '2023-03-01', accuracy: 82, responseTime: 1.8, errorRate: 5.2 },
    { date: '2023-04-01', accuracy: 84, responseTime: 1.6, errorRate: 4.8 },
    { date: '2023-05-01', accuracy: 85, responseTime: 1.4, errorRate: 4.5 },
    { date: '2023-06-01', accuracy: 87, responseTime: 1.3, errorRate: 4.0 },
    { date: '2023-07-01', accuracy: 89, responseTime: 1.2, errorRate: 3.7 },
    { date: '2023-08-01', accuracy: 91, responseTime: 1.1, errorRate: 3.5 },
  ];
  
  // Current AI metrics
  const aiMetrics = {
    accuracy: 91,
    responseTime: 1.1, // seconds
    errorRate: 3.5, // percentage
    satisfaction: 87, // percentage
    queryVolume: 145280, // total queries
    improvementRate: 9.8, // percentage improvement over time
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>AI Performance Metrics</CardTitle>
            <CardDescription>Performance trends for AI components</CardDescription>
          </div>
          <Badge variant={aiMetrics.accuracy > 90 ? "default" : "outline"}>
            {aiMetrics.accuracy}% Accuracy
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={performanceData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" domain={[75, 100]} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 6]} />
              <Tooltip />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="accuracy" 
                stroke="#2563eb" 
                activeDot={{ r: 8 }}
                strokeWidth={2}
                name="Accuracy %"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="responseTime" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Response Time (s)"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="errorRate" 
                stroke="#f43f5e" 
                strokeWidth={2}
                name="Error Rate %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="space-y-1">
            <div className="text-sm font-medium">Accuracy</div>
            <Progress value={aiMetrics.accuracy} className="h-2" />
            <div className="text-xs text-muted-foreground">{aiMetrics.accuracy}%</div>
          </div>
          
          <div className="space-y-1">
            <div className="text-sm font-medium">Response Time</div>
            <Progress value={100 - (aiMetrics.responseTime/3)*100} className="h-2" />
            <div className="text-xs text-muted-foreground">{aiMetrics.responseTime}s avg.</div>
          </div>
          
          <div className="space-y-1">
            <div className="text-sm font-medium">Error Rate</div>
            <Progress value={100 - aiMetrics.errorRate * 5} className="h-2" />
            <div className="text-xs text-muted-foreground">{aiMetrics.errorRate}%</div>
          </div>
          
          <div className="space-y-1">
            <div className="text-sm font-medium">User Satisfaction</div>
            <Progress value={aiMetrics.satisfaction} className="h-2" />
            <div className="text-xs text-muted-foreground">{aiMetrics.satisfaction}%</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-md">
            <div className="text-sm text-muted-foreground">Query Volume</div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {aiMetrics.queryVolume.toLocaleString()}
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400">
              +{aiMetrics.improvementRate}% more accurate than last quarter
            </div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-950 p-4 rounded-md">
            <div className="text-sm text-muted-foreground">Processing Speed</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {aiMetrics.responseTime}s
            </div>
            <div className="text-xs text-green-600 dark:text-green-400">
              39% faster than industry average
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIPerformanceCard;
