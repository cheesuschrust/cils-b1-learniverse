
import { Flashcard } from '@/lib/interface-fixes';

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
 * Normalize a flashcard object to ensure it has all required properties
 * @param card The card to normalize
 * @returns A normalized flashcard
 */
export function normalizeFlashcard(card: any): Flashcard {
  const now = new Date();
  const tags = Array.isArray(card.tags) ? card.tags : 
    (typeof card.tags === 'string' ? card.tags.split(',').map(t => t.trim()) : []);
  
  return {
    id: card.id || crypto.randomUUID(),
    front: card.front || card.italian || '',
    back: card.back || card.english || '',
    italian: card.italian || card.front || '',
    english: card.english || card.back || '',
    difficulty: typeof card.difficulty === 'number' ? card.difficulty : 1,
    tags: tags,
    lastReviewed: card.lastReviewed ? new Date(card.lastReviewed) : null,
    nextReview: card.nextReview ? new Date(card.nextReview) : null,
    createdAt: card.createdAt ? new Date(card.createdAt) : now,
    updatedAt: card.updatedAt ? new Date(card.updatedAt) : undefined,
    reviewHistory: card.reviewHistory || []
  };
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
    difficulty: card.difficulty,
    tags: card.tags?.join(', ') || '',
    nextReview: card.nextReview ? new Date(card.nextReview).toLocaleDateString() : 'Not scheduled',
  };
}

export default {
  adaptFlashcard,
  adaptFlashcards,
  formatFlashcardForDisplay,
  normalizeFlashcard
};
