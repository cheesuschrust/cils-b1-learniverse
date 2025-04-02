
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface ConfidenceIndicatorProps {
  score: number;
}

const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({ score }) => {
  // Determine confidence level and appearance
  const getConfidenceLevel = (score: number) => {
    if (score >= 85) {
      return {
        label: 'High',
        color: 'bg-green-100 text-green-800 hover:bg-green-200',
        icon: <CheckCircle className="h-3.5 w-3.5 mr-1" />,
        description: 'This content has high accuracy and reliability for CILS B1 preparation.'
      };
    } else if (score >= 70) {
      return {
        label: 'Medium',
        color: 'bg-amber-100 text-amber-800 hover:bg-amber-200',
        icon: <AlertTriangle className="h-3.5 w-3.5 mr-1" />,
        description: 'This content is likely useful for CILS B1 preparation but may have some inaccuracies.'
      };
    } else {
      return {
        label: 'Low',
        color: 'bg-red-100 text-red-800 hover:bg-red-200',
        icon: <XCircle className="h-3.5 w-3.5 mr-1" />,
        description: 'This content may not closely match CILS B1 requirements.'
      };
    }
  };

  const confidenceInfo = getConfidenceLevel(score);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className={`${confidenceInfo.color} flex items-center`}>
            {confidenceInfo.icon}
            <span>{score}% Confidence</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="bg-white p-2 shadow-md rounded-md max-w-xs">
          <p className="text-sm font-medium">{confidenceInfo.label} Confidence</p>
          <p className="text-xs text-muted-foreground">{confidenceInfo.description}</p>
          <p className="text-xs mt-1">AI confidence score: {score}%</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ConfidenceIndicator;
