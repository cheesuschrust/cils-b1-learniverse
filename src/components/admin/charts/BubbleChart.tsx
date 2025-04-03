
import React from 'react';
import { 
  ScatterChart, 
  Scatter,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ZAxis
} from 'recharts';

interface BubbleChartProps {
  data: Record<string, any>[];
  xAxis: {
    dataKey: string;
    name?: string;
    unit?: string;
  };
  yAxis: {
    dataKey: string;
    name?: string;
    unit?: string;
  };
  zAxis: {
    dataKey: string;
    name?: string;
    range?: [number, number];
  };
  groups: {
    name: string;
    dataKey?: string;
    color?: string;
  }[];
  height?: number;
  className?: string;
  title?: string;
}

const DEFAULT_COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', 
  '#8884d8', '#82ca9d', '#ffc658', '#a4de6c'
];

/**
 * BubbleChart component for visualizing multi-dimensional data
 * Particularly useful for comparing AI model versions on multiple metrics
 */
const BubbleChart: React.FC<BubbleChartProps> = ({
  data,
  xAxis,
  yAxis,
  zAxis,
  groups,
  height = 400,
  className = '',
  title
}) => {
  // Filter function to get data for a specific group if needed
  const getGroupData = (group: { name: string, dataKey?: string, color?: string }) => {
    if (!group.dataKey) return data;
    // If we have a group dataKey, filter data for this specific group
    return data.filter(item => String(item[group.dataKey!]) === group.name);
  };
  
  return (
    <div className={`w-full ${className}`}>
      {title && <h3 className="text-base font-medium mb-2">{title}</h3>}
      
      <ResponsiveContainer width="100%" height={height}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          
          <XAxis 
            type="number" 
            dataKey={xAxis.dataKey} 
            name={xAxis.name || xAxis.dataKey}
            unit={xAxis.unit || ''}
            label={xAxis.name ? { value: xAxis.name, position: 'insideBottom', offset: -10 } : undefined} 
          />
          
          <YAxis 
            type="number" 
            dataKey={yAxis.dataKey} 
            name={yAxis.name || yAxis.dataKey}
            unit={yAxis.unit || ''}
            label={yAxis.name ? { value: yAxis.name, angle: -90, position: 'insideLeft', offset: -5 } : undefined} 
          />
          
          <ZAxis 
            type="number" 
            dataKey={zAxis.dataKey} 
            range={zAxis.range || [50, 400]} 
            name={zAxis.name || zAxis.dataKey} 
          />
          
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }}
            formatter={(value, name) => {
              // Format different types of values differently
              if (name === xAxis.dataKey && xAxis.unit) {
                return [`${value}${xAxis.unit}`, xAxis.name || name];
              }
              if (name === yAxis.dataKey && yAxis.unit) {
                return [`${value}${yAxis.unit}`, yAxis.name || name];
              }
              if (name === zAxis.dataKey) {
                return [`${value}`, zAxis.name || name];
              }
              return [`${value}`, name];
            }}
          />
          
          <Legend />
          
          {groups.map((group, index) => (
            <Scatter 
              key={group.name}
              name={group.name}
              data={getGroupData(group)}
              fill={group.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BubbleChart;
