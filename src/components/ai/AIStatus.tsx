
import React from 'react';
import { useAI } from '@/hooks/useAI';
import { Badge } from '@/components/ui/badge';
import { CircleCheck, CircleAlert, CircleX } from 'lucide-react';

export interface AIStatusProps {
  minimal?: boolean;
}

export const AIStatus: React.FC<AIStatusProps> = ({ minimal = false }) => {
  const { isModelLoaded, status, error } = useAI();
  
  if (minimal) {
    return (
      <div className="flex items-center">
        <Badge variant={isModelLoaded ? "default" : "outline"} className="gap-1">
          {status === 'ready' && <CircleCheck className="h-3 w-3" />}
          {status === 'loading' && <span className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />}
          {status === 'error' && <CircleX className="h-3 w-3" />}
          <span className="text-xs">AI {status}</span>
        </Badge>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 mb-1">
        <Badge variant={isModelLoaded ? "default" : "outline"} className="gap-1">
          {status === 'ready' && <CircleCheck className="h-3 w-3" />}
          {status === 'loading' && <span className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />}
          {status === 'error' && <CircleX className="h-3 w-3" />}
          <span>AI {status}</span>
        </Badge>
      </div>
      
      {status === 'error' && (
        <div className="text-sm text-destructive">{error}</div>
      )}
    </div>
  );
};
