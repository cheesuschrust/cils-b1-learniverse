
// Text-to-speech utility functions

// Define VoicePreference type
export interface VoicePreference {
  englishVoiceURI: string;
  italianVoiceURI: string;
  voiceRate: number;
  voicePitch: number;
}

// Check if speech synthesis is supported in the browser
export const isSpeechSupported = (): boolean => {
  return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
};

// Get available voices
export const getVoices = (): SpeechSynthesisVoice[] => {
  if (!isSpeechSupported()) {
    return [];
  }
  
  return window.speechSynthesis.getVoices();
};

// Get default voice preferences by selecting appropriate voices for English and Italian
export const getDefaultVoicePreferences = async (): Promise<VoicePreference> => {
  // Wait for voices to load if needed
  if (window.speechSynthesis.getVoices().length === 0) {
    await new Promise<void>((resolve) => {
      const voicesChanged = () => {
        window.speechSynthesis.removeEventListener('voiceschanged', voicesChanged);
        resolve();
      };
      window.speechSynthesis.addEventListener('voiceschanged', voicesChanged);
      
      // Add a timeout in case the event never fires
      setTimeout(() => {
        window.speechSynthesis.removeEventListener('voiceschanged', voicesChanged);
        resolve();
      }, 1000);
    });
  }
  
  const voices = getVoices();
  
  // Find default English voice
  const englishVoice = voices.find(
    voice => voice.lang.startsWith('en') || voice.name.toLowerCase().includes('english')
  );
  
  // Find default Italian voice
  const italianVoice = voices.find(
    voice => voice.lang.startsWith('it') || voice.name.toLowerCase().includes('italian')
  );
  
  return {
    englishVoiceURI: englishVoice?.voiceURI || '',
    italianVoiceURI: italianVoice?.voiceURI || '',
    voiceRate: 1.0,
    voicePitch: 1.0
  };
};

// Speak text with the specified options
export const speak = (
  text: string, 
  language?: string,
  voicePreference?: VoicePreference,
  options: {
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (error: any) => void
  } = {}
): Promise<void> => {
  if (!isSpeechSupported()) {
    return Promise.reject(new Error('Speech synthesis not supported'));
  }
  
  return new Promise((resolve, reject) => {
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set language
      if (language) {
        utterance.lang = language;
      }
      
      // Set voice options if preference is provided
      if (voicePreference) {
        // Set pitch and rate from preferences
        if (voicePreference.voicePitch !== undefined) {
          utterance.pitch = voicePreference.voicePitch;
        }
        
        if (voicePreference.voiceRate !== undefined) {
          utterance.rate = voicePreference.voiceRate;
        }
        
        // Set appropriate voice based on language
        const voices = getVoices();
        const isItalian = language === 'it' || language?.startsWith('it-');
        
        if (isItalian && voicePreference.italianVoiceURI) {
          const italianVoice = voices.find(v => v.voiceURI === voicePreference.italianVoiceURI);
          if (italianVoice) {
            utterance.voice = italianVoice;
          }
        } else if (voicePreference.englishVoiceURI) {
          const englishVoice = voices.find(v => v.voiceURI === voicePreference.englishVoiceURI);
          if (englishVoice) {
            utterance.voice = englishVoice;
          }
        }
      }
      
      // Event handlers
      utterance.onstart = () => {
        if (options.onStart) options.onStart();
      };
      
      utterance.onend = () => {
        if (options.onEnd) options.onEnd();
        resolve();
      };
      
      utterance.onerror = (event) => {
        if (options.onError) options.onError(event);
        reject(new Error(`Speech synthesis error: ${event.error}`));
      };
      
      // Start speaking
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      reject(error);
    }
  });
};

// Stop any ongoing speech
export const stopSpeaking = (): void => {
  if (isSpeechSupported()) {
    window.speechSynthesis.cancel();
  }
};

// Public API
export default {
  isSpeechSupported,
  getVoices,
  getDefaultVoicePreferences,
  speak,
  stopSpeaking
};
