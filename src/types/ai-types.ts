
// AI-related type definitions

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  contextWindow: number;
  maxTokens: number;
  temperature: number;
  isActive: boolean;
}

export interface AIGenerationOptions {
  model: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

export interface AIGenerationRequest {
  prompt: string;
  options?: AIGenerationOptions;
  context?: string;
}

export interface AIGenerationResponse {
  text: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}
