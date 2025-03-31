
/**
 * Core AI types for the application
 */

// AI model types
export type AIModel = 
  | 'gpt-4o'
  | 'gpt-4o-mini'
  | 'gpt-4'
  | 'gpt-3.5-turbo'
  | 'claude-instant'
  | 'claude-2'
  | 'mistral-small'
  | 'mistral-medium'
  | 'mistral-large';

// AI provider types
export type AIProvider = 'openai' | 'anthropic' | 'mistral' | 'local';

// AI Settings interface
export interface AISettings {
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  defaultModelSize: string;
  features: {
    contentGeneration: boolean;
    contentAnalysis: boolean;
    errorCorrection: boolean;
    personalization: boolean;
    pronunciationHelp: boolean;
    conversationalLearning: boolean;
    progressTracking: boolean;
    difficultyAdjustment: boolean;
    languageTranslation: boolean;
    flashcards: boolean;
    questions: boolean;
    listening: boolean;
    speaking: boolean;
    writing: boolean;
    translation: boolean;
    explanation: boolean;
    correction: boolean;
    simplified?: boolean;
  };
  italianVoiceURI?: string;
  englishVoiceURI?: string;
  voiceRate?: number;
  voicePitch?: number;
  assistantName?: string;
}

// AI Service options
export interface AIServiceOptions {
  temperature?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  model?: string;
  maxTokens?: number;
}

// AI Preference interface
export interface AIPreference {
  enabled: boolean;
  modelSize: 'small' | 'medium' | 'large';
  contentSafety: boolean;
  dataUsage: 'minimal' | 'standard' | 'full';
}

// Content types that can be processed by AI
export type ContentType = 'reading' | 'writing' | 'listening' | 'speaking' | 'grammar' | 'vocabulary' | 'culture';
