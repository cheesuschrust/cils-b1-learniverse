
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { ConfidenceIndicatorProps } from '@/types';

/**
 * Displays a visual indicator of confidence/score with appropriate colors and labels
 */
const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({ 
  score,
  value,  // For backward compatibility
  contentType = 'unknown',
  size = 'md',
  className,
  indicatorClassName
}) => {
  // Handle percentage or decimal scores (0-100 or 0-1)
  // Support backward compatibility with 'value' prop
  const scoreValue = value !== undefined ? value : score;
  const normalizedScore = typeof scoreValue === 'number'
    ? (scoreValue > 1 ? scoreValue : scoreValue * 100)
    : 0;
  
  // Ensure score is between 0 and 100
  const clampedScore = Math.max(0, Math.min(100, normalizedScore));
  
  // Determine color based on score
  const getColorClass = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };
  
  // Get appropriate label based on score
  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Work';
  };
  
  // Get appropriate description based on content type
  const getDescription = (type: string) => {
    switch (type) {
      case 'writing':
        return 'Writing Quality';
      case 'speaking':
        return 'Pronunciation';
      case 'listening':
        return 'Comprehension';
      default:
        return 'Confidence Score';
    }
  };
  
  // Determine size class for the progress bar
  const getSizeClass = (size: string) => {
    switch (size) {
      case 'sm': return 'h-1.5';
      case 'lg': return 'h-3';
      case 'md':
      default:
        return 'h-2';
    }
  };
  
  const description = getDescription(contentType);
  const scoreLabel = getScoreLabel(clampedScore);
  const colorClass = getColorClass(clampedScore);
  const sizeClass = getSizeClass(size);
  
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex justify-between text-sm">
        <span className="font-medium">{description}</span>
        <span className="font-medium">
          {scoreLabel} ({Math.round(clampedScore)}%)
        </span>
      </div>
      
      <Progress 
        value={clampedScore}
        className={cn("w-full", sizeClass)}
        indicatorClassName={cn(colorClass, indicatorClassName)}
      />
    </div>
  );
};

export default ConfidenceIndicator;
