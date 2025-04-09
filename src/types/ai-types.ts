
export type AIProcessingOptions = {
  confidenceThreshold?: number;
  language?: 'italian' | 'english' | 'both';
  includeTranslation?: boolean;
  includeFeedback?: boolean;
  maxTokens?: number;
  processingType?: 'grammar' | 'vocabulary' | 'culture' | 'citizenship';
};

export type AIModelStatus = 'active' | 'loading' | 'error' | 'inactive';

export type AIModelType = 'embedding' | 'translation' | 'speech' | 'text-generation' | 'chat';

export type AIModel = {
  id: string;
  name: string;
  type: AIModelType;
  size: number; // size in MB
  isLoaded: boolean;
  isActive: boolean;
  accuracy: number; // 0-1
  version: string;
};

export type ItalianQuestionGenerationParams = {
  contentType: 'multiple_choice' | 'open_ended' | 'fill_in_blank';
  topics: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  count: number;
  includeTranslation?: boolean;
};

export type AIGeneratedQuestion = {
  id: string;
  question: string;
  questionTranslation?: string;
  type: 'multiple_choice' | 'open_ended' | 'fill_in_blank';
  options?: string[];
  optionsTranslations?: string[];
  correctAnswer?: string | number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
};

export type TextToSpeechOptions = {
  text: string;
  voice?: string; 
  speed?: number;
};

export type TTSOptions = {
  voice?: string;
  speed?: number;
  pitch?: number;
};

export type AIGenerationResult = {
  content: string;
  confidence?: number;
  metadata?: {
    processingTime?: number;
    modelUsed?: string;
    tokensUsed?: number;
  };
};
