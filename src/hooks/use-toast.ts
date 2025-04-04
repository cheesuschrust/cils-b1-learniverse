
import { toast } from 'sonner';

type ToastOptions = {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
  action?: {
    label: string;
    onClick: () => void;
  };
};

export function useToast() {
  const showToast = ({ title, description, variant = 'default', action }: ToastOptions) => {
    if (variant === 'destructive') {
      toast.error(title, {
        description,
        action: action ? {
          label: action.label,
          onClick: action.onClick,
        } : undefined,
      });
    } else {
      toast(title, {
        description,
        action: action ? {
          label: action.label,
          onClick: action.onClick,
        } : undefined,
      });
    }
  };

  return {
    toast: showToast,
  };
}
