
import React from 'react';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { Mic, HelpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SpeakingConfidenceIndicatorProps {
  confidenceScore: number;
  cils_level?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const CILS_LEVEL_THRESHOLDS = {
  'A1': 40,
  'A2': 55,
  'B1': 70,
  'B2': 80,
  'C1': 90,
  'C2': 95
};

const SpeakingConfidenceIndicator: React.FC<SpeakingConfidenceIndicatorProps> = ({
  confidenceScore,
  cils_level = 'B1',
  size = 'md',
  showLabel = true,
  className = ''
}) => {
  // Calculate whether the confidence meets the CILS level requirements
  const levelThreshold = CILS_LEVEL_THRESHOLDS[cils_level];
  const meetsStandard = confidenceScore >= levelThreshold;
  
  // Determine status color based on confidence compared to threshold
  const getStatusColor = () => {
    const ratio = confidenceScore / levelThreshold;
    if (ratio >= 1) return 'bg-green-500';
    if (ratio >= 0.8) return 'bg-amber-500';
    return 'bg-red-500';
  };
  
  // Size adjustments
  const sizeClass = {
    'sm': 'text-xs',
    'md': 'text-sm',
    'lg': 'text-base'
  }[size];
  
  // Icon size
  const iconSize = {
    'sm': 'h-3 w-3',
    'md': 'h-4 w-4',
    'lg': 'h-5 w-5'
  }[size];
  
  // Progress bar height
  const progressHeight = {
    'sm': 'h-1',
    'md': 'h-2',
    'lg': 'h-3'
  }[size];
  
  return (
    <div className={`space-y-1 ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Mic className={`${iconSize} text-purple-500`} />
            <span className={`font-medium ${sizeClass}`}>Speaking Confidence</span>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-3 w-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>This indicator shows how closely your speaking proficiency aligns with CILS {cils_level} requirements.</p>
                  <p className="mt-1">Minimum threshold: {levelThreshold}%</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <Badge variant={meetsStandard ? "default" : "outline"} className={meetsStandard ? "bg-green-500" : ""}>
            CILS {cils_level}
          </Badge>
        </div>
      )}
      
      <div className="space-y-1">
        <Progress value={confidenceScore} className={progressHeight} />
        
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
            <span>{confidenceScore.toFixed(0)}%</span>
          </div>
          
          {!showLabel && (
            <Badge variant="outline" className="text-xs py-0 h-5">
              CILS {cils_level}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpeakingConfidenceIndicator;
