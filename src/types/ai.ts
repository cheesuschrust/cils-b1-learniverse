
// AI related types

export type AIModel = 
  | 'small' 
  | 'medium' 
  | 'large' 
  | 'gpt-4o' 
  | 'gpt-4o-mini' 
  | 'gpt-4' 
  | 'gpt-3.5-turbo'
  | 'mistral-small'
  | 'mistral-medium'
  | 'mistral-large'
  | 'claude-instant'
  | 'claude-2';

export type AIModelSize = 'small' | 'medium' | 'large';

export interface AIOptions {
  model: AIModel;
  temperature?: number;
  maxTokens?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  streaming?: boolean;
  contextLength?: number;
}

export interface AISettings {
  enabled: boolean;
  model: AIModel;
  provider: string;
  temperature: number;
  maxTokens: number;
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
  };
  streaming: boolean;
  contentSafety: boolean;
  debugMode: boolean;
}

export type AIPreference = 'minimal' | 'balanced' | 'extensive';

export type AIStatus = 'idle' | 'loading' | 'generating' | 'error';

export interface AIFeedbackSettings {
  showConfidenceScore: boolean;
  includeExplanations: boolean;
  highlightErrors: boolean;
  suggestImprovements: boolean;
}
