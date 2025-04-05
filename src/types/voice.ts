
export interface TextToSpeechOptions {
  text: string;
  voice?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
}

export interface VoiceOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voiceURI?: string;
  language?: string;
  voice?: string;
  text?: string;
}

export interface VoicePreference {
  language: string;
  voiceURI?: string;
  englishVoiceURI?: string;
  italianVoiceURI?: string;
  rate?: number;
  voiceRate?: number;
  pitch?: number;
  voicePitch?: number;
  volume?: number;
}

export interface SpeechState {
  speaking: boolean;
  paused: boolean;
  voice: SpeechSynthesisVoice | null;
  text: string;
}

export function isValidDate(date: any): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}
