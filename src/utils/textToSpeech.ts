
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
 * Get a list of English voices
 */
export const getEnglishVoices = async (): Promise<SpeechSynthesisVoice[]> => {
  const voices = await getAvailableVoices();
  return voices.filter(voice => 
    voice.lang.startsWith('en') || voice.name.toLowerCase().includes('english')
  );
};

/**
 * Get a list of Italian voices
 */
export const getItalianVoices = async (): Promise<SpeechSynthesisVoice[]> => {
  const voices = await getAvailableVoices();
  return voices.filter(voice => 
    voice.lang.startsWith('it') || voice.name.toLowerCase().includes('italian')
  );
};

/**
 * Get default voice preferences based on available voices
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
      if (!isSpeechSupported()) {
        const error = new Error('Speech synthesis not supported in this browser');
        console.error(error);
        reject(error);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set language
      utterance.lang = language === 'en' ? 'en-US' : 'it-IT';
      
      // Set voice based on language
      const voices = window.speechSynthesis.getVoices();
      const voiceURI = language === 'en' ? preferences.englishVoiceURI : preferences.italianVoiceURI;
      const voice = voices.find(v => v.voiceURI === voiceURI);
      
      if (voice) {
        utterance.voice = voice;
      } else {
        console.warn(`Voice with URI "${voiceURI}" not found. Using default voice.`);
      }
      
      // Set rate and pitch
      utterance.rate = preferences.voiceRate;
      utterance.pitch = preferences.voicePitch;
      
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
 * Stops all speech synthesis
 */
export const stopSpeaking = (): void => {
  if (isSpeechSupported()) {
    window.speechSynthesis.cancel();
  }
};

/**
 * Pauses speech synthesis
 */
export const pauseSpeaking = (): void => {
  if (isSpeechSupported()) {
    window.speechSynthesis.pause();
  }
};

/**
 * Resumes speech synthesis
 */
export const resumeSpeaking = (): void => {
  if (isSpeechSupported()) {
    window.speechSynthesis.resume();
  }
};
