
import React from 'react';
import { 
  RadarChart as RechartsRadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Legend, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface DataPoint {
  [key: string]: number | string;
}

interface RadarChartProps {
  data: DataPoint[];
  dataKeys: string[];
  nameKey?: string;
  height?: number;
  colors?: string[];
  className?: string;
  showLegend?: boolean;
  fillOpacity?: number;
  showTooltip?: boolean;
}

const DEFAULT_COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', 
  '#8884d8', '#82ca9d', '#ffc658', '#a4de6c'
];

const RadarChart: React.FC<RadarChartProps> = ({
  data,
  dataKeys,
  nameKey = 'name',
  height = 300,
  colors = DEFAULT_COLORS,
  className = '',
  showLegend = true,
  fillOpacity = 0.6,
  showTooltip = true
}) => {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsRadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey={nameKey} />
          <PolarRadiusAxis />
          
          {dataKeys.map((dataKey, index) => (
            <Radar
              key={dataKey}
              name={dataKey}
              dataKey={dataKey}
              stroke={colors[index % colors.length]}
              fill={colors[index % colors.length]}
              fillOpacity={fillOpacity}
            />
          ))}
          
          {showLegend && <Legend />}
          {showTooltip && <Tooltip />}
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarChart;
