
export interface VoicePreference {
  englishVoiceURI: string;
  italianVoiceURI: string;
  voiceRate: number;
  voicePitch: number;
}

export interface TextToSpeechOptions {
  voice?: SpeechSynthesisVoice;
  rate?: number;
  pitch?: number;
  volume?: number;
  language?: string;
}

export interface VoiceOptions {
  enableAutoSpeech: boolean;
  enablePlaybackControls: boolean;
  preferredVoice: {
    italian: string;
    english: string;
  };
  playbackSpeed: number;
  pitch: number;
  volume: number;
  usePremiumVoices: boolean;
}

export interface SpeechState {
  isSpeaking: boolean;
  isListening: boolean;
  isProcessing: boolean;
  error: string | null;
  transcript: string;
  confidence: number;
  finalTranscript: boolean;
}

// Utility function to check if a date is valid
export function isValidDate(date: any): date is Date {
  return date instanceof Date && !isNaN(date.getTime());
}

// Utility function to get available voices by language
export function getVoicesByLanguage(prefix: string): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !window.speechSynthesis) return [];
  
  const voices = window.speechSynthesis.getVoices();
  return voices.filter(voice => voice.lang.startsWith(prefix));
}

// Default voice preferences
export const defaultVoicePreferences: VoicePreference = {
  englishVoiceURI: '',
  italianVoiceURI: '',
  voiceRate: 1.0,
  voicePitch: 1.0
};
