
import React from 'react';
import { Flashcard, FlashcardComponentProps } from '@/types';
import { normalizeFlashcard } from '@/types/interface-fixes';

interface FlashcardAdapterProps {
  flashcard: any;
  onRating?: (rating: number) => void;
  onSkip?: () => void;
  flipped?: boolean;
  onFlip?: () => void;
  showPronunciation?: boolean;
  showActions?: boolean;
  className?: string;
  showHints?: boolean;
  onUnknown?: () => void;
}

/**
 * Adapter component to convert different flashcard formats to match FlashcardComponentProps
 * This resolves the type mismatches in test files and other places
 */
export function FlashcardComponentAdapter({
  flashcard,
  ...otherProps
}: FlashcardAdapterProps) {
  // Normalize the flashcard to ensure it has all required properties
  const normalizedCard = normalizeFlashcard(flashcard);
  
  // Convert to expected FlashcardComponentProps format
  const adaptedProps: FlashcardComponentProps = {
    card: normalizedCard,
    ...otherProps
  };
  
  // Import the actual FlashcardComponent dynamically to avoid circular dependencies
  const FlashcardComponent = React.lazy(() => import('./FlashcardComponent'));
  
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <FlashcardComponent {...adaptedProps} />
    </React.Suspense>
  );
}
