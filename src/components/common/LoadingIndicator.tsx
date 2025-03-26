
import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingIndicatorProps {
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
  text?: string;
  className?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  size = 'md',
  fullPage = false,
  text,
  className
}) => {
  // Size mapping for the spinner
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };
  
  // Container sizing based on fullPage
  const containerClasses = fullPage
    ? 'fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50'
    : 'flex flex-col items-center justify-center p-4';
  
  return (
    <div className={cn(containerClasses, className)}>
      <div className="flex flex-col items-center space-y-3">
        <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
        
        {text && (
          <p className={cn(
            "text-muted-foreground animate-pulse",
            size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'
          )}>
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoadingIndicator;
