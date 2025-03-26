
import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

interface DonutChartProps {
  data: any[];
  valueKey: string;
  labelKey: string;
  colors: string[];
  className?: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({ 
  data, 
  valueKey, 
  labelKey, 
  colors,
  className
}) => {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            innerRadius={40}
            fill="#8884d8"
            dataKey={valueKey}
            nameKey={labelKey}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
