
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface DonutChartProps {
  data: Array<{
    name: string;
    value: number;
    color?: string;
  }>;
  height?: number;
  width?: number;
  innerRadius?: number;
  outerRadius?: number;
  showLegend?: boolean;
  showLabels?: boolean;
  showTooltip?: boolean;
}

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const DefaultRenderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      fontSize={12}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const DonutChart: React.FC<DonutChartProps> = ({
  data,
  height = 300,
  width,
  innerRadius = 60,
  outerRadius = 80,
  showLegend = true,
  showLabels = true,
  showTooltip = true
}) => {
  if (!data || data.length === 0) {
    return (
      <div 
        style={{ height: `${height}px`, width: width ? `${width}px` : '100%' }}
        className="flex items-center justify-center bg-muted/20 rounded-md"
      >
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  // Add colors to data if not provided
  const dataWithColors = data.map((item, index) => ({
    ...item,
    color: item.color || COLORS[index % COLORS.length]
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-md shadow-md p-3">
          <p className="font-medium">{data.name}</p>
          <p>
            <span className="font-semibold">{data.value}</span>
            <span className="ml-2 text-muted-foreground">
              ({((data.value / dataWithColors.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%)
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom legend
  const renderLegend = (props: any) => {
    const { payload } = props;
    
    return (
      <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm mt-4">
        {payload.map((entry: any, index: number) => (
          <li key={`legend-${index}`} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: entry.color }}
            />
            <span>{entry.value}: {entry.payload.value}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={dataWithColors}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={showLabels ? DefaultRenderCustomizedLabel : undefined}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
          >
            {dataWithColors.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          {showTooltip && <Tooltip content={<CustomTooltip />} />}
          {showLegend && <Legend content={renderLegend} />}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DonutChart;
