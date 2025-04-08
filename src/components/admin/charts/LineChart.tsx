
import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface LineChartProps {
  data: any[];
  xField: string;
  yField: string | string[];
  height?: number;
  showLegend?: boolean;
  lineColor?: string | string[];
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  xField,
  yField,
  height = 300,
  showLegend = true,
  lineColor = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
}) => {
  const yFields = Array.isArray(yField) ? yField : [yField];
  const lineColors = Array.isArray(lineColor) ? lineColor : [lineColor];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xField} />
        <YAxis />
        <Tooltip />
        {showLegend && <Legend />}
        
        {yFields.map((field, index) => (
          <Line
            key={field}
            type="monotone"
            dataKey={field}
            stroke={lineColors[index % lineColors.length]}
            activeDot={{ r: 6 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;
