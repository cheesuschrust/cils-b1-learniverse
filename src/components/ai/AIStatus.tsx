
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Cpu, Check, AlertTriangle, HelpCircle } from 'lucide-react';
import { useAI } from '@/hooks/useAI';
import { Skeleton } from '@/components/ui/skeleton';

interface AIStatusProps {
  modelType?: string;
  showDetails?: boolean;
  className?: string;
}

const AIStatus = ({ modelType = 'text-generation', showDetails = false, className = '' }: AIStatusProps) => {
  const { isModelLoaded, isProcessing, error, loadModel } = useAI();
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Initializing AI...');

  useEffect(() => {
    if (!isModelLoaded && !isProcessing && !error) {
      // Model not yet loaded or initialized
      setStatusMessage('Ready to initialize AI');
      setProgress(0);
    } else if (isProcessing) {
      // Model is loading
      setStatusMessage('Loading AI model...');
      
      // Simulate progress for better UX
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + (Math.random() * 15);
        });
      }, 500);
      
      return () => clearInterval(interval);
    } else if (error) {
      // Error loading model
      setStatusMessage(`Error: ${error}`);
      setProgress(100);
    } else if (isModelLoaded) {
      // Model successfully loaded
      setStatusMessage('AI model loaded and ready');
      setProgress(100);
    }
  }, [isModelLoaded, isProcessing, error]);

  // Reset progress when completed
  useEffect(() => {
    if (progress === 100) {
      const timeout = setTimeout(() => {
        if (!isProcessing) {
          setProgress(0);
        }
      }, 2000);
      
      return () => clearTimeout(timeout);
    }
  }, [progress, isProcessing]);

  const getIcon = () => {
    if (error) return <AlertTriangle className="h-4 w-4 text-destructive" />;
    if (isModelLoaded) return <Check className="h-4 w-4 text-green-500" />;
    if (isProcessing) return <Cpu className="h-4 w-4 text-primary animate-pulse" />;
    return <HelpCircle className="h-4 w-4 text-muted-foreground" />;
  };

  if (!showDetails) {
    // Simplified display for inline usage
    return (
      <div className={`flex items-center ${className}`}>
        {getIcon()}
        <span className="ml-2 text-xs">
          {isModelLoaded ? 'AI Ready' : isProcessing ? 'Loading AI...' : error ? 'AI Error' : 'AI Standby'}
        </span>
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Cpu className="h-5 w-5 mr-2 text-primary" />
            <span className="font-medium">AI Status</span>
          </div>
          <div className="flex items-center">
            {getIcon()}
            <span className="ml-1 text-sm">
              {isModelLoaded ? 'Ready' : isProcessing ? 'Loading' : error ? 'Error' : 'Standby'}
            </span>
          </div>
        </div>
        
        {(isProcessing || progress > 0) && (
          <Progress value={progress} className="h-1 mb-2" />
        )}
        
        <p className="text-xs text-muted-foreground">{statusMessage}</p>
        
        {!isModelLoaded && !isProcessing && (
          <button
            onClick={() => loadModel(modelType as any)}
            className="mt-2 text-xs text-primary hover:underline"
          >
            Initialize AI
          </button>
        )}
        
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Model:</span>
            {isModelLoaded ? (
              <span className="text-xs">{modelType}</span>
            ) : (
              <Skeleton className="h-3 w-20" />
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Processing:</span>
            <span className="text-xs">Browser-based</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIStatus;
