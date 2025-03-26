import { ContentType } from './contentType';

export interface UseAIReturn {
  generateText: (prompt: string, options?: any) => Promise<string>;
  getConfidenceScore?: (contentType: ContentType) => Promise<number>;
  translateText?: (text: string, targetLang: 'english' | 'italian') => Promise<string>;
  checkGrammar?: (text: string, lang: 'english' | 'italian') => Promise<{text: string, corrections: any[]}>;
  isLoading?: boolean;
  error?: Error | null;
  abort?: () => void;
  generateFlashcards?: (topic: string, count?: number, difficulty?: string) => Promise<any[]>;
  isProcessing?: boolean;
  classifyText?: (text: string) => Promise<any[]>;
  generateQuestions?: (content: string, contentType?: ContentType, count?: number, difficulty?: string) => Promise<any[]>;
  isModelLoaded?: boolean;
  status?: string;
  loadModel?: (modelName: string) => Promise<boolean>;
  prepareModel?: () => Promise<boolean>;
  confidence?: number;
  lastProcessedAt?: Date | null;
  isCacheEnabled?: boolean;
  isEnabled?: boolean;
  toggleAI?: () => boolean;
}

// Add other interface fixes as needed
