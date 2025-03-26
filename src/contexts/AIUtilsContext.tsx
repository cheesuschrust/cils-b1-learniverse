
import React, { createContext, useState, useCallback, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { AIPreference } from '@/types/interface-fixes';

interface AIUtilsContextValue {
  settings: AIPreference;
  updateSettings: (newSettings: Partial<AIPreference>) => void;
  getSpeechVoice: (language: 'italian' | 'english') => SpeechSynthesisVoice | null;
  speakText: (text: string, language?: 'italian' | 'english') => void;
  stopSpeaking: () => void;
  isLoading: boolean;
}

const defaultSettings: AIPreference = {
  defaultModelSize: 'medium',
  useWebGPU: false,
  voiceRate: 1.0,
  voicePitch: 1.0,
  italianVoiceURI: '',
  englishVoiceURI: '',
  defaultLanguage: 'english',
  processOnDevice: true,
  dataCollection: false,
  assistanceLevel: 2,
  autoLoadModels: true,
  cacheModels: true,
  processingSetting: 'balanced',
  optimizationLevel: 1,
  anonymousAnalytics: false,
  contentFiltering: true,
};

export const AIUtilsContext = createContext<{
  settings: AIPreference;
  updateSettings: (newSettings: Partial<AIPreference>) => void;
  getSpeechVoice: (language: 'italian' | 'english') => SpeechSynthesisVoice | null;
  speakText: (text: string, language?: 'italian' | 'english') => void;
  stopSpeaking: () => void;
  isLoading: boolean;
}>({
  settings: defaultSettings,
  updateSettings: () => {},
  getSpeechVoice: () => null,
  speakText: () => {},
  stopSpeaking: () => {},
  isLoading: false,
});

export const AIUtilsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<AIPreference>(defaultSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const { toast } = useToast();

  // Initialize voices when available
  useEffect(() => {
    const synth = window.speechSynthesis;
    
    // Get available voices
    const getVoices = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
      
      // Try to set default voice URIs if not already set
      setSettings(prev => {
        const italianVoice = availableVoices.find(voice => voice.lang.includes('it-'));
        const englishVoice = availableVoices.find(voice => voice.lang.includes('en-'));
        
        return {
          ...prev,
          italianVoiceURI: prev.italianVoiceURI || italianVoice?.voiceURI || '',
          englishVoiceURI: prev.englishVoiceURI || englishVoice?.voiceURI || '',
        };
      });
    };
    
    // Try to get voices immediately (works in Chrome)
    getVoices();
    
    // Set up voice changed event for other browsers
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = getVoices;
    }
    
    // Load settings from localStorage if available
    const savedSettings = localStorage.getItem('aiSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(prevSettings => ({
          ...prevSettings,
          ...parsedSettings,
        }));
      } catch (error) {
        console.error('Error loading AI settings:', error);
      }
    }
    
    return () => {
      if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = null;
      }
    };
  }, []);
  
  // Save settings to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('aiSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving AI settings:', error);
    }
  }, [settings]);
  
  const updateSettings = useCallback((newSettings: Partial<AIPreference>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);
  
  const getSpeechVoice = useCallback((language: 'italian' | 'english'): SpeechSynthesisVoice | null => {
    if (!voices.length) return null;
    
    const voiceURI = language === 'italian' 
      ? settings.italianVoiceURI 
      : settings.englishVoiceURI;
    
    // Try to find the voice by URI first
    if (voiceURI) {
      const voiceByURI = voices.find(voice => voice.voiceURI === voiceURI);
      if (voiceByURI) return voiceByURI;
    }
    
    // Fallback to finding a voice by language
    const langPrefix = language === 'italian' ? 'it' : 'en';
    const fallbackVoice = voices.find(voice => voice.lang.startsWith(langPrefix));
    
    // If still no match, just use the first available voice
    return fallbackVoice || voices[0] || null;
  }, [voices, settings.italianVoiceURI, settings.englishVoiceURI]);
  
  const speakText = useCallback((text: string, language?: 'italian' | 'english') => {
    try {
      if (!text) return;
      
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Determine language to use
      const langToUse = language || settings.defaultLanguage;
      
      // Set voice based on language
      const voice = getSpeechVoice(langToUse);
      if (voice) {
        utterance.voice = voice;
      }
      
      // Set rate and pitch
      utterance.rate = settings.voiceRate;
      utterance.pitch = settings.voicePitch;
      
      // Cancel any ongoing speech
      synth.cancel();
      
      // Speak the text
      synth.speak(utterance);
    } catch (error) {
      console.error('Error with speech synthesis:', error);
      toast({
        title: 'Speech Error',
        description: 'Unable to play audio. Please try again.',
        variant: 'destructive',
      });
    }
  }, [settings.defaultLanguage, settings.voiceRate, settings.voicePitch, getSpeechVoice, toast]);
  
  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
  }, []);

  const value = {
    settings,
    updateSettings,
    getSpeechVoice,
    speakText,
    stopSpeaking,
    isLoading,
  };

  return (
    <AIUtilsContext.Provider value={value}>
      {children}
    </AIUtilsContext.Provider>
  );
};

export type UseAIPreferencesReturn = {
  settings: AIPreference;
  updateSettings: (newSettings: Partial<AIPreference>) => void;
};

export const useAIPreferences = (): UseAIPreferencesReturn => {
  const context = React.useContext(AIUtilsContext);
  
  if (context === undefined) {
    throw new Error('useAIPreferences must be used within an AIUtilsProvider');
  }
  
  return {
    settings: context.settings,
    updateSettings: context.updateSettings,
  };
};
