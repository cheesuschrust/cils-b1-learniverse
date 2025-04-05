
import { ReactNode } from 'react';

// Core AI types
export interface AIOptions {
  model: string;
  temperature: number;
  maxTokens: number;
  showFeedback?: boolean;
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

export interface AIModelSize {
  name: string;
  size: number;
  capabilities: string[];
  recommended: boolean;
}

export interface AIProcessingOptions {
  maxTokens?: number;
  temperature?: number;
  modelType?: string;
  language?: "english" | "italian" | "both";
}

export interface AIServiceOptions {
  temperature?: number;
  maxTokens?: number;
  modelType?: string;
  language?: "english" | "italian" | "both";
}

export type ItalianLevel = 
  | 'beginner' 
  | 'elementary' 
  | 'pre-intermediate' 
  | 'intermediate' 
  | 'upper-intermediate' 
  | 'advanced'
  | 'B1';

export type ItalianTestSection = 
  | 'reading'
  | 'writing'
  | 'speaking'
  | 'listening'
  | 'grammar'
  | 'vocabulary'
  | 'culture'
  | 'citizenship';

export interface AIGeneratedQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  type: ItalianTestSection;
  difficulty: ItalianLevel;
  questionType: string;
  isCitizenshipRelevant: boolean;
}

export interface QuestionGenerationParams {
  topics: string[];
  contentTypes: ItalianTestSection[];
  difficulty: ItalianLevel;
  count: number;
  isCitizenshipFocused?: boolean;
}

export interface ItalianQuestionGenerationParams {
  topics?: string[];
  contentTypes: ItalianTestSection[];
  difficulty: ItalianLevel;
  count: number;
  isCitizenshipFocused?: boolean;
}

export interface TextToSpeechOptions {
  text: string;
  voice?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
}

export interface VoiceOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voiceURI?: string;
  language?: string;
  voice?: string;
  text?: string;
}

export interface VoicePreference {
  language: string;
  voiceURI?: string;
  englishVoiceURI?: string;
  italianVoiceURI?: string;
  rate?: number;
  voiceRate?: number;
  pitch?: number;
  voicePitch?: number;
  volume?: number;
}

export interface SpeechState {
  speaking: boolean;
  paused: boolean;
  voice: SpeechSynthesisVoice | null;
  text: string;
}

export interface AIUtilsContextType {
  processContent: (content: string, options?: AIProcessingOptions) => Promise<any>;
  generateQuestions: (params: QuestionGenerationParams) => Promise<AIGeneratedQuestion[]>;
  analyzeGrammar: (text: string) => Promise<any>;
  translateText: (text: string, targetLanguage: string) => Promise<string>;
  compareTexts?: (userText: string, targetText: string) => Promise<number>;
  loadModel?: (modelName?: string) => Promise<boolean>;
  classifyText?: (text: string, categories?: string[]) => Promise<any>;
  speak?: (text: string | VoiceOptions, options?: any) => Promise<void>;
  transcribeSpeech?: (audioData: Blob) => Promise<{ text: string; confidence: number }>;
  isProcessing: boolean;
  isAIEnabled?: boolean;
  status?: AIStatus | string;
  isModelLoaded?: boolean;
  generateContent?: (prompt: string, options?: any) => Promise<string>;
  isSpeaking?: boolean;
  processAudioStream?: (audioStream: MediaStream) => Promise<void>;
  stopAudioProcessing?: () => void;
  isTranscribing?: boolean;
  hasActiveMicrophone?: boolean;
  checkMicrophoneAccess?: () => Promise<boolean>;
  isGenerating?: boolean;
  remainingCredits?: number;
  generateText?: (prompt: string) => Promise<string>;
  evaluateWriting?: (text: string, level?: string) => Promise<any>;
  getConfidenceScore?: (text: string) => Promise<number>;
  analyzeContent?: (content: string, options?: any) => Promise<any>;
  settings?: AISettings;
  speakText?: (text: string | TextToSpeechOptions) => Promise<void>;
}

export interface UseAIReturn extends AIUtilsContextType {
  generateText?: (prompt: string) => Promise<string>;
  recognizeSpeech?: (audioData: Blob) => Promise<{text: string; confidence: number}>;
}

export interface AISettings {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  showFeedback?: boolean;
  modelSize?: string;
  processingOnDevice?: boolean;
  autoSpeakCorrections?: boolean;
  voiceEnabled?: boolean;
  voiceRate?: number;
  voicePitch?: number;
  confidenceThreshold?: number;
  enabled?: boolean;
  defaultModelSize?: string;
  useWebGPU?: boolean;
  dataCollection?: boolean;
  assistanceLevel?: number;
  autoLoadModels?: boolean;
  cacheModels?: boolean;
  processingSetting?: string;
  optimizationLevel?: number;
  anonymousAnalytics?: boolean;
  contentFiltering?: boolean;
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
  language?: string;
  difficulty?: string;
  contentTypes?: string[];
  focusAreas?: string[];
  assistantName?: string;
}

export type ContentType = 
  | 'grammar' 
  | 'vocabulary' 
  | 'reading' 
  | 'writing' 
  | 'speaking' 
  | 'listening' 
  | 'culture' 
  | 'citizenship'
  | 'multiple-choice'
  | 'flashcards'
  | 'pdf'
  | 'document'
  | 'video'
  | 'audio'
  | 'image'
  | 'unknown';

export interface ContentFeatures {
  supportsAudio: boolean;
  supportsVideo: boolean;
  supportsInteractive: boolean;
  requiresInternet: boolean;
  isDownloadable: boolean;
  level: string;
  wordCount?: number; 
  sentenceCount?: number;
  questionMarks?: number;
  avgSentenceLength?: number;
  paragraphCount?: number;
  language?: string;
}

export interface AISpeechOptions {
  voice?: SpeechSynthesisVoice;
  rate?: number;
  pitch?: number;
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: any) => void;
  text: string;
}

export interface AIServiceInterface {
  processContent: (content: string, options?: AIProcessingOptions) => Promise<any>;
  evaluateResponse: (response: string, expectedAnswer: string) => Promise<number>;
  translateText: (text: string, sourceLang?: string, targetLang?: string) => Promise<string>;
  getLanguageLevel: (text: string) => Promise<ItalianLevel>;
  correctGrammar: (text: string, language?: string) => Promise<string>;
  generateQuestions: (params: QuestionGenerationParams) => Promise<AIGeneratedQuestion[]>;
  processSpokenInput: (audioData: Blob) => Promise<{ text: string; confidence: number }>;
  isProcessing: boolean;
  loadModel?: () => Promise<boolean>;
  isModelLoaded?: boolean;
  status?: any;
}
