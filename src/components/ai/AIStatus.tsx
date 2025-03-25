
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Brain, AlertCircle, Cpu } from 'lucide-react';
import { useAIUtils } from '@/contexts/AIUtilsContext';

interface AIStatusProps {
  showTooltip?: boolean;
  variant?: 'default' | 'minimal';
}

const AIStatus: React.FC<AIStatusProps> = ({ 
  showTooltip = true,
  variant = 'default'
}) => {
  const { isAIEnabled, modelSize, isProcessing } = useAIUtils();
  
  // Generate the appropriate icon and text based on status
  const getStatusContent = () => {
    if (!isAIEnabled) {
      return {
        icon: <AlertCircle className="h-4 w-4 mr-1" />,
        text: 'AI Disabled',
        tooltipText: 'AI features are currently disabled. Enable them in settings.',
        badgeVariant: 'outline' as const
      };
    }
    
    if (isProcessing) {
      return {
        icon: <Brain className="h-4 w-4 mr-1 animate-pulse" />,
        text: 'Processing',
        tooltipText: 'AI is currently processing a request.',
        badgeVariant: 'secondary' as const
      };
    }
    
    return {
      icon: <Brain className="h-4 w-4 mr-1" />,
      text: variant === 'minimal' ? 'AI' : `AI Active (${modelSize})`,
      tooltipText: `AI is enabled and ready to use. Current model size: ${modelSize}.`,
      badgeVariant: 'default' as const
    };
  };
  
  const { icon, text, tooltipText, badgeVariant } = getStatusContent();
  
  // Render with or without tooltip
  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant={badgeVariant} className="cursor-help">
              {icon}
              {text}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltipText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return (
    <Badge variant={badgeVariant}>
      {icon}
      {text}
    </Badge>
  );
};

export default AIStatus;
