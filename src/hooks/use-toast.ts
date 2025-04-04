
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
    console.log('Toast:', { title, description, variant, action });
    // In a real implementation, this would show a toast notification
  };

  return {
    toast: showToast,
    toasts: []
  };
}
