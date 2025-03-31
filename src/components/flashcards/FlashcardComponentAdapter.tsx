
import React from 'react';
import { Flashcard } from '@/types';
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
  onUpdate,
  onDelete,
  showActions,
  ...otherProps
}: FlashcardAdapterProps) {
  // Normalize the flashcard to ensure it has all required properties
  const normalizedCard = normalizeFlashcard(flashcard);
  
  return (
    <FlashcardComponent 
      card={normalizedCard}
      onUpdate={onUpdate}
      onDelete={onDelete}
      showActions={showActions}
    />
  );
}

export default FlashcardComponentAdapter;
