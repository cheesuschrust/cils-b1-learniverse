
export interface AIPreferences {
  enabled: boolean;
  modelSize: string;
  useLocalModel: boolean;
  voiceEnabled: boolean;
  autoTranslate: boolean;
  assistant?: {
    name: string;
    voice: string;
    personality: string;
  };
  promptTemplates?: Record<string, string>;
  confidenceScoreVisible?: boolean;
  usageLimit?: {
    daily: number;
    monthly: number;
    remaining: number;
  };
  // Additional props to match the requirements
  features?: {
    grammarCorrection: boolean;
    pronunciationFeedback: boolean;
    vocabularySuggestions: boolean;
    culturalContext: boolean;
    contentGeneration: boolean;
    errorCorrection: boolean;
    pronunciationHelp: boolean;
    personalization: boolean;
  };
  assistantName?: string;
  voiceRate?: number;
  voicePitch?: number;
  language?: string;
  difficulty?: string;
  contentTypes?: string[];
  focusAreas?: string[];
  processingOnDevice?: boolean;
  autoSpeakCorrections?: boolean;
  confidenceThreshold?: number;
}
