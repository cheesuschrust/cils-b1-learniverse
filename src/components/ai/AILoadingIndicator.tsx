
import React from 'react';
import { Loader2 } from 'lucide-react';

interface AILoadingIndicatorProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Loading indicator for AI operations
 */
const AILoadingIndicator: React.FC<AILoadingIndicatorProps> = ({
  message = 'AI is processing your request...',
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };
  
  const containerClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };
  
  return (
    <div className={`flex flex-col items-center justify-center p-4 ${containerClasses[size]} ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin mb-2 text-primary`} />
      <p className="text-center text-muted-foreground">{message}</p>
    </div>
  );
};

export default AILoadingIndicator;
