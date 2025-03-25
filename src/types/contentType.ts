
// Type definitions for content types

export type ContentType = 
  | 'multiple-choice' 
  | 'flashcards' 
  | 'writing' 
  | 'speaking' 
  | 'listening'
  | 'audio'
  | 'unknown'
  | 'csv'
  | 'json'
  | 'txt'
  | 'pdf';

// Mapping for content type labels
export const contentTypeLabels: Record<ContentType, string> = {
  'multiple-choice': 'Multiple Choice',
  'flashcards': 'Flashcards',
  'writing': 'Writing',
  'speaking': 'Speaking',
  'listening': 'Listening',
  'audio': 'Audio',
  'unknown': 'Unknown',
  'csv': 'CSV',
  'json': 'JSON',
  'txt': 'Text',
  'pdf': 'PDF'
};

// Helper function to get displayable content types
export const getDisplayableContentTypes = (): ContentType[] => [
  'multiple-choice', 
  'flashcards', 
  'writing', 
  'speaking', 
  'listening'
];
