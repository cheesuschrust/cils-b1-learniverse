
// Map between different toast variant naming conventions
export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'destructive' | 'info';
export type StandardToastVariant = 'default' | 'success' | 'error' | 'warning';

// Convert any toast variant to a standard one
export const normalizeToastVariant = (variant: ToastVariant | undefined): StandardToastVariant => {
  if (!variant) return 'default';
  
  switch (variant) {
    case 'destructive':
      return 'error';
    case 'info':
      return 'default';
    case 'success':
    case 'error':
    case 'warning':
    case 'default':
      return variant;
    default:
      return 'default';
  }
};
