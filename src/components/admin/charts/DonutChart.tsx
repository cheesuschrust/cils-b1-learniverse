
import React from 'react';

interface DonutChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  height?: number;
  width?: number;
}

const DonutChart: React.FC<DonutChartProps> = ({ data, height = 300, width }) => {
  const total = data.reduce((acc, slice) => acc + slice.value, 0);
  let currentAngle = 0;
  
  const colors = [
    'hsl(var(--primary))',
    'hsl(var(--primary) / 0.8)',
    'hsl(var(--primary) / 0.6)',
    'hsl(var(--primary) / 0.4)',
    'hsl(var(--primary) / 0.2)'
  ];

  return (
    <div 
      style={{ 
        height: `${height}px`, 
        width: width ? `${width}px` : '100%' 
      }}
      className="relative flex items-center justify-center"
    >
      <svg width="100%" height="100%" viewBox="0 0 100 100">
        {data.map((slice, i) => {
          const startAngle = currentAngle;
          const sliceAngle = (slice.value / total) * 360;
          currentAngle += sliceAngle;
          
          const startX = 50 + 40 * Math.cos((startAngle - 90) * (Math.PI / 180));
          const startY = 50 + 40 * Math.sin((startAngle - 90) * (Math.PI / 180));
          
          const endX = 50 + 40 * Math.cos((currentAngle - 90) * (Math.PI / 180));
          const endY = 50 + 40 * Math.sin((currentAngle - 90) * (Math.PI / 180));
          
          const largeArcFlag = sliceAngle > 180 ? 1 : 0;
          
          const d = [
            `M 50 50`,
            `L ${startX} ${startY}`,
            `A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY}`,
            'Z'
          ].join(' ');
          
          return (
            <path
              key={i}
              d={d}
              fill={colors[i % colors.length]}
            />
          );
        })}
        <circle cx="50" cy="50" r="25" fill="white" />
      </svg>
      
      <div className="absolute bottom-0 flex w-full justify-center">
        <div className="flex flex-wrap justify-center gap-4">
          {data.map((slice, i) => (
            <div key={i} className="flex items-center">
              <div 
                className="mr-2 h-3 w-3 rounded-full" 
                style={{ backgroundColor: colors[i % colors.length] }}
              />
              <span className="text-xs">
                {slice.name} ({Math.round((slice.value / total) * 100)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DonutChart;
