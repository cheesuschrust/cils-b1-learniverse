
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Brain, AlertCircle, Cpu } from 'lucide-react';
import { useAIUtils } from '@/contexts/AIUtilsContext';

interface AIStatusProps {
  showTooltip?: boolean;
  variant?: 'default' | 'minimal';
  className?: string;
}

const AIStatus: React.FC<AIStatusProps> = ({ 
  showTooltip = true,
  variant = 'default',
  className = ''
}) => {
  const { isAIEnabled, modelSize, isProcessing, hasActiveMicrophone } = useAIUtils();
  
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
    
    const modelSizeDisplay = modelSize === 'small' 
      ? 'Small (Fast)' 
      : modelSize === 'medium' 
        ? 'Medium (Balanced)' 
        : 'Large (Accurate)';

    return {
      icon: <Brain className="h-4 w-4 mr-1" />,
      text: variant === 'minimal' ? 'AI' : `AI Active (${modelSizeDisplay})`,
      tooltipText: `AI is enabled and ready to use. Current model: ${modelSizeDisplay}. ${hasActiveMicrophone ? 'Microphone available.' : 'No microphone access.'}`,
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
            <Badge variant={badgeVariant} className={`cursor-help ${className}`}>
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
    <Badge variant={badgeVariant} className={className}>
      {icon}
      {text}
    </Badge>
  );
};

export default AIStatus;
