
// Creating a stub file to define toast interfaces
import { ReactNode } from 'react';

export interface Toast {
  id: string;
  title?: string;
  description?: ReactNode;
  action?: ReactNode;
  variant?: 'default' | 'destructive';
  duration?: number; // Adding the missing duration property
}

export interface ToastActionElement {
  altText: string;
  children: ReactNode;
}

// This is just a stub file to fix the type errors
// The actual implementation would be in use-toast.tsx
export const useToast = () => {
  return {
    toast: (props: Toast) => {},
    dismiss: (toastId: string) => {},
    toasts: [] as Toast[]
  };
};

