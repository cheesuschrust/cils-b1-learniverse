
export interface VoicePreference {
  englishVoiceURI: string;
  italianVoiceURI: string;
  voiceRate: number;
  voicePitch: number;
}

/**
 * Gets available voices from the browser's speech synthesis API
 */
export const getAvailableVoices = async (): Promise<SpeechSynthesisVoice[]> => {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        resolve(window.speechSynthesis.getVoices());
      };
    }
  });
};

/**
 * Speaks the provided text using the browser's speech synthesis API
 * @param text Text to speak
 * @param language Language code ('en' or 'it')
 * @param preferences Voice preferences
 */
export const speak = async (
  text: string, 
  language: 'en' | 'it',
  preferences: VoicePreference
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set language
      utterance.lang = language === 'en' ? 'en-US' : 'it-IT';
      
      // Set voice based on language
      const voices = window.speechSynthesis.getVoices();
      const voiceURI = language === 'en' ? preferences.englishVoiceURI : preferences.italianVoiceURI;
      const voice = voices.find(v => v.voiceURI === voiceURI);
      
      if (voice) {
        utterance.voice = voice;
      }
      
      // Set rate and pitch
      utterance.rate = preferences.voiceRate;
      utterance.pitch = preferences.voicePitch;
      
      // Set event handlers
      utterance.onend = () => resolve();
      utterance.onerror = (error) => reject(error);
      
      // Speak the text
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Stops all speech synthesis
 */
export const stopSpeaking = (): void => {
  window.speechSynthesis.cancel();
};

/**
 * Pauses speech synthesis
 */
export const pauseSpeaking = (): void => {
  window.speechSynthesis.pause();
};

/**
 * Resumes speech synthesis
 */
export const resumeSpeaking = (): void => {
  window.speechSynthesis.resume();
};
