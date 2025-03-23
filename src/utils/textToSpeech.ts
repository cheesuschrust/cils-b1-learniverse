
// Text-to-speech utility functions

export interface VoicePreference {
  italianVoiceURI?: string;
  englishVoiceURI?: string;
  voiceRate: number;
  voicePitch: number;
}

/**
 * Check if the browser supports the Speech Synthesis API
 */
export const isSpeechSupported = (): boolean => {
  return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
};

/**
 * Stop any currently speaking synthesis
 */
export const stopSpeaking = (): void => {
  if (isSpeechSupported()) {
    window.speechSynthesis.cancel();
  }
};

/**
 * Get all available voices
 */
export const getAllVoices = (): Promise<SpeechSynthesisVoice[]> => {
  return new Promise((resolve) => {
    if (!isSpeechSupported()) {
      resolve([]);
      return;
    }
    
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }
    
    // If no voices are available, wait for them to load
    const onVoicesChanged = () => {
      window.speechSynthesis.onvoiceschanged = null;
      resolve(window.speechSynthesis.getVoices());
    };
    
    window.speechSynthesis.onvoiceschanged = onVoicesChanged;
    
    // Fallback if onvoiceschanged never fires
    setTimeout(() => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        resolve(voices);
      } else {
        resolve([]);
      }
    }, 1000);
  });
};

/**
 * Get Italian voices
 */
export const getItalianVoices = async (): Promise<SpeechSynthesisVoice[]> => {
  const voices = await getAllVoices();
  return voices.filter(voice => voice.lang.toLowerCase().startsWith('it'));
};

/**
 * Get English voices
 */
export const getEnglishVoices = async (): Promise<SpeechSynthesisVoice[]> => {
  const voices = await getAllVoices();
  return voices.filter(voice => voice.lang.toLowerCase().startsWith('en'));
};

/**
 * Play a sample of the selected voice
 */
export const speakSample = async (voiceURI: string, language: 'it' | 'en'): Promise<void> => {
  const text = language === 'it' 
    ? "Ciao, questo è un esempio di come suonerà la voce italiana." 
    : "Hello, this is an example of how the English voice will sound.";
  
  const voices = await getAllVoices();
  const voice = voices.find(v => v.voiceURI === voiceURI || v.name === voiceURI);
  
  if (!voice) {
    throw new Error(`Voice not found: ${voiceURI}`);
  }
  
  return new Promise((resolve, reject) => {
    try {
      stopSpeaking();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voice;
      utterance.lang = voice.lang;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      
      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error(`Speech error: ${event.error}`));
      
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Get the best available voice for a given language
 */
export const getBestVoice = (language: string, voicePreference?: VoicePreference): SpeechSynthesisVoice | null => {
  if (!isSpeechSupported()) return null;
  
  const voices = window.speechSynthesis.getVoices();
  
  // If we have a specific voice preference, try to find it
  if (voicePreference) {
    const preferredVoiceURI = language === 'it' ? 
      voicePreference.italianVoiceURI : 
      voicePreference.englishVoiceURI;
      
    if (preferredVoiceURI) {
      const preferredVoice = voices.find(voice => 
        voice.voiceURI === preferredVoiceURI ||
        voice.name === preferredVoiceURI
      );
      if (preferredVoice) return preferredVoice;
    }
  }
  
  // If no preference or preferred voice not found, find best voice for language
  const langCode = language === 'it' ? 'it-IT' : language === 'en' ? 'en-US' : language;
  
  // First try to find a native voice for the language
  const nativeVoice = voices.find(voice => 
    voice.lang.toLowerCase().startsWith(langCode.toLowerCase()) && 
    voice.localService === true
  );
  if (nativeVoice) return nativeVoice;
  
  // Next, any voice for the language
  const anyLangVoice = voices.find(voice => 
    voice.lang.toLowerCase().startsWith(langCode.toLowerCase())
  );
  if (anyLangVoice) return anyLangVoice;
  
  // Default to first available voice
  return voices.length > 0 ? voices[0] : null;
};

/**
 * Speak text using the Speech Synthesis API
 */
export const speak = (text: string, language: 'it' | 'en' = 'it', voicePreference?: VoicePreference): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!isSpeechSupported()) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }
    
    // Ensure any previous speech is stopped
    stopSpeaking();
    
    // Wait for voices to be loaded if needed
    const synth = window.speechSynthesis;
    const getVoicesAndSpeak = () => {
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        
        const langCode = language === 'it' ? 'it-IT' : 'en-US';
        utterance.lang = langCode;
        
        // Set rate and pitch if provided in voicePreference
        if (voicePreference) {
          utterance.rate = voicePreference.voiceRate || 0.9;
          utterance.pitch = voicePreference.voicePitch || 1.0;
        } else {
          // Set a good default rate and pitch
          utterance.rate = 0.9; // Slightly slower than default
          utterance.pitch = 1.0;
        }
        
        // Find the best voice
        const voice = getBestVoice(language, voicePreference);
        if (voice) {
          utterance.voice = voice;
          console.log(`Using voice: ${voice.name} (${voice.lang})`);
        } else {
          console.warn(`No voice found for language: ${language}, using default`);
        }
        
        // Set up event handlers
        utterance.onend = () => {
          resolve();
        };
        
        utterance.onerror = (event) => {
          reject(new Error(`Speech synthesis error: ${event.error}`));
        };
        
        // Speak the text
        synth.speak(utterance);
        
        // Chrome bug workaround - if the speech doesn't start, restart it
        setTimeout(() => {
          if (synth.speaking && !synth.paused) {
            // Speaking is working
          } else {
            // Try to restart
            synth.cancel();
            synth.speak(utterance);
          }
        }, 250);
      } catch (error) {
        reject(error);
      }
    };
    
    // Make sure we have voices loaded
    if (synth.getVoices().length > 0) {
      getVoicesAndSpeak();
    } else {
      // Wait for voices to load
      synth.onvoiceschanged = () => {
        synth.onvoiceschanged = null; // Only run once
        getVoicesAndSpeak();
      };
      
      // Fallback in case onvoiceschanged doesn't fire
      setTimeout(() => {
        if (synth.getVoices().length > 0) {
          getVoicesAndSpeak();
        } else {
          reject(new Error('Could not load speech synthesis voices'));
        }
      }, 1000);
    }
  });
};
