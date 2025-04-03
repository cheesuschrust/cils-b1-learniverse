
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const ModelUsageCard: React.FC = () => {
  // Mock data for AI model usage
  const modelUsageData = [
    { name: 'gpt-3.5-turbo', value: 68, color: '#3b82f6' },
    { name: 'gpt-4', value: 22, color: '#10b981' },
    { name: 'mistral-7b', value: 10, color: '#f59e0b' },
  ];
  
  const featureUsageData = [
    { name: 'Question Generation', value: 45, color: '#60a5fa' },
    { name: 'Content Classification', value: 25, color: '#34d399' },
    { name: 'Translation', value: 15, color: '#a855f7' },
    { name: 'Evaluation', value: 15, color: '#f472b6' },
  ];

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Model Usage</CardTitle>
        <CardDescription>Distribution by model and feature</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-[200px]">
            <h4 className="text-sm font-medium text-center mb-2">By Model</h4>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={modelUsageData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {modelUsageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="h-[200px]">
            <h4 className="text-sm font-medium text-center mb-2">By Feature</h4>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={featureUsageData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {featureUsageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-md">
            <div className="text-sm text-muted-foreground">Total API Calls</div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              287,495
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400">
              Last 30 days
            </div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-950 p-4 rounded-md">
            <div className="text-sm text-muted-foreground">Avg. Cost per Call</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              $0.0032
            </div>
            <div className="text-xs text-green-600 dark:text-green-400">
              -12% from previous month
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelUsageCard;
