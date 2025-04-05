
import { ItalianLevel, ItalianTestSection } from './core-types';

export interface AIPreferences {
  enabled: boolean;
  modelSize: string;
  useLocalModel: boolean;
  voiceEnabled: boolean;
  autoTranslate: boolean;
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  capabilities: string[];
  sizeInMB: number;
  isLocallyAvailable: boolean;
}

export interface AIServiceOptions {
  temperature?: number;
  maxTokens?: number;
  modelType?: string;
  language?: "english" | "italian" | "both";
}
