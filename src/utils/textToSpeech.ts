
export interface VoicePreference {
  italianVoiceURI: string;
  englishVoiceURI: string;
  voiceRate: number;
  voicePitch: number;
}

export const isSpeechSupported = (): boolean => {
  return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
};

export const getVoiceByURI = (uri: string): SpeechSynthesisVoice | null => {
  if (!isSpeechSupported()) return null;
  
  const voices = window.speechSynthesis.getVoices();
  return voices.find(voice => voice.voiceURI === uri) || null;
};

export const speak = async (
  text: string, 
  language: 'it' | 'en', 
  preferences: VoicePreference
): Promise<void> => {
  if (!isSpeechSupported()) {
    throw new Error('Speech synthesis is not supported in this browser');
  }
  
  // Cancel any ongoing speech
  window.speechSynthesis.cancel();
  
  return new Promise((resolve, reject) => {
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set language-specific voice
      const voiceURI = language === 'it' 
        ? preferences.italianVoiceURI 
        : preferences.englishVoiceURI;
      
      if (voiceURI) {
        const voice = getVoiceByURI(voiceURI);
        if (voice) utterance.voice = voice;
      }
      
      // Set language as fallback if no voice is set
      utterance.lang = language === 'it' ? 'it-IT' : 'en-US';
      
      // Apply other preferences
      utterance.rate = preferences.voiceRate;
      utterance.pitch = preferences.voicePitch;
      
      // Event handlers
      utterance.onend = () => {
        resolve();
      };
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        reject(new Error('Error occurred during speech synthesis'));
      };
      
      // Speak the text
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Speech synthesis initialization error:', error);
      reject(error);
    }
  });
};

export const getAvailableVoices = async (): Promise<SpeechSynthesisVoice[]> => {
  if (!isSpeechSupported()) return [];
  
  // If voices are already loaded
  let voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) return voices;
  
  // Wait for voices to load (primarily for Chrome)
  return new Promise((resolve) => {
    const voicesChanged = () => {
      voices = window.speechSynthesis.getVoices();
      resolve(voices);
    };
    
    window.speechSynthesis.onvoiceschanged = voicesChanged;
    
    // Fallback in case onvoiceschanged doesn't fire
    setTimeout(() => {
      const currentVoices = window.speechSynthesis.getVoices();
      if (currentVoices.length > 0) {
        resolve(currentVoices);
      } else {
        resolve([]);
      }
    }, 1000);
  });
};

export const getVoicesByLanguage = async (
  languageCode: string
): Promise<SpeechSynthesisVoice[]> => {
  const voices = await getAvailableVoices();
  return voices.filter(voice => 
    voice.lang.startsWith(languageCode) || 
    voice.name.toLowerCase().includes(languageCode)
  );
};
