
/**
 * Error monitoring and logging system for production use
 */

export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

export enum ErrorCategory {
  UI = 'ui',
  API = 'api',
  AUTHENTICATION = 'auth',
  DATABASE = 'database',
  AI_SERVICE = 'ai-service',
  RENDERING = 'rendering',
  NETWORK = 'network',
  RESOURCE = 'resource',
  FEATURE_FLAG = 'feature-flag',
  UNKNOWN = 'unknown',
  USER_GENERATED = 'user-generated'
}

interface ErrorDetails {
  message: string;
  stack?: string;
  componentName?: string;
  componentStack?: string;
  url?: string;
  timestamp: number;
  userAgent?: string;
  severity: ErrorSeverity;
  category: ErrorCategory;
  metadata?: Record<string, any>;
  userId?: string;
  sessionId?: string;
}

export class ErrorMonitor {
  private static instance: ErrorMonitor;
  private buffer: ErrorDetails[] = [];
  private flushInterval: number = 10000; // 10 seconds
  private bufferSize: number = 10;
  private isInitialized: boolean = false;
  private apiEndpoint: string = '';
  private sessionId: string = '';
  private isProduction: boolean = false;
  
  private constructor() {
    // Generate a session ID
    this.sessionId = Math.random().toString(36).substring(2, 15);
    this.isProduction = process.env.NODE_ENV === 'production';
    
    // Set up interval to flush errors
    setInterval(() => this.flush(), this.flushInterval);
    
    // Listen for unhandled errors
    window.addEventListener('error', this.handleGlobalError);
    window.addEventListener('unhandledrejection', this.handlePromiseRejection);
  }
  
  public static getInstance(): ErrorMonitor {
    if (!ErrorMonitor.instance) {
      ErrorMonitor.instance = new ErrorMonitor();
    }
    return ErrorMonitor.instance;
  }
  
  public initialize(apiEndpoint: string): void {
    this.apiEndpoint = apiEndpoint;
    this.isInitialized = true;
    console.log('Error monitoring initialized');
  }
  
  public captureError(
    error: Error | string,
    severity: ErrorSeverity = ErrorSeverity.ERROR,
    category: ErrorCategory = ErrorCategory.UNKNOWN,
    metadata?: Record<string, any>,
    userId?: string
  ): void {
    const errorDetails: ErrorDetails = {
      message: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      severity,
      category,
      metadata,
      userId,
      sessionId: this.sessionId
    };
    
    // In non-production, log to console
    if (!this.isProduction) {
      console.group('Error captured');
      console.error(errorDetails.message);
      console.log('Details:', errorDetails);
      console.groupEnd();
    }
    
    // Add to buffer
    this.buffer.push(errorDetails);
    
    // Flush if buffer is full
    if (this.buffer.length >= this.bufferSize) {
      this.flush();
    }
  }
  
  private handleGlobalError = (event: ErrorEvent): void => {
    this.captureError(
      event.error || event.message,
      ErrorSeverity.ERROR,
      ErrorCategory.UNKNOWN,
      {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      }
    );
  };
  
  private handlePromiseRejection = (event: PromiseRejectionEvent): void => {
    const error = event.reason instanceof Error 
      ? event.reason 
      : new Error(String(event.reason));
      
    this.captureError(
      error,
      ErrorSeverity.ERROR,
      ErrorCategory.UNKNOWN,
      {
        type: 'unhandled-rejection'
      }
    );
  };
  
  private async flush(): Promise<void> {
    if (!this.isInitialized || this.buffer.length === 0) {
      return;
    }
    
    try {
      const errorsToSend = [...this.buffer];
      this.buffer = [];
      
      if (this.isProduction) {
        // Send to error monitoring API
        await fetch(this.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            errors: errorsToSend,
            timestamp: Date.now(),
            sessionId: this.sessionId
          }),
          keepalive: true
        });
      } else {
        // Just log the count in non-production
        console.log(`Flushed ${errorsToSend.length} errors (would be sent in production)`);
      }
    } catch (e) {
      // If we fail to send, put the errors back in the buffer
      console.error('Failed to send errors:', e);
      // Don't add more than the buffer size
      this.buffer = [...this.buffer, ...this.buffer.slice(0, this.bufferSize - this.buffer.length)];
    }
  }
}

// Export a singleton instance
export const errorMonitoring = ErrorMonitor.getInstance();

// Initialize in your application entry point
export const initializeErrorMonitoring = (apiEndpoint: string): void => {
  errorMonitoring.initialize(apiEndpoint);
};

export default errorMonitoring;
