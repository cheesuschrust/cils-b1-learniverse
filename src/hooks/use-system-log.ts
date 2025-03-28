
import { useAuth } from '@/contexts/AuthContext';
import { useCallback } from 'react';
import { errorMonitoring, ErrorSeverity, ErrorCategory } from '@/utils/errorMonitoring';
import { toast } from '@/hooks/use-toast';

// This hook provides a simple way to log system events
export function useSystemLog() {
  const { addSystemLog } = useAuth();

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
    [addSystemLog]
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
    [addSystemLog]
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
    [addSystemLog]
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
    (action: string, details: string) => {
      console.info(`[EMAIL] ${action}: ${details}`);
      addSystemLog(action, details, 'email');
    },
    [addSystemLog]
  );
  
  // Log user actions
  const logUserAction = useCallback(
    (action: string, details: string) => {
      console.info(`[USER] ${action}: ${details}`);
      addSystemLog(action, details, 'user');
    },
    [addSystemLog]
  );

  return {
    logInfo,
    logWarning,
    logError,
    logDebug,
    logSecurity,
    logAudit,
    logEmailAction,
    logUserAction
  };
}
