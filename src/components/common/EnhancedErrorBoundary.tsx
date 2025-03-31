import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Bug } from 'lucide-react';
import { 
  ErrorSeverity, 
  ErrorCategory, 
  ErrorMonitoringService,
  EnhancedErrorBoundaryProps
} from '@/types/interface-fixes';

interface ErrorState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Enhanced error boundary component with configurable fallback UI and error reporting
 */
class EnhancedErrorBoundary extends Component<EnhancedErrorBoundaryProps, ErrorState> {
  constructor(props: EnhancedErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static defaultProps = {
    showDetails: false,
    reportErrors: true,
    severity: 'medium' as ErrorSeverity,
    category: 'ui' as ErrorCategory,
    additionalInfo: {},
  };

  static getDerivedStateFromError(error: Error): ErrorState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to console
    console.error('Error caught by EnhancedErrorBoundary:', error, errorInfo);
    
    // Update state with error info
    this.setState({
      error,
      errorInfo
    });

    // If error reporting is enabled, report to monitoring service
    if (this.props.reportErrors && this.props.errorMonitoringService) {
      try {
        this.props.errorMonitoringService.captureError(error, {
          errorInfo,
          component: this.constructor.name,
          severity: this.props.severity,
          category: this.props.category,
          ...this.props.additionalInfo
        });
      } catch (reportingError) {
        console.error('Error while reporting to monitoring service:', reportingError);
      }
    }
    
    // Call user-provided error handler if available
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Otherwise use default fallback UI
      return (
        <div className="p-4 rounded shadow">
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>
              We encountered an error while rendering this component.
            </AlertDescription>
          </Alert>
          
          {this.props.showDetails && this.state.error && (
            <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded overflow-x-auto text-sm">
              <div className="font-medium mb-2 flex items-center">
                <Bug className="h-4 w-4 mr-1" />
                Error details:
              </div>
              <pre className="whitespace-pre-wrap break-all">
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </div>
          )}
          
          <Button 
            onClick={this.handleReset}
            variant="outline" 
            className="mt-4"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try again
          </Button>
        </div>
      );
    }

    // If there's no error, render children normally
    return this.props.children;
  }
}

export default EnhancedErrorBoundary;
