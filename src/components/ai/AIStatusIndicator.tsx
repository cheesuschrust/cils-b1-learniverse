
import React from 'react';
import { useAIUtils } from '@/contexts/AIUtilsContext';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Brain, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

interface AIStatusIndicatorProps {
  className?: string;
  showDetails?: boolean;
}

const AIStatusIndicator: React.FC<AIStatusIndicatorProps> = ({ 
  className = '',
  showDetails = false
}) => {
  const { isAIEnabled, status, remainingCredits } = useAIUtils();

  let statusIcon;
  let statusText;
  let badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline' = 'outline';

  switch (status) {
    case 'ready':
      statusIcon = <CheckCircle2 className="h-3 w-3" />;
      statusText = 'AI Ready';
      badgeVariant = 'default';
      break;
    case 'loading':
      statusIcon = <Loader2 className="h-3 w-3 animate-spin" />;
      statusText = 'AI Loading';
      badgeVariant = 'secondary';
      break;
    case 'error':
      statusIcon = <AlertCircle className="h-3 w-3" />;
      statusText = 'AI Error';
      badgeVariant = 'destructive';
      break;
    default:
      statusIcon = <Brain className="h-3 w-3" />;
      statusText = isAIEnabled ? 'AI Enabled' : 'AI Limited';
      badgeVariant = isAIEnabled ? 'default' : 'outline';
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={className}>
            <Badge variant={badgeVariant} className="gap-1 cursor-help">
              {statusIcon}
              <span>{statusText}</span>
              {showDetails && isAIEnabled && remainingCredits !== undefined && (
                <span className="ml-1 text-xs">({remainingCredits})</span>
              )}
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>
            {isAIEnabled 
              ? `AI features are enabled. You have ${remainingCredits !== undefined ? remainingCredits : 'unlimited'} AI credits remaining.` 
              : 'AI features are limited. Some functionality may not be available.'}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AIStatusIndicator;
