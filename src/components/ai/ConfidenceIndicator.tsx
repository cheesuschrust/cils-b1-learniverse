
import React from 'react';
import { cn } from '@/lib/utils';
import { ConfidenceIndicatorProps } from '@/types/ai';

/**
 * Visual indicator for AI confidence scores
 */
const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  score,
  size = 'md',
  className = '',
  indicatorClassName = ''
}) => {
  // Determine color based on confidence score
  const getColor = (value: number) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  // Determine label based on confidence score
  const getLabel = (value: number) => {
    if (value >= 80) return 'High';
    if (value >= 60) return 'Medium';
    return 'Low';
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'h-1.5 text-xs',
    md: 'h-2 text-sm',
    lg: 'h-3 text-base'
  };
  
  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex justify-between items-center">
        <span className={cn('text-muted-foreground', sizeClasses[size])}>
          Confidence: {getLabel(score)}
        </span>
        <span className={cn('font-medium', sizeClasses[size])}>
          {Math.round(score)}%
        </span>
      </div>
      
      <div className={cn('bg-secondary w-full overflow-hidden rounded-full', sizeClasses[size])}>
        <div 
          className={cn('rounded-full', getColor(score), indicatorClassName)}
          style={{ width: `${Math.min(Math.max(score, 0), 100)}%` }}
        />
      </div>
    </div>
  );
};

export default ConfidenceIndicator;
