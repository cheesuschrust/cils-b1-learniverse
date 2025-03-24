
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
      
      // Get available voices
      let voices = window.speechSynthesis.getVoices();
      
      // Chrome sometimes needs a bit of time to load voices
      if (voices.length === 0) {
        setTimeout(() => {
          voices = window.speechSynthesis.getVoices();
          continueWithVoices(voices);
        }, 100);
      } else {
        continueWithVoices(voices);
      }
      
      function continueWithVoices(voices: SpeechSynthesisVoice[]) {
        // Set language-specific voice
        const voiceURI = language === 'it' 
          ? preferences.italianVoiceURI 
          : preferences.englishVoiceURI;
        
        if (voiceURI) {
          const voice = voices.find(v => v.voiceURI === voiceURI);
          if (voice) {
            utterance.voice = voice;
          } else {
            // Fallback: find a voice for the language
            const languageCode = language === 'it' ? 'it' : 'en';
            const fallbackVoice = voices.find(v => v.lang.startsWith(languageCode));
            if (fallbackVoice) utterance.voice = fallbackVoice;
          }
        }
        
        // Set language as fallback
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
      }
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

// Get the default voice for a given language
export const getDefaultVoiceForLanguage = async (
  language: 'it' | 'en'
): Promise<SpeechSynthesisVoice | null> => {
  if (!isSpeechSupported()) return null;
  
  const voices = await getAvailableVoices();
  const langCode = language === 'it' ? 'it' : 'en';
  
  // First try to find a voice specifically for the right country code
  const countryCode = language === 'it' ? 'IT' : 'US';
  const preferredLocale = `${langCode}-${countryCode}`;
  
  // First priority: voice with exact locale match
  const exactMatch = voices.find(voice => voice.lang === preferredLocale);
  if (exactMatch) return exactMatch;
  
  // Second priority: any voice starting with the language code
  const languageMatch = voices.find(voice => voice.lang.startsWith(langCode));
  if (languageMatch) return languageMatch;
  
  // Third priority: any voice that includes the language name
  const nameMatch = voices.find(voice => 
    voice.name.toLowerCase().includes(language === 'it' ? 'italian' : 'english')
  );
  if (nameMatch) return nameMatch;
  
  // Final fallback: just use the first voice
  return voices.length > 0 ? voices[0] : null;
};
