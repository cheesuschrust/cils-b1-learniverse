
/**
 * Extended variant types for UI components
 * These types extend the base shadcn UI variants to provide more options
 */

// Extended alert variants
export type ExtendedAlertVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'warning'
  | 'success'
  | 'primary'
  | 'info';

// Extended button variants for more semantic options
export type ExtendedButtonVariant = 
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link'
  | 'success'
  | 'warning';

// Extended select variants
export type ExtendedSelectVariant =
  | 'default'
  | 'outline'
  | 'underlined';

// Extended input variants
export type ExtendedInputVariant =
  | 'default'
  | 'outline'
  | 'filled'
  | 'underlined';

// Extended theme variants
export type ExtendedThemeVariant =
  | 'light'
  | 'dark'
  | 'system'
  | 'auto';
