
import { useAuth } from '@/contexts/AuthContext';
import { useCallback } from 'react';

// This hook provides a simple way to log system events
export function useSystemLog() {
  const { addSystemLog } = useAuth();

  // Log information messages
  const logInfo = useCallback(
    (action: string, details: string) => {
      addSystemLog(action, details, 'info');
    },
    [addSystemLog]
  );

  // Log warning messages
  const logWarning = useCallback(
    (action: string, details: string) => {
      addSystemLog(action, details, 'warning');
    },
    [addSystemLog]
  );

  // Log error messages
  const logError = useCallback(
    (action: string, details: string) => {
      addSystemLog(action, details, 'error');
    },
    [addSystemLog]
  );

  // Log debug messages
  const logDebug = useCallback(
    (action: string, details: string) => {
      addSystemLog(action, details, 'debug');
    },
    [addSystemLog]
  );

  // Log security-related messages
  const logSecurity = useCallback(
    (action: string, details: string) => {
      addSystemLog(action, details, 'security');
    },
    [addSystemLog]
  );

  // Log audit trail messages
  const logAudit = useCallback(
    (action: string, details: string) => {
      addSystemLog(action, details, 'audit');
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
  };
}
