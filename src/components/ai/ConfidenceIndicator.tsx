
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAIUtils } from '@/contexts/AIUtilsContext';
import { ContentType } from '@/types/contentType';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

interface ConfidenceIndicatorProps {
  contentType: ContentType;
  hideLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  className?: string;
}

const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  contentType,
  hideLabel = false,
  size = 'md',
  showTooltip = true,
  className
}) => {
  const { confidenceScores, isAIEnabled } = useAIUtils();
  
  if (!isAIEnabled) {
    return (
      <Badge variant="outline" className="text-muted-foreground">
        AI Disabled
      </Badge>
    );
  }
  
  const confidenceScore = confidenceScores[contentType] || 0;
  
  const getConfidenceLabel = (score: number): string => {
    if (score >= 90) {
      return 'Very High';
    } else if (score >= 75) {
      return 'High';
    } else if (score >= 60) {
      return 'Moderate';
    } else if (score >= 40) {
      return 'Low';
    } else {
      return 'Very Low';
    }
  };
  
  const getConfidenceColor = (score: number): string => {
    if (score >= 90) {
      return 'bg-green-500';
    } else if (score >= 75) {
      return 'bg-emerald-500';
    } else if (score >= 60) {
      return 'bg-yellow-500';
    } else if (score >= 40) {
      return 'bg-orange-500';
    } else {
      return 'bg-red-500';
    }
  };
  
  const getTooltipText = (contentType: ContentType, score: number): string => {
    const baseText = `AI confidence for ${contentType}: ${score}%`;
    let additionalInfo = '';
    
    if (score >= 90) {
      additionalInfo = 'The AI has high confidence in its ability to process this content type accurately.';
    } else if (score >= 75) {
      additionalInfo = 'The AI is confident in processing this content, with occasional errors.';
    } else if (score >= 60) {
      additionalInfo = 'The AI may make some errors when processing this content. Review results carefully.';
    } else if (score >= 40) {
      additionalInfo = 'The AI often struggles with this content type. Expect more errors and review thoroughly.';
    } else {
      additionalInfo = 'The AI has very low confidence with this content. Results likely need manual correction.';
    }
    
    return `${baseText} - ${additionalInfo}`;
  };
  
  const sizeClasses = {
    sm: 'h-1.5 w-16',
    md: 'h-2 w-24',
    lg: 'h-3 w-32'
  };
  
  const indicator = (
    <div className={`flex items-center gap-2 ${className}`}>
      <Progress 
        value={confidenceScore} 
        className={`${sizeClasses[size]} ${getConfidenceColor(confidenceScore)}`}
      />
      
      {!hideLabel && (
        <span className="text-xs font-medium">
          {getConfidenceLabel(confidenceScore)}
        </span>
      )}
    </div>
  );
  
  if (showTooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {indicator}
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p>{getTooltipText(contentType, confidenceScore)}</p>
        </TooltipContent>
      </Tooltip>
    );
  }
  
  return indicator;
};

export default ConfidenceIndicator;
