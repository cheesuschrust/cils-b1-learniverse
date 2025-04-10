
import { Flashcard } from '@/types/interface-fixes';
import { safeParseDate, ensureDate } from './dateUtils';

/**
 * Converts database flashcard record to Flashcard type
 */
export function convertDbFlashcardToFlashcard(dbRecord: any): Flashcard {
  return {
    id: dbRecord.id || '',
    front: dbRecord.front || dbRecord.italian || '',
    back: dbRecord.back || dbRecord.english || '',
    italian: dbRecord.italian || dbRecord.front || '',
    english: dbRecord.english || dbRecord.back || '',
    difficulty: typeof dbRecord.difficulty === 'number' 
      ? dbRecord.difficulty 
      : typeof dbRecord.difficulty === 'string' && !isNaN(Number(dbRecord.difficulty))
        ? Number(dbRecord.difficulty)
        : 1,
    tags: dbRecord.tags || [],
    lastReviewed: safeParseDate(dbRecord.last_reviewed || dbRecord.lastReviewed),
    nextReview: safeParseDate(dbRecord.next_review || dbRecord.nextReview) || new Date(),
    createdAt: ensureDate(dbRecord.created_at || dbRecord.createdAt),
    updatedAt: ensureDate(dbRecord.updated_at || dbRecord.updatedAt),
    mastered: dbRecord.mastered || false,
    level: typeof dbRecord.level === 'number' ? dbRecord.level : 0,
    explanation: dbRecord.explanation || ''
  };
}

/**
 * Converts Flashcard to database record format
 */
export function convertFlashcardToDbFormat(flashcard: Partial<Flashcard>): any {
  const result: any = {};
  
  if (flashcard.front !== undefined) result.front = flashcard.front;
  if (flashcard.back !== undefined) result.back = flashcard.back;
  if (flashcard.italian !== undefined) result.italian = flashcard.italian;
  if (flashcard.english !== undefined) result.english = flashcard.english;
  if (flashcard.explanation !== undefined) result.explanation = flashcard.explanation;
  
  // Convert difficulty from string to number if needed
  if (flashcard.difficulty !== undefined) {
    result.difficulty = typeof flashcard.difficulty === 'string' 
      ? parseFloat(flashcard.difficulty) || 1
      : flashcard.difficulty;
  }
  
  if (flashcard.tags !== undefined) result.tags = flashcard.tags;
  if (flashcard.level !== undefined) result.level = flashcard.level;
  if (flashcard.mastered !== undefined) result.mastered = flashcard.mastered;
  
  return result;
}
