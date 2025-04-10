
import React from 'react';
import { useToast as useOriginalToast } from '@/components/ui/use-toast';

// Standardize toast variants across the application
type StandardToastVariant = 'default' | 'success' | 'error' | 'warning';

// Map toast variants to ensure compatibility
export const mapToastVariant = (variant: string | undefined): StandardToastVariant => {
  if (variant === 'destructive') return 'error';
  if (variant === 'outline' || variant === 'secondary') return 'default';
  return (variant as StandardToastVariant) || 'default';
};

// Create an adapter for the toast function that handles variant mapping
export const useToast = () => {
  const originalToast = useOriginalToast();
  
  return {
    ...originalToast,
    toast: (props: any) => {
      return originalToast.toast({
        ...props,
        variant: props.variant ? mapToastVariant(props.variant) : 'default',
      });
    },
  };
};

export default { useToast, mapToastVariant };
