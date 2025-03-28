
import React from 'react';
import { ConfidenceIndicatorProps } from '@/types/ai';
import { cn } from '@/lib/utils';

const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  score,
  contentType = 'multiple-choice', // Default content type
  showLabel = false,
  size = 'md',
  className,
  value, // Allow for backward compatibility
  indicatorClassName,
}) => {
  // Use value prop if score is not provided (for backward compatibility)
  const confidenceScore = score ?? value ?? 0;
  
  // Determine confidence level based on score
  const getConfidenceLevel = () => {
    if (confidenceScore >= 80) return 'high';
    if (confidenceScore >= 50) return 'medium';
    return 'low';
  };
  
  const level = getConfidenceLevel();
  
  // Get color based on confidence level
  const getColor = () => {
    switch (level) {
      case 'high':
        return 'bg-green-500';
      case 'medium':
        return 'bg-amber-500';
      case 'low':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  // Determine size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-1.5 w-16';
      case 'lg':
        return 'h-3 w-32';
      case 'md':
      default:
        return 'h-2 w-24';
    }
  };
  
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="bg-gray-200 rounded overflow-hidden w-full">
        <div 
          className={cn(
            "h-full transition-all duration-500 rounded",
            getColor(),
            getSizeClasses(),
            indicatorClassName
          )}
          style={{ width: `${Math.min(Math.max(confidenceScore, 0), 100)}%` }}
        />
      </div>
      {showLabel && (
        <div className="text-xs text-muted-foreground">
          Confidence: {confidenceScore.toFixed(0)}%
        </div>
      )}
    </div>
  );
};

export default ConfidenceIndicator;
