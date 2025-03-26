
// This file adds missing interfaces and fixes type errors

// Add missing AIPreference properties
export interface AIPreference {
  defaultModelSize: 'small' | 'medium' | 'large';
  useWebGPU: boolean;
  voiceRate: number;
  voicePitch: number;
  italianVoiceURI: string;
  englishVoiceURI: string;
  defaultLanguage: 'english' | 'italian';
}

// Extend the ConfidenceIndicatorProps interface
export interface ConfidenceIndicatorProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Fix for the Progress component
export interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  indicator?: string;
}
