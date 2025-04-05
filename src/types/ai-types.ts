
// Basic AI-related types
export type ItalianLevel = 'beginner' | 'intermediate' | 'advanced';

export type ItalianTestSection = 
  | 'grammar' 
  | 'vocabulary' 
  | 'reading' 
  | 'writing' 
  | 'speaking' 
  | 'listening' 
  | 'culture' 
  | 'citizenship';

export interface AIQuestion {
  id: string;
  text: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  type: string;
  difficulty: ItalianLevel;
  isCitizenshipRelevant: boolean;
}

export interface AIGeneratedQuestion extends AIQuestion {
  questionType: 'multiple-choice' | 'fill-in' | 'true-false' | 'matching';
}

export interface ItalianQuestionGenerationParams {
  contentTypes: ItalianTestSection[];
  difficulty: string;
  count: number;
  isCitizenshipFocused?: boolean;
  topics?: string[];
}

export interface QuestionGenerationParams {
  contentTypes: ItalianTestSection[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  count: number;
  isCitizenshipFocused?: boolean;
  topics: string[];
}

export interface VoiceOptions {
  language?: string;
  voiceURI?: string;
  pitch?: number;
  rate?: number;
  volume?: number;
}

export type TTSOptions = VoiceOptions | string;

export interface VoicePreference {
  voiceRate: number;
  voicePitch: number;
  italianVoiceURI?: string;
  englishVoiceURI?: string;
}

export interface AIProcessingOptions {
  format?: 'json' | 'text' | 'html';
  model?: string;
  language?: string;
  detailed?: boolean;
  maxTokens?: number;
}

export interface AIUtilsContextType {
  processContent: (content: string, options?: AIProcessingOptions) => Promise<any>;
  generateQuestions: (params: QuestionGenerationParams) => Promise<AIGeneratedQuestion[]>;
  analyzeGrammar: (text: string) => Promise<any>;
  translateText: (text: string, targetLanguage: string) => Promise<string>;
  speak: (text: string, options?: TTSOptions) => Promise<void>;
  transcribeSpeech: (audioData: Blob) => Promise<{ text: string; confidence: number }>;
  compareTexts: (userText: string, targetText: string) => Promise<number>;
  isProcessing: boolean;
  isAIEnabled?: boolean;
  loadModel?: (modelName?: string) => Promise<boolean>;
  status?: {
    isModelLoaded: boolean;
    isInitialized: boolean;
    error: string | null;
  };
  settings?: AISettings;
  generateText?: (prompt: string) => Promise<string>;
  classifyText?: (text: string) => Promise<any>;
  speakText?: (text: string, options?: VoiceOptions) => Promise<void>;
  remainingCredits?: number;
  isGenerating?: boolean;
}

export interface UseAIReturn {
  processContent: (content: string, options?: AIProcessingOptions) => Promise<any>;
  generateQuestions: (params: QuestionGenerationParams) => Promise<AIGeneratedQuestion[]>;
  analyzeGrammar: (text: string) => Promise<any>;
  translateText: (text: string, targetLanguage: string) => Promise<string>;
  speak: (text: string, options?: TTSOptions) => Promise<void>;
  transcribeSpeech: (audioData: Blob) => Promise<{ text: string; confidence: number }>;
  compareTexts: (userText: string, targetText: string) => Promise<number>;
  isProcessing: boolean;
  isAIEnabled: boolean;
}
