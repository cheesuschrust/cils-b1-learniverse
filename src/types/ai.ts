
import { User } from './user';

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
  questionType: 'multiple-choice' | 'fill-in-blank' | 'true-false' | 'short-answer' | 'matching';
  isCitizenshipRelevant: boolean;
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
  topics?: string[];
  isCitizenshipFocused?: boolean;
}

export interface ItalianQuestionGenerationParams {
  contentTypes: ContentType[];
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
}

export interface AISettings {
  enabled: boolean;
  modelSize: AIModelSize;
  processingOnDevice: boolean;
  autoSpeakCorrections: boolean;
  voiceEnabled: boolean;
  voiceRate: number;
  voicePitch: number;
  confidenceThreshold: number;
  features: {
    grammarCorrection: boolean;
    pronunciationFeedback: boolean;
    vocabularySuggestions: boolean;
    culturalContext: boolean;
  }
}

export interface AISettingsContextType {
  settings: AISettings;
  updateSettings: (settings: Partial<AISettings>) => void;
  isLoading: boolean;
}

export interface AIUtilsContextType {
  generateQuestions: (params: QuestionGenerationParams) => Promise<AIGenerationResult>;
  processContent: (content: string, options?: AIProcessingOptions) => Promise<any>;
  analyzeGrammar: (text: string, language?: string) => Promise<any>;
  translateText: (text: string, targetLanguage?: string) => Promise<any>;
  generateText: (prompt: string, options?: any) => Promise<any>;
  evaluateWriting: (text: string, level?: string) => Promise<any>;
  isGenerating: boolean;
  remainingCredits: number;
  usageLimit: number;
  isAIEnabled: boolean;
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
}

export interface UseAIReturn {
  processContent: (content: string, options?: AIProcessingOptions) => Promise<any>;
  generateQuestions: (params: ItalianQuestionGenerationParams) => Promise<AIGeneratedQuestion[]>;
  analyzeGrammar: (text: string, language?: string) => Promise<any>;
  translateText: (text: string, targetLanguage?: string) => Promise<any>;
  generateText: (prompt: string, options?: any) => Promise<any>;
  evaluateWriting: (text: string, level?: string) => Promise<any>;
  lastResult: any;
  isProcessing: boolean;
  speak?: (text: string, options?: any) => Promise<void>;
  isAIEnabled: boolean;
  status?: string;
  isModelLoaded?: boolean;
  compareTexts?: (text1: string, text2: string) => Promise<{ similarity: number, differences: string[] }>;
  loadModel?: () => Promise<void>;
  classifyText?: (text: string, categories: string[]) => Promise<{ category: string, confidence: number }>;
  transcribeSpeech?: (audioData: Blob) => Promise<{ text: string, confidence: number }>;
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
  englishVoiceURI: string;
  italianVoiceURI: string;
}

export interface AIContentProcessorProps {
  contentType: ContentType;
  onQuestionsGenerated: (generatedQuestions: AIQuestion[]) => void;
  isLoading?: boolean;
  content?: string;
}
