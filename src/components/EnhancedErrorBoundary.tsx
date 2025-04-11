
import React from 'react';
import { Component, ErrorInfo, ReactNode } from '@/adapters/ReactImports';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

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

class EnhancedErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });
    
    // Call the onError prop callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // Log the error to console for development purposes
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  public componentDidUpdate(prevProps: ErrorBoundaryProps) {
    // Reset the error state when props change if resetOnPropsChange is true
    if (this.props.resetOnPropsChange && prevProps.children !== this.props.children) {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null
      });
    }
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  public render() {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-destructive">An error occurred</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>Error details</AlertTitle>
                <AlertDescription>
                  {this.state.error?.message || 'Unknown error'}
                </AlertDescription>
              </Alert>
              
              <div className="mt-4">
                <details className="text-sm">
                  <summary className="cursor-pointer font-medium">Technical details</summary>
                  <pre className="mt-2 max-h-96 overflow-auto rounded bg-slate-950 p-4 text-xs text-slate-50">
                    {this.state.error?.stack}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={this.handleReset}>Try Again</Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default EnhancedErrorBoundary;
