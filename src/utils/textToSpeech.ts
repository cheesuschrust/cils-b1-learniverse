
// Text-to-speech utility functions

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
 * Get the best available voice for a given language
 */
export const getBestVoice = (language: string, voicePreference?: string): SpeechSynthesisVoice | null => {
  if (!isSpeechSupported()) return null;
  
  const voices = window.speechSynthesis.getVoices();
  
  // If we have a specific voice preference, try to find it
  if (voicePreference) {
    const preferredVoice = voices.find(voice => 
      voice.voiceURI.toLowerCase() === voicePreference.toLowerCase() ||
      voice.name.toLowerCase() === voicePreference.toLowerCase()
    );
    if (preferredVoice) return preferredVoice;
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
export const speak = (text: string, language: 'it' | 'en' = 'it', voicePreference?: string): Promise<void> => {
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
        
        // Set a good default rate and pitch
        utterance.rate = 0.9; // Slightly slower than default
        utterance.pitch = 1.0;
        
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
