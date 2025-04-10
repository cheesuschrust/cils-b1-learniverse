
import { useToast as useOriginalToast } from '@/hooks/use-toast';

// The original toast variants
type OriginalVariant = 'default' | 'destructive' | 'success' | 'warning' | 'outline' | 'secondary';

// The expected toast variants in some components
type ExpectedVariant = 'default' | 'success' | 'error' | 'warning';

// Map destructive to error for compatibility
const mapVariant = (variant: OriginalVariant | ExpectedVariant | undefined): OriginalVariant | undefined => {
  if (variant === 'error') return 'destructive';
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
