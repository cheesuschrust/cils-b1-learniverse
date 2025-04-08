
import React from 'react';
import {
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface RadarChartProps {
  data: any[];
  dataKeys: string[];
  nameKey: string;
  height?: number;
  colors?: string[];
}

const RadarChart: React.FC<RadarChartProps> = ({
  data,
  dataKeys,
  nameKey,
  height = 300,
  colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsRadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey={nameKey} />
        <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
        
        {dataKeys.map((key, index) => (
          <Radar
            key={key}
            name={key}
            dataKey={key}
            stroke={colors[index % colors.length]}
            fill={colors[index % colors.length]}
            fillOpacity={0.6}
          />
        ))}
        
        <Tooltip />
        <Legend />
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
};

export default RadarChart;
