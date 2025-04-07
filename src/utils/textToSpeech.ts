
export interface VoicePreference {
  voiceId?: string;
  pitch?: number;
  speed: number;
  volume?: number;
  language: 'en' | 'it';
}

export const defaultVoicePreference: VoicePreference = {
  speed: 1.0,
  language: 'it'
};

export async function speakText(text: string, preference: VoicePreference = defaultVoicePreference): Promise<void> {
  // Check if browser supports speech synthesis
  if (!('speechSynthesis' in window)) {
    console.error('Your browser does not support speech synthesis');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Create utterance
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Set language
  utterance.lang = preference.language === 'it' ? 'it-IT' : 'en-US';
  
  // Set rate (speed)
  utterance.rate = preference.speed;
  
  // Set pitch if specified
  if (preference.pitch) {
    utterance.pitch = preference.pitch;
  }
  
  // Set volume if specified
  if (preference.volume) {
    utterance.volume = preference.volume;
  }
  
  // Find voice if voiceId is specified
  if (preference.voiceId) {
    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = voices.find(voice => voice.voiceURI === preference.voiceId);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
  } else {
    // Try to use a voice matching the language
    const voices = window.speechSynthesis.getVoices();
    const langVoices = voices.filter(voice => voice.lang.startsWith(preference.language === 'it' ? 'it' : 'en'));
    if (langVoices.length > 0) {
      utterance.voice = langVoices[0];
    }
  }

  // Speak
  window.speechSynthesis.speak(utterance);
}

export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (!('speechSynthesis' in window)) {
    console.error('Your browser does not support speech synthesis');
    return [];
  }
  
  return window.speechSynthesis.getVoices();
}
