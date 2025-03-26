
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { ConfidenceIndicatorProps } from '@/types/ai';

export const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({ 
  score,
  size = 'md',
  className = '',
  indicatorClassName = ''
}) => {
  const getColorClass = () => {
    if (score >= 90) return 'bg-green-500 dark:bg-green-600';
    if (score >= 70) return 'bg-blue-500 dark:bg-blue-600';
    if (score >= 50) return 'bg-yellow-500 dark:bg-yellow-600';
    return 'bg-red-500 dark:bg-red-600';
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'h-1.5';
      case 'lg': return 'h-3';
      case 'md':
      default: return 'h-2';
    }
  };

  const formattedScore = typeof score === 'number' 
    ? Math.round(score) 
    : typeof score === 'string' 
      ? parseInt(score, 10) 
      : 0;

  return (
    <div className={cn('w-full', className)}>
      <Progress 
        value={formattedScore} 
        className={cn(getSizeClass(), indicatorClassName)} 
        indicatorClassName={getColorClass()}
      />
      <div className="flex justify-between mt-1 text-xs text-muted-foreground">
        <span>0%</span>
        <span>{formattedScore}%</span>
        <span>100%</span>
      </div>
    </div>
  );
};

export default ConfidenceIndicator;
