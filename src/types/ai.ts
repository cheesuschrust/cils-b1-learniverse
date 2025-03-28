
// Define AI-related types for the application

export type AIModel = 
  | 'gpt-4o' 
  | 'gpt-4o-mini'
  | 'gpt-4'
  | 'gpt-3.5-turbo'
  | 'claude-instant'
  | 'claude-2'
  | 'mistral-small'
  | 'mistral-medium'
  | 'mistral-large';

export type AIModelSize = 'small' | 'medium' | 'large';

export type AIStatus = 
  | 'idle' 
  | 'loading' 
  | 'ready'
  | 'processing'
  | 'error'
  | 'success';

export type AIFeature = 
  | 'flashcards'
  | 'questions'
  | 'listening'
  | 'speaking'
  | 'writing'
  | 'translation'
  | 'explanation'
  | 'correction'
  | 'simplified';

export interface AIServiceOptions {
  apiKey?: string;
  model?: AIModel;
  temperature?: number;
  maxTokens?: number;
}

export interface AIServiceInterface {
  generateText: (prompt: string) => Promise<string>;
  generateCompletions: (prompts: string[]) => Promise<string[]>;
  generateQuestions: (content: string, count?: number) => Promise<any[]>;
  generateFlashcards: (content: string, count?: number) => Promise<any[]>;
  translateText: (text: string, targetLanguage: string) => Promise<string>;
  abort: () => void;
  classifyText?: (text: string) => Promise<any[]>;
}

export interface AISettings {
  enabled: boolean;
  model: AIModel;
  temperature: number;
  maxTokens: number;
  features: Record<AIFeature, boolean>;
  apiKey?: string;
  provider?: 'openai' | 'anthropic' | 'mistral' | 'local';
  streaming?: boolean;
  contentSafety?: boolean;
  debugMode?: boolean;
  defaultLanguage?: 'english' | 'italian' | 'auto';
}

export interface AIFeedbackSettings {
  automaticFeedback: boolean;
  detailedExplanations: boolean;
  highlightErrors: boolean;
  suggestAlternatives: boolean;
  proficiencyLevel: 'beginner' | 'intermediate' | 'advanced';
  feedbackLanguage: 'english' | 'italian' | 'same-as-content';
}

export interface ConfidenceIndicatorProps {
  score: number;
  contentType?: 'flashcards' | 'listening' | 'writing' | 'speaking' | 'multiple-choice';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  value?: number;
  indicatorClassName?: string;
}

export interface AIPreferences {
  model: AIModelSize;
  contentSafety: boolean;
  debugMode: boolean;
  voicePreference: string;
  autoPlayAudio: boolean;
  enabled?: boolean;
  cacheResponses?: boolean;
  voiceEnabled?: boolean;
  defaultLanguage?: 'english' | 'italian' | 'both';
  voiceRate?: number;
  voicePitch?: number;
  italianVoiceURI?: string;
  englishVoiceURI?: string;
  defaultModelSize?: 'small' | 'medium' | 'large';
  useWebGPU?: boolean;
  anonymousAnalytics?: boolean;
  modelSize?: string;
}

export interface UseAIReturn {
  isLoading: boolean;
  error: Error | null;
  result: string | null;
  generateText: (prompt: string) => Promise<string>;
  abort: () => void;
  status: AIStatus;
  isModelLoaded: boolean;
  loadModel: () => Promise<void>;
  generateQuestions: (content: string, contentType: string, count: number, difficulty: string) => Promise<any[]>;
  isProcessing: boolean;
  generateFlashcards: (content: string, count?: number, difficulty?: string) => Promise<any[]>;
  classifyText: (text: string) => Promise<any[]>;
  getConfidenceScore: (contentType: string) => number;
}

export interface AISetupWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
}
