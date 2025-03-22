
/**
 * Text-to-speech utility for reading text aloud
 */

// Browser's native speech synthesis
const synth = window.speechSynthesis;

// Get available voices
const getVoices = (): Promise<SpeechSynthesisVoice[]> => {
  return new Promise((resolve) => {
    let voices = synth.getVoices();
    
    if (voices.length > 0) {
      resolve(voices);
      return;
    }
    
    // If voices aren't loaded yet, wait for them
    const voicesChangedHandler = () => {
      voices = synth.getVoices();
      resolve(voices);
      synth.removeEventListener('voiceschanged', voicesChangedHandler);
    };
    
    synth.addEventListener('voiceschanged', voicesChangedHandler);
  });
};

// Get Italian voice if available
const getItalianVoice = async (): Promise<SpeechSynthesisVoice | null> => {
  const voices = await getVoices();
  
  // Try to find an Italian voice
  const italianVoice = voices.find(voice => 
    voice.lang.includes('it') || // Italian language code
    voice.name.toLowerCase().includes('italian') || 
    voice.name.toLowerCase().includes('italia')
  );
  
  return italianVoice || null;
};

// Speak text
export const speak = async (text: string, language: 'it' | 'en' = 'it'): Promise<void> => {
  if (!text) return;
  
  try {
    // Cancel any ongoing speech
    if (synth.speaking) {
      synth.cancel();
    }
    
    const voices = await getVoices();
    
    // Set up utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Select voice based on language
    if (language === 'it') {
      const italianVoice = await getItalianVoice();
      if (italianVoice) {
        utterance.voice = italianVoice;
      } else {
        // If no Italian voice, try to use any voice but set lang to Italian
        utterance.lang = 'it-IT';
      }
    } else {
      // For English, try to find an English voice
      const englishVoice = voices.find(voice => 
        voice.lang.includes('en') || 
        voice.name.toLowerCase().includes('english')
      );
      
      if (englishVoice) {
        utterance.voice = englishVoice;
      } else {
        utterance.lang = 'en-US';
      }
    }
    
    // Speak
    synth.speak(utterance);
    
    // Return a promise that resolves when speech ends
    return new Promise((resolve) => {
      utterance.onend = () => {
        resolve();
      };
      
      // Also resolve if there's an error
      utterance.onerror = () => {
        console.error('Speech synthesis error');
        resolve();
      };
    });
  } catch (error) {
    console.error('Text-to-speech error:', error);
  }
};

// Check if text-to-speech is supported
export const isSpeechSupported = (): boolean => {
  return 'speechSynthesis' in window;
};

// Get all available voices (for settings)
export const getAllVoices = async (): Promise<SpeechSynthesisVoice[]> => {
  return await getVoices();
};

// Stop any ongoing speech
export const stopSpeaking = (): void => {
  if (synth.speaking) {
    synth.cancel();
  }
};
