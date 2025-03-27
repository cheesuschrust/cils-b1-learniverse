
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { errorMonitoringService } from '@/services/ErrorMonitoringService';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    
    // Call the optional onError callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // Log the error to our monitoring service
    errorMonitoringService.captureError(error, {
      componentStack: errorInfo.componentStack,
      context: 'ErrorBoundary'
    });

    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    // Reset the error state if props have changed and resetOnPropsChange is true
    if (
      this.state.hasError && 
      this.props.resetOnPropsChange && 
      prevProps !== this.props
    ) {
      this.resetErrorBoundary();
    }
  }

  resetErrorBoundary = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  renderDefaultFallback(): ReactNode {
    const { error, errorInfo } = this.state;
    
    return (
      <Card className="w-full max-w-md mx-auto my-8 shadow-lg">
        <CardHeader className="bg-destructive/10">
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Something went wrong
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>{error?.name || 'Error'}</AlertTitle>
            <AlertDescription>
              {error?.message || 'An unexpected error occurred'}
            </AlertDescription>
          </Alert>
          
          {process.env.NODE_ENV === 'development' && errorInfo && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Component Stack</h4>
              <pre className="text-xs bg-muted p-4 rounded overflow-auto max-h-48">
                {errorInfo.componentStack}
              </pre>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            onClick={this.resetErrorBoundary}
            className="flex items-center gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Try Again
          </Button>
        </CardFooter>
      </Card>
    );
  }

  render(): ReactNode {
    const { hasError } = this.state;
    const { children, fallback } = this.props;
    
    if (hasError) {
      return fallback || this.renderDefaultFallback();
    }
    
    return children;
  }
}

export default ErrorBoundary;
