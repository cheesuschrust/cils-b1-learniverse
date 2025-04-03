
import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BarChartProps {
  data: any[];
  height?: number;
  width?: number;
  barSize?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  keys?: string[];
  colors?: string[];
  stackBars?: boolean;
  horizontal?: boolean;
}

const BarChart: React.FC<BarChartProps> = ({ 
  data,
  height = 300,
  width,
  barSize = 20,
  showGrid = true,
  showLegend = true,
  keys,
  colors = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'],
  stackBars = false,
  horizontal = false
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
  
  // Determine all possible data keys (excluding 'date' and 'name')
  const dataKeys = keys || Object.keys(data[0])
    .filter(key => key !== 'date' && key !== 'name');
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-md shadow-md p-3">
          <p className="font-medium">
            {typeof label === 'string' && label.includes('/')
              ? new Date(label).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
              : label}
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center mt-1">
              <div 
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="font-medium">{entry.name}: </span>
              <span className="ml-1">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <RechartsBarChart
          data={data}
          layout={horizontal ? 'vertical' : 'horizontal'}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#888888" opacity={0.2} />}
          {horizontal ? (
            <>
              <YAxis dataKey="name" type="category" />
              <XAxis type="number" />
            </>
          ) : (
            <>
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }} 
                tickFormatter={(value) => {
                  if (typeof value === 'string' && value.includes('/')) {
                    const date = new Date(value);
                    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  }
                  if (value.length > 10) {
                    return `${value.substring(0, 10)}...`;
                  }
                  return value;
                }}
              />
              <YAxis tick={{ fontSize: 12 }} />
            </>
          )}
          <Tooltip content={<CustomTooltip />} />
          {showLegend && <Legend />}
          
          {dataKeys.map((key, index) => (
            <Bar
              key={key}
              dataKey={key}
              stackId={stackBars ? 'stack' : undefined}
              fill={colors[index % colors.length]}
              barSize={barSize}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
