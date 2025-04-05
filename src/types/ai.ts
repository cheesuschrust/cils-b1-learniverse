
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
  isModelLoaded?: boolean;
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
  enabled?: boolean;
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
  maxLength?: number;
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
  language?: 'english' | 'italian' | 'both';
  contentType?: string;
}

/**
 * Extended AI settings
 */
export interface AISettings {
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  showFeedback?: boolean;
  features?: string[];
  language?: string;
  difficulty?: string;
  contentTypes?: string[];
  focusAreas?: string[];
  assistantName?: string;
  modelSize?: string;
  voiceRate?: number;
  voicePitch?: number;
}

export interface AISettingsProps {
  initialSettings?: AISettings;
  onSettingsChange?: (settings: AISettings) => void;
  onClose?: () => void;
  onSave?: () => void;
  onReset?: () => void;
  availableModels?: string[];
  isLoading?: boolean;
}

/**
 * Question generation parameters
 */
export interface QuestionGenerationParams {
  topics: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  count: number;
  contentTypes: string[];
  isCitizenshipFocused?: boolean;
}

/**
 * AI content settings
 */
export interface AIContentSettings {
  language: string;
  difficulty: string;
  contentTypes: string[];
  focusAreas: string[];
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
  classifyText?: (text: string, categories: string[]) => Promise<{category: string, confidence: number}>;
  generateFlashcards?: (content: string, options?: any) => Promise<any>;
  processDocument?: (document: string | File, options?: any) => Promise<any>;
  generateSpeech?: (text: string, options?: any) => Promise<any>;
  recognizeSpeech?: (audio: Blob) => Promise<any>;
  comparePronunciation?: (spoken: string, expected: string) => Promise<any>;
  analyzeGrammar?: (text: string, language?: string) => Promise<any>;
  abortRequest?: () => void;
}

/**
 * Hook return type for using AI services
 */
export interface UseAIReturn {
  processContent: (content: string, options?: AIProcessingOptions) => Promise<any>;
  generateQuestions: (params: any) => Promise<any>;
  evaluateResponse?: (response: string, expectedAnswer: string, options?: any) => Promise<any>;
  translateText?: (text: string, targetLanguage: string) => Promise<string>;
  getLanguageLevel?: (text: string) => Promise<string>;
  correctGrammar?: (text: string) => Promise<{corrected: string, explanation: string}>;
  speak?: (text: string, options?: any) => Promise<void>;
  isAIEnabled?: boolean;
  isProcessing: boolean;
  compareTexts?: (text1: string, text2: string) => Promise<{similarity: number, differences: string[]}>;
  classifyText?: (text: string, categories: string[]) => Promise<{category: string, confidence: number}>;
  generateText?: (prompt: string, options?: AIServiceOptions) => Promise<string>;
  transcribeSpeech?: (audioData: Blob) => Promise<{text: string, confidence: number}>;
  status?: AIStatus;
  isModelLoaded?: boolean;
  isSpeaking?: boolean;
  processAudioStream?: (options?: any) => Promise<any>;
  stopAudioProcessing?: () => void;
  isTranscribing?: boolean;
  hasActiveMicrophone?: boolean;
  checkMicrophoneAccess?: () => Promise<boolean>;
  analyzeGrammar?: (text: string, language?: string) => Promise<any>;
  loadModel?: () => Promise<void>;
  getConfidenceScore?: (text: string, expected: string) => Promise<number>;
}

/**
 * AI generation result
 */
export interface AIGenerationResult {
  questions: any[];
  error?: string;
}

/**
 * AI utils context type
 */
export interface AIUtilsContextType {
  generateQuestions: (params: QuestionGenerationParams) => Promise<AIGenerationResult>;
  generateContent?: (prompt: string, options?: any) => Promise<string>;
  isGenerating: boolean;
  remainingCredits: number;
  usageLimit: number;
  analyzeContent?: (content: any) => Promise<any>;
}

/**
 * AI Question interface
 */
export interface AIQuestion {
  id: string;
  text: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  type: string;
  difficulty: string;
  questionType: string;
  isCitizenshipRelevant: boolean;
  question?: string;
}

export type AIGeneratedQuestion = AIQuestion;
