
/**
 * AI model size options
 */
export type AIModelSize = 'small' | 'medium' | 'large';

/**
 * AI status information
 */
export interface AIStatus {
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  modelSize: AIModelSize;
  availableModels: string[];
}

/**
 * AI model configuration
 */
export interface AIModel {
  name: string;
  version: string;
  size: AIModelSize;
  capabilities: string[];
  languages: string[];
  tokenLimit: number;
}

/**
 * AI configuration options
 */
export interface AIOptions {
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  stopSequences?: string[];
}

/**
 * AI feedback settings
 */
export interface AIFeedbackSettings {
  showConfidence: boolean;
  detailedFeedback: boolean;
  highlightErrors: boolean;
  suggestImprovements: boolean;
}

/**
 * AI user preferences
 */
export interface AIPreferences {
  defaultModel: string;
  languagePreference: 'english' | 'italian' | 'both';
  voiceEnabled: boolean;
  autoTranslate: boolean;
  feedbackLevel: 'basic' | 'detailed' | 'expert';
}

/**
 * AI service configuration options
 */
export type AIServiceOptions = {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  includeTokenCount?: boolean;
  language?: 'italian' | 'english' | 'both';
};

/**
 * AI content processing options
 */
export interface AIProcessingOptions {
  type?: string;
  level?: string;
  category?: string;
  context?: string;
  includeConfidence?: boolean;
}

/**
 * AI service interface
 */
export interface AIServiceInterface {
  processContent: (content: string, options?: AIProcessingOptions) => Promise<any>;
  generateQuestions: (params: any) => Promise<any>;
  evaluateResponse: (response: string, expectedAnswer: string, options?: any) => Promise<any>;
  translateText: (text: string, targetLanguage: string) => Promise<string>;
  getLanguageLevel: (text: string) => Promise<string>;
  correctGrammar: (text: string) => Promise<{corrected: string, explanation: string}>;
  generateText: (prompt: string, options?: AIServiceOptions) => Promise<string>;
}

/**
 * Hook return type for using AI services
 */
export interface UseAIReturn {
  processContent: (content: string, options?: AIProcessingOptions) => Promise<any>;
  generateQuestions: (params: any) => Promise<any>;
  evaluateResponse: (response: string, expectedAnswer: string, options?: any) => Promise<any>;
  translateText: (text: string, targetLanguage: string) => Promise<string>;
  getLanguageLevel: (text: string) => Promise<string>;
  correctGrammar: (text: string) => Promise<{corrected: string, explanation: string}>;
  speak: (text: string, options?: any) => Promise<void>;
  isAIEnabled: boolean;
  isProcessing: boolean;
  compareTexts: (text1: string, text2: string) => Promise<{similarity: number, differences: string[]}>;
  classifyText: (text: string, categories: string[]) => Promise<{category: string, confidence: number}>;
  generateText: (prompt: string, options?: AIServiceOptions) => Promise<string>;
  transcribeSpeech: (audioData: Blob) => Promise<{text: string, confidence: number}>;
}
