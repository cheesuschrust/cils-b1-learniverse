
import { ItalianTestSection } from './ai';

export interface AISettings {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  showFeedback?: boolean;
  modelSize?: string;
  processingOnDevice?: boolean;
  autoSpeakCorrections?: boolean;
  voiceEnabled?: boolean;
  voiceRate?: number;
  voicePitch?: number;
  confidenceThreshold?: number;
  enabled?: boolean;
  assistantName?: string;
  useGPU?: boolean;
  autoTranslate?: boolean;
  feedbackLevel?: string;
  confidenceDisplay?: boolean;
  language?: string;
  pronunciation?: boolean;
  grammar?: boolean;
  vocabulary?: boolean;
  features?: {
    grammarCorrection?: boolean;
    pronunciationFeedback?: boolean;
    vocabularySuggestions?: boolean;
    culturalContext?: boolean;
    contentGeneration?: boolean;
    errorCorrection?: boolean;
    pronunciationHelp?: boolean;
    personalization?: boolean;
  };
  difficulty?: string;
  contentTypes?: string[];
  focusAreas?: string[];
}

export interface AISettingsProps {
  settings: AISettings;
  onSettingsChange: (settings: Partial<AISettings>) => void;
}
