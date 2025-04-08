
import React from 'react';
import { 
  RadarChart as RechartsRadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Legend, 
  ResponsiveContainer,
  Tooltip
} from 'recharts';

interface RadarChartProps {
  data: Record<string, any>[];
  dataKeys: string[];
  nameKey: string;
  height?: number;
  className?: string;
  title?: string;
  colors?: string[];
}

/**
 * RadarChart component to visualize multi-dimensional data
 * Useful for comparing different models/categories across multiple metrics
 */
const RadarChart: React.FC<RadarChartProps> = ({
  data,
  dataKeys,
  nameKey,
  height = 300,
  className = '',
  title,
  colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F']
}) => {
  return (
    <div className={`w-full ${className}`}>
      {title && <h3 className="text-base font-medium mb-2">{title}</h3>}
      
      <ResponsiveContainer width="100%" height={height}>
        <RechartsRadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey={nameKey} />
          <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
          
          <Tooltip 
            formatter={(value, name) => {
              return [`${value}`, name];
            }}
          />
          
          {dataKeys.map((key, index) => (
            <Radar
              key={key}
              name={key}
              dataKey={key}
              stroke={colors[index % colors.length]}
              fill={colors[index % colors.length]}
              fillOpacity={0.2}
            />
          ))}
          
          <Legend />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarChart;
