
import React from 'react';
import { format } from 'date-fns';

interface ActivityHeatmapProps {
  data: Array<{
    day: number;
    hour: number;
    value: number;
    dayName: string;
    hourFormatted: string;
  }>;
}

const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ data }) => {
  // Find max value for color scaling
  const maxValue = Math.max(...data.map(item => item.value));
  
  // Group data by day
  const dayGroups: Record<number, typeof data> = {};
  data.forEach(item => {
    if (!dayGroups[item.day]) {
      dayGroups[item.day] = [];
    }
    dayGroups[item.day].push(item);
  });
  
  // Color scaling function
  const getColorIntensity = (value: number): string => {
    if (value === 0) return 'bg-slate-100 dark:bg-slate-800';
    
    const normalizedValue = value / maxValue;
    
    if (normalizedValue < 0.25) return 'bg-green-100 dark:bg-green-900';
    if (normalizedValue < 0.5) return 'bg-green-200 dark:bg-green-800';
    if (normalizedValue < 0.75) return 'bg-green-300 dark:bg-green-700';
    return 'bg-green-500 dark:bg-green-600';
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[700px]">
        <div className="flex">
          {/* Empty corner cell */}
          <div className="w-12 flex-shrink-0"></div>
          
          {/* Hour labels (0-23) */}
          {Array.from({ length: 24 }, (_, i) => (
            <div key={`hour-${i}`} className="w-6 flex-shrink-0 text-center">
              <span className="text-xs text-muted-foreground">
                {i % 3 === 0 ? i : ''}
              </span>
            </div>
          ))}
        </div>
        
        {/* Days and heat cells */}
        {[0, 1, 2, 3, 4, 5, 6].map(day => (
          <div key={`day-${day}`} className="flex items-center">
            {/* Day label */}
            <div className="w-12 flex-shrink-0 text-xs font-medium">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]}
            </div>
            
            {/* Hour cells */}
            {Array.from({ length: 24 }, (_, hour) => {
              const cell = data.find(d => d.day === day && d.hour === hour);
              return (
                <div 
                  key={`cell-${day}-${hour}`}
                  className={`w-6 h-6 flex-shrink-0 m-0.5 rounded-sm ${getColorIntensity(cell?.value || 0)}`}
                  title={`${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day]} at ${hour}:00 - ${cell?.value || 0} questions`}
                >
                </div>
              );
            })}
          </div>
        ))}
        
        <div className="flex justify-end mt-2">
          <div className="flex items-center text-xs text-muted-foreground">
            <span>Less</span>
            <div className="flex mx-1">
              <div className="w-4 h-4 bg-slate-100 dark:bg-slate-800 rounded-sm"></div>
              <div className="w-4 h-4 bg-green-100 dark:bg-green-900 rounded-sm"></div>
              <div className="w-4 h-4 bg-green-200 dark:bg-green-800 rounded-sm"></div>
              <div className="w-4 h-4 bg-green-300 dark:bg-green-700 rounded-sm"></div>
              <div className="w-4 h-4 bg-green-500 dark:bg-green-600 rounded-sm"></div>
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityHeatmap;
