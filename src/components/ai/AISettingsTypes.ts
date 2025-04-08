
import { ContentType } from '@/types/contentType';

export type ConfidenceScores = {
  [key in ContentType]: number;
};

export const getInitialConfidenceScores = (): ConfidenceScores => ({
  'multiple-choice': 85,
  'flashcards': 82,
  'writing': 78,
  'speaking': 75,
  'listening': 80
});
