
// Adding missing button variant types
export type ExtendedButtonVariant = 
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link'
  | 'success'
  | 'warning';

// Adding missing alert variant types
export type ExtendedAlertVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'warning'
  | 'success'
  | 'primary'
  | 'info'; // Added warning, success, primary and info variants

// Adding extended confidence types
export type ContentType = 
  | 'flashcards'
  | 'listening'
  | 'writing'
  | 'speaking'
  | 'multiple-choice'
  | 'pdf'
  | 'unknown';

// Adding confidence indicator types
export interface ConfidenceIndicatorProps {
  contentType?: ContentType;
  score: number; // Add a default score value for speaking and listening
}
