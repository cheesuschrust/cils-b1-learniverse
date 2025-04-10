
import { VoiceSettings, VoicePreference } from '@/types/ai-settings';

export interface VoiceIntegrationSettings {
  // System-wide settings
  defaultEnglishVoice: string;
  defaultItalianVoice: string;
  defaultVoiceRate: number;
  defaultVoicePitch: number;
  defaultVoiceVolume: number;
  
  // Provider settings
  provider: 'browser' | 'elevenlabs' | 'openai';
  apiKeys: {
    elevenlabs?: string;
    openai?: string;
  };
  
  // Feature flags
  enableTextToSpeech: boolean;
  enableSpeechRecognition: boolean;
  enablePronunciationFeedback: boolean;
  
  // Browser settings
  preferLocalVoices: boolean;
  fallbackToRemote: boolean;
  
  // Advanced settings
  cacheAudio: boolean;
  maxCacheSize: number; // MB
  audioQuality: 'low' | 'medium' | 'high';
  
  // Usage tracking
  trackUsage: boolean;
  usageLimits: {
    daily: number;
    monthly: number;
  };
}

export interface VoiceModel {
  id: string;
  name: string;
  provider: 'browser' | 'elevenlabs' | 'openai';
  language: string;
  gender?: 'male' | 'female' | 'neutral';
  isPremium: boolean;
  isDefault?: boolean;
}

export interface VoiceUsageStatistics {
  totalTextToSpeechRequests: number;
  totalSpeechToTextRequests: number;
  averageProcessingTime: number;
  charactersParsed: number;
  audioGeneratedMinutes: number;
  byLanguage: {
    language: string;
    count: number;
    percentage: number;
  }[];
  byVoice: {
    voiceId: string;
    voiceName: string;
    count: number;
    percentage: number;
  }[];
}
