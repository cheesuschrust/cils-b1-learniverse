
import React from 'react';
import { cn } from '@/lib/utils';

export interface ConfidenceIndicatorProps {
  score: number;
  value?: number;
  className?: string;
  indicatorClassName?: string;
}

/**
 * Component to visually display AI confidence scores
 * @param score - Confidence score between 0 and 1
 */
const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  score,
  value = score,
  className = '',
  indicatorClassName = ''
}) => {
  // Ensure score is between 0 and 1
  const normalizedScore = Math.max(0, Math.min(1, score));
  const percent = Math.round(normalizedScore * 100);
  
  // Determine color based on confidence level
  let color = '';
  let label = '';
  
  if (normalizedScore >= 0.8) {
    color = 'bg-green-500';
    label = 'High Confidence';
  } else if (normalizedScore >= 0.6) {
    color = 'bg-yellow-500';
    label = 'Medium Confidence';
  } else {
    color = 'bg-red-500';
    label = 'Low Confidence';
  }
  
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={cn("h-full rounded-full", color, indicatorClassName)}
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`AI confidence level: ${label}`}
        />
      </div>
      <div className="text-sm font-medium w-10 text-right">
        {`${percent}%`}
      </div>
    </div>
  );
};

export default ConfidenceIndicator;
