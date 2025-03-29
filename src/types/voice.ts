
// Voice and speech related types

/**
 * Voice preferences for text-to-speech
 */
export type VoicePreference = 'default' | 'male' | 'female' | 'natural' | 'robotic';

/**
 * Text-to-speech configuration options
 */
export interface TextToSpeechOptions {
  voice: VoicePreference;
  pitch?: number;
  rate?: number;
  volume?: number;
  language?: 'en' | 'it';
}

/**
 * Voice component options
 */
export interface VoiceOptions {
  autoPlay?: boolean;
  includePronunciation?: boolean;
  repeatEnabled?: boolean;
  maxRepeatCount?: number;
}

/**
 * Speech recognition state
 */
export interface SpeechState {
  isListening: boolean;
  transcript: string;
  confidence: number;
  error?: string;
  supported: boolean;
}

/**
 * Utility function to check if a value is a valid date
 */
export const isValidDate = (date: any): boolean => {
  if (!date) return false;
  if (date instanceof Date) {
    return !isNaN(date.getTime());
  }
  return false;
};

export default {
  isValidDate
};
