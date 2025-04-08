
import React from 'react';
import {
  ScatterChart as RechartsScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface ScatterPlotProps {
  data: any[];
  xDataKey: string;
  yDataKey: string;
  zDataKey?: string;
  nameKey?: string;
  height?: number;
  xAxisLabel?: string;
  yAxisLabel?: string;
  colors?: string[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  nameKey?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, nameKey }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border border-border p-3 rounded-md shadow-md">
        <p className="font-medium">{nameKey ? data[nameKey] : 'Point'}</p>
        {Object.entries(data)
          .filter(([key]) => key !== nameKey && !key.startsWith('_'))
          .map(([key, value]) => (
            <p key={key} className="text-sm">
              {key}: {value as React.ReactNode}
            </p>
          ))}
      </div>
    );
  }
  return null;
};

const ScatterPlot: React.FC<ScatterPlotProps> = ({
  data,
  xDataKey,
  yDataKey,
  zDataKey,
  nameKey,
  height = 300,
  xAxisLabel,
  yAxisLabel,
  colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
}) => {
  // Group data by unique name values if nameKey is provided
  const groupedData = nameKey
    ? Array.from(new Set(data.map(item => item[nameKey]))).map(name => ({
        name,
        data: data.filter(item => item[nameKey] === name)
      }))
    : [{ name: 'Data', data }];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsScatterChart
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          type="number" 
          dataKey={xDataKey} 
          name={xAxisLabel || xDataKey} 
          label={xAxisLabel ? { value: xAxisLabel, position: 'bottom' } : undefined}
        />
        <YAxis 
          type="number" 
          dataKey={yDataKey} 
          name={yAxisLabel || yDataKey} 
          label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'left' } : undefined}
        />
        {zDataKey && <ZAxis type="number" dataKey={zDataKey} range={[50, 400]} />}
        <Tooltip content={<CustomTooltip nameKey={nameKey} />} />
        <Legend />
        
        {groupedData.map((group, index) => (
          <Scatter
            key={`scatter-${group.name}`}
            name={group.name}
            data={group.data}
            fill={colors[index % colors.length]}
          />
        ))}
      </RechartsScatterChart>
    </ResponsiveContainer>
  );
};

export default ScatterPlot;
