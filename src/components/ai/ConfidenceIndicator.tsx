
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export interface ConfidenceIndicatorProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  indicatorClassName?: string;
}

/**
 * Displays a visual indicator for confidence or accuracy scores
 * 
 * @param score - A number between 0 and 1 (or 0 and 100) representing the confidence
 * @param size - The size of the indicator (sm, md, lg)
 * @param className - Optional additional class for the container
 * @param indicatorClassName - Optional additional class for the indicator itself
 */
const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  score,
  size = 'md',
  className,
  indicatorClassName,
}) => {
  // Normalize score to 0-100 if it's given as 0-1
  const normalizedScore = score > 1 ? score : score * 100;
  
  // Determine color based on score
  const getColorClass = () => {
    if (normalizedScore >= 80) return 'bg-green-500';
    if (normalizedScore >= 60) return 'bg-yellow-500';
    if (normalizedScore >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };
  
  // Determine size classes
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };
  
  return (
    <div className={cn('flex items-center gap-2', className)} data-testid="confidence-indicator">
      <Progress 
        value={normalizedScore} 
        className={cn(sizeClasses[size], 'bg-muted w-full rounded-full')}
        // Apply a custom class to the indicator itself
        // This is implemented as a div inside the Progress component
        style={{'--progress-indicator-class': indicatorClassName || getColorClass()}}
      />
      <span className="text-xs font-medium w-10 text-right">
        {Math.round(normalizedScore)}%
      </span>
    </div>
  );
};

export default ConfidenceIndicator;
