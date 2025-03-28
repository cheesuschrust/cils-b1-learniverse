
import { User } from '@/types/user';

export interface TextToSpeechOptions {
  language: 'en' | 'it';
  rate?: number;
  pitch?: number;
  voiceURI?: string;
  voice?: string;
}

export interface SpeechState {
  speaking: boolean;
  voices: SpeechSynthesisVoice[];
}

export type TextToSpeechState = 'idle' | 'speaking' | 'paused' | 'error';

/**
 * Voice preference settings
 */
export interface VoicePreference {
  englishVoiceURI: string;
  italianVoiceURI: string;
  voiceRate: number;
  voicePitch: number;
}

/**
 * Checks if speech synthesis is supported in the browser
 */
export const isSpeechSupported = (): boolean => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
};

/**
 * Gets available voices from the browser's speech synthesis API
 */
export const getAvailableVoices = async (): Promise<SpeechSynthesisVoice[]> => {
  return new Promise((resolve) => {
    try {
      if (!isSpeechSupported()) {
        console.error('Speech synthesis not supported in this browser');
        resolve([]);
        return;
      }

      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        resolve(voices);
      } else {
        window.speechSynthesis.onvoiceschanged = () => {
          resolve(window.speechSynthesis.getVoices());
        };
      }
    } catch (error) {
      console.error('Error getting available voices:', error);
      resolve([]);
    }
  });
};

/**
 * Get available voices from the browser
 */
export function getVoices(): SpeechSynthesisVoice[] {
  return window.speechSynthesis.getVoices();
}

/**
 * Text to speech function
 */
export const textToSpeech = async (
  text: string,
  options: TextToSpeechOptions
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      if (!isSpeechSupported()) {
        const error = new Error('Speech synthesis not supported in this browser');
        console.error(error);
        reject(error);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set language
      utterance.lang = options.language === 'en' ? 'en-US' : 'it-IT';
      
      // Set rate and pitch if provided
      if (options.rate) utterance.rate = options.rate;
      if (options.pitch) utterance.pitch = options.pitch;
      
      // Set voice if voiceURI is provided
      if (options.voiceURI) {
        const voices = window.speechSynthesis.getVoices();
        const voice = voices.find(v => v.voiceURI === options.voiceURI);
        if (voice) {
          utterance.voice = voice;
        }
      }
      
      // Set event handlers
      utterance.onend = () => resolve();
      utterance.onerror = (error) => {
        console.error('Speech synthesis error:', error);
        reject(error);
      };
      
      // Speak the text
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error in speak function:', error);
      reject(error);
    }
  });
};

/**
 * Get English voices
 */
export const getEnglishVoices = async (): Promise<SpeechSynthesisVoice[]> => {
  const voices = await getAvailableVoices();
  return voices.filter(voice => 
    voice.lang.startsWith('en') || voice.name.toLowerCase().includes('english')
  );
};

/**
 * Get Italian voices
 */
export const getItalianVoices = async (): Promise<SpeechSynthesisVoice[]> => {
  const voices = await getAvailableVoices();
  return voices.filter(voice => 
    voice.lang.startsWith('it') || voice.name.toLowerCase().includes('italian')
  );
};

/**
 * Get default voice preferences
 */
export const getDefaultVoicePreferences = async (): Promise<VoicePreference> => {
  const englishVoices = await getEnglishVoices();
  const italianVoices = await getItalianVoices();
  
  return {
    englishVoiceURI: englishVoices.length > 0 ? englishVoices[0].voiceURI : '',
    italianVoiceURI: italianVoices.length > 0 ? italianVoices[0].voiceURI : '',
    voiceRate: 1.0,
    voicePitch: 1.0
  };
};

// Adding legacy functions to maintain backward compatibility
export const speak = async (
  text: string, 
  language: 'en' | 'it',
  preferences: VoicePreference
): Promise<void> => {
  return textToSpeech(text, {
    language,
    rate: preferences.voiceRate,
    pitch: preferences.voicePitch,
    voiceURI: language === 'en' ? preferences.englishVoiceURI : preferences.italianVoiceURI
  });
};

export const stopSpeaking = (): void => {
  if (isSpeechSupported()) {
    window.speechSynthesis.cancel();
  }
};

export const pauseSpeaking = (): void => {
  if (isSpeechSupported()) {
    window.speechSynthesis.pause();
  }
};

export const resumeSpeaking = (): void => {
  if (isSpeechSupported()) {
    window.speechSynthesis.resume();
  }
};

// Adding aliases for backward compatibility
export const getAllVoices = getAvailableVoices;

export const getVoiceByURI = async (voiceURI: string): Promise<SpeechSynthesisVoice | undefined> => {
  const voices = await getAvailableVoices();
  return voices.find(v => v.voiceURI === voiceURI);
};

export default textToSpeech;
