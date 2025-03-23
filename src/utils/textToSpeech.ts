
/**
 * Text-to-speech utility for reading text aloud
 */

// Browser's native speech synthesis
const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

// Cache for voice preferences
let cachedVoices: SpeechSynthesisVoice[] = [];

export interface VoicePreference {
  italianVoiceURI: string | null;
  englishVoiceURI: string | null;
  voiceRate: number;
  voicePitch: number;
}

// Default voice preferences
const defaultVoicePreference: VoicePreference = {
  italianVoiceURI: null,
  englishVoiceURI: null,
  voiceRate: 1.0,
  voicePitch: 1.0
};

// Check if speech synthesis is supported
const checkSpeechSupport = (): boolean => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
};

// Get available voices
export const getVoices = (): Promise<SpeechSynthesisVoice[]> => {
  return new Promise((resolve) => {
    if (!checkSpeechSupport()) {
      console.warn('Speech synthesis not supported in this browser');
      resolve([]);
      return;
    }
    
    if (cachedVoices.length > 0) {
      resolve(cachedVoices);
      return;
    }
    
    let voices = synth?.getVoices() || [];
    
    if (voices.length > 0) {
      cachedVoices = voices;
      resolve(voices);
      return;
    }
    
    // If voices aren't loaded yet, wait for them
    const voicesChangedHandler = () => {
      voices = synth?.getVoices() || [];
      cachedVoices = voices;
      resolve(voices);
      synth?.removeEventListener('voiceschanged', voicesChangedHandler);
    };
    
    synth?.addEventListener('voiceschanged', voicesChangedHandler);
    
    // Fallback if event never fires
    setTimeout(() => {
      if (cachedVoices.length === 0) {
        console.warn('Voice list could not be loaded');
        resolve([]);
      }
    }, 1000);
  });
};

// Get voice by URI
const getVoiceByURI = async (voiceURI: string | null): Promise<SpeechSynthesisVoice | null> => {
  if (!voiceURI) return null;
  
  const voices = await getVoices();
  return voices.find(voice => voice.voiceURI === voiceURI) || null;
};

// Get Italian voice by preference or fallback
const getPreferredItalianVoice = async (preference?: VoicePreference): Promise<SpeechSynthesisVoice | null> => {
  const voices = await getVoices();
  
  // First try to get the preferred voice by URI
  if (preference?.italianVoiceURI) {
    const preferredVoice = await getVoiceByURI(preference.italianVoiceURI);
    if (preferredVoice) return preferredVoice;
  }
  
  // Fallback to any Italian voice
  const italianVoice = voices.find(voice => 
    voice.lang.includes('it') || // Italian language code
    voice.name.toLowerCase().includes('italian') || 
    voice.name.toLowerCase().includes('italia')
  );
  
  return italianVoice || null;
};

// Get English voice by preference or fallback
const getPreferredEnglishVoice = async (preference?: VoicePreference): Promise<SpeechSynthesisVoice | null> => {
  const voices = await getVoices();
  
  // First try to get the preferred voice by URI
  if (preference?.englishVoiceURI) {
    const preferredVoice = await getVoiceByURI(preference.englishVoiceURI);
    if (preferredVoice) return preferredVoice;
  }
  
  // Fallback to any English voice
  const englishVoice = voices.find(voice => 
    voice.lang.includes('en') || 
    voice.name.toLowerCase().includes('english')
  );
  
  return englishVoice || null;
};

// Speak text
export const speak = async (
  text: string, 
  language: 'it' | 'en' = 'it', 
  voicePreference?: VoicePreference
): Promise<void> => {
  if (!text) return;
  
  // Check for speech synthesis support
  if (!checkSpeechSupport()) {
    console.error('Speech synthesis not supported in this browser');
    return;
  }
  
  try {
    // Cancel any ongoing speech
    if (synth?.speaking) {
      synth.cancel();
    }
    
    // Set up utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Apply rate and pitch if provided
    if (voicePreference) {
      utterance.rate = voicePreference.voiceRate || 1.0;
      utterance.pitch = voicePreference.voicePitch || 1.0;
    }
    
    // Select voice based on language
    if (language === 'it') {
      const italianVoice = await getPreferredItalianVoice(voicePreference);
      if (italianVoice) {
        utterance.voice = italianVoice;
      } else {
        // If no Italian voice, try to use any voice but set lang to Italian
        utterance.lang = 'it-IT';
      }
    } else {
      const englishVoice = await getPreferredEnglishVoice(voicePreference);
      if (englishVoice) {
        utterance.voice = englishVoice;
      } else {
        utterance.lang = 'en-US';
      }
    }
    
    // Speak
    synth?.speak(utterance);
    
    // Return a promise that resolves when speech ends
    return new Promise((resolve) => {
      utterance.onend = () => {
        resolve();
      };
      
      // Also resolve if there's an error
      utterance.onerror = (e) => {
        console.error('Speech synthesis error:', e);
        resolve();
      };
      
      // Fallback to resolve in case the event never fires
      setTimeout(() => {
        if (synth?.speaking) {
          resolve();
        }
      }, 10000); // 10 second timeout
    });
  } catch (error) {
    console.error('Text-to-speech error:', error);
  }
};

// Get a sample of a voice
export const speakSample = async (voiceURI: string, language: 'it' | 'en'): Promise<void> => {
  const sampleText = language === 'it' 
    ? "Ciao, questa è una prova della voce selezionata."
    : "Hello, this is a test of the selected voice.";
    
  const voice = await getVoiceByURI(voiceURI);
  
  if (!voice) {
    console.error('Voice not found');
    return;
  }
  
  // Cancel any ongoing speech
  if (synth?.speaking) {
    synth.cancel();
  }
  
  const utterance = new SpeechSynthesisUtterance(sampleText);
  utterance.voice = voice;
  utterance.lang = voice.lang;
  
  // Speak
  synth?.speak(utterance);
};

// Check if text-to-speech is supported
export const isSpeechSupported = (): boolean => {
  return checkSpeechSupport();
};

// Get all available voices (for settings)
export const getAllVoices = async (): Promise<SpeechSynthesisVoice[]> => {
  return await getVoices();
};

// Get all Italian voices
export const getItalianVoices = async (): Promise<SpeechSynthesisVoice[]> => {
  const voices = await getVoices();
  return voices.filter(voice => 
    voice.lang.includes('it') || 
    voice.name.toLowerCase().includes('italian') || 
    voice.name.toLowerCase().includes('italia')
  );
};

// Get all English voices
export const getEnglishVoices = async (): Promise<SpeechSynthesisVoice[]> => {
  const voices = await getVoices();
  return voices.filter(voice => 
    voice.lang.includes('en') || 
    voice.name.toLowerCase().includes('english')
  );
};

// Stop any ongoing speech
export const stopSpeaking = (): void => {
  if (synth?.speaking) {
    synth.cancel();
  }
};

// Get current voice preferences
export const getCurrentVoicePreference = (): VoicePreference => {
  try {
    const saved = localStorage.getItem('voicePreference');
    return saved ? JSON.parse(saved) : defaultVoicePreference;
  } catch (error) {
    console.error('Error retrieving voice preference:', error);
    return defaultVoicePreference;
  }
};

// Save voice preferences
export const saveVoicePreference = (preference: VoicePreference): void => {
  try {
    localStorage.setItem('voicePreference', JSON.stringify(preference));
  } catch (error) {
    console.error('Error saving voice preference:', error);
  }
};
