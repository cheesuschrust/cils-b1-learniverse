
import { useState, useCallback } from 'react';
import * as textToSpeech from '@/utils/textToSpeech';

interface TTSOptions {
  language: 'en' | 'it';
  rate?: number;
  pitch?: number;
  voiceURI?: string;
}

export const useTTS = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Get available voices
  const getVoices = useCallback(async () => {
    try {
      return await textToSpeech.getAvailableVoices();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get voices'));
      return [];
    }
  }, []);

  // Get English voices
  const getEnglishVoices = useCallback(async () => {
    try {
      return await textToSpeech.getEnglishVoices();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get English voices'));
      return [];
    }
  }, []);

  // Get Italian voices
  const getItalianVoices = useCallback(async () => {
    try {
      return await textToSpeech.getItalianVoices();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get Italian voices'));
      return [];
    }
  }, []);

  // Speak text
  const speakText = useCallback(async (text: string, options: TTSOptions) => {
    try {
      setError(null);
      setIsSpeaking(true);
      setIsPaused(false);

      await textToSpeech.textToSpeech(text, {
        language: options.language,
        rate: options.rate,
        pitch: options.pitch,
        voiceURI: options.voiceURI
      });

      setIsSpeaking(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to speak text'));
      setIsSpeaking(false);
    }
  }, []);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    textToSpeech.stopSpeaking();
    setIsSpeaking(false);
    setIsPaused(false);
  }, []);

  // Pause speaking
  const pauseSpeaking = useCallback(() => {
    textToSpeech.pauseSpeaking();
    setIsPaused(true);
  }, []);

  // Resume speaking
  const resumeSpeaking = useCallback(() => {
    textToSpeech.resumeSpeaking();
    setIsPaused(false);
  }, []);

  // Check if speech synthesis is supported
  const isSpeechSupported = useCallback(() => {
    return textToSpeech.isSpeechSupported();
  }, []);

  return {
    speakText,
    stopSpeaking,
    pauseSpeaking,
    resumeSpeaking,
    getVoices,
    getEnglishVoices,
    getItalianVoices,
    isSpeechSupported,
    isSpeaking,
    isPaused,
    error
  };
};
