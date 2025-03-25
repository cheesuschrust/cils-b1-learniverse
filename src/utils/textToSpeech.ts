export type VoicePreference = {
  englishVoiceURI: string;
  italianVoiceURI: string;
  voiceRate: number;
  voicePitch: number;
};

// Check if the browser supports speech synthesis
export const isSpeechSupported = (): boolean => {
  return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
};

// Get available voices, handling the async nature of voice loading
export const getAvailableVoices = (): Promise<SpeechSynthesisVoice[]> => {
  return new Promise((resolve) => {
    // Check if browser supports speech synthesis
    if (!isSpeechSupported()) {
      resolve([]);
      return;
    }

    // Get voices that are already loaded
    const voices = window.speechSynthesis.getVoices();
    
    if (voices.length > 0) {
      resolve(voices);
      return;
    }

    // If voices aren't loaded yet, wait for the voiceschanged event
    window.speechSynthesis.onvoiceschanged = () => {
      const updatedVoices = window.speechSynthesis.getVoices();
      resolve(updatedVoices);
    };
  });
};

// Get a specific voice by URI or a fallback by language
export const getVoice = async (
  language: 'en' | 'it',
  voicePreference: VoicePreference
): Promise<SpeechSynthesisVoice | null> => {
  if (!isSpeechSupported()) {
    return null;
  }

  const voices = await getAvailableVoices();
  
  // Try to find the voice by URI from preferences
  const preferredVoiceURI = language === 'en' 
    ? voicePreference.englishVoiceURI 
    : voicePreference.italianVoiceURI;
  
  if (preferredVoiceURI) {
    const preferredVoice = voices.find(voice => voice.voiceURI === preferredVoiceURI);
    if (preferredVoice) {
      return preferredVoice;
    }
  }
  
  // Fallback: find a voice by language
  const langCode = language === 'en' ? 'en' : 'it';
  
  // First try to find a voice that exactly matches the language code
  let matchingVoice = voices.find(voice => 
    voice.lang.toLowerCase().startsWith(langCode) && voice.localService
  );
  
  // If no local voice found, try any matching voice
  if (!matchingVoice) {
    matchingVoice = voices.find(voice => 
      voice.lang.toLowerCase().startsWith(langCode)
    );
  }
  
  // Last resort: try to find a voice by name containing the language
  if (!matchingVoice) {
    const languageName = language === 'en' ? 'english' : 'italian';
    matchingVoice = voices.find(voice => 
      voice.name.toLowerCase().includes(languageName)
    );
  }
  
  return matchingVoice || null;
};

// Speak text using the speech synthesis API
export const speak = async (
  text: string,
  language: 'en' | 'it' = 'it',
  voicePreference: VoicePreference = {
    englishVoiceURI: '',
    italianVoiceURI: '',
    voiceRate: 1,
    voicePitch: 1
  }
): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    if (!isSpeechSupported()) {
      reject(new Error('Speech synthesis is not supported in this browser'));
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set language based on parameter
    utterance.lang = language === 'en' ? 'en-US' : 'it-IT';
    
    // Apply voice preference settings
    utterance.rate = voicePreference.voiceRate;
    utterance.pitch = voicePreference.voicePitch;
    
    // Try to get the preferred voice
    const voice = await getVoice(language, voicePreference);
    if (voice) {
      utterance.voice = voice;
    }
    
    // Set up event handlers
    utterance.onend = () => {
      resolve();
    };
    
    utterance.onerror = (event) => {
      reject(new Error(`Speech synthesis error: ${event.error}`));
    };
    
    // Speak the text
    window.speechSynthesis.speak(utterance);
    
    // Safari and some browsers have a bug where speech synthesis stops after about 15 seconds
    // This is a workaround to keep it going
    const intervalId = setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        clearInterval(intervalId);
        return;
      }
      
      // Force the speech synthesis to continue by pausing and resuming
      window.speechSynthesis.pause();
      window.speechSynthesis.resume();
    }, 10000);
  });
};

// Stop any ongoing speech
export const stopSpeaking = (): void => {
  if (isSpeechSupported()) {
    window.speechSynthesis.cancel();
  }
};

// Check if speech synthesis is currently speaking
export const isSpeaking = (): boolean => {
  if (!isSpeechSupported()) {
    return false;
  }
  
  return window.speechSynthesis.speaking;
};

// Get the default voice preferences
export const getDefaultVoicePreferences = async (): Promise<VoicePreference> => {
  const voices = await getAvailableVoices();
  
  let englishVoiceURI = '';
  let italianVoiceURI = '';
  
  // Try to find suitable voices
  const englishVoice = voices.find(voice => 
    voice.lang.toLowerCase().startsWith('en') && voice.localService
  ) || voices.find(voice => 
    voice.lang.toLowerCase().startsWith('en')
  );
  
  const italianVoice = voices.find(voice => 
    voice.lang.toLowerCase().startsWith('it') && voice.localService
  ) || voices.find(voice => 
    voice.lang.toLowerCase().startsWith('it')
  );
  
  if (englishVoice) {
    englishVoiceURI = englishVoice.voiceURI;
  }
  
  if (italianVoice) {
    italianVoiceURI = italianVoice.voiceURI;
  }
  
  return {
    englishVoiceURI,
    italianVoiceURI,
    voiceRate: 1,
    voicePitch: 1
  };
};
