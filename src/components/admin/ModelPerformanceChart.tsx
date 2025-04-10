
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer
} from '@/adapters/RechartsAdapter';
import { HelpTooltip } from '@/components/help/HelpTooltip';

interface ModelPerformanceData {
  name: string;
  accuracy: number;
  speed: number;
  cost: number;
}

interface ModelPerformanceChartProps {
  data?: ModelPerformanceData[];
  title?: string;
  description?: string;
}

export const ModelPerformanceChart: React.FC<ModelPerformanceChartProps> = ({
  data = [
    { name: 'GPT-4o', accuracy: 95, speed: 80, cost: 85 },
    { name: 'GPT-4o-mini', accuracy: 88, speed: 90, cost: 60 },
    { name: 'Claude 3', accuracy: 91, speed: 85, cost: 75 },
    { name: 'Mistral', accuracy: 86, speed: 95, cost: 55 },
    { name: 'Llama 3', accuracy: 84, speed: 92, cost: 40 },
  ],
  title = "AI Model Performance Comparison",
  description = "Accuracy, speed, and cost comparison across different AI models"
}) => {
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {title}
          <HelpTooltip 
            content="This chart compares key performance metrics across different AI models to help you select the best option for your use case."
          />
        </CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="accuracy" fill="#8884d8" name="Accuracy" />
            <Bar dataKey="speed" fill="#82ca9d" name="Speed" />
            <Bar dataKey="cost" fill="#ffc658" name="Cost Efficiency" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ModelPerformanceChart;
