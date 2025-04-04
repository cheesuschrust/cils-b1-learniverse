
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cva } from 'class-variance-authority';
import { CheckCircle, AlertCircle, HelpCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConfidenceIndicatorProps {
  value?: number;
  score?: number; // Add score prop for backward compatibility
  showLabel?: boolean;
  showTooltip?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'citizenship' | 'expert' | 'minimal';
  className?: string;
  contentType?: string;
  indicatorClassName?: string;
}

const indicatorVariants = cva(
  "flex items-center",
  {
    variants: {
      size: {
        sm: "text-xs gap-0.5",
        md: "text-sm gap-1",
        lg: "text-base gap-1.5",
      },
      variant: {
        default: "",
        citizenship: "text-amber-600",
        expert: "text-emerald-600",
        minimal: "opacity-80",
      },
    },
    defaultVariants: {
      size: "sm",
      variant: "default",
    },
  }
);

export const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  value,
  score, // Accept score parameter
  showLabel = false,
  showTooltip = true,
  size = 'sm',
  variant = 'default',
  className,
  contentType,
}) => {
  // Use score prop if value is undefined for backward compatibility
  const confidenceValue = value !== undefined ? value : (score !== undefined ? score : 0);
  
  const getConfidenceLevel = () => {
    if (confidenceValue >= 90) return { label: 'Expert', icon: <CheckCircle className="h-3.5 w-3.5" />, color: 'text-emerald-500' };
    if (confidenceValue >= 70) return { label: 'Good', icon: <Info className="h-3.5 w-3.5" />, color: 'text-blue-500' };
    if (confidenceValue >= 50) return { label: 'Adequate', icon: <HelpCircle className="h-3.5 w-3.5" />, color: 'text-amber-500' };
    return { label: 'Needs Work', icon: <AlertCircle className="h-3.5 w-3.5" />, color: 'text-red-500' };
  };

  const confidence = getConfidenceLevel();
  const tooltipText = contentType 
    ? `${confidenceValue}% alignment with ${contentType} requirements` 
    : `${confidenceValue}% alignment with CILS B1 requirements`;

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <div className={cn(indicatorVariants({ size, variant }), confidence.color, className)}>
            {confidence.icon}
            {showLabel && <span className="ml-1">{confidence.label}</span>}
          </div>
        </TooltipTrigger>
        {showTooltip && (
          <TooltipContent side="top">
            <p>{tooltipText}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

export default ConfidenceIndicator;
