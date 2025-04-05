
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
}
