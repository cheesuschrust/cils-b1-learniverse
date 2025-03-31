
import React from 'react';
import { Flashcard } from '@/types/interface-fixes';
import { normalizeFlashcard } from '@/types/interface-fixes';
import FlashcardComponent from '../learning/FlashcardComponent';

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
  onKnown?: () => void;
  onUnknown?: () => void;
  onUpdate?: (card: Flashcard) => void;
  onDelete?: (id: string) => void;
}

/**
 * Adapter component to convert different flashcard formats to match FlashcardComponentProps
 * This resolves the type mismatches in test files and other places
 */
export function FlashcardComponentAdapter({
  flashcard,
  onRating,
  onSkip,
  flipped,
  onFlip,
  showPronunciation,
  showActions,
  className,
  showHints,
  onKnown,
  onUnknown,
  onUpdate,
  onDelete,
}: FlashcardAdapterProps) {
  // Normalize the flashcard to ensure it has all required properties
  const normalizedCard = normalizeFlashcard(flashcard);
  
  return (
    <FlashcardComponent 
      card={normalizedCard}
      onRating={onRating}
      onSkip={onSkip}
      flipped={flipped}
      onFlip={onFlip}
      showPronunciation={showPronunciation}
      showActions={showActions}
      className={className}
      showHints={showHints}
      onKnown={onKnown}
      onUnknown={onUnknown}
      onUpdate={onUpdate}
      onDelete={onDelete}
    />
  );
}

export default FlashcardComponentAdapter;
