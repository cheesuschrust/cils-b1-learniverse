
/**
 * Voice and Speech related types and utilities
 */

// Type Guards
export const isValidDate = (date: any): date is Date =>
  date instanceof Date && !isNaN(date.getTime());

/**
 * Voice preferences for text-to-speech functionality
 */
export interface VoicePreference {
  voice: string;
  rate: number;
  pitch: number;
  preferredLanguage?: string;
  volume?: number;
  autoPlay?: boolean;
  useNative?: boolean;
}

/**
 * Text-to-speech options for the voice API
 */
export interface TextToSpeechOptions {
  voice?: string;
  rate?: number;
  pitch?: number;
  language?: string;
  volume?: number;
}

/**
 * Voice options configuration
 */
export interface VoiceOptions {
  voice: string;
  rate: number;
  pitch: number;
  volume?: number;
}

/**
 * State for the speech synthesis system
 */
export interface SpeechState {
  speaking: boolean;
  voices: SpeechSynthesisVoice[];
  currentVoice: string | null;
  error?: string;
  isPaused?: boolean;
  isLoading?: boolean;
  performance?: {
    loadTime: number;
    errorCount: number;
    lastError?: string;
  };
}
