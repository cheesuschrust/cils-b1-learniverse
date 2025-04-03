
/**
 * Comprehensive error monitoring service for the CILS platform
 */
import { supabase } from '@/integrations/supabase/client';

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
  offline?: boolean;
}

// Rate limiting configuration
interface RateLimitConfig {
  maxErrors: number;
  timeWindowMs: number;
}

// Error monitoring service
class ErrorMonitoringService {
  private isEnabled: boolean = true;
  private errorQueue: ErrorReport[] = [];
  private maxQueueSize: number = 50;
  private flushInterval: number = 30000; // 30 seconds
  private flushTimeoutId: number | null = null;
  private rateLimitConfig: RateLimitConfig = {
    maxErrors: 10, // Max errors per time window
    timeWindowMs: 60000 // 1 minute time window
  };
  private errorCounts: Record<string, { count: number, firstTimestamp: number }> = {};
  
  constructor() {
    // Start periodic flushing
    this.startPeriodicFlush();
    
    // Set up global error handlers
    if (typeof window !== 'undefined') {
      window.addEventListener('error', this.handleGlobalError);
      window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
      window.addEventListener('offline', this.handleOffline);
      window.addEventListener('online', this.handleOnline);
    }
  }

  /**
   * Enable or disable error monitoring
   */
  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }
  
  /**
   * Handle online status change
   */
  private handleOnline = (): void => {
    console.log('Back online, flushing error queue');
    this.flush();
  };
  
  /**
   * Handle offline status change
   */
  private handleOffline = (): void => {
    console.log('Offline detected, errors will be queued');
  };
  
  /**
   * Handle global window errors
   */
  private handleGlobalError = (event: ErrorEvent): void => {
    this.captureError(
      event.error || new Error(event.message),
      undefined,
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
      undefined,
      ErrorCategory.UNKNOWN,
      { unhandledRejection: true }
    );
  };

  /**
   * Check rate limiting for a specific error
   * Returns true if the error should be processed, false if rate limited
   */
  private checkRateLimit(error: Error): boolean {
    const key = `${error.name}:${error.message.substring(0, 100)}`;
    const now = Date.now();
    
    if (this.errorCounts[key]) {
      const { count, firstTimestamp } = this.errorCounts[key];
      
      // If time window has passed, reset the count
      if (now - firstTimestamp > this.rateLimitConfig.timeWindowMs) {
        this.errorCounts[key] = { count: 1, firstTimestamp: now };
        return true;
      }
      
      // Check if under rate limit
      if (count < this.rateLimitConfig.maxErrors) {
        this.errorCounts[key].count++;
        return true;
      }
      
      // Rate limited
      return false;
    } else {
      // First occurrence of this error
      this.errorCounts[key] = { count: 1, firstTimestamp: now };
      return true;
    }
  }
  
  /**
   * Capture an error for reporting
   */
  public captureError(
    error: Error,
    componentStack?: string,
    category: ErrorCategory = ErrorCategory.UNKNOWN,
    metadata?: ErrorMetadata
  ): void {
    if (!this.isEnabled) return;
    
    try {
      // Check rate limiting
      if (!this.checkRateLimit(error)) {
        console.debug('Error rate limited:', error.message);
        return;
      }
      
      // Get user ID if available
      const userId = this.getUserId();
      
      const errorReport: ErrorReport = {
        error,
        message: error.message,
        timestamp: new Date().toISOString(),
        severity: this.determineSeverity(error, category),
        category,
        metadata,
        stackTrace: error.stack,
        componentStack,
        userId,
        sessionId: this.getSessionId(),
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        offline: typeof navigator !== 'undefined' ? !navigator.onLine : undefined
      };
      
      // Add to queue
      this.addToQueue(errorReport);
      
      // Log to console in development
      if (process.env.NODE_ENV !== 'production') {
        this.logErrorToConsole(errorReport);
      }
      
      // Attempt to recover based on error type
      this.attemptRecovery(error, category);
    } catch (e) {
      // Avoid infinite recursion if capturing fails
      console.error('Error in error capture:', e);
    }
  }
  
  /**
   * Determine error severity based on error type and category
   */
  private determineSeverity(error: Error, category: ErrorCategory): ErrorSeverity {
    // Network errors are usually warnings unless they persist
    if (category === ErrorCategory.NETWORK) {
      return ErrorSeverity.WARNING;
    }
    
    // Auth errors are usually important
    if (category === ErrorCategory.AUTHENTICATION) {
      return ErrorSeverity.ERROR;
    }
    
    // Database errors could be critical
    if (category === ErrorCategory.DATABASE) {
      return ErrorSeverity.CRITICAL;
    }
    
    // Default for most UI errors
    if (category === ErrorCategory.UI) {
      return ErrorSeverity.INFO;
    }
    
    // Default to ERROR for unknown categories
    return ErrorSeverity.ERROR;
  }
  
  /**
   * Get current user ID if available
   */
  private getUserId(): string | undefined {
    try {
      const user = supabase.auth.getUser();
      return user ? (user as any).data?.user?.id : undefined;
    } catch (e) {
      return undefined;
    }
  }
  
  /**
   * Generate or retrieve a unique session ID
   */
  private getSessionId(): string {
    try {
      let sessionId = sessionStorage.getItem('sessionId');
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
        sessionStorage.setItem('sessionId', sessionId);
      }
      return sessionId;
    } catch (e) {
      return `fallback_${Date.now()}`;
    }
  }
  
  /**
   * Attempt to recover from specific error types
   */
  private attemptRecovery(error: Error, category: ErrorCategory): void {
    // Network error recovery
    if (category === ErrorCategory.NETWORK && navigator.onLine) {
      // Wait a moment and retry network operations
      setTimeout(() => {
        // This could trigger a refresh or retry mechanism
        console.debug('Network recovery attempted');
      }, 1000);
    }
    
    // Auth error recovery
    if (category === ErrorCategory.AUTHENTICATION) {
      try {
        // This could redirect to login page if auth token is invalid
        if (error.message.includes('token') || error.message.includes('auth')) {
          console.debug('Auth recovery attempted');
        }
      } catch (e) {
        // Ignore recovery errors
      }
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
    
    // Flush immediately for critical errors if online
    if (report.severity === ErrorSeverity.CRITICAL && navigator.onLine) {
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
   * Flush error queue to database
   */
  public flush(): void {
    if (!this.isEnabled || this.errorQueue.length === 0 || !navigator.onLine) return;
    
    try {
      // Only take the first 10 errors to avoid overloading the API
      const errorsToSend = this.errorQueue.slice(0, 10);
      this.errorQueue = this.errorQueue.slice(10);
      
      // Send errors to Supabase
      this.sendErrorsToSupabase(errorsToSend);
      
      // Clear the batch we just sent
      console.debug(`Flushing ${errorsToSend.length} error reports`);
    } catch (e) {
      console.error('Error flushing error reports:', e);
    }
  }

  /**
   * Log errors to Supabase
   */
  private async sendErrorsToSupabase(errors: ErrorReport[]): Promise<void> {
    try {
      // Prepare error data for Supabase
      const errorData = errors.map(error => ({
        user_id: error.userId,
        error_message: error.message.substring(0, 500), // Limit message length
        error_type: error.error.name,
        stack_trace: error.stackTrace?.substring(0, 3000), // Limit stack trace length
        component_stack: error.componentStack?.substring(0, 3000),
        url: error.url,
        metadata: error.metadata ? JSON.stringify(error.metadata) : null,
        severity: error.severity,
        category: error.category,
        created_at: error.timestamp,
        session_id: error.sessionId
      }));

      // Insert into Supabase
      const { error } = await supabase
        .from('error_logs')
        .insert(errorData);
      
      if (error) {
        console.error('Failed to save errors to Supabase:', error);
      }
    } catch (e) {
      console.error('Error sending errors to Supabase:', e);
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
    if (report.componentStack) {
      console.info('Component Stack:', report.componentStack);
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
