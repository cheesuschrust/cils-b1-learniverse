
/**
 * Error monitoring service for tracking, reporting, and handling application errors
 */

// Error severity levels
export enum ErrorSeverity {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  CRITICAL = "critical"
}

// Error categories for better organization
export enum ErrorCategory {
  UI = "ui",
  API = "api",
  AUTHENTICATION = "auth",
  NETWORK = "network",
  DATABASE = "database",
  VALIDATION = "validation",
  PERFORMANCE = "performance",
  MEMORY = "memory",
  UNKNOWN = "unknown"
}

// Error metadata interface
export interface ErrorMetadata {
  [key: string]: any;
}

// Error report interface
export interface ErrorReport {
  error: Error;
  message: string;
  timestamp: string;
  severity: ErrorSeverity;
  category: ErrorCategory;
  metadata?: ErrorMetadata;
  stackTrace?: string;
  componentStack?: string;
  userId?: string;
  sessionId?: string;
  url?: string;
}

// Error monitoring service
class ErrorMonitoringService {
  private isEnabled: boolean = true;
  private errorQueue: ErrorReport[] = [];
  private maxQueueSize: number = 50;
  private flushInterval: number = 30000; // 30 seconds
  private flushTimeoutId: number | null = null;
  
  constructor() {
    // Start periodic flushing
    this.startPeriodicFlush();
    
    // Set up global error handlers
    if (typeof window !== 'undefined') {
      window.addEventListener('error', this.handleGlobalError);
      window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
    }
  }
  
  /**
   * Enable or disable error monitoring
   */
  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }
  
  /**
   * Handle global window errors
   */
  private handleGlobalError = (event: ErrorEvent): void => {
    this.captureError(
      event.error || new Error(event.message),
      ErrorSeverity.ERROR,
      ErrorCategory.UNKNOWN,
      {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      }
    );
  };
  
  /**
   * Handle unhandled promise rejections
   */
  private handleUnhandledRejection = (event: PromiseRejectionEvent): void => {
    const error = event.reason instanceof Error 
      ? event.reason 
      : new Error(String(event.reason));
    
    this.captureError(
      error,
      ErrorSeverity.ERROR,
      ErrorCategory.UNKNOWN,
      { unhandledRejection: true }
    );
  };
  
  /**
   * Capture an error for reporting
   */
  public captureError(
    error: Error,
    severity: ErrorSeverity = ErrorSeverity.ERROR,
    category: ErrorCategory = ErrorCategory.UNKNOWN,
    metadata?: ErrorMetadata,
    componentStack?: string
  ): void {
    if (!this.isEnabled) return;
    
    try {
      const errorReport: ErrorReport = {
        error,
        message: error.message,
        timestamp: new Date().toISOString(),
        severity,
        category,
        metadata,
        stackTrace: error.stack,
        componentStack,
        url: typeof window !== 'undefined' ? window.location.href : undefined
      };
      
      // Add to queue
      this.addToQueue(errorReport);
      
      // Log to console in development
      if (process.env.NODE_ENV !== 'production') {
        this.logErrorToConsole(errorReport);
      }
    } catch (e) {
      // Avoid infinite recursion if capturing fails
      console.error('Error in error capture:', e);
    }
  }
  
  /**
   * Add error report to queue
   */
  private addToQueue(report: ErrorReport): void {
    this.errorQueue.push(report);
    
    // Enforce max queue size
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue = this.errorQueue.slice(-this.maxQueueSize);
    }
    
    // Flush immediately for critical errors
    if (report.severity === ErrorSeverity.CRITICAL) {
      this.flush();
    }
  }
  
  /**
   * Start periodic flushing of error queue
   */
  private startPeriodicFlush(): void {
    if (this.flushTimeoutId !== null) {
      clearTimeout(this.flushTimeoutId);
    }
    
    this.flushTimeoutId = window.setTimeout(() => {
      this.flush();
      this.startPeriodicFlush();
    }, this.flushInterval);
  }
  
  /**
   * Flush error queue to reporting endpoint
   */
  public flush(): void {
    if (!this.isEnabled || this.errorQueue.length === 0) return;
    
    try {
      // In a real app, you would send this data to your error reporting service
      // For now, we'll just log to console in development
      if (process.env.NODE_ENV !== 'production') {
        console.debug(`Flushing ${this.errorQueue.length} error reports`);
      }
      
      // Clear the queue
      this.errorQueue = [];
    } catch (e) {
      console.error('Error flushing error reports:', e);
    }
  }
  
  /**
   * Log error to console in development
   */
  private logErrorToConsole(report: ErrorReport): void {
    console.group(`Error: ${report.message} (${report.severity}/${report.category})`);
    console.error(report.error);
    if (report.metadata) {
      console.info('Metadata:', report.metadata);
    }
    console.groupEnd();
  }
  
  /**
   * Get all errors in the queue (for debugging)
   */
  public getErrors(): ErrorReport[] {
    return [...this.errorQueue];
  }
  
  /**
   * Clear all errors in the queue
   */
  public clearErrors(): void {
    this.errorQueue = [];
  }
}

// Create and export singleton instance
export const errorMonitoring = new ErrorMonitoringService();

export default errorMonitoring;
