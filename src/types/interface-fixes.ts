
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
  processOnDevice?: boolean;
  dataCollection?: boolean;
  assistanceLevel?: number;
  autoLoadModels?: boolean;
  cacheModels?: boolean;
  processingSetting?: 'fast' | 'balanced' | 'high-quality';
  optimizationLevel?: number;
  anonymousAnalytics?: boolean;
  contentFiltering?: boolean;
}

// Extend the ConfidenceIndicatorProps interface
export interface ConfidenceIndicatorProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  score?: number; // Added for compatibility with existing code
  contentType?: string; // Added for compatibility with existing code
}

// Fix for the Progress component
export interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  indicator?: string;
}

// Add the missing NotificationItemProps properties
export interface NotificationItemPropsExtension {
  onRead: (id: string) => void;
}
