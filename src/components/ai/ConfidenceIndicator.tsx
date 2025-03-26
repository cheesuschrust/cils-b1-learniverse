
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export interface ConfidenceIndicatorProps {
  confidence: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  confidence,
  showLabel = true,
  size = 'md',
  className
}) => {
  // Determine color based on confidence
  const getColor = () => {
    if (confidence >= 90) return 'bg-green-500';
    if (confidence >= 70) return 'bg-blue-500';
    if (confidence >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const getHeight = () => {
    switch (size) {
      case 'sm': return 'h-1';
      case 'lg': return 'h-3';
      default: return 'h-2';
    }
  };
  
  return (
    <div className={cn("space-y-1", className)}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs">
          <span>AI Confidence</span>
          <span className="font-medium">{Math.round(confidence)}%</span>
        </div>
      )}
      <Progress 
        value={confidence} 
        className={cn(getHeight(), "bg-muted")} 
        indicatorClassName={getColor()}
      />
    </div>
  );
};

export default ConfidenceIndicator;
