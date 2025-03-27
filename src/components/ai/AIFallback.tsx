
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface AIFallbackProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

/**
 * Fallback component to display when AI features encounter errors
 */
const AIFallback: React.FC<AIFallbackProps> = ({
  title = 'AI Feature Unavailable',
  message = 'This AI feature is currently unavailable. Please try again later.',
  onRetry,
  showRetry = true
}) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-amber-500 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{message}</p>
      </CardContent>
      {showRetry && onRetry && (
        <CardFooter>
          <Button 
            variant="outline" 
            onClick={onRetry}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default AIFallback;
