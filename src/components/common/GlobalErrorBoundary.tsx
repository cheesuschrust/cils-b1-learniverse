
import React, { ErrorInfo, Component } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { supabase } from '@/lib/supabase-client';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

class GlobalErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render shows the fallback UI
    return {
      hasError: true,
      error: error,
      errorInfo: null,
      errorId: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    this.logError(error, errorInfo);
    
    // Update state with error info
    this.setState({
      errorInfo: errorInfo
    });
  }

  async logError(error: Error, errorInfo: ErrorInfo): Promise<void> {
    try {
      // Generate unique error ID
      const errorId = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
      
      // Get user info if available
      let userId = null;
      try {
        const { data } = await supabase.auth.getSession();
        userId = data?.session?.user?.id;
      } catch (e) {
        // Ignore auth errors
      }
      
      // Log error to Supabase
      const { data, error: logError } = await supabase
        .from('security_audit_log')
        .insert([
          {
            event_type: 'error',
            user_id: userId,
            event_details: {
              error: {
                name: error.name,
                message: error.message,
                stack: error.stack,
              },
              componentStack: errorInfo.componentStack,
              url: window.location.href,
              userAgent: navigator.userAgent,
            },
          },
        ])
        .select();
      
      if (logError) {
        console.error('Failed to log error:', logError);
      } else if (data && data[0]) {
        this.setState({ errorId: data[0].id });
      }
      
      // Also log to console for debugging
      console.error('Error caught by boundary:', error);
      console.error('Component stack:', errorInfo.componentStack);
    } catch (e) {
      console.error('Error in error logging:', e);
    }
  }

  handleRefresh = (): void => {
    window.location.reload();
  }

  handleHome = (): void => {
    window.location.href = '/';
  }

  render() {
    if (this.state.hasError) {
      const { error, errorId } = this.state;
      
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-destructive mb-2">Oops!</h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                Something went wrong
              </p>
            </div>
            
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{error?.name || 'Error'}</AlertTitle>
              <AlertDescription>
                {error?.message || 'An unexpected error occurred'}
              </AlertDescription>
            </Alert>
            
            {errorId && (
              <div className="text-center mb-6">
                <p className="text-sm text-muted-foreground">
                  Error ID: <code className="font-mono">{errorId}</code>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Please quote this ID if you contact support
                </p>
              </div>
            )}
            
            <div className="flex flex-col space-y-3">
              <Button onClick={this.handleRefresh} className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Page
              </Button>
              
              <Button onClick={this.handleHome} variant="outline" className="w-full">
                <Home className="mr-2 h-4 w-4" />
                Return to Home
              </Button>
            </div>
            
            <div className="text-center text-sm text-muted-foreground mt-6">
              <p>
                If this problem persists, please contact customer support.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;
