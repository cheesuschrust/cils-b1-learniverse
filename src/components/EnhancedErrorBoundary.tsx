
import React from 'react';
import { errorMonitoringService } from '@/services/ErrorMonitoringService';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  resetOnPropsChange?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class EnhancedErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
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

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Update state with error details
    this.setState({
      errorInfo
    });
    
    // Report to error monitoring service
    errorMonitoringService.captureError(error, {
      componentStack: errorInfo.componentStack,
      context: 'ErrorBoundary'
    });
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    // Reset error state if props changed and resetOnPropsChange is true
    if (
      this.state.hasError &&
      this.props.resetOnPropsChange &&
      prevProps.children !== this.props.children
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

  render(): React.ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Default error UI
      return (
        <div className="p-4 flex flex-col items-center justify-center min-h-[200px]">
          <Alert variant="destructive" className="mb-4 max-w-lg">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription className="mt-2">
              {this.state.error?.message || 'An unexpected error occurred'}
              {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                <pre className="mt-2 text-xs overflow-auto p-2 bg-muted rounded whitespace-pre-wrap">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </AlertDescription>
          </Alert>
          <Button 
            onClick={this.resetErrorBoundary} 
            variant="outline" 
            size="sm"
            className="mt-2"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      );
    }

    // Render children if no error
    return this.props.children;
  }
}

export default EnhancedErrorBoundary;
