
/**
 * Returns a list of available speech synthesis voices on the current device
 * @returns An array of SpeechSynthesisVoice objects
 */
export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    return window.speechSynthesis.getVoices();
  }
  return [];
}

/**
 * Speaks the provided text using the specified voice
 * @param text The text to be spoken
 * @param voiceName Optional name of the voice to use
 * @returns Promise that resolves when speech is completed or rejects on error
 */
export function speak(text: string, voiceName?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    if (voiceName) {
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(v => v.name === voiceName);
      if (voice) {
        utterance.voice = voice;
      }
    }

    utterance.onend = () => resolve();
    utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`));

    window.speechSynthesis.speak(utterance);
  });
}

/**
 * Stops any ongoing speech synthesis
 */
export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Checks if speech synthesis is supported in the current browser
 * @returns Boolean indicating if speech synthesis is supported
 */
export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

/**
 * Get a list of available voices
 * Alias for getAvailableVoices for backwards compatibility
 */
export function getVoices(): SpeechSynthesisVoice[] {
  return getAvailableVoices();
}

/**
 * Voice preference interface
 */
export interface VoicePreference {
  enabled: boolean;
  rate: number;
  pitch: number;
  volume: number;
  voice: string;
  language: string;
}

/**
 * Get default voice preferences
 */
export function getDefaultVoicePreferences(): Record<string, VoicePreference> {
  return {
    english: {
      enabled: true,
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0,
      voice: '',
      language: 'en-US'
    },
    italian: {
      enabled: true,
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0,
      voice: '',
      language: 'it-IT'
    }
  };
}

// Export getAvailableVoices as default for backward compatibility
export default getAvailableVoices;
