
// Creating a stub file to define toast interfaces
import { ReactNode } from 'react';

export interface Toast {
  id: string;
  title?: string;
  description?: ReactNode;
  action?: ReactNode;
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'outline' | 'secondary';
  duration?: number;
  onOpenChange?: (open: boolean) => void;
}

export interface ToastActionElement {
  altText: string;
  children: ReactNode;
}

// This is just a stub file to fix the type errors
// The actual implementation would be in hooks/use-toast.ts
export const useToast = () => {
  return {
    toast: (props: Omit<Toast, "id">) => {},
    dismiss: (toastId: string) => {},
    toasts: [] as Toast[]
  };
};
