
import { ContentType } from '@/types/contentType';

export type AIModel = 'gpt-4o-mini' | 'gpt-4o' | 'mistral-small' | 'claude-instant';

export interface AISettings {
  model: AIModel;
  temperature: number;
  maxTokens: number;
  enableStreaming: boolean;
  prioritizeSpeed: boolean;
  enableLocalModel: boolean;
  localModelPath?: string;
  modelSize?: string;
  language?: string;
  difficulty?: string;
  contentTypes?: string[];
  focusAreas?: string[];
  showFeedback?: boolean;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

export interface AIAccessConfig {
  apiKey?: string;
  useProxyEndpoint: boolean;
  proxyEndpoint?: string;
  rateLimit: number; // Requests per minute
  cacheDuration: number; // In minutes
}

export interface AIFeedbackSettings {
  detailedFeedback: boolean;
  includeExamples: boolean;
  suggestCorrections: boolean;
  language: 'english' | 'italian' | 'both';
  feedbackLevel: 'beginner' | 'intermediate' | 'advanced';
}

export interface AIFeatureFlags {
  enableImageGeneration: boolean;
  enableVoiceRecognition: boolean;
  enablePronunciationFeedback: boolean;
  enableContentCreation: boolean;
  enablePersonalization: boolean;
}

export interface AIUsageMetrics {
  tokensUsed: number;
  requestsMade: number;
  lastReset: Date;
  quotaLimit: number;
}

// Helper to get displayable content types
export const getDisplayableContentTypes = (): ContentType[] => {
  return ['multiple-choice', 'flashcards', 'writing', 'speaking', 'listening', 'grammar', 'vocabulary', 'culture', 'reading', 'pdf', 'document', 'video', 'audio', 'image', 'unknown'];
};

// Initialize default confidence scores for displayable content types
export const getInitialConfidenceScores = (): Partial<Record<ContentType, number>> => {
  return {
    'multiple-choice': 78,
    'flashcards': 82,
    'writing': 69,
    'speaking': 74,
    'listening': 65,
    'grammar': 77,
    'vocabulary': 80,
    'culture': 65,
    'reading': 70,
    'pdf': 60,
    'document': 60,
    'video': 72,
    'audio': 68,
    'image': 55,
  };
};

// Get user-friendly labels for content types
export const getContentTypeLabels = (): Partial<Record<ContentType, string>> => {
  return {
    'multiple-choice': 'Multiple Choice',
    'flashcards': 'Flashcards',
    'writing': 'Writing',
    'speaking': 'Speaking',
    'listening': 'Listening',
    'grammar': 'Grammar',
    'vocabulary': 'Vocabulary',
    'culture': 'Culture',
    'reading': 'Reading',
    'pdf': 'PDF Documents',
    'document': 'Documents',
    'video': 'Video Content',
    'audio': 'Audio Content',
    'image': 'Images'
  };
};

// Default AI settings
export const defaultAISettings: AISettings = {
  model: 'gpt-4o-mini',
  temperature: 0.7,
  maxTokens: 1024,
  enableStreaming: true,
  prioritizeSpeed: false,
  enableLocalModel: false
};

// Default AI access configuration
export const defaultAIAccessConfig: AIAccessConfig = {
  useProxyEndpoint: true,
  rateLimit: 60,
  cacheDuration: 60 // 1 hour
};

// Default AI feedback settings
export const defaultAIFeedbackSettings: AIFeedbackSettings = {
  detailedFeedback: true,
  includeExamples: true,
  suggestCorrections: true,
  language: 'english',
  feedbackLevel: 'intermediate'
};

// Default AI feature flags
export const defaultAIFeatureFlags: AIFeatureFlags = {
  enableImageGeneration: true,
  enableVoiceRecognition: true,
  enablePronunciationFeedback: true,
  enableContentCreation: false,
  enablePersonalization: true
};

// Default AI usage metrics
export const defaultAIUsageMetrics: AIUsageMetrics = {
  tokensUsed: 0,
  requestsMade: 0,
  lastReset: new Date(),
  quotaLimit: 100000
};
