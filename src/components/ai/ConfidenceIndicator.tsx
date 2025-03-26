
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export interface ConfidenceIndicatorProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  value,
  size = 'md',
  className
}) => {
  // Determine the color based on the confidence score
  const getIndicatorClass = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 70) return 'bg-green-400';
    if (score >= 50) return 'bg-yellow-400';
    if (score >= 30) return 'bg-orange-400';
    return 'bg-red-500';
  };

  // Size classes
  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  };

  return (
    <div className={cn('flex flex-col', className)} data-testid="confidence-indicator">
      <Progress 
        value={value} 
        className={cn(sizeClasses[size])} 
        indicator={getIndicatorClass(value)}
      />
      <div className="text-xs text-muted-foreground mt-1 text-right">
        {value}% confidence
      </div>
    </div>
  );
};

export default ConfidenceIndicator;
