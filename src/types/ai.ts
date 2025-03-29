
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
    flashcards?: boolean;
    questions?: boolean;
    listening?: boolean;
    speaking?: boolean;
    writing?: boolean;
    translation?: boolean;
    explanation?: boolean;
    correction?: boolean;
    simplified?: boolean;
  };
  streaming: boolean;
  contentSafety: boolean;
  debugMode: boolean;
}

export type AIPreference = 'minimal' | 'balanced' | 'extensive';

export type AIStatus = 'idle' | 'loading' | 'generating' | 'error' | 'ready';

export interface AIFeedbackSettings {
  showConfidenceScore: boolean;
  includeExplanations: boolean;
  highlightErrors: boolean;
  suggestImprovements: boolean;
}

export interface UseAIReturn {
  generateText: (prompt: string, options?: any) => Promise<string>;
  getConfidenceScore: (text: string, contentType: string) => Promise<number>;
  translateText?: (text: string, targetLang: 'english' | 'italian') => Promise<string>;
  checkGrammar?: (text: string, lang: 'english' | 'italian') => Promise<{text: string, corrections: any[]}>;
  isLoading?: boolean;
  error: Error | null;
  abort?: () => void;
  generateFlashcards?: (topic: string, count?: number, difficulty?: string) => Promise<any[]>;
  isProcessing?: boolean;
  classifyText?: (text: string) => Promise<any>;
  isModelLoaded?: boolean;
  status?: string;
  loadModel?: (modelName: string) => Promise<boolean>;
  generateQuestions?: (content: string, count?: number, type?: string) => Promise<any[]>;
}

export interface AIServiceOptions {
  maxLength?: number;
  temperature?: number;
  model?: string;
  stream?: boolean;
}

export interface AIServiceInterface {
  generateText(prompt: string, options?: AIServiceOptions): Promise<string>;
  classifyText(text: string): Promise<Array<{ label: string; score: number }>>;
  generateImage?(prompt: string, size?: string): Promise<string>;
  getConfidenceScore(contentType: string): number;
  addTrainingExamples(contentType: string, examples: any[]): number;
  generateFlashcards(topic: string, count?: number, difficulty?: string): Promise<any[]>;
  generateQuestions(content: string, count?: number, type?: string): Promise<any[]>;
  abortRequest(requestId: string): void;
  abortAllRequests(): void;
}

export interface AISetupWizardProps {
  onComplete: (preferences: AIPreference) => void;
  initialPreference?: AIPreference;
}
