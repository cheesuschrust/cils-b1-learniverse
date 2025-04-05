
export type ItalianTestSection = 
  | 'reading'
  | 'writing'
  | 'speaking'
  | 'listening'
  | 'grammar'
  | 'vocabulary'
  | 'culture'
  | 'citizenship';

export type ItalianLevel = 
  | 'beginner' 
  | 'elementary' 
  | 'pre-intermediate' 
  | 'intermediate' 
  | 'upper-intermediate' 
  | 'advanced'
  | 'B1';

export interface AIQuestion {
  id: string;
  text: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  type: ItalianTestSection;
  difficulty: ItalianLevel;
  questionType?: string;
  isCitizenshipRelevant: boolean;
}

export interface AIGeneratedQuestion extends AIQuestion {
  score?: number;
  userAnswer?: string;
  isCorrect?: boolean;
  attempts?: number;
  timeSpent?: number;
  question?: string;
}

export interface ItalianQuestionGenerationParams {
  contentTypes: ItalianTestSection[];
  difficulty: ItalianLevel;
  count: number;
  isCitizenshipFocused?: boolean;
  topics?: string[];
}

export interface QuestionGenerationParams extends ItalianQuestionGenerationParams {
  topics: string[];
}

export interface VoiceOptions {
  language?: string;
  voice?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  text?: string;
}

export type TextToSpeechOptions = VoiceOptions | string;

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

export interface AIProcessingOptions {
  language?: string;
  difficulty?: string;
  focusAreas?: string[];
  feedback?: boolean;
  detailed?: boolean;
  format?: string;
}

export interface AIModelStatus {
  isModelLoaded: boolean;
  isInitialized: boolean;
  error: string;
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
  status?: AIModelStatus | string;
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
  analyzeContent?: (content: string, options?: any) => Promise<any>;
}

export interface UseAIReturn extends AIUtilsContextType {
  generateText?: (prompt: string) => Promise<string>;
}
