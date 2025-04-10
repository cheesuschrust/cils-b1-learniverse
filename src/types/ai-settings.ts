
// AI Settings types and interfaces

export interface AIModelSettings {
  id: string;
  name: string;
  isActive: boolean;
  confidenceThreshold: number;
  usageLimit: number;
  processingMode: 'fast' | 'accurate';
  cacheResponses: boolean;
  useWebGPU: boolean;
}

export interface VoiceSettings {
  enabled: boolean;
  defaultVoice: string;
  defaultSpeed: number;
  defaultPitch: number;
  availableVoices: string[];
  defaultLanguage?: 'en' | 'it';
  provider?: 'browser' | 'elevenlabs' | 'openai';
  volume?: number;
}

export interface AIUsageStatistics {
  totalQueries: number;
  averageResponseTime: number;
  averageAccuracy: number;
  dailyUsage: {
    date: string;
    count: number;
  }[];
  modelUsage: {
    model: string;
    count: number;
  }[];
}

export interface AISystemStatus {
  isOnline: boolean;
  lastUpdated: Date;
  services: {
    name: string;
    status: 'operational' | 'degraded' | 'outage';
    uptime: number;
  }[];
  memoryUsage: number;
  processingLoad: number;
}

export interface AISecuritySettings {
  encryptResponses: boolean;
  logSensitiveData: boolean;
  maxQueriesPerMinute: number;
  userDataRetention: number; // days
  accessControls: {
    role: string;
    permissions: string[];
  }[];
}

export interface AITrainingSettings {
  autoTrain: boolean;
  trainingFrequency: 'daily' | 'weekly' | 'monthly';
  minimumDataPoints: number;
  validateBeforeTraining: boolean;
  notifyAdminOnComplete: boolean;
}

export interface VoicePreference {
  englishVoiceURI: string;
  italianVoiceURI: string;
  voiceRate: number;
  voicePitch: number;
  voiceVolume?: number;
  preferredProvider?: 'browser' | 'elevenlabs' | 'openai';
}

export interface VoiceSystemSettings {
  defaultEnglishVoice: string;
  defaultItalianVoice: string;
  defaultRate: number;
  defaultPitch: number;
  defaultVolume: number;
  provider: 'browser' | 'elevenlabs' | 'openai';
  apiKeys: {
    elevenlabs?: string;
    openai?: string;
  };
  enableTextToSpeech: boolean;
  enableSpeechRecognition: boolean;
  enablePronunciationFeedback: boolean;
  usageLimits: {
    daily: number;
    monthly: number;
  };
}
