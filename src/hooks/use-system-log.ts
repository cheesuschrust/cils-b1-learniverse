
import { useAuth } from "@/contexts/AuthContext";
import type { LogCategory } from "@/contexts/shared-types";

/**
 * Hook for system logging operations
 * Provides type-safe methods for different log categories
 */
export function useSystemLog() {
  const { addSystemLog } = useAuth();
  
  /**
   * Log a user-related action
   */
  const logUserAction = (action: string, details?: string, level: 'info' | 'warning' | 'error' = 'info') => {
    addSystemLog('user', action, details, level);
  };
  
  /**
   * Log a system-related action
   */
  const logSystemAction = (action: string, details?: string, level: 'info' | 'warning' | 'error' = 'info') => {
    addSystemLog('system', action, details, level);
  };
  
  /**
   * Log an authentication-related action
   */
  const logAuthAction = (action: string, details?: string, level: 'info' | 'warning' | 'error' = 'info') => {
    addSystemLog('auth', action, details, level);
  };
  
  /**
   * Log a content-related action
   */
  const logContentAction = (action: string, details?: string, level: 'info' | 'warning' | 'error' = 'info') => {
    addSystemLog('content', action, details, level);
  };
  
  /**
   * Log an email-related action
   */
  const logEmailAction = (action: string, details?: string, level: 'info' | 'warning' | 'error' = 'info') => {
    addSystemLog('email', action, details, level);
  };
  
  /**
   * Log an AI-related action
   */
  const logAIAction = (action: string, details?: string, level: 'info' | 'warning' | 'error' = 'info') => {
    addSystemLog('ai', action, details, level);
  };
  
  return {
    logUserAction,
    logSystemAction,
    logAuthAction,
    logContentAction,
    logEmailAction,
    logAIAction
  };
}
