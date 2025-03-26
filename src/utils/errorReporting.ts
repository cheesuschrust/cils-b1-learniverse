
/**
 * Error reporting utility for tracking and handling errors
 */

// Error severity levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Error categories
export enum ErrorCategory {
  API = 'api',
  AUTHENTICATION = 'authentication',
  NETWORK = 'network',
  UI = 'ui',
  AI = 'ai',
  VALIDATION = 'validation',
  DATABASE = 'database',
  UNKNOWN = 'unknown'
}

// Error context information
interface ErrorContext {
  userId?: string;
  route?: string;
  component?: string;
  action?: string;
  additionalData?: Record<string, any>;
}

// Error report structure
interface ErrorReport {
  id: string;
  timestamp: Date;
  message: string;
  stack?: string;
  severity: ErrorSeverity;
  category: ErrorCategory;
  context: ErrorContext;
  isSent: boolean;
}

class ErrorReportingService {
  private static instance: ErrorReportingService;
  private errors: ErrorReport[] = [];
  private isEnabled: boolean = true;
  private apiEndpoint: string = '/api/error-reporting';
  
  // Singleton pattern
  private constructor() {
    // Initialize global error handlers
    this.setupGlobalHandlers();
    
    // Load errors from local storage
    this.loadErrors();
    
    // Send any unsent errors
    this.processPendingErrors();
  }
  
  public static getInstance(): ErrorReportingService {
    if (!ErrorReportingService.instance) {
      ErrorReportingService.instance = new ErrorReportingService();
    }
    return ErrorReportingService.instance;
  }
  
  // Setup global error handlers
  private setupGlobalHandlers(): void {
    // Window unhandled error event
    window.addEventListener('error', (event) => {
      this.captureError(
        event.error || new Error(event.message),
        ErrorSeverity.HIGH,
        ErrorCategory.UNKNOWN,
        { action: 'unhandled_window_error' }
      );
    });
    
    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      const error = event.reason instanceof Error 
        ? event.reason 
        : new Error(String(event.reason));
      
      this.captureError(
        error,
        ErrorSeverity.MEDIUM,
        ErrorCategory.UNKNOWN,
        { action: 'unhandled_promise_rejection' }
      );
    });
  }
  
  // Load saved errors from localStorage
  private loadErrors(): void {
    try {
      const savedErrors = localStorage.getItem('error_reports');
      if (savedErrors) {
        this.errors = JSON.parse(savedErrors);
      }
    } catch (e) {
      console.error('Failed to load saved errors:', e);
      localStorage.removeItem('error_reports');
    }
  }
  
  // Save errors to localStorage
  private saveErrors(): void {
    try {
      localStorage.setItem('error_reports', JSON.stringify(this.errors));
    } catch (e) {
      console.error('Failed to save errors:', e);
    }
  }
  
  // Process any pending errors that haven't been sent
  private async processPendingErrors(): Promise<void> {
    const unsentErrors = this.errors.filter(error => !error.isSent);
    
    if (unsentErrors.length === 0) return;
    
    // Try to send errors in batch
    try {
      await this.sendErrorReports(unsentErrors);
      
      // Mark errors as sent
      this.errors = this.errors.map(error => {
        if (!error.isSent) {
          return { ...error, isSent: true };
        }
        return error;
      });
      
      // Save updated status
      this.saveErrors();
    } catch (e) {
      console.error('Failed to send pending errors:', e);
    }
  }
  
  // Send error reports to the backend
  private async sendErrorReports(reports: ErrorReport[]): Promise<void> {
    // In development, just log to console
    if (process.env.NODE_ENV === 'development') {
      console.group('Error Reports (Development Mode)');
      reports.forEach(report => {
        console.log('Error Report:', report);
      });
      console.groupEnd();
      return Promise.resolve();
    }
    
    // In production, send to API
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reports }),
        keepalive: true // Ensure report is sent even if page is unloading
      });
      
      if (!response.ok) {
        throw new Error(`Error reporting API returned ${response.status}`);
      }
    } catch (e) {
      console.error('Failed to send error reports:', e);
      throw e;
    }
  }
  
  // Generate a unique ID for error reports
  private generateErrorId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }
  
  // Capture and record an error
  public captureError(
    error: Error,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    category: ErrorCategory = ErrorCategory.UNKNOWN,
    context: ErrorContext = {}
  ): string {
    if (!this.isEnabled) return '';
    
    // Create error report
    const errorReport: ErrorReport = {
      id: this.generateErrorId(),
      timestamp: new Date(),
      message: error.message,
      stack: error.stack,
      severity,
      category,
      context: {
        ...context,
        route: window.location.pathname,
      },
      isSent: false
    };
    
    // Add to errors list
    this.errors.push(errorReport);
    
    // Save to storage
    this.saveErrors();
    
    // If it's a critical error, try to send immediately
    if (severity === ErrorSeverity.CRITICAL) {
      this.sendErrorReports([errorReport]).catch(e => {
        console.error('Failed to send critical error report:', e);
      });
    }
    
    return errorReport.id;
  }
  
  // Enable or disable error reporting
  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }
  
  // Get error reports
  public getErrors(): ErrorReport[] {
    return [...this.errors];
  }
  
  // Clear error reports
  public clearErrors(): void {
    this.errors = [];
    this.saveErrors();
  }
}

// Export singleton instance
export const errorReporting = ErrorReportingService.getInstance();

// Utility functions
export function reportError(
  error: Error | string,
  severity?: ErrorSeverity,
  category?: ErrorCategory,
  context?: ErrorContext
): string {
  const errorObj = typeof error === 'string' ? new Error(error) : error;
  return errorReporting.captureError(errorObj, severity, category, context);
}

export default errorReporting;
