
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { ConfidenceIndicatorProps } from '@/types/interface-fixes';
import { cn } from '@/lib/utils';

const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  value,
  score,
  size = 'md',
  className,
  contentType,
  ...props
}) => {
  // Support both value and score props (score is for backward compatibility)
  const confidenceValue = score !== undefined ? score : value;
  
  // Convert confidence value to percentage (0-100)
  const percentage = Math.round(confidenceValue * 100);
  
  // Determine color based on confidence level
  const getColorClass = () => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    if (percentage >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };
  
  // Determine size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'h-1.5';
      case 'lg': return 'h-3';
      case 'md':
      default: return 'h-2';
    }
  };
  
  // Get label based on confidence level
  const getLabel = () => {
    if (percentage >= 80) return 'Excellent';
    if (percentage >= 60) return 'Good';
    if (percentage >= 40) return 'Fair';
    return 'Needs Work';
  };
  
  // Get description text based on content type
  const getDescription = () => {
    if (!contentType) return 'Confidence Score';
    
    switch (contentType.toLowerCase()) {
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

  return (
    <div className={cn("space-y-1", className)} {...props}>
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{getDescription()}</span>
        <span className="font-medium">{getLabel()} ({percentage}%)</span>
      </div>
      <Progress 
        value={percentage}
        max={100}
        className={cn("rounded-full", getSizeClasses())}
        indicator={getColorClass()}
      />
    </div>
  );
};

export default ConfidenceIndicator;
