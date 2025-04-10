
import { useState } from 'react';

interface Toast {
  id: string;
  title: string;
  description?: string;
  duration?: number;
  variant?: 'default' | 'success' | 'error' | 'warning';
}

interface ToastOptions {
  title: string;
  description?: string;
  duration?: number;
  variant?: 'default' | 'success' | 'error' | 'warning';
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = ({ title, description, duration = 5000, variant = 'default' }: ToastOptions) => {
    const id = Math.random().toString(36).substring(2, 9);
    
    setToasts((prevToasts) => [
      ...prevToasts,
      {
        id,
        title,
        description,
        duration,
        variant,
      },
    ]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
      }, duration);
    }
    
    return id;
  };

  const dismiss = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return {
    toast,
    dismiss,
    toasts,
  };
}
