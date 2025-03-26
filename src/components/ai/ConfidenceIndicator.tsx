
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { ConfidenceIndicatorProps } from '@/types/interface-fixes';

const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  score,
  value,
  showLabel = true,
  size = 'md',
  className,
  contentType,
}) => {
  // Use score or value property
  const confidenceValue = score !== undefined ? score * 100 : value !== undefined ? value : 0;
  
  // Determine color based on confidence level
  const getColorClass = () => {
    if (confidenceValue >= 80) return 'text-green-600 dark:text-green-400';
    if (confidenceValue >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };
  
  // Determine indicator text
  const getConfidenceText = () => {
    if (confidenceValue >= 80) return 'High';
    if (confidenceValue >= 60) return 'Medium';
    return 'Low';
  };
  
  // Determine size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs';
      case 'lg':
        return 'text-base';
      case 'md':
      default:
        return 'text-sm';
    }
  };
  
  // Determine progress height
  const getProgressHeight = () => {
    switch (size) {
      case 'sm':
        return 'h-1';
      case 'lg':
        return 'h-3';
      case 'md':
      default:
        return 'h-2';
    }
  };

  // Get label text based on content type
  const getLabelText = () => {
    if (!contentType) return 'Confidence';
    
    switch (contentType) {
      case 'writing':
        return 'Writing Quality';
      case 'speaking':
        return 'Pronunciation';
      case 'listening':
        return 'Comprehension';
      default:
        return 'Confidence';
    }
  };
  
  // Get the appropriate indicator class based on confidence level
  const getIndicatorClass = () => {
    if (confidenceValue >= 80) return 'bg-green-500';
    if (confidenceValue >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  return (
    <div className={cn('space-y-1', className)}>
      {showLabel && (
        <div className="flex justify-between items-center">
          <span className={cn('font-medium', getSizeClasses())}>{getLabelText()}</span>
          <span className={cn('font-medium', getSizeClasses(), getColorClass())}>
            {getConfidenceText()} ({Math.round(confidenceValue)}%)
          </span>
        </div>
      )}
      <Progress 
        value={confidenceValue} 
        className={cn(getProgressHeight())}
        indicator={getIndicatorClass()}
      />
    </div>
  );
};

export default ConfidenceIndicator;
