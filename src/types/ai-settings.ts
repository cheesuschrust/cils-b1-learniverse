
export type AIModelType = 'local' | 'cloud' | 'hybrid';

export type AIOptions = {
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
};

export type AIStatus = {
  isModelLoaded: boolean;
  isOnline: boolean;
  error: string | null;
  availableModels: string[];
};

export type AIFeedbackSettings = {
  provideHints: boolean;
  explainErrors: boolean;
  suggestImprovements: boolean;
  translationFeedback: boolean;
};

export type AIModelSize = 'small' | 'medium' | 'large';
