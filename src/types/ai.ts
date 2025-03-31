
// AI-related type definitions

export type AIProvider = 'openai' | 'anthropic' | 'cohere' | 'huggingface' | 'local';

export type AIModel = 
  | 'gpt-4o-mini' 
  | 'gpt-4o'
  | 'gpt-4-turbo' 
  | 'claude-instant' 
  | 'claude-2' 
  | 'command' 
  | 'small' 
  | 'medium' 
  | 'large';

export type AIStatus = 'idle' | 'loading' | 'generating' | 'error' | 'success';

export interface AIServiceOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  model?: string;
}

export interface AIPreference {
  preferredModel: AIModel;
  temperature: number;
  maxTokens: number;
  systemPrompt?: string;
  autoComplete?: boolean;
  showFeedback?: boolean;
}

export interface AIOptions {
  model: string;
  prompt: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

export interface AIFeedbackSettings {
  showConfidence: boolean;
  showTokenCount: boolean;
  showModelInfo: boolean;
  allowFeedback: boolean;
  autoImprove: boolean;
}

export interface UseAIReturn {
  generateText: (prompt: string, options?: AIServiceOptions) => Promise<string>;
  getConfidenceScore: (text: string, contentType: string) => Promise<number>;
  isLoading: boolean;
  error: Error | null;
  abort: () => void;
}

export interface AIService {
  generateText: (prompt: string, options?: AIServiceOptions) => Promise<string>;
  getConfidenceScore: (contentType: string) => number;
  abortAllRequests: () => void;
  generateQuestions?: (contentType: string, count: number, difficulty: string) => Promise<any[]>;
}

// Utility to normalize AI model names across providers
export const normalizeAIModel = (modelName: string): AIModel => {
  const lowerModel = modelName.toLowerCase();
  
  if (lowerModel.includes('gpt-4o-mini')) return 'gpt-4o-mini';
  if (lowerModel.includes('gpt-4o')) return 'gpt-4o';
  if (lowerModel.includes('gpt-4')) return 'gpt-4-turbo';
  if (lowerModel.includes('claude-instant')) return 'claude-instant';
  if (lowerModel.includes('claude')) return 'claude-2';
  if (lowerModel.includes('command')) return 'command';
  
  // Size-based fallbacks
  if (lowerModel.includes('small')) return 'small';
  if (lowerModel.includes('medium')) return 'medium';
  if (lowerModel.includes('large')) return 'large';
  
  // Default
  return 'medium';
};
