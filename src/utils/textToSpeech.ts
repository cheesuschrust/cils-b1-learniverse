
/**
 * Returns a list of available speech synthesis voices on the current device
 * @returns An array of SpeechSynthesisVoice objects
 */
export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    return window.speechSynthesis.getVoices();
  }
  return [];
}

/**
 * Speaks the provided text using the specified voice
 * @param text The text to be spoken
 * @param voiceName Optional name of the voice to use
 * @returns Promise that resolves when speech is completed or rejects on error
 */
export function speak(text: string, voiceName?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    if (voiceName) {
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(v => v.name === voiceName);
      if (voice) {
        utterance.voice = voice;
      }
    }

    utterance.onend = () => resolve();
    utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`));

    window.speechSynthesis.speak(utterance);
  });
}

// Export getAvailableVoices as default for backward compatibility
export default getAvailableVoices;
