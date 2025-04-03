
import React from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface LineChartProps {
  data: any[];
  xField?: string;
  yField?: string;
  height?: number;
  width?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  lineColor?: string;
  customTooltip?: React.FC<any>;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  xField = 'date',
  yField = 'count',
  height = 300,
  width,
  showGrid = true,
  showLegend = false,
  lineColor = '#2563eb',
  customTooltip
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

  // Determine if we have multiple lines (multiple y-axis fields)
  const multiLine = typeof yField !== 'string';
  
  // Format dates for x-axis if xField is 'date'
  const formatXAxis = (tickItem: string) => {
    if (xField === 'date') {
      const date = new Date(tickItem);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    return tickItem;
  };

  // Default tooltip formatter
  const DefaultTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-md shadow-md p-3">
          <p className="font-medium">
            {xField === 'date'
              ? new Date(label).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })
              : label}
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center mt-1">
              <div 
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: entry.stroke }}
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
        <RechartsLineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#888888" opacity={0.2} />}
          <XAxis 
            dataKey={xField} 
            tickFormatter={formatXAxis}
            stroke="#888888"
            fontSize={12}
          />
          <YAxis 
            stroke="#888888"
            fontSize={12}
          />
          <Tooltip content={customTooltip || <DefaultTooltip />} />
          {showLegend && <Legend />}
          
          {multiLine ? (
            // Render multiple lines if yField is an array
            (yField as string[]).map((field, index) => (
              <Line
                key={field}
                type="monotone"
                dataKey={field}
                name={field}
                stroke={Array.isArray(lineColor) ? lineColor[index % lineColor.length] : lineColor}
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            ))
          ) : (
            // Render single line
            <Line
              type="monotone"
              dataKey={yField}
              stroke={lineColor}
              activeDot={{ r: 8 }}
              strokeWidth={2}
            />
          )}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;
