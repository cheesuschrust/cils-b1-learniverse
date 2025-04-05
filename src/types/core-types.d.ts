
// Core Italian language types
export type ItalianLevel = "beginner" | "intermediate" | "advanced";
export type ItalianTestSection = "grammar" | "vocabulary" | "culture" | "listening" | "reading" | "writing" | "speaking" | "citizenship";

// AI types
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

export interface TextToSpeechOptions {
  text: string;
  voice?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
}

export interface AIProcessingOptions {
  maxTokens?: number;
  temperature?: number;
  modelType?: string;
  language?: "english" | "italian" | "both";
}

export interface QuestionGenerationParams {
  topics: string[];
  contentTypes: ItalianTestSection[];
  difficulty: ItalianLevel;
  count: number;
  isCitizenshipFocused?: boolean;
  testSection?: ItalianTestSection;
  italianLevel?: ItalianLevel;
}

export interface ItalianQuestionGenerationParams extends QuestionGenerationParams {
  topics: string[];
  contentTypes: ItalianTestSection[];
  difficulty: ItalianLevel;
  count: number;
  isCitizenshipFocused?: boolean;
}

export interface AISettings {
  language?: "english" | "italian" | "both";
  difficulty?: ItalianLevel;
  contentTypes?: ItalianTestSection[];
  focusAreas?: string[];
  modelSize?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  showFeedback?: boolean;
}

export interface VoiceOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voiceURI?: string;
}

export interface AIServiceOptions {
  temperature?: number;
  maxTokens?: number;
  modelType?: string;
  language?: "english" | "italian" | "both";
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

// Export utility functions
export const utils = {
  normalizeUser: null,
  normalizeUserRecords: null,
  normalizeFlashcard: null,
  convertLegacyUser: null,
  normalizeFields: null,
  calculateReviewPerformance: null,
  isValidDate: null
};
