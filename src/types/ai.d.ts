
import { ItalianLevel, ItalianTestSection } from './core-types';

export interface AIPreferences {
  enabled: boolean;
  modelSize: string;
  useLocalModel: boolean;
  voiceEnabled: boolean;
  autoTranslate: boolean;
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  capabilities: string[];
  sizeInMB: number;
  isLocallyAvailable: boolean;
}

export interface AISettings {
  model: string;
  temperature: number;
  maxTokens: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  showFeedback?: boolean;
  language?: string;
  difficulty?: string;
  contentTypes?: string[];
  focusAreas?: string[];
  modelSize?: string;
  processingOnDevice?: boolean;
  autoSpeakCorrections?: boolean;
  voiceEnabled?: boolean;
  voiceRate?: number;
  voicePitch?: number;
  confidenceThreshold?: number;
  enabled?: boolean;
  features?: {
    grammarCorrection: boolean;
    pronunciationFeedback: boolean;
    vocabularySuggestions: boolean;
    culturalContext: boolean;
    contentGeneration: boolean;
    errorCorrection: boolean;
    pronunciationHelp: boolean;
    personalization: boolean;
  };
  assistantName?: string;
}

export interface AIServiceOptions {
  temperature?: number;
  maxTokens?: number;
  modelType?: string;
  language?: "english" | "italian" | "both";
}

export interface AIProcessingOptions {
  maxTokens?: number;
  temperature?: number;
  modelType?: string;
  language?: "english" | "italian" | "both";
}

export interface UseAIReturn {
  processContent: (content: string, options?: AIProcessingOptions) => Promise<any>;
  generateQuestions: (params: any) => Promise<any>;
  analyzeGrammar: (text: string, language?: string) => Promise<any>;
  translateText: (text: string, targetLanguage?: string) => Promise<string>;
  generateText: (prompt: string, options?: AIServiceOptions) => Promise<string>;
  evaluateWriting: (text: string, level?: string) => Promise<any>;
  recognizeSpeech: (audioData: Blob) => Promise<{text: string, confidence: number}>;
  isProcessing: boolean;
  speak?: (options: string | TextToSpeechOptions) => Promise<void>;
  isAIEnabled?: boolean;
  compareTexts?: (text1: string, text2: string) => Promise<number>;
  transcribeSpeech?: (audio: Blob) => Promise<string>;
  classifyText?: (text: string) => Promise<any>;
  loadModel?: () => Promise<boolean>;
  isModelLoaded?: boolean;
  status?: any;
  isGenerating?: boolean;
  remainingCredits?: number;
  usageLimit?: number;
  isSpeaking?: boolean;
}

export interface AIModelSize {
  name: string;
  size: number;
  capabilities: string[];
  recommended: boolean;
}

export interface AIStatus {
  loaded: boolean;
  loading: boolean;
  error: string | null;
  modelSize: string;
  lastUpdated: Date;
}

export interface AIFeedbackSettings {
  detailed: boolean;
  suggestions: boolean;
  examples: boolean;
  language: 'english' | 'italian' | 'both';
}

export type ContentType = 
  | 'grammar' 
  | 'vocabulary' 
  | 'culture' 
  | 'listening' 
  | 'reading' 
  | 'writing' 
  | 'speaking'
  | 'multiple-choice'
  | 'flashcards'
  | 'pdf'
  | 'document'
  | 'video'
  | 'audio'
  | 'image'
  | 'unknown';

export type QuestionGenerationParams = {
  topics: string[];
  contentTypes: ItalianTestSection[];
  difficulty: ItalianLevel;
  count: number;
  isCitizenshipFocused?: boolean;
};

export interface TextToSpeechOptions {
  text: string;
  voice?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
}
