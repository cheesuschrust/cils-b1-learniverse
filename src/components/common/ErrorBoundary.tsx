import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertOctagon } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    // Update state to include the error info
    this.setState({
      error,
      errorInfo
    });
    
    // Here you could also send the error to a reporting service
    // reportError(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // If a custom fallback was provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Otherwise, render the default error UI
      return (
        <div className="flex items-center justify-center min-h-[300px] p-4">
          <Card className="w-full max-w-md border-red-200 dark:border-red-800">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertOctagon className="h-5 w-5" />
                Something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
                <p className="text-sm text-red-800 dark:text-red-300">
                  {this.state.error?.message || 'An unexpected error occurred'}
                </p>
              </div>
              
              {this.state.errorInfo && (
                <details className="text-xs mt-2">
                  <summary className="cursor-pointer text-muted-foreground">
                    Technical details
                  </summary>
                  <pre className="mt-2 max-h-[150px] overflow-auto rounded-md bg-slate-100 dark:bg-slate-800 p-2">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={this.handleReset} className="w-full">
                Try Again
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
