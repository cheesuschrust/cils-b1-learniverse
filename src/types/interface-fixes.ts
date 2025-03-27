// This file fixes any interface compatibility issues between our own types
// and third-party library types

import { ProgressProps as RadixProgressProps } from '@radix-ui/react-progress';

// Extend the RadixProgressProps to include our custom properties
export interface ProgressProps extends RadixProgressProps {
  value: number;
  max?: number;
  indicator?: string;
}

// Other interface compatibility fixes can be added here as needed

// Fix for Alert component props to include variant
export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'warning' | 'success' | 'info' | 'secondary';
}

// Fix for ConfidenceIndicator component props
export interface ConfidenceIndicatorProps {
  score?: number;
  value?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  contentType?: 'writing' | 'speaking' | 'listening' | 'multiple-choice' | 'flashcards';
}
