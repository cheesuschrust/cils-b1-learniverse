
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  showDetails?: boolean;
  reportErrors?: boolean;
  onError?: (error: Error, info: ErrorInfo) => void;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class EnhancedErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Optional error reporting
    if (this.props.reportErrors) {
      console.error("Uncaught error:", error, errorInfo);
    }
    
    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <Card className="w-full max-w-md mx-auto my-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-red-600">Something went wrong</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {this.state.error?.toString()}
              </AlertDescription>
            </Alert>
            
            {this.props.showDetails && this.state.errorInfo && (
              <div className="mt-4">
                <details className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
                  <summary className="font-medium cursor-pointer">Stack trace</summary>
                  <pre className="mt-2 text-xs overflow-auto p-2 bg-gray-200 dark:bg-gray-700 rounded">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={this.handleReset} variant="outline">
              Try again
            </Button>
          </CardFooter>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default EnhancedErrorBoundary;
