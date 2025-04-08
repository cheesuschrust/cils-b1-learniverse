
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ModelPerformanceData {
  name: string;
  accuracy: number;
  speed: number;
  memory: number;
}

const data: ModelPerformanceData[] = [
  { 
    name: 'GPT-4o Mini', 
    accuracy: 92, 
    speed: 85, 
    memory: 75 
  },
  { 
    name: 'Llama 3.1', 
    accuracy: 86, 
    speed: 95, 
    memory: 88 
  },
  { 
    name: 'Italian Small', 
    accuracy: 78, 
    speed: 98, 
    memory: 95 
  },
  { 
    name: 'Grammar Assistant', 
    accuracy: 95, 
    speed: 92, 
    memory: 67 
  },
  { 
    name: 'Vocab Checker', 
    accuracy: 89, 
    speed: 97, 
    memory: 93 
  }
];

const ModelPerformanceChart: React.FC = () => {
  const [timeRange, setTimeRange] = React.useState('week');

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Model Performance</CardTitle>
          <CardDescription>
            Performance metrics across different AI models
          </CardDescription>
        </div>
        <Select
          value={timeRange}
          onValueChange={setTimeRange}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Last 24h</SelectItem>
            <SelectItem value="week">Last Week</SelectItem>
            <SelectItem value="month">Last Month</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 5,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '0.875rem' }} />
              <Bar dataKey="accuracy" name="Accuracy %" fill="var(--primary)" radius={4} />
              <Bar dataKey="speed" name="Speed %" fill="var(--primary-foreground)" radius={4} />
              <Bar dataKey="memory" name="Memory Efficiency %" fill="var(--secondary)" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelPerformanceChart;
