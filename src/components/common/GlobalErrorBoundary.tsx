
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { errorMonitoring } from '@/utils/errorMonitoring';
import { useSystemLog } from '@/hooks/use-system-log';
import { useToast } from '@/hooks/use-toast';

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
  isOffline: boolean;
}

class GlobalErrorBoundaryClass extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isOffline: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidMount(): void {
    window.addEventListener('online', this.handleNetworkChange);
    window.addEventListener('offline', this.handleNetworkChange);
  }

  componentWillUnmount(): void {
    window.removeEventListener('online', this.handleNetworkChange);
    window.removeEventListener('offline', this.handleNetworkChange);
  }

  handleNetworkChange = (): void => {
    this.setState({ isOffline: !navigator.onLine });
    if (navigator.onLine && this.state.hasError) {
      // Attempt to recover if we're back online
      this.resetErrorBoundary();
    }
  };

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    
    // Call the optional onError callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // Log the error to our monitoring service
    errorMonitoring.captureError(
      error, 
      errorInfo.componentStack,
      'ui',
      {
        componentStack: errorInfo.componentStack,
        offline: !navigator.onLine,
        url: window.location.href
      }
    );

    console.error('Error caught by GlobalErrorBoundary:', error, errorInfo);
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
    const { error, errorInfo, isOffline } = this.state;
    
    if (isOffline) {
      return (
        <Card className="w-full max-w-md mx-auto my-8 shadow-lg">
          <CardHeader className="bg-amber-500/10">
            <CardTitle className="flex items-center gap-2 text-amber-500">
              <AlertCircle className="h-5 w-5" />
              You appear to be offline
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Alert variant="warning" className="mb-4">
              <AlertTitle>Network Connectivity Issue</AlertTitle>
              <AlertDescription>
                Please check your internet connection and try again.
                We'll automatically attempt to reconnect when you're back online.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button onClick={this.resetErrorBoundary} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Retry Connection
            </Button>
          </CardFooter>
        </Card>
      );
    }
    
    return (
      <Card className="w-full max-w-md mx-auto my-8 shadow-lg animate-fade-in">
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
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Button>
          <Button 
            onClick={this.resetErrorBoundary}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
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

// Create a wrapper component to use hooks
export const GlobalErrorBoundary = ({ 
  children,
  fallback,
  onError,
  resetOnPropsChange = false
}: ErrorBoundaryProps) => {
  const { logError } = useSystemLog();
  const { toast } = useToast();

  const handleError = (error: Error, errorInfo: ErrorInfo) => {
    // Log to system logs
    logError(error, 'GlobalErrorBoundary', {
      componentStack: errorInfo.componentStack,
      url: window.location.href
    });
    
    // Show toast notification for non-critical errors
    toast({
      title: "Oops! Something went wrong",
      description: "We've encountered an error and have logged the issue. Please try again.",
      variant: "destructive",
    });
    
    // Pass to custom error handler if provided
    if (onError) {
      onError(error, errorInfo);
    }
  };

  return (
    <GlobalErrorBoundaryClass
      fallback={fallback}
      onError={handleError}
      resetOnPropsChange={resetOnPropsChange}
    >
      {children}
    </GlobalErrorBoundaryClass>
  );
};

export default GlobalErrorBoundary;
