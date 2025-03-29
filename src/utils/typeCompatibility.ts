
import { Flashcard } from '@/types/interface-fixes';
import { normalizeFlashcard } from '@/types/interface-fixes';

/**
 * Convert various flashcard formats to the unified Flashcard type
 * @param card Any object with flashcard-like properties
 * @returns Normalized Flashcard object
 */
export function adaptFlashcard(card: any): Flashcard {
  return normalizeFlashcard(card);
}

/**
 * Convert an array of flashcards to the unified format
 * @param cards Array of objects with flashcard-like properties
 * @returns Array of normalized Flashcard objects
 */
export function adaptFlashcards(cards: any[]): Flashcard[] {
  if (!Array.isArray(cards)) return [];
  return cards.map(card => adaptFlashcard(card));
}

/**
 * Convert a flashcard to a display format with proper labels
 * @param card Flashcard to format
 * @param frontFieldName Custom name for the front field
 * @param backFieldName Custom name for the back field
 * @returns Object with labeled fields
 */
export function formatFlashcardForDisplay(
  card: Flashcard, 
  frontFieldName: string = 'Front', 
  backFieldName: string = 'Back'
): Record<string, any> {
  return {
    id: card.id,
    [frontFieldName]: card.front || card.italian || '',
    [backFieldName]: card.back || card.english || '',
    level: card.level,
    tags: card.tags?.join(', ') || '',
    mastered: card.mastered ? 'Yes' : 'No',
    nextReview: card.nextReview ? new Date(card.nextReview).toLocaleDateString() : 'Not scheduled',
    // Add other fields as needed
  };
}

export default {
  adaptFlashcard,
  adaptFlashcards,
  formatFlashcardForDisplay,
  normalizeFlashcard
};
