
import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface BarChartProps {
  data: any[];
  xField: string;
  yField: string | string[];
  height?: number;
  showLegend?: boolean;
  barColor?: string | string[];
  layout?: 'horizontal' | 'vertical';
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  xField,
  yField,
  height = 300,
  showLegend = true,
  barColor = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
  layout = 'horizontal'
}) => {
  const yFields = Array.isArray(yField) ? yField : [yField];
  const barColors = Array.isArray(barColor) ? barColor : [barColor];
  
  const isVertical = layout === 'vertical';
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart
        data={data}
        layout={layout}
        margin={{ top: 5, right: 30, left: isVertical ? 80 : 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        
        {isVertical ? (
          <>
            <XAxis type="number" />
            <YAxis type="category" dataKey={xField} />
          </>
        ) : (
          <>
            <XAxis dataKey={xField} />
            <YAxis />
          </>
        )}
        
        <Tooltip />
        {showLegend && <Legend />}
        
        {yFields.map((field, index) => (
          <Bar
            key={field}
            dataKey={field}
            fill={barColors[index % barColors.length]}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export default BarChart;
