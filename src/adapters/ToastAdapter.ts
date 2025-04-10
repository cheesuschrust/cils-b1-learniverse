
import { useToast as useOriginalToast } from '@/hooks/use-toast';

// The original toast variants
type OriginalVariant = 'default' | 'destructive' | 'success' | 'warning' | 'outline' | 'secondary';

// The expected toast variants in some components
type ExpectedVariant = 'default' | 'success' | 'error' | 'warning' | undefined;

// Map destructive to error for compatibility and vice versa
const mapVariant = (variant: OriginalVariant | ExpectedVariant | undefined): OriginalVariant | undefined => {
  if (variant === 'error') return 'destructive';
  if (variant === 'destructive') return 'destructive'; // Already correct format
  return variant as OriginalVariant;
};

// Create an adapter for the toast function
export const useToast = () => {
  const originalToast = useOriginalToast();
  
  return {
    ...originalToast,
    toast: (props: any) => {
      return originalToast.toast({
        ...props,
        variant: mapVariant(props.variant),
      });
    },
  };
};

// Add direct destructive -> error mapping for components
export const mapToastVariant = (variant: string): string => {
  if (variant === 'destructive') return 'error';
  return variant;
};

export default { useToast, mapToastVariant };
