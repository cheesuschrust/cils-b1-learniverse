
import React from 'react';
import { cn } from '@/lib/utils';

export interface ConfidenceIndicatorProps {
  score: number;
  contentType?: 'flashcards' | 'listening' | 'writing' | 'speaking' | 'multiple-choice';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  value?: number; // Allow for backward compatibility
  indicatorClassName?: string;
}

const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  score,
  contentType = 'multiple-choice', // Default content type
  showLabel = true,
  size = 'md',
  className,
  value, // Allow for backward compatibility
  indicatorClassName,
}) => {
  // Use value prop if score is not provided (for backward compatibility)
  const confidenceScore = score ?? value ?? 0;
  
  // Normalize value to be between 0-100
  const normalizedScore = typeof confidenceScore === 'number' 
    ? Math.min(Math.max(confidenceScore > 1 ? confidenceScore : confidenceScore * 100, 0), 100)
    : 0;
  
  // Determine confidence level based on score
  const getConfidenceLevel = () => {
    if (normalizedScore >= 80) return 'high';
    if (normalizedScore >= 50) return 'medium';
    return 'low';
  };
  
  const level = getConfidenceLevel();
  
  // Get label based on confidence level
  const getLabel = () => {
    if (normalizedScore >= 80) return 'Excellent';
    if (normalizedScore >= 65) return 'Good';
    if (normalizedScore >= 40) return 'Fair';
    return 'Needs Work';
  };
  
  // Get color based on confidence level
  const getColor = () => {
    switch (level) {
      case 'high':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
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
        return 'h-1.5';
      case 'lg':
        return 'h-3';
      case 'md':
      default:
        return 'h-2';
    }
  };

  // Get context-specific label for the indicator
  const getContextLabel = () => {
    switch (contentType) {
      case 'writing':
        return 'Writing Quality';
      case 'speaking':
        return 'Pronunciation';
      case 'listening':
        return 'Comprehension';
      case 'flashcards':
        return 'Memory Strength';
      default:
        return 'Confidence Score';
    }
  };
  
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {showLabel && (
        <div className="flex justify-between items-center text-sm">
          <span>{getContextLabel()}</span>
          <span className="font-medium">
            {getLabel()} ({Math.round(normalizedScore)}%)
          </span>
        </div>
      )}
      <div 
        role="progressbar"
        aria-valuenow={normalizedScore}
        aria-valuemin={0}
        aria-valuemax={100}
        className="bg-gray-200 rounded overflow-hidden w-full progress-bar"
      >
        <div 
          className={cn(
            "transition-all duration-500 rounded progress-bar-fill",
            getColor(),
            getSizeClasses(),
            indicatorClassName
          )}
          style={{ width: `${normalizedScore}%` }}
        />
      </div>
    </div>
  );
};

export default ConfidenceIndicator;
