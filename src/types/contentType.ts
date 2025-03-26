
export type ContentType = 
  | 'writing' 
  | 'speaking' 
  | 'listening' 
  | 'multiple-choice'
  | 'flashcards';

export interface ContentFeatures {
  wordCount: number;
  sentenceCount: number;
  paragraphCount?: number;
  questionMarks?: number;
  language?: 'english' | 'italian' | 'mixed';
}

export function formatContentType(type: ContentType): string {
  switch (type) {
    case 'multiple-choice':
      return 'Multiple Choice';
    case 'flashcards':
      return 'Flashcards';
    default:
      // Capitalize first letter
      return type.charAt(0).toUpperCase() + type.slice(1);
  }
}

export function getContentTypeColor(type: ContentType): string {
  switch (type) {
    case 'writing':
      return 'blue';
    case 'speaking':
      return 'green';
    case 'listening':
      return 'purple';
    case 'multiple-choice':
      return 'orange';
    case 'flashcards':
      return 'pink';
    default:
      return 'gray';
  }
}
