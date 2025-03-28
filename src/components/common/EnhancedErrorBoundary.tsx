
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ErrorMonitoringService } from '@/services/ErrorMonitoringService';

// Define error severities
export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

// Define error categories
export enum ErrorCategory {
  UI = 'UI',
  API = 'API',
  DATA = 'DATA',
  NETWORK = 'NETWORK',
  AUTHENTICATION = 'AUTHENTICATION',
  PERMISSIONS = 'PERMISSIONS',
  VALIDATION = 'VALIDATION',
  PERFORMANCE = 'PERFORMANCE',
  STORAGE = 'STORAGE',
  UNKNOWN = 'UNKNOWN',
  FEATURE_FLAG = 'FEATURE_FLAG',
  AI_SERVICE = 'AI_SERVICE',
}

// Props for the EnhancedErrorBoundary component
interface EnhancedErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  errorMonitoringService?: ErrorMonitoringService;
  category?: ErrorCategory;
  severity?: ErrorSeverity;
  showDetails?: boolean;
  showReset?: boolean;
  resetLabel?: string;
  boundary?: string;
  additionalInfo?: Record<string, any>;
  reportErrors?: boolean;
}

// State for the EnhancedErrorBoundary component
interface EnhancedErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  timestamp: Date | null;
  retry: number;
}

/**
 * EnhancedErrorBoundary component that captures React errors,
 * displays a fallback UI, and optionally reports errors to a monitoring service.
 */
class EnhancedErrorBoundary extends Component<EnhancedErrorBoundaryProps, EnhancedErrorBoundaryState> {
  private errorMonitoringService: ErrorMonitoringService | null = null;

  static defaultProps = {
    showDetails: false,
    showReset: true,
    resetLabel: 'Retry',
    category: ErrorCategory.UNKNOWN,
    severity: ErrorSeverity.MEDIUM,
    boundary: 'Component',
    reportErrors: true,
  };

  constructor(props: EnhancedErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      timestamp: null,
      retry: 0,
    };

    // Initialize error monitoring service if provided
    if (props.errorMonitoringService) {
      this.errorMonitoringService = props.errorMonitoringService;
    } else {
      this.errorMonitoringService = new ErrorMonitoringService();
    }
  }

  static getDerivedStateFromError(error: Error): Partial<EnhancedErrorBoundaryState> {
    return { hasError: true, error, timestamp: new Date() };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Update state with error information
    this.setState({ errorInfo });

    // Call onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Report error to monitoring service if enabled
    if (this.props.reportErrors && this.errorMonitoringService) {
      const { category, severity, boundary, additionalInfo } = this.props;

      this.errorMonitoringService.reportError({
        error,
        errorInfo,
        category: category || ErrorCategory.UNKNOWN,
        severity: severity || ErrorSeverity.MEDIUM,
        boundary,
        additionalInfo: {
          ...additionalInfo,
          retryCount: this.state.retry,
          component: boundary,
        },
      });
    }

    // Log error to console
    console.error('Error caught by EnhancedErrorBoundary:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      timestamp: null,
      retry: prevState.retry + 1,
    }));
  };

  render(): ReactNode {
    const { children, fallback, showDetails, showReset, resetLabel } = this.props;
    const { hasError, error, timestamp } = this.state;

    if (hasError && error) {
      if (fallback) {
        return fallback;
      }

      // Default fallback UI
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>
            <p>An error occurred in this component.</p>
            
            {showDetails && (
              <div className="mt-2 text-sm bg-destructive/10 p-2 rounded overflow-auto max-h-40">
                <p><strong>Error:</strong> {error.message}</p>
                {timestamp && (
                  <p><strong>Time:</strong> {timestamp.toLocaleString()}</p>
                )}
              </div>
            )}
            
            {showReset && (
              <Button onClick={this.handleReset} size="sm" className="mt-2">
                <RefreshCcw className="h-4 w-4 mr-2" />
                {resetLabel}
              </Button>
            )}
          </AlertDescription>
        </Alert>
      );
    }

    return children;
  }
}

export default EnhancedErrorBoundary;
