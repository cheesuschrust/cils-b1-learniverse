
import { useAuth, LogCategory } from "@/contexts/AuthContext";

export function useSystemLog() {
  const { addSystemLog } = useAuth();
  
  const logUserAction = (action: string, details?: string) => {
    addSystemLog('user', action, details);
  };
  
  const logSystemAction = (action: string, details?: string) => {
    addSystemLog('system', action, details);
  };
  
  const logAuthAction = (action: string, details?: string) => {
    addSystemLog('auth', action, details);
  };
  
  const logContentAction = (action: string, details?: string) => {
    addSystemLog('content', action, details);
  };
  
  return {
    logUserAction,
    logSystemAction,
    logAuthAction,
    logContentAction
  };
}
