
export type ContentType = 'flashcards' | 'multiple-choice' | 'listening' | 'writing' | 'speaking';

export interface AISettings {
  defaultModelSize: string;
  useWebGPU: boolean;
  voiceRate: number;
  voicePitch: number;
  italianVoiceURI: string;
  englishVoiceURI: string;
  defaultLanguage: string;
  processOnDevice: boolean;
  useLocalModels: boolean;
  useCaching: boolean;
  contentGeneration: boolean;
  contentAnalysis: boolean;
  errorCorrection: boolean;
  personalization: boolean;
  pronunciationHelp: boolean;
  conversationalLearning: boolean;
  progressTracking: boolean;
  autoTranslation: boolean;
  sentimentAnalysis: boolean;
  advancedExplanations: boolean;
  contentFiltering: boolean;
}

export interface AIPreference {
  flashcards: boolean;
  questions: boolean;
  listening: boolean;
  speaking: boolean;
  writing: boolean;
  translation: boolean;
  explanation: boolean;
  correction: boolean;
  simplified: boolean;
  // Add more specific preferences as needed
}

export interface AIServiceOptions {
  model?: string;
  temperature?: number;
  maxLength?: number;
  minLength?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stopSequences?: string[];
  timeout?: number;
  language?: 'english' | 'italian' | 'both';
  signal?: AbortSignal;
}

export interface AIServiceInterface {
  generateText: (prompt: string, options?: AIServiceOptions) => Promise<string>;
  classifyText: (text: string) => Promise<Array<{label: string; score: number}>>;
  getConfidenceScore: (contentType: string) => number;
  addTrainingExamples: (contentType: string, examples: any[]) => number;
  generateFlashcards: (topic: string, count?: number, difficulty?: string) => Promise<any[]>;
  generateQuestions: (content: string, count?: number, type?: string) => Promise<any[]>;
  abortRequest: (requestId: string) => void;
  abortAllRequests: () => void;
}

// For AI Setup Wizard
export interface AISetupWizardProps {
  onComplete: (settings: AISettings) => void;
}

// For AI Content Processor
export interface AIContentProcessorProps {
  content: string;
  contentType: ContentType;
  onQuestionsGenerated: (questions: any[]) => void;
}

// For Confidence Indicator
export interface ConfidenceIndicatorProps {
  score: number;
  contentType?: ContentType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}
