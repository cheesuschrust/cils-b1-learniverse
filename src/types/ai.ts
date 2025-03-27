
export interface AIPreferences {
  enabled: boolean;
  modelSize: string;
  cacheResponses: boolean;
  voiceEnabled: boolean;
  defaultLanguage: string;
  voiceRate: number;
  voicePitch: number;
  italianVoiceURI: string;
  englishVoiceURI: string;
  defaultModelSize: string;
  useWebGPU: boolean;
  anonymousAnalytics: boolean;
}

export interface AIFeedbackSettings {
  enabled: boolean;
  confidence: boolean;
  accuracy: boolean;
  pronunciation: boolean;
  fluency: boolean;
  grammar: boolean;
  vocabulary: boolean;
}

export interface AIModel {
  id: string;
  name: string;
  size: 'small' | 'medium' | 'large' | 'xlarge';
  description: string;
  parameters: number;
  capabilities: string[];
  usageLimit?: number;
  context?: number;
  type: 'text' | 'image' | 'audio' | 'multimodal';
  tags: string[];
}

export interface AISettings {
  enabled: boolean;
  defaultModel: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  stopSequences: string[];
  models: AIModel[];
  features: {
    translation: boolean;
    grammar: boolean;
    vocabulary: boolean;
    pronunciation: boolean;
    questionGeneration: boolean;
    contentSummarization: boolean;
    difficultyAdjustment: boolean;
  };
  cache: {
    enabled: boolean;
    ttl: number;
    maxSize: number;
  };
  feedback: AIFeedbackSettings;
  usage: {
    daily: number;
    monthly: number;
    limit: number;
    resetDate: string;
  };
}

export interface ContentType {
  id: string;
  name: string;
  description: string;
  features: string[];
  enabled: boolean;
}

export interface UseAIReturn {
  generateText: (prompt: string, options?: any) => Promise<string>;
  getConfidenceScore: (text: string, contentType: string) => Promise<number>;
  translateText?: (text: string, targetLang: 'english' | 'italian') => Promise<string>;
  checkGrammar?: (text: string, lang: 'english' | 'italian') => Promise<{text: string, corrections: any[]}>;
  isLoading?: boolean;
  error: Error | null;
  abort?: () => void;
  generateFlashcards?: (topic: string, count?: number, difficulty?: string) => Promise<any[]>;
  isProcessing?: boolean;
  classifyText?: (text: string) => Promise<any>;
  isModelLoaded?: boolean;
  status?: string;
  loadModel?: (modelName: string) => Promise<boolean>;
  generateQuestions?: (content: string, count?: number, type?: string) => Promise<any[]>;
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

// Add AIStatus type for AIStatus component
export type AIStatus = 'idle' | 'loading' | 'ready' | 'error';

// Add ConfidenceIndicatorProps for ConfidenceIndicator component
export interface ConfidenceIndicatorProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  indicatorClassName?: string;
  contentType?: string;
  value?: number;
}
