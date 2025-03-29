
// Basic error reporting service

export enum ErrorCategory {
  AUTH = 'auth',
  API = 'api',
  UI = 'ui',
  UNKNOWN = 'unknown'
}

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

interface ErrorDetails {
  category: ErrorCategory;
  severity: ErrorSeverity;
  message: string;
  stack?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

class ErrorReportingService {
  private errors: ErrorDetails[] = [];

  captureError(
    error: Error, 
    severity: ErrorSeverity = ErrorSeverity.MEDIUM, 
    category: ErrorCategory = ErrorCategory.UNKNOWN,
    metadata?: Record<string, any>
  ): void {
    const errorDetails: ErrorDetails = {
      category,
      severity,
      message: error.message,
      stack: error.stack,
      metadata,
      timestamp: new Date()
    };

    this.errors.push(errorDetails);
    
    // Log to console for development
    console.error(`[${category}][${severity}] ${error.message}`, metadata);
    
    // In a real app, you would send this to your error reporting service
    // Example: await this.sendToErrorService(errorDetails);
  }

  // More methods would be here in a real implementation
  getErrors(): ErrorDetails[] {
    return this.errors;
  }
  
  clearErrors(): void {
    this.errors = [];
  }
}

// Singleton instance
export const errorReporting = new ErrorReportingService();
