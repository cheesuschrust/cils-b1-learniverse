
import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BarChartProps {
  data: any[];
  xField: string;
  yField: string | string[];
  height?: number;
  showLegend?: boolean;
  barColors?: string | string[];
  stacked?: boolean;
}

const BarChart: React.FC<BarChartProps> = ({ 
  data, 
  xField, 
  yField, 
  height = 300,
  showLegend = false,
  barColors = "#3b82f6",
  stacked = false
}) => {
  // Convert string yField to array for consistent processing
  const yFields = Array.isArray(yField) ? yField : [yField];
  const colors = Array.isArray(barColors) ? barColors : [barColors];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xField} />
        <YAxis />
        <Tooltip />
        {showLegend && <Legend />}
        {yFields.map((field, index) => (
          <Bar 
            key={field}
            dataKey={field} 
            fill={colors[index % colors.length]} 
            stackId={stacked ? 'a' : undefined}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export default BarChart;
