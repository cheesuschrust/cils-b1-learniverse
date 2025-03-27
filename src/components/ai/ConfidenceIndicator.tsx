
import React from 'react';
import { cn } from '@/lib/utils';
import { ConfidenceIndicatorProps } from '@/types/ai';

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
  // Backward compatibility: if score is provided as a decimal, convert to percentage
  const displayScore = score <= 1 ? Math.round(score * 100) : Math.round(score);
  
  // Support for older value prop for backward compatibility
  const finalScore = value !== undefined ? (value <= 1 ? Math.round(value * 100) : Math.round(value)) : displayScore;
  
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
  
  // Get title based on content type
  const getTitle = (type?: string) => {
    if (!type) return 'Confidence Score';
    
    switch (type) {
      case 'writing': return 'Writing Quality';
      case 'speaking': return 'Pronunciation';
      case 'listening': return 'Comprehension';
      default: return 'Confidence Score';
    }
  };
  
  // Get score label text
  const getScoreLabel = (value: number) => {
    if (value >= 80) return 'Excellent';
    if (value >= 60) return 'Good';
    if (value >= 40) return 'Fair';
    return 'Needs Work';
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
          {getTitle(contentType)}
        </span>
        <span className={cn('font-medium', sizeClasses[size])}>
          {getScoreLabel(finalScore)} ({finalScore}%)
        </span>
      </div>
      
      <div className={cn('bg-secondary w-full overflow-hidden rounded-full progress-bar', sizeClasses[size])}>
        <div 
          className={cn('rounded-full progress-bar-fill', getColor(finalScore), indicatorClassName)}
          style={{ width: `${Math.min(Math.max(finalScore, 0), 100)}%` }}
        />
      </div>
    </div>
  );
};

export default ConfidenceIndicator;
