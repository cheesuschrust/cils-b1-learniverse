
import React from 'react';
import { cn } from '@/lib/utils';
import { ConfidenceIndicatorProps } from '@/types/ai';
import { normalizeScore, getConfidenceLabel, getConfidenceColor, getContentTypeTitle } from './ConfidenceIndicator.helpers';

/**
 * Visual indicator for AI confidence scores
 */
const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  score,
  value,
  size = 'md',
  className = '',
  indicatorClassName = '',
  contentType
}) => {
  // Use helpers to calculate and normalize the score
  // Support for older value prop for backward compatibility
  const finalScore = normalizeScore(value !== undefined ? value : (score ?? 0));
  
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
          {getContentTypeTitle(contentType)}
        </span>
        <span className={cn('font-medium', sizeClasses[size])}>
          {getConfidenceLabel(finalScore)} ({finalScore}%)
        </span>
      </div>
      
      <div className={cn('bg-secondary w-full overflow-hidden rounded-full progress-bar', sizeClasses[size])}>
        <div 
          className={cn('rounded-full progress-bar-fill', getConfidenceColor(finalScore), indicatorClassName)}
          style={{ width: `${finalScore}%` }}
          role="progressbar"
          aria-valuenow={finalScore}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
};

export default ConfidenceIndicator;
