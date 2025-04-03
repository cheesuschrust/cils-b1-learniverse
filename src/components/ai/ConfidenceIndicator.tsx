
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ConfidenceIndicatorProps {
  score: number;  // 0 to 1 value
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  score,
  size = 'md',
  showText = true,
  className = ''
}) => {
  // Ensure score is between 0 and 1
  const normalizedScore = Math.max(0, Math.min(1, score));
  
  // Determine the color based on the score
  let color = '';
  let label = '';
  
  if (normalizedScore < 0.5) {
    color = 'bg-red-500 text-white';
    label = 'Low';
  } else if (normalizedScore < 0.7) {
    color = 'bg-yellow-500 text-black';
    label = 'Medium';
  } else if (normalizedScore < 0.9) {
    color = 'bg-green-500 text-white';
    label = 'High';
  } else {
    color = 'bg-emerald-600 text-white';
    label = 'Very High';
  }
  
  // Convert score to percentage for display
  const percentage = Math.round(normalizedScore * 100);
  
  // Size classes
  const sizeClasses = {
    sm: 'text-xs py-0.5 px-1.5',
    md: 'text-sm py-0.5 px-2',
    lg: 'text-base py-1 px-3'
  };
  
  return (
    <Badge className={`${color} ${sizeClasses[size]} ${className}`}>
      {showText ? (
        <>
          {label} <span className="ml-1 opacity-80">{percentage}%</span>
        </>
      ) : (
        `${percentage}%`
      )}
    </Badge>
  );
};

export default ConfidenceIndicator;
