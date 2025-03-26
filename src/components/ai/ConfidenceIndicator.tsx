
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ConfidenceIndicatorProps {
  score?: number;
  value?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  score,
  value,
  showLabel = true,
  size = 'md',
  className,
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
  
  return (
    <div className={cn('space-y-1', className)}>
      {showLabel && (
        <div className="flex justify-between items-center">
          <span className={cn('font-medium', getSizeClasses())}>Confidence</span>
          <span className={cn('font-medium', getSizeClasses(), getColorClass())}>
            {getConfidenceText()} ({Math.round(confidenceValue)}%)
          </span>
        </div>
      )}
      <Progress 
        value={confidenceValue} 
        className={cn(getProgressHeight())}
        indicator={confidenceValue >= 80 ? 'bg-green-500' : 
                 confidenceValue >= 60 ? 'bg-yellow-500' : 
                 'bg-red-500'}
      />
    </div>
  );
};

export default ConfidenceIndicator;
