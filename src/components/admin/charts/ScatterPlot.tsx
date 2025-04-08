
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

interface ScatterPlotProps {
  data: any[];
  xDataKey: string;
  yDataKey: string;
  zDataKey?: string;
  nameKey: string;
  height?: number;
  color?: string;
  name?: string;
}

const ScatterPlot: React.FC<ScatterPlotProps> = ({
  data,
  xDataKey,
  yDataKey,
  zDataKey,
  nameKey,
  height = 300,
  color = '#8884d8',
  name = 'Data'
}) => {
  return (
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
        <XAxis type="number" dataKey={xDataKey} name={xDataKey} />
        <YAxis type="number" dataKey={yDataKey} name={yDataKey} />
        {zDataKey && <ZAxis type="number" dataKey={zDataKey} range={[60, 400]} name={zDataKey} />}
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Legend />
        <Scatter name={name} data={data} fill={color} />
      </RechartsScatterChart>
    </ResponsiveContainer>
  );
};

export default ScatterPlot;
