
import { useToast as useToastOriginal } from '../components/ui/use-toast';
import type { Toast, ToastActionElement } from '../components/ui/use-toast';
import { errorMonitoring, ErrorSeverity, ErrorCategory } from '@/utils/errorMonitoring';

// Enhanced useToast with error reporting integration
export const useToast = () => {
  const originalToast = useToastOriginal();
  
  // Enhanced toast function that can automatically log errors
  const enhancedToast = (props: Toast | Omit<Toast, "id">) => {
    // Invoke the original toast function
    originalToast.toast(props);
    
    // Automatically log destructive toasts to error monitoring
    if (props.variant === "destructive") {
      const errorMessage = `Toast Error: ${props.title || 'Unnamed Error'}`;
      const errorDetails = typeof props.description === 'string' 
        ? props.description 
        : 'No details provided';
      
      // Create a synthetic error for tracking
      const error = new Error(errorMessage);
      
      // Log to error monitoring
      errorMonitoring.captureError(
        error,
        ErrorSeverity.WARNING,
        ErrorCategory.UI,
        { 
          context: 'toast',
          title: props.title,
          description: errorDetails,
          timestamp: new Date().toISOString()
        }
      );
    }
    
    // Log toast events to console in development
    if (process.env.NODE_ENV === 'development') {
      const level = props.variant === 'destructive' ? 'error' 
        : props.variant === 'warning' ? 'warn' : 'info';
      
      console[level](`[Toast] ${props.title || 'Notification'}:`, 
        typeof props.description === 'string' ? props.description : 'React element description');
    }
  };
  
  return {
    ...originalToast,
    toast: enhancedToast
  };
};

// Re-export Toast type for convenience
export type { Toast, ToastActionElement };

// Re-export toast function directly from the component
export { useToast as toast } from '../components/ui/use-toast';

// Add utility function to create error toasts with automatic error reporting
export const errorToast = (title: string, description: string, error?: Error) => {
  // Log the error to the console
  if (error) {
    console.error(`${title}: ${description}`, error);
    
    // Report to error monitoring
    errorMonitoring.captureError(
      error,
      ErrorSeverity.ERROR,
      ErrorCategory.UI,
      { context: 'errorToast', title, description }
    );
  } else {
    console.error(`${title}: ${description}`);
  }

  // Return a toast config object
  return {
    title,
    description,
    variant: "destructive" as const,
    duration: 5000,
  };
};

// Add utility for warning toasts
export const warningToast = (title: string, description: string) => {
  console.warn(`${title}: ${description}`);
  
  return {
    title,
    description,
    variant: "default" as const,
    duration: 4000,
  };
};

// Add utility for success toasts
export const successToast = (title: string, description: string) => {
  console.log(`${title}: ${description}`);
  
  return {
    title,
    description,
    variant: "default" as const,
    duration: 3000,
  };
};
