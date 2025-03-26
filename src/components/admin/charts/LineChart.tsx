
import React from 'react';
import { Line, LineChart as RechartsLineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface LineChartProps {
  data: any[];
  xKey: string;
  lines: {
    key: string;
    label: string;
    color: string;
  }[];
  height?: number | string;
}

export const LineChart: React.FC<LineChartProps> = ({ 
  data, 
  xKey, 
  lines,
  height = 300
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        {lines.map((line, index) => (
          <Line 
            key={index}
            type="monotone" 
            dataKey={line.key} 
            name={line.label}
            stroke={line.color} 
            activeDot={{ r: 8 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};
