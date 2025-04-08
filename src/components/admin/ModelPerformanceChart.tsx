
import React from 'react';

export const ModelPerformanceChart: React.FC = () => {
  // This would be implemented with Recharts or another charting library
  return (
    <div className="flex flex-col h-full justify-center items-center p-4">
      <div className="flex flex-col items-center space-y-1">
        <div className="text-4xl font-bold">96.8%</div>
        <div className="text-sm text-muted-foreground">Accuracy</div>
      </div>
      
      <div className="w-full h-1 bg-muted my-4">
        <div className="h-full bg-primary" style={{ width: '96.8%' }}></div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 w-full text-center">
        <div>
          <div className="text-lg font-medium">92.5%</div>
          <div className="text-xs text-muted-foreground">Previous</div>
        </div>
        <div>
          <div className="text-lg font-medium text-green-500">+4.3%</div>
          <div className="text-xs text-muted-foreground">Improvement</div>
        </div>
      </div>
    </div>
  );
};
