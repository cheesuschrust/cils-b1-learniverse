
import React from 'react';

interface BarChartProps {
  data: any[];
  height?: number;
  width?: number;
}

const BarChart: React.FC<BarChartProps> = ({ data, height = 300, width }) => {
  return (
    <div 
      style={{ height: `${height}px`, width: width ? `${width}px` : '100%' }}
      className="flex items-end justify-between gap-2 py-4"
    >
      {data.map((item, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="flex h-full items-end space-x-2">
            {Object.keys(item).filter(key => key !== 'date' && key !== 'name').map((key) => (
              <div
                key={key}
                style={{ height: `${(item[key] / 20) * 100}%` }}
                className={`w-8 rounded-md bg-primary ${key === 'admin' ? 'opacity-70' : ''}`}
              />
            ))}
          </div>
          <div className="mt-2 text-xs">
            {item.date ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : item.name}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BarChart;
