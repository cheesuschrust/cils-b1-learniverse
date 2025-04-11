
// AI settings and configuration

export interface AISettings {
  defaultModel: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
}

export const defaultAISettings: AISettings = {
  defaultModel: 'gpt-3.5-turbo',
  temperature: 0.7,
  maxTokens: 500,
  topP: 1,
  frequencyPenalty: 0,
  presencePenalty: 0
};
