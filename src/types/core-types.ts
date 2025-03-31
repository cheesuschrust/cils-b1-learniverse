
import { ReactNode } from 'react';
import { ContentType } from './contentType';
import { Flashcard } from './interface-fixes';
import { ItalianLevel, ItalianTestSection } from './italian-types';

// Re-export types from other modules
export { ContentType } from './contentType';
export type { Flashcard } from './interface-fixes';
export { ItalianLevel, ItalianTestSection } from './italian-types';

// AI Generation Types
export interface QuestionGenerationParams {
  contentType?: ContentType;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  count?: number;
  topic?: string;
  language?: 'english' | 'italian';
  includeExplanations?: boolean;
  focusArea?: string;
  targetLevel?: ItalianLevel;
  withCitizenship?: boolean;
  testSection?: ItalianTestSection;
}

export interface AIGeneratedQuestion {
  id: string;
  text: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  type: ItalianTestSection;
  difficulty: ItalianLevel;
  isCitizenshipRelevant?: boolean;
}

export interface AIGenerationResult {
  questions: AIGeneratedQuestion[];
  error?: string;
}

// AI Service Types
export interface AIServiceOptions {
  temperature?: number;
  maxTokens?: number;
  model?: string;
  contextId?: string;
  systemPrompt?: string;
  stopSequences?: string[];
}

export interface UseAIReturn {
  generateText: (prompt: string, options?: AIServiceOptions) => Promise<string>;
  getConfidenceScore: (text: string, contentType: string) => Promise<number>;
  isLoading: boolean;
  error: Error | null;
  abort: () => void;
}

// AI Utils Context Type
export interface AISettings {
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  specificPrompts: Record<string, string>;
  systemPrompt: string;
}

export interface AIUtilsContextType {
  processContent: (content: string, type: ContentType) => Promise<any>;
  settings: AISettings;
  updateSettings: (settings: Partial<AISettings>) => void;
  generateContent: (prompt: string, type: ContentType) => Promise<string>;
  isSpeaking: boolean;
  processAudioStream: (audioStream: MediaStream) => Promise<string>;
  speakText: (text: string, language: 'english' | 'italian') => Promise<void>;
  stopSpeaking: () => void;
  isProcessing: boolean;
  error: Error | null;
  transcribeAudio: (audioBlob: Blob) => Promise<string>;
  translateText: (text: string, from: 'en' | 'it', to: 'en' | 'it') => Promise<string>;
  generateQuestions: (params: QuestionGenerationParams) => Promise<AIGenerationResult>;
  suggestLearningPath: (history: any[], level: ItalianLevel) => Promise<any>;
  isGenerating: boolean;
  remainingCredits: number;
  usageLimit: number;
  summarizeContent: (content: string, targetLength: number) => Promise<string>;
  evaluateProgress: (submissions: any[], targetLevel: ItalianLevel) => Promise<any>;
}

// Flashcard Normalization
export const normalizeFlashcard = (flashcard: any): Flashcard => {
  return {
    id: flashcard.id || '',
    front: flashcard.front || flashcard.italian || '',
    back: flashcard.back || flashcard.english || '',
    italian: flashcard.italian || flashcard.front || '',
    english: flashcard.english || flashcard.back || '',
    level: typeof flashcard.level === 'number' ? flashcard.level : 1,
    difficulty: typeof flashcard.difficulty === 'number' 
      ? flashcard.difficulty 
      : typeof flashcard.difficulty === 'string'
        ? flashcard.difficulty
        : 'beginner',
    lastReviewed: flashcard.lastReviewed || null,
    nextReview: flashcard.nextReview || new Date(Date.now() + 24 * 60 * 60 * 1000),
    createdAt: flashcard.createdAt || new Date(),
    updatedAt: flashcard.updatedAt || new Date(),
    tags: Array.isArray(flashcard.tags) ? flashcard.tags : [],
    mastered: flashcard.mastered || false,
    explanation: flashcard.explanation || ''
  };
};

// SEO Types
export interface PageSEOProps {
  title: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  structuredData?: Record<string, any> | string;
  noIndex?: boolean;
  children?: ReactNode;
}

// Error handling extensions
export type ExtendedAlertVariant = 
  | "default"
  | "destructive"
  | "success"
  | "warning"
  | "outline"
  | "secondary"
  | "info";
