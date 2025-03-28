
import { useAuth } from '@/contexts/AuthContext';
import { useCallback } from 'react';
import { errorMonitoring, ErrorSeverity, ErrorCategory } from '@/utils/errorMonitoring';
import { useToast } from '@/components/ui/use-toast';

// This hook provides a simple way to log system events
export function useSystemLog() {
  const { addSystemLog } = useAuth();
  const { toast } = useToast();

  // Log information messages
  const logInfo = useCallback(
    (action: string, details: string) => {
      console.info(`[INFO] ${action}: ${details}`);
      addSystemLog(action, details, 'info');
    },
    [addSystemLog]
  );

  // Log warning messages
  const logWarning = useCallback(
    (action: string, details: string) => {
      console.warn(`[WARNING] ${action}: ${details}`);
      addSystemLog(action, details, 'warning');
      
      // Show warning toast
      toast({
        title: action,
        description: details,
        variant: "default",
        duration: 4000
      });
    },
    [addSystemLog, toast]
  );

  // Log error messages
  const logError = useCallback(
    (action: string, details: string, error?: Error) => {
      console.error(`[ERROR] ${action}: ${details}`, error);
      addSystemLog(action, details, 'error');
      
      // Show error toast
      toast({
        title: action,
        description: details,
        variant: "destructive",
        duration: 5000
      });
      
      if (error) {
        errorMonitoring.captureError(
          error,
          ErrorSeverity.ERROR,
          ErrorCategory.UNKNOWN,
          { action, details }
        );
      }
    },
    [addSystemLog, toast]
  );

  // Log debug messages
  const logDebug = useCallback(
    (action: string, details: string) => {
      console.debug(`[DEBUG] ${action}: ${details}`);
      addSystemLog(action, details, 'debug');
    },
    [addSystemLog]
  );

  // Log security-related messages
  const logSecurity = useCallback(
    (action: string, details: string, error?: Error) => {
      console.warn(`[SECURITY] ${action}: ${details}`, error);
      addSystemLog(action, details, 'security');
      
      // Show security toast
      toast({
        title: `Security Alert: ${action}`,
        description: details,
        variant: "destructive",
        duration: 6000
      });
      
      if (error) {
        errorMonitoring.captureError(
          error,
          ErrorSeverity.WARNING,
          ErrorCategory.AUTHENTICATION,
          { action, details }
        );
      }
    },
    [addSystemLog, toast]
  );

  // Log audit trail messages
  const logAudit = useCallback(
    (action: string, details: string) => {
      console.info(`[AUDIT] ${action}: ${details}`);
      addSystemLog(action, details, 'audit');
    },
    [addSystemLog]
  );

  // Log email-related actions
  const logEmailAction = useCallback(
    (action: string, details: string, error?: Error) => {
      console.info(`[EMAIL] ${action}: ${details}`);
      addSystemLog(action, details, 'email');
      
      if (error) {
        console.error(`[EMAIL ERROR] ${action}: ${details}`, error);
        toast({
          title: `Email Error: ${action}`,
          description: details,
          variant: "destructive",
          duration: 5000
        });
        
        errorMonitoring.captureError(
          error,
          ErrorSeverity.ERROR,
          ErrorCategory.UNKNOWN,
          { action, details, context: 'email' }
        );
      }
    },
    [addSystemLog, toast]
  );
  
  // Log user actions
  const logUserAction = useCallback(
    (action: string, details: string) => {
      console.info(`[USER] ${action}: ${details}`);
      addSystemLog(action, details, 'user');
    },
    [addSystemLog]
  );
  
  // Log performance issues
  const logPerformance = useCallback(
    (action: string, details: string, duration: number, threshold: number = 1000) => {
      const isSlowOperation = duration > threshold;
      const level = isSlowOperation ? 'warning' : 'info';
      
      console[level](`[PERFORMANCE] ${action}: ${details} (${duration}ms)`);
      addSystemLog(action, `${details} (${duration}ms)`, level);
      
      if (isSlowOperation) {
        toast({
          title: `Slow Operation: ${action}`,
          description: `${details} took ${duration}ms`,
          variant: "warning",
          duration: 4000
        });
        
        errorMonitoring.captureError(
          new Error(`Slow operation: ${action}`),
          ErrorSeverity.WARNING,
          ErrorCategory.PERFORMANCE,
          { action, details, duration, threshold }
        );
      }
    },
    [addSystemLog, toast]
  );
  
  // Log API calls
  const logApiCall = useCallback(
    (endpoint: string, method: string, status: number, duration: number, error?: Error) => {
      const isError = status >= 400 || error;
      const level = isError ? 'error' : (status >= 300 ? 'warning' : 'info');
      const details = `${method} ${endpoint} - Status: ${status} (${duration}ms)`;
      
      console[level](`[API] ${details}`, error);
      addSystemLog(`API ${method}`, details, level);
      
      if (isError) {
        toast({
          title: `API Error: ${method} ${endpoint}`,
          description: error?.message || `Status: ${status}`,
          variant: "destructive",
          duration: 5000
        });
        
        if (error) {
          errorMonitoring.captureError(
            error,
            ErrorSeverity.ERROR,
            ErrorCategory.API,
            { endpoint, method, status, duration }
          );
        } else {
          errorMonitoring.captureError(
            new Error(`API error: ${method} ${endpoint} - Status: ${status}`),
            ErrorSeverity.ERROR,
            ErrorCategory.API,
            { endpoint, method, status, duration }
          );
        }
      }
    },
    [addSystemLog, toast]
  );

  return {
    logInfo,
    logWarning,
    logError,
    logDebug,
    logSecurity,
    logAudit,
    logEmailAction,
    logUserAction,
    logPerformance,
    logApiCall
  };
}
