
import { ContentType, contentTypeLabels as baseContentTypeLabels, getDisplayableContentTypes } from '@/types/contentType';

export interface AISettingsContentTypeMap {
  'multiple-choice': string;
  'flashcards': string;
  'writing': string;
  'speaking': string;
  'listening': string;
  'audio': string;
  'unknown': string;
  'csv': string;
  'json': string;
  'txt': string;
  'pdf': string;
}

// Re-export the content type labels to ensure consistency
export const getContentTypeLabels = (): Record<ContentType, string> => baseContentTypeLabels;

export const getInitialConfidenceScores = (): Record<ContentType, number> => ({
  'multiple-choice': 85,
  'flashcards': 90,
  'writing': 75,
  'speaking': 70,
  'listening': 80,
  'audio': 65,
  'unknown': 50,
  'csv': 95,
  'json': 95,
  'txt': 90,
  'pdf': 85
});

export { getDisplayableContentTypes };
