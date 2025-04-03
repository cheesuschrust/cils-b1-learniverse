
import React from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

interface DonutChartProps {
  data: { name: string; value: number; color?: string }[];
  nameKey?: string;
  valueKey?: string;
  height?: number;
  showLegend?: boolean;
  colors?: string[];
  innerRadius?: number;
  outerRadius?: number;
  paddingAngle?: number;
  className?: string;
  tooltip?: boolean;
  dataKey?: string; // Added to support different data structures
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#a4de6c'];

const DonutChart: React.FC<DonutChartProps> = ({
  data,
  nameKey = 'name',
  valueKey = 'value',
  dataKey,
  height = 300,
  showLegend = true,
  colors = COLORS,
  innerRadius = 60,
  outerRadius = 80,
  paddingAngle = 2,
  className = '',
  tooltip = true
}) => {
  // Use dataKey if provided, otherwise use valueKey
  const actualDataKey = dataKey || valueKey;

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            paddingAngle={paddingAngle}
            fill="#8884d8"
            dataKey={actualDataKey}
            nameKey={nameKey}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color || colors[index % colors.length]} 
              />
            ))}
          </Pie>
          {showLegend && <Legend />}
          {tooltip && <Tooltip />}
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DonutChart;
