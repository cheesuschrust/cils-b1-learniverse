
interface ErrorContext {
  componentStack?: string;
  context?: string;
  [key: string]: any;
}

class ErrorMonitoringService {
  captureError(error: Error, context?: ErrorContext): void {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error captured by monitoring service:', error);
      if (context) {
        console.error('Error context:', context);
      }
    }

    // In a real implementation, this would send the error to a monitoring service
    // like Sentry, LogRocket, etc.
    try {
      // For now, just console.log in production too
      console.error('[ErrorMonitoringService]', error, context);
      
      // Add implementation to send to external service here when ready
    } catch (e) {
      // Fail silently to avoid causing more errors
      console.error('Error in error monitoring service:', e);
    }
  }

  captureMessage(message: string, context?: Record<string, any>): void {
    // For debug/info level messages
    console.log('[ErrorMonitoringService] Message:', message, context);
  }
}

// Create a singleton instance
export const errorMonitoringService = new ErrorMonitoringService();

export default errorMonitoringService;
