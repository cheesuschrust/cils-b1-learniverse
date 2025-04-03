
import React from 'react';

interface LineChartProps {
  data: any[];
  xField?: string;
  yField?: string;
  height?: number;
  width?: number;
}

const LineChart: React.FC<LineChartProps> = ({ 
  data, 
  xField = 'date', 
  yField = 'value', 
  height = 300,
  width 
}) => {
  // Find min and max values for y-axis
  const values = data.map(d => d[yField]);
  const max = Math.max(...values);
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d[yField] / max) * 100);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div 
      className="relative" 
      style={{ height: `${height}px`, width: width ? `${width}px` : '100%' }}
    >
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Grid lines */}
        <line x1="0" y1="0" x2="100" y2="0" stroke="#e5e7eb" strokeWidth="0.5" />
        <line x1="0" y1="25" x2="100" y2="25" stroke="#e5e7eb" strokeWidth="0.5" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="#e5e7eb" strokeWidth="0.5" />
        <line x1="0" y1="75" x2="100" y2="75" stroke="#e5e7eb" strokeWidth="0.5" />
        <line x1="0" y1="100" x2="100" y2="100" stroke="#e5e7eb" strokeWidth="0.5" />
        
        {/* Line */}
        <polyline
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          points={points}
        />
        
        {/* Area */}
        <polyline
          fill="hsl(var(--primary) / 0.2)"
          stroke="none"
          points={`0,100 ${points} 100,100`}
        />
        
        {/* Points */}
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * 100;
          const y = 100 - ((d[yField] / max) * 100);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="1.5"
              fill="hsl(var(--primary))"
              stroke="white"
              strokeWidth="1"
            />
          );
        })}
      </svg>
    </div>
  );
};

export default LineChart;
