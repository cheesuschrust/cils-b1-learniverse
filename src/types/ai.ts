
import { ContentType } from '@/types/contentType';

export type AIModelSize = 'small' | 'medium' | 'large';
export type ConfidenceLevel = 'low' | 'medium' | 'high';
export type ContentType = 'grammar' | 'vocabulary' | 'culture' | 'listening' | 'reading' | 'writing' | 'speaking';
export type ItalianLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface AIQuestion {
  id: string;
  text: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  type: ContentType;
  difficulty: string;
  questionType?: 'multiple-choice' | 'fill-in-blank' | 'true-false' | 'short-answer' | 'matching';
  isCitizenshipRelevant?: boolean;
}

export interface AIGeneratedQuestion extends AIQuestion {
  questionType: 'multiple-choice' | 'fill-in-blank' | 'true-false' | 'short-answer' | 'matching';
}

export interface AIGenerationResult {
  questions: AIQuestion[];
  error?: string;
}

export interface QuestionGenerationParams {
  contentTypes: ContentType[];
  difficulty: string;
  count: number;
  topics: string[];
  isCitizenshipFocused?: boolean;
}

export interface ItalianQuestionGenerationParams {
  contentTypes: ContentType[] | ItalianTestSection[];
  difficulty: string;
  count: number;
  topics?: string[];
  isCitizenshipFocused?: boolean;
}

export interface AIProcessingOptions {
  language?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  level?: string;
}

export interface TTSOptions {
  voice?: string;
  language?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export interface VoiceOptions {
  voice?: string;
  language?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export interface AIGenerationOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  language?: string;
}

export interface VoicePreference {
  voiceEnabled: boolean;
  autoPlay: boolean;
  voiceRate: number;
  voicePitch: number;
  englishVoiceURI?: string;
  italianVoiceURI?: string;
}

export interface AIContentProcessorProps {
  contentType: ContentType;
  onQuestionsGenerated: (generatedQuestions: AIQuestion[]) => void;
  isLoading?: boolean;
  content?: string;
}

export interface AIUtilsContextType {
  generateQuestions: (params: QuestionGenerationParams) => Promise<AIGenerationResult>;
  processContent: (content: string, options?: AIProcessingOptions) => Promise<any>;
  analyzeGrammar: (text: string, language?: string) => Promise<any>;
  translateText: (text: string, targetLanguage?: string) => Promise<any>;
  generateText: (prompt: string, options?: any) => Promise<any>;
  evaluateWriting: (text: string, level?: string) => Promise<any>;
  isGenerating?: boolean;
  isProcessing: boolean;
  remainingCredits?: number;
  usageLimit?: number;
  isAIEnabled?: boolean;
  speak?: (text: string, options?: any) => Promise<void>;
  isSpeaking?: boolean;
  status?: string;
  isModelLoaded?: boolean;
  compareTexts?: (text1: string, text2: string) => Promise<{ similarity: number, differences: string[] }>;
  loadModel?: () => Promise<void>;
  classifyText?: (text: string, categories: string[]) => Promise<{ category: string, confidence: number }>;
  transcribeSpeech?: (audioData: Blob) => Promise<{ text: string, confidence: number }>;
  processAudioStream?: (stream: MediaStream) => Promise<void>;
  stopAudioProcessing?: () => void;
  isTranscribing?: boolean;
  hasActiveMicrophone?: boolean;
  checkMicrophoneAccess?: () => Promise<boolean>;
  generateContent?: (prompt: string, options?: any) => Promise<any>;
  analyzeContent?: (content: string, contentType: string) => Promise<any>;
}

// Initialize default confidence scores for content types
export const getInitialConfidenceScores = (): Record<ContentType, number> => {
  return {
    'grammar': 78,
    'vocabulary': 82,
    'writing': 69,
    'speaking': 74,
    'listening': 65,
    'reading': 70,
    'culture': 75
  };
};

// Get user-friendly labels for content types
export const getContentTypeLabels = (): Record<ContentType, string> => {
  return {
    'grammar': 'Grammar',
    'vocabulary': 'Vocabulary',
    'writing': 'Writing',
    'speaking': 'Speaking',
    'listening': 'Listening',
    'reading': 'Reading',
    'culture': 'Culture'
  };
};

// Get content types that should be displayed in the UI
export const getDisplayableContentTypes = (): ContentType[] => {
  return ['grammar', 'vocabulary', 'writing', 'speaking', 'listening', 'reading', 'culture'];
};
