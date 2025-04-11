// Error monitoring service for capturing and logging errors
import { isFeatureEnabled } from '@/utils/featureFlags';

export interface ErrorMetadata {
  componentStack?: string;
  context?: string;
  userId?: string;
  url?: string;
  tags?: Record<string, string>;
  [key: string]: any;
}

export interface ErrorMonitoringOptions {
  enabled: boolean;
  sampleRate: number;
  ignoredErrors: RegExp[];
  maxErrorsPerMinute: number;
  includeUserInfo: boolean;
  includeDevice: boolean;
  includeNetwork: boolean;
}

class ErrorMonitoringService {
  private enabled: boolean;
  private sampleRate: number;
  private ignoredErrors: RegExp[];
  private maxErrorsPerMinute: number;
  private includeUserInfo: boolean;
  private includeDevice: boolean;
  private includeNetwork: boolean;
  private errorCount: number = 0;
  private lastErrorReset: number = Date.now();
  
  constructor(options: Partial<ErrorMonitoringOptions> = {}) {
    this.enabled = options.enabled ?? true;
    this.sampleRate = options.sampleRate ?? 1.0; // 1.0 = 100% of errors
    this.ignoredErrors = options.ignoredErrors ?? [
      // Common browser extensions errors
      /ResizeObserver loop limit exceeded/,
      /ResizeObserver loop completed with undelivered notifications/,
      /Network Error/,
      /Script error/,
      /Extension context invalidated/
    ];
    this.maxErrorsPerMinute = options.maxErrorsPerMinute ?? 10;
    this.includeUserInfo = options.includeUserInfo ?? true;
    this.includeDevice = options.includeDevice ?? true;
    this.includeNetwork = options.includeNetwork ?? false;
    
    // Reset error count every minute
    setInterval(() => {
      this.errorCount = 0;
      this.lastErrorReset = Date.now();
    }, 60000);
  }
  
  /**
   * Capture and log an error
   */
  public captureError(error: Error, metadata: ErrorMetadata = {}): void {
    // Skip if monitoring is disabled or we hit the rate limit
    if (!this.enabled || !this.shouldCaptureError(error)) {
      return;
    }
    
    // Increment error count
    this.errorCount++;
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('Error captured:');
      console.error(error);
      console.info('Metadata:', metadata);
      console.groupEnd();
    }
    
    // Prepare error data
    const errorData = this.prepareErrorData(error, metadata);
    
    // Send to backend if we have a backend reporting enabled
    if (isFeatureEnabled('errorReporting')) {
      this.sendToBackend(errorData);
    }
    
    // Send to browser console
    console.error('[ErrorMonitor]', error.message, errorData);
  }
  
  /**
   * Capture and log a message
   */
  public captureMessage(message: string, metadata: ErrorMetadata = {}): void {
    if (!this.enabled) return;
    
    const error = new Error(message);
    error.name = 'Message';
    this.captureError(error, metadata);
  }
  
  /**
   * Determine if an error should be captured based on sampling and rules
   */
  private shouldCaptureError(error: Error): boolean {
    // Check if we've exceeded the rate limit
    if (this.errorCount >= this.maxErrorsPerMinute) {
      return false;
    }
    
    // Check if the error is in the ignored list
    if (this.ignoredErrors.some(pattern => pattern.test(error.message))) {
      return false;
    }
    
    // Apply sampling rate
    if (Math.random() > this.sampleRate) {
      return false;
    }
    
    return true;
  }
  
  /**
   * Prepare error data for reporting
   */
  private prepareErrorData(error: Error, metadata: ErrorMetadata): Record<string, any> {
    const errorData: Record<string, any> = {
      message: error.message,
      name: error.name,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      ...metadata
    };
    
    // Add user info if enabled
    if (this.includeUserInfo) {
      try {
        const user = localStorage.getItem('user');
        if (user) {
          errorData.user = JSON.parse(user);
        }
      } catch (e) {
        // Ignore errors reading user
      }
    }
    
    // Add device info if enabled
    if (this.includeDevice) {
      errorData.device = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        screenSize: {
          width: window.screen.width,
          height: window.screen.height
        }
      };
    }
    
    // Add network info if enabled
    if (this.includeNetwork && navigator.connection) {
      // @ts-ignore - Some browsers support this
      const connection = navigator.connection;
      errorData.network = {
        effectiveType: connection?.effectiveType,
        downlink: connection?.downlink,
        rtt: connection?.rtt
      };
    }
    
    return errorData;
  }
  
  /**
   * Send error data to backend
   */
  private sendToBackend(errorData: Record<string, any>): void {
    // Only do this if we're in production to avoid spam during development
    if (process.env.NODE_ENV !== 'production') return;
    
    // Use fetch with keepalive to ensure the request completes even if the page is unloading
    fetch('/api/errors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(errorData),
      keepalive: true
    }).catch(e => {
      // Silently fail if we can't send the error
      console.error('Failed to send error to backend', e);
    });
  }
}

// Create and export a singleton instance
export const errorMonitoringService = new ErrorMonitoringService();

// Export a global error handler that can be used in event handlers
export const handleGlobalError = (error: Error, context?: string): void => {
  errorMonitoringService.captureError(error, { context });
};

// Export default for convenience
export default errorMonitoringService;
