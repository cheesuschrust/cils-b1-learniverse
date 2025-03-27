
export type AIStatus = 'idle' | 'loading' | 'ready' | 'error';
export type AIModel = 'gpt-4o-mini' | 'gpt-4o' | 'mistral-small' | 'claude-instant' | 'small' | 'medium' | 'large';

export interface AIPreferences {
  enabled: boolean;
  modelSize: 'small' | 'medium' | 'large';
  cacheResponses: boolean;
  voiceEnabled: boolean;
  defaultLanguage: 'english' | 'italian' | 'both';
  voiceRate: number;
  voicePitch: number;
  italianVoiceURI?: string;
  englishVoiceURI?: string;
  defaultModelSize: 'small' | 'medium' | 'large';
  useWebGPU: boolean;
  anonymousAnalytics: boolean;
}

export interface AIServiceOptions {
  maxLength?: number;
  temperature?: number;
  model?: string;
  stream?: boolean;
}

export interface AIServiceInterface {
  generateText(prompt: string, options?: AIServiceOptions): Promise<string>;
  classifyText(text: string): Promise<Array<{ label: string; score: number }>>;
  generateImage?(prompt: string, size?: string): Promise<string>;
  getConfidenceScore(contentType: string): number;
  addTrainingExamples(contentType: string, examples: any[]): number;
  generateFlashcards(topic: string, count?: number, difficulty?: string): Promise<any[]>;
  generateQuestions(content: string, count?: number, type?: string): Promise<any[]>;
  abortRequest(requestId: string): void;
  abortAllRequests(): void;
}

// Add ConfidenceIndicatorProps type
export interface ConfidenceIndicatorProps {
  score: number;
  value?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  indicatorClassName?: string;
  contentType?: 'writing' | 'speaking' | 'listening' | 'multiple-choice' | 'flashcards';
}

// Add UseAIReturn interface
export interface UseAIReturn {
  isLoading: boolean;
  error: Error | null;
  result: string | null;
  generateText: (prompt: string) => Promise<string>;
  abort: () => void;
}
