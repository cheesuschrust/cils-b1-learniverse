
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

export interface ConfidenceIndicatorProps {
  score: number;
  label?: boolean;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  score,
  label = true,
  showDetails = false,
  size = 'md',
  className = '',
}) => {
  // Ensure the score is a number between 0-100
  const normalizedScore = typeof score === 'number' ? Math.max(0, Math.min(100, score * 100)) : 0;
  
  // Determine color based on score
  let color = 'bg-red-500';
  let textColor = 'text-red-700';
  let icon = <AlertCircle className="h-4 w-4" />;
  let labelText = 'Low';
  
  if (normalizedScore >= 80) {
    color = 'bg-green-500';
    textColor = 'text-green-700';
    icon = <CheckCircle2 className="h-4 w-4" />;
    labelText = 'High';
  } else if (normalizedScore >= 50) {
    color = 'bg-yellow-500';
    textColor = 'text-yellow-700';
    icon = <Sparkles className="h-4 w-4" />;
    labelText = 'Medium';
  }
  
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };
  
  const progressSizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="flex items-center gap-2 justify-end">
        {label && (
          <Badge
            variant="outline"
            className={`${textColor} flex items-center gap-1 ${sizeClasses[size]}`}
          >
            {icon}
            <span>
              {showDetails ? `${Math.round(normalizedScore)}% Confidence` : `${labelText} Confidence`}
            </span>
          </Badge>
        )}
      </div>
      
      {showDetails && (
        <Progress 
          value={normalizedScore} 
          className={`w-full ${progressSizes[size]}`}
          fill={color} 
        />
      )}
    </div>
  );
};

export default ConfidenceIndicator;
