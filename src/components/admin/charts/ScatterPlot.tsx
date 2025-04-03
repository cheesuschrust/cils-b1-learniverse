
import React from 'react';
import { 
  ScatterChart as RechartsScatterChart, 
  Scatter,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ZAxis
} from 'recharts';

interface DataPoint {
  [key: string]: any;
}

interface ScatterPlotProps {
  data: DataPoint[];
  xDataKey: string;
  yDataKey: string;
  zDataKey?: string;
  nameKey?: string;
  height?: number;
  colors?: string[];
  className?: string;
  showLegend?: boolean;
  showTooltip?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  groups?: { name: string; data: DataPoint[] }[];
}

const DEFAULT_COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', 
  '#8884d8', '#82ca9d', '#ffc658', '#a4de6c'
];

const ScatterPlot: React.FC<ScatterPlotProps> = ({
  data,
  xDataKey,
  yDataKey,
  zDataKey,
  nameKey,
  height = 300,
  colors = DEFAULT_COLORS,
  className = '',
  showLegend = true,
  showTooltip = true,
  xAxisLabel,
  yAxisLabel,
  groups
}) => {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsScatterChart
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid />
          <XAxis 
            type="number" 
            dataKey={xDataKey} 
            name={xAxisLabel || xDataKey} 
            label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -10 } : undefined}
          />
          <YAxis 
            type="number" 
            dataKey={yDataKey} 
            name={yAxisLabel || yDataKey} 
            label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
          />
          {zDataKey && <ZAxis type="number" dataKey={zDataKey} range={[50, 400]} />}
          
          {showTooltip && <Tooltip cursor={{ strokeDasharray: '3 3' }} />}
          {showLegend && <Legend />}
          
          {groups ? (
            groups.map((group, index) => (
              <Scatter
                key={group.name}
                name={group.name}
                data={group.data}
                fill={colors[index % colors.length]}
              />
            ))
          ) : (
            <Scatter
              name={nameKey || `${xDataKey} vs ${yDataKey}`}
              data={data}
              fill={colors[0]}
            />
          )}
        </RechartsScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScatterPlot;
