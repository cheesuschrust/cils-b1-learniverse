
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

// Initialize default confidence scores for content types
export const getInitialConfidenceScores = (): Record<ContentType, number> => {
  return {
    'multiple-choice': 78,
    'flashcards': 82,
    'writing': 69,
    'speaking': 74,
    'listening': 65
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
