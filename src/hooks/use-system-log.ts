
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useSystemLog() {
  const logAction = useCallback(async (
    eventType: string, 
    details: Record<string, any> = {},
    userId?: string
  ) => {
    try {
      console.log(`System Log: ${eventType}`, details);
      
      // In a production app, we would log to a database table
      // const { error } = await supabase
      //   .from('system_logs')
      //   .insert({
      //     event_type: eventType,
      //     user_id: userId,
      //     details,
      //     ip_address: null, // Would be determined on the server
      //     user_agent: navigator.userAgent
      //   });
      
      // if (error) throw error;
    } catch (error) {
      console.error('Error logging system action:', error);
    }
  }, []);

  const logUserAction = useCallback((action: string, details: Record<string, any> = {}) => {
    return logAction('user_action', { action, ...details });
  }, [logAction]);
  
  const logError = useCallback((error: Error, context: Record<string, any> = {}) => {
    return logAction('error', { 
      message: error.message, 
      stack: error.stack,
      ...context 
    });
  }, [logAction]);
  
  const logPageView = useCallback((page: string, referrer?: string) => {
    return logAction('page_view', { page, referrer });
  }, [logAction]);
  
  const logAIAction = useCallback((action: string, details: Record<string, any> = {}) => {
    return logAction('ai_action', { action, ...details });
  }, [logAction]);
  
  const logAuthAction = useCallback((action: string, details: Record<string, any> = {}) => {
    return logAction('auth_action', { action, ...details });
  }, [logAction]);
  
  const logAdminAction = useCallback((action: string, details: Record<string, any> = {}) => {
    return logAction('admin_action', { action, ...details });
  }, [logAction]);
  
  const logEmailAction = useCallback((action: string, details: Record<string, any> = {}) => {
    return logAction('email_action', { action, ...details });
  }, [logAction]);

  return {
    logAction,
    logUserAction,
    logError,
    logPageView,
    logAIAction,
    logAuthAction,
    logAdminAction,
    logEmailAction
  };
}
