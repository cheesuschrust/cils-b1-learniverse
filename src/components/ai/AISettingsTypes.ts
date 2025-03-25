
import { ContentType } from '@/types/contentType';

export interface AIModelInfo {
  id: string;
  name: string;
  provider: string;
  task: string;
  size: string;
  languages: string[];
  huggingFaceId: string;
}

export interface AIPreferences {
  useWebGPU: boolean;
  autoLoadModels: boolean;
  cacheModels: boolean;
  defaultLanguage: 'english' | 'italian' | 'auto';
  processingSetting: 'fast' | 'balanced' | 'high-quality';
  defaultModelSize: 'small' | 'medium' | 'large';
  optimizationLevel: number;
  anonymousAnalytics: boolean;
  contentFiltering: boolean;
  voiceRate: number;
  voicePitch: number;
  englishVoiceURI: string | null;
  italianVoiceURI: string | null;
  processOnDevice?: boolean;
  dataCollection?: boolean;
  assistanceLevel?: number;
}

export type AIModelCategory = 'text' | 'speech' | 'translation';

export const getInitialConfidenceScores = (): Record<ContentType, number> => {
  return {
    'multiple-choice': 85,
    'flashcards': 80,
    'writing': 75,
    'speaking': 70,
    'listening': 90,
    'pdf': 65,
    'audio': 80,
    'csv': 95,
    'json': 95,
    'txt': 85,
    'unknown': 50
  };
};

export const getDisplayableContentTypes = (): ContentType[] => {
  return [
    'multiple-choice',
    'flashcards',
    'writing',
    'speaking',
    'listening'
  ];
};

export const getContentTypeLabels = (): Record<ContentType, string> => {
  return {
    'multiple-choice': 'Multiple Choice Questions',
    'flashcards': 'Flashcard Content',
    'writing': 'Written Exercises',
    'speaking': 'Speaking Practice',
    'listening': 'Listening Comprehension',
    'pdf': 'PDF Documents',
    'audio': 'Audio Files',
    'csv': 'CSV Data',
    'json': 'JSON Data',
    'txt': 'Text Files',
    'unknown': 'Unknown Content'
  };
};

export const getDefaultAIPreferences = (): AIPreferences => {
  return {
    useWebGPU: true,
    autoLoadModels: false,
    cacheModels: true,
    defaultLanguage: 'italian',
    processingSetting: 'balanced',
    defaultModelSize: 'medium',
    optimizationLevel: 5,
    anonymousAnalytics: true,
    contentFiltering: true,
    voiceRate: 1,
    voicePitch: 1,
    englishVoiceURI: null,
    italianVoiceURI: null,
    processOnDevice: true,
    dataCollection: true,
    assistanceLevel: 5
  };
};
