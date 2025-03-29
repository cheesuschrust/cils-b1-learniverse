
/**
 * Configuration options for AI-powered services
 */
export interface AIOptions {
  temperature?: number;
  maxTokens?: number;
  model?: string;
  context?: string;
  systemPrompt?: string;
  streaming?: boolean;
  presence_penalty?: number;
  frequency_penalty?: number;
}
