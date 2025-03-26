
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Brain, AlertTriangle, Check, Loader2 } from 'lucide-react';
import { AIStatus as AIStatusType } from '@/types/ai';

interface AIStatusProps {
  status: AIStatusType;
  className?: string;
}

export const AIStatus: React.FC<AIStatusProps> = ({ status, className = '' }) => {
  const getStatusDetails = () => {
    switch (status) {
      case 'loading':
        return {
          label: 'AI Loading',
          description: 'The AI system is currently initializing...',
          color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
          icon: <Loader2 className="h-3 w-3 mr-1 animate-spin" />
        };
      case 'ready':
        return {
          label: 'AI Ready',
          description: 'The AI system is ready to process your requests',
          color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
          icon: <Check className="h-3 w-3 mr-1" />
        };
      case 'error':
        return {
          label: 'AI Error',
          description: 'There was an error initializing the AI system',
          color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
          icon: <AlertTriangle className="h-3 w-3 mr-1" />
        };
      default:
        return {
          label: 'AI Idle',
          description: 'The AI system is in standby mode',
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100',
          icon: <Brain className="h-3 w-3 mr-1" />
        };
    }
  };

  const { label, description, color, icon } = getStatusDetails();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className={`flex items-center ${color} ${className}`}>
            {icon}
            {label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AIStatus;
