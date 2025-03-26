
export type AIStatus = 'loading' | 'error' | 'idle' | 'ready';
export type AIModel = 'small' | 'medium' | 'large';
export type AILanguage = 'english' | 'italian' | 'auto';

export interface AIPreference {
  enabled: boolean;
  modelSize: AIModel;
  defaultModelSize?: AIModel;
  useWebGPU?: boolean;
  cacheResponses: boolean;
  defaultLanguage?: AILanguage;
  voiceEnabled: boolean;
  voiceRate?: number;
  voicePitch?: number;
  italianVoiceURI?: string;
  englishVoiceURI?: string;
  anonymousAnalytics?: boolean;
}

export type AIPreferences = AIPreference;

export interface AIFeedback {
  exercise: string;
  type: string;
  input: string;
  correction: string;
  explanation: string;
  confidence: number;
}
