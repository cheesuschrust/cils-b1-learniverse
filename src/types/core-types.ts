
// Re-export all types and utilities from the specialized modules
// Import needed utilities and types
export { isValidDate } from './voice';
export { normalizeFields } from './utils';

// Export specific types from the specialized modules
export type {
  VoicePreference,
  TextToSpeechOptions,
  VoiceOptions,
  SpeechState
} from './voice';

export type {
  AIOptions,
  AIModel,
  AIStatus,
  AIFeedbackSettings,
  AIModelSize,
  AIProcessingOptions,
  QuestionGenerationParams
} from './ai';

export type {
  User,
  UserSettings,
  UserPerformance,
  UserRole,
  LegacyFields
} from './user-types';

export {
  normalizeUser,
  normalizeUserRecords,
  convertLegacyUser
} from './user-types';

export type {
  ReviewPerformance,
  ReviewHistory,
  FlashcardMetadata,
  Flashcard
} from './flashcard-types';

export {
  calculateReviewPerformance,
  normalizeFlashcard
} from './flashcard-types';

export interface AIGeneratedQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  type: string;
  difficulty: string;
  questionType: string;
  isCitizenshipRelevant: boolean;
}

export type ItalianLevel = 'beginner' | 'intermediate' | 'advanced';
export type ItalianTestSection = 'reading' | 'writing' | 'listening' | 'speaking' | 'grammar' | 'vocabulary' | 'culture' | 'citizenship';

export interface ItalianQuestionGenerationParams extends QuestionGenerationParams {
  topics: string[];
  contentTypes: ItalianTestSection[];
  difficulty: ItalianLevel;
  count: number;
  isCitizenshipFocused?: boolean;
}

export interface UseAIReturn {
  processContent: (content: string, options?: AIProcessingOptions) => Promise<{label: string, score: number}[]>;
  generateQuestions: (params: ItalianQuestionGenerationParams) => Promise<AIGeneratedQuestion[]>;
  analyzeGrammar: (text: string, language?: string) => Promise<any>;
  translateText: (text: string, targetLanguage?: string) => Promise<string>;
  generateText: (prompt: string, options?: AIServiceOptions) => Promise<string>;
  evaluateWriting: (text: string, level?: string) => Promise<any>;
  recognizeSpeech: (audioData: Blob) => Promise<{text: string, confidence: number}>;
  isProcessing: boolean;
}

// Export as default object for backwards compatibility
export default {
  normalizeUser,
  normalizeUserRecords,
  normalizeFlashcard,
  convertLegacyUser,
  normalizeFields,
  calculateReviewPerformance,
  isValidDate
};
