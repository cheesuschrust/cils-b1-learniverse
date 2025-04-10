
interface ErrorContext {
  componentStack?: string;
  context?: string;
  [key: string]: unknown;
}

class ErrorMonitoringService {
  private initialized = false;
  private context: Record<string, unknown> = {};

  initialize(config: Record<string, unknown> = {}) {
    if (this.initialized) {
      console.warn('Error monitoring service already initialized');
      return;
    }
    
    this.context = { ...config };
    this.initialized = true;
    
    console.log('Error monitoring service initialized', this.context);
    
    // Set up global error handler
    window.addEventListener('error', (event) => {
      this.captureError(event.error || new Error(event.message), { 
        source: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        context: 'window.onerror'
      });
    });
    
    // Set up unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError(event.reason instanceof Error ? event.reason : new Error(String(event.reason)), { 
        context: 'unhandledrejection'
      });
    });
  }

  setUser(user: { id: string; email?: string; name?: string }) {
    this.context.user = user;
  }

  clearUser() {
    delete this.context.user;
  }

  setExtra(key: string, value: unknown) {
    this.context[key] = value;
  }

  captureError(error: Error, context: ErrorContext = {}) {
    if (!this.initialized) {
      console.warn('Error monitoring service not initialized');
    }
    
    const errorData = {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      context: { ...this.context, ...context },
      timestamp: new Date().toISOString(),
    };
    
    // In a real implementation, this would send data to an error monitoring service
    console.error('Error captured by monitoring service:', errorData);
  }
}

export const errorMonitoringService = new ErrorMonitoringService();
export default errorMonitoringService;
