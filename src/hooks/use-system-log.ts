
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/contexts/AuthContext';

interface LogOptions {
  severity?: 'info' | 'warning' | 'error';
  metadata?: Record<string, any>;
  saveToDatabase?: boolean;
}

export const useSystemLog = () => {
  const { user } = useAuth();
  
  const logAction = async (action: string, description: string, options: LogOptions = {}) => {
    const { severity = 'info', metadata = {}, saveToDatabase = true } = options;
    
    // Always log to console
    if (severity === 'error') {
      console.error(`[${action}]`, description, metadata);
    } else if (severity === 'warning') {
      console.warn(`[${action}]`, description, metadata);
    } else {
      console.log(`[${action}]`, description, metadata);
    }
    
    // Save to database if requested
    if (saveToDatabase) {
      try {
        await supabase.from('user_activity_logs').insert({
          user_id: user?.id || null,
          activity_type: action,
          details: {
            description,
            severity,
            ...metadata
          }
        });
      } catch (error) {
        console.error('Error saving log to database:', error);
      }
    }
  };

  const logNavigation = (pageName: string, metadata: Record<string, any> = {}) => {
    return logAction('navigation', `User navigated to ${pageName}`, { 
      metadata,
      severity: 'info' 
    });
  };
  
  const logError = (error: Error, context: string, metadata: Record<string, any> = {}) => {
    return logAction('error', `Error in ${context}: ${error.message}`, { 
      metadata: { 
        ...metadata,
        errorName: error.name,
        stack: error.stack 
      },
      severity: 'error' 
    });
  };
  
  const logFeatureUsage = (featureName: string, metadata: Record<string, any> = {}) => {
    return logAction('feature_usage', `User used feature: ${featureName}`, { 
      metadata,
      severity: 'info' 
    });
  };
  
  const logSubscriptionEvent = (eventType: string, plan: string, metadata: Record<string, any> = {}) => {
    return logAction('subscription', `Subscription ${eventType} for plan: ${plan}`, { 
      metadata,
      severity: 'info' 
    });
  };
  
  const logAuthEvent = (eventType: string, metadata: Record<string, any> = {}) => {
    return logAction('authentication', `Auth event: ${eventType}`, { 
      metadata,
      severity: 'info' 
    });
  };
  
  const logEmailAction = (actionType: string, details: string, metadata: Record<string, any> = {}) => {
    return logAction('email', `Email ${actionType}: ${details}`, { 
      metadata,
      severity: 'info' 
    });
  };

  return {
    logAction,
    logNavigation,
    logError,
    logFeatureUsage,
    logSubscriptionEvent,
    logAuthEvent,
    logEmailAction
  };
};
