
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cva } from 'class-variance-authority';
import { Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from 'lucide-react';

interface ConfidenceIndicatorProps {
  score: number;
  showLabel?: boolean;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  tooltipText?: string;
  className?: string;
}

const badgeVariants = cva('', {
  variants: {
    confidence: {
      high: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30',
      medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/30',
      low: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30'
    },
  },
  defaultVariants: {
    confidence: 'medium',
  }
});

const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  score,
  showLabel = true,
  showIcon = true,
  size = 'md',
  tooltipText,
  className = ''
}) => {
  // Ensure score is between 0-100
  const normalizedScore = Math.max(0, Math.min(100, score));
  
  // Determine confidence level
  const confidenceLevel = 
    normalizedScore >= 80 ? 'high' :
    normalizedScore >= 60 ? 'medium' :
    'low';
  
  // Default tooltip text based on confidence level
  const defaultTooltip = 
    confidenceLevel === 'high' 
      ? 'High confidence (80%+): The AI is very confident in this result.'
      : confidenceLevel === 'medium'
      ? 'Medium confidence (60-79%): The AI is reasonably confident, but there may be some uncertainty.'
      : 'Low confidence (<60%): The AI is uncertain about this result. Consider reviewing it manually.';
  
  // Icon based on confidence level
  const ConfidenceIcon = 
    confidenceLevel === 'high' 
      ? ShieldCheck
      : confidenceLevel === 'medium' 
      ? Shield
      : ShieldAlert;
  
  // Size adjustments
  const sizeClasses = 
    size === 'sm' ? 'text-xs py-0.5 px-1.5' :
    size === 'lg' ? 'text-sm py-1 px-3' :
    'text-xs py-0.5 px-2';
  
  // Icon size
  const iconSize = 
    size === 'sm' ? 12 :
    size === 'lg' ? 16 :
    14;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`flex items-center ${className}`}>
            <Badge 
              variant="outline" 
              className={`flex items-center gap-1 ${sizeClasses} ${badgeVariants({ confidence: confidenceLevel })}`}
            >
              {showIcon && <ConfidenceIcon className="h-3 w-3" />}
              {showLabel ? (
                <>
                  {confidenceLevel === 'high' && 'High'}
                  {confidenceLevel === 'medium' && 'Medium'}
                  {confidenceLevel === 'low' && 'Low'}
                  {' confidence'}
                </>
              ) : (
                <span>{Math.round(normalizedScore)}%</span>
              )}
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-2 max-w-xs">
            <p>{tooltipText || defaultTooltip}</p>
            <div className="flex items-center gap-2">
              <Progress value={normalizedScore} className="h-1" />
              <span className="text-xs font-medium">{Math.round(normalizedScore)}%</span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ConfidenceIndicator;
