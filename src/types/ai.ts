
export type AIModelSize = 'small' | 'medium' | 'large';

export interface AIStatus {
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  modelSize: AIModelSize;
  availableModels: string[];
}

export interface AIModel {
  name: string;
  version: string;
  size: AIModelSize;
  capabilities: string[];
  languages: string[];
  tokenLimit: number;
}

export interface AIOptions {
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  stopSequences?: string[];
}

export interface AIFeedbackSettings {
  showConfidence: boolean;
  detailedFeedback: boolean;
  highlightErrors: boolean;
  suggestImprovements: boolean;
}

export interface AIPreferences {
  defaultModel: string;
  languagePreference: 'english' | 'italian' | 'both';
  voiceEnabled: boolean;
  autoTranslate: boolean;
  feedbackLevel: 'basic' | 'detailed' | 'expert';
}

export type AIServiceOptions = {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  includeTokenCount?: boolean;
  language?: 'italian' | 'english' | 'both';
};

export interface AIProcessingOptions {
  type?: string;
  level?: string;
  category?: string;
  context?: string;
  includeConfidence?: boolean;
}

export interface QuestionGenerationParams {
  topics: string[];
  contentTypes: string[];
  difficulty: string;
  count: number;
  isCitizenshipFocused?: boolean;
}
