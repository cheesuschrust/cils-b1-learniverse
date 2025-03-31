
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Zap, Brain, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AIModelSize } from '@/types/ai';

interface AIStatusProps {
  status: 'idle' | 'processing' | 'success' | 'error';
  model: string;
  modelSize: AIModelSize;
  creditsRemaining: number;
  creditsTotal: number;
  isEnabled: boolean;
  errorMessage?: string;
  processingTask?: string;
}

const AIStatus: React.FC<AIStatusProps> = ({
  status,
  model,
  modelSize,
  creditsRemaining,
  creditsTotal,
  isEnabled,
  errorMessage,
  processingTask
}) => {
  // Status icon component based on current status
  const StatusIcon = () => {
    switch(status) {
      case 'processing':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'idle':
      default:
        return <Brain className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Model size indicator
  const ModelSizeIndicator = () => {
    const sizes = {
      small: { label: 'SMALL', color: 'bg-green-500' },
      medium: { label: 'MEDIUM', color: 'bg-yellow-500' },
      large: { label: 'LARGE', color: 'bg-red-500' }
    };
    
    const { label, color } = sizes[modelSize] || sizes.medium;
    
    return (
      <div className="flex items-center gap-1.5">
        <div className={`w-2 h-2 rounded-full ${color}`}></div>
        <span className="text-xs font-semibold">{label}</span>
      </div>
    );
  };

  return (
    <Card className={cn(
      'w-full transition-opacity', 
      !isEnabled && 'opacity-70'
    )}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className={cn(
              "h-5 w-5", 
              isEnabled ? "text-blue-500" : "text-gray-400"
            )} />
            AI Status
          </CardTitle>
          <ModelSizeIndicator />
        </div>
        <CardDescription>
          {isEnabled ? `Using ${model}` : 'AI features are disabled'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StatusIcon />
            <span className="font-medium">
              {status === 'processing' ? (
                <span className="text-blue-600">Processing{processingTask ? `: ${processingTask}` : ''}</span>
              ) : status === 'success' ? (
                <span className="text-green-600">Ready</span>
              ) : status === 'error' ? (
                <span className="text-red-600">Error</span>
              ) : (
                <span>Idle</span>
              )}
            </span>
          </div>
        </div>
        
        {status === 'error' && errorMessage && (
          <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded border border-red-200 dark:border-red-800">
            {errorMessage}
          </div>
        )}
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Credits Remaining</span>
            <span className="font-medium">{creditsRemaining} / {creditsTotal}</span>
          </div>
          <Progress 
            value={(creditsRemaining / creditsTotal) * 100} 
            className="h-2"
          />
          <p className="text-xs text-muted-foreground">
            Credits refresh daily. {isEnabled ? `${creditsRemaining} credits left today.` : 'Enable AI to use credits.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIStatus;
