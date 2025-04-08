
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface ContentDistributionData {
  name: string;
  value: number;
  color: string;
}

interface ContentDistributionChartProps {
  data?: ContentDistributionData[];
  height?: number;
}

const ContentDistributionChart: React.FC<ContentDistributionChartProps> = ({ 
  data,
  height = 300 
}) => {
  // Default data if none provided
  const chartData = data || [
    { name: 'Flashcards', value: 35, color: '#3b82f6' },
    { name: 'Multiple Choice', value: 25, color: '#10b981' },
    { name: 'Reading', value: 15, color: '#8b5cf6' },
    { name: 'Writing', value: 10, color: '#f59e0b' },
    { name: 'Speaking', value: 8, color: '#ef4444' },
    { name: 'Listening', value: 7, color: '#06b6d4' },
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
        <CardTitle>Content Type Distribution</CardTitle>
        <CardDescription>Breakdown of content by type</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: height }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentDistributionChart;
