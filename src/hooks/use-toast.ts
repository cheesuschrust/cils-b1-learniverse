
// Re-export from components/ui/use-toast.ts
import { useToast as useToastOriginal } from '../components/ui/use-toast';
import type { Toast, ToastActionElement } from '../components/ui/use-toast';

// Extended useToast with error reporting
export const useToast = () => {
  const toast = useToastOriginal();

  // The original implementation
  return toast;
};

// Re-export Toast type for convenience
export type { Toast, ToastActionElement };

// Re-export toast function for direct use
export { toast } from '../components/ui/use-toast';

// Add utility function to create error toasts with automatic error reporting
export const errorToast = (title: string, description: string, error?: Error) => {
  // Log the error to the console
  if (error) {
    console.error(`${title}: ${description}`, error);
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
