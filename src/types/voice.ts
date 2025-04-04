
export interface VoicePreference {
  voiceId: string;
  language: string;
  rate: number;
  pitch: number;
  volume: number;
  isDefault: boolean;
}

export interface TextToSpeechOptions {
  text: string;
  voice?: string;
  language?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export interface VoiceOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: string;
}

export interface SpeechState {
  isSpeaking: boolean;
  isPaused: boolean;
  isLoading: boolean;
  error: string | null;
}

export function isValidDate(date: any): date is Date {
  return date instanceof Date && !isNaN(date.getTime());
}
