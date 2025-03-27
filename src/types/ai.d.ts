
/**
 * AI service interfaces and types
 */

export type AIStatus = 'idle' | 'loading' | 'ready' | 'error';
export type AIModel = 'small' | 'medium' | 'large';
export type AILanguage = 'english' | 'italian' | 'auto';

export interface AIPreference {
  enabled: boolean;
  modelSize: AIModel;
  defaultModelSize?: AIModel;
  useWebGPU?: boolean;
  cacheResponses: boolean;
  defaultLanguage?: AILanguage;
  voiceEnabled: boolean;
  voiceRate?: number;
  voicePitch?: number;
  italianVoiceURI?: string;
  englishVoiceURI?: string;
  anonymousAnalytics?: boolean;
}

export interface AIFeedback {
  exercise: string;
  type: string;
  input: string;
  correction: string;
  explanation: string;
  confidence: number;
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
