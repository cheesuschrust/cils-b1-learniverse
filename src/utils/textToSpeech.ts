
// Text-to-speech utility functions

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

// Speak text with the specified options
export const speak = (
  text: string, 
  options: {
    lang?: string,
    voiceName?: string,
    pitch?: number,
    rate?: number,
    volume?: number,
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
      if (options.lang) {
        utterance.lang = options.lang;
      }
      
      // Set other options
      if (options.pitch !== undefined) utterance.pitch = options.pitch;
      if (options.rate !== undefined) utterance.rate = options.rate;
      if (options.volume !== undefined) utterance.volume = options.volume;
      
      // Set voice if specified
      if (options.voiceName) {
        const voices = getVoices();
        const voice = voices.find(v => v.name === options.voiceName);
        if (voice) {
          utterance.voice = voice;
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

export default {
  isSpeechSupported,
  getVoices,
  speak,
  stopSpeaking
};
