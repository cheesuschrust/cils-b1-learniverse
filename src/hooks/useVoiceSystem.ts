
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { VoiceModel, VoiceIntegrationSettings } from '@/types/voice-integration';
import { supabase } from '@/lib/supabase-client';

interface UseVoiceSystemOptions {
  defaultLanguage?: 'en' | 'it';
  defaultRate?: number;
  defaultPitch?: number;
  defaultVolume?: number;
  autoConnect?: boolean;
}

export const useVoiceSystem = (options: UseVoiceSystemOptions = {}) => {
  const { toast } = useToast();
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentVoice, setCurrentVoice] = useState<VoiceModel | null>(null);
  const [availableVoices, setAvailableVoices] = useState<VoiceModel[]>([]);
  const [settings, setSettings] = useState<VoiceIntegrationSettings | null>(null);
  
  // Initialize voice system
  useEffect(() => {
    if (options.autoConnect) {
      initializeVoiceSystem();
    }
  }, [options.autoConnect]);
  
  // Initialize the voice system
  const initializeVoiceSystem = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First, check if browser supports speech synthesis
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        // Load system settings from server or localStorage
        const voiceSettings = await loadVoiceSettings();
        setSettings(voiceSettings);
        
        // Load available voices
        await loadAvailableVoices();
        
        setIsReady(true);
      } else {
        throw new Error('Speech synthesis not supported in this browser');
      }
    } catch (err) {
      console.error('Failed to initialize voice system:', err);
      setError(err instanceof Error ? err : new Error('Unknown error initializing voice system'));
      
      toast({
        title: 'Voice System Error',
        description: 'Failed to initialize the voice system. Some features may not work correctly.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  // Load voice settings from server or localStorage
  const loadVoiceSettings = useCallback(async (): Promise<VoiceIntegrationSettings> => {
    try {
      // Try to load from server first
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .eq('key', 'voice_settings')
        .single();
      
      if (error || !data) {
        // If server fails, try localStorage
        const localSettings = localStorage.getItem('voiceSettings');
        if (localSettings) {
          return JSON.parse(localSettings);
        }
        
        // If no settings found, return defaults
        return {
          defaultEnglishVoice: '',
          defaultItalianVoice: '',
          defaultVoiceRate: options.defaultRate || 1.0,
          defaultVoicePitch: options.defaultPitch || 1.0,
          defaultVoiceVolume: options.defaultVolume || 0.8,
          provider: 'browser',
          apiKeys: {},
          enableTextToSpeech: true,
          enableSpeechRecognition: true,
          enablePronunciationFeedback: true,
          preferLocalVoices: true,
          fallbackToRemote: true,
          cacheAudio: true,
          maxCacheSize: 100,
          audioQuality: 'medium',
          trackUsage: true,
          usageLimits: {
            daily: 1000,
            monthly: 20000
          }
        };
      }
      
      return data.value;
    } catch (error) {
      console.error('Error loading voice settings:', error);
      
      // Return default settings in case of error
      return {
        defaultEnglishVoice: '',
        defaultItalianVoice: '',
        defaultVoiceRate: options.defaultRate || 1.0,
        defaultVoicePitch: options.defaultPitch || 1.0,
        defaultVoiceVolume: options.defaultVolume || 0.8,
        provider: 'browser',
        apiKeys: {},
        enableTextToSpeech: true,
        enableSpeechRecognition: true,
        enablePronunciationFeedback: true,
        preferLocalVoices: true,
        fallbackToRemote: true,
        cacheAudio: true,
        maxCacheSize: 100,
        audioQuality: 'medium',
        trackUsage: true,
        usageLimits: {
          daily: 1000,
          monthly: 20000
        }
      };
    }
  }, [options.defaultRate, options.defaultPitch, options.defaultVolume]);
  
  // Load available voices
  const loadAvailableVoices = useCallback(async () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return [];
    }
    
    return new Promise<VoiceModel[]>((resolve) => {
      const voices = window.speechSynthesis.getVoices();
      
      if (voices.length > 0) {
        processVoices(voices);
        resolve(mapVoices(voices));
      } else {
        window.speechSynthesis.onvoiceschanged = () => {
          const updatedVoices = window.speechSynthesis.getVoices();
          processVoices(updatedVoices);
          resolve(mapVoices(updatedVoices));
        };
      }
    });
  }, []);
  
  // Process voices to set available voices in state
  const processVoices = useCallback((speechVoices: SpeechSynthesisVoice[]) => {
    const mappedVoices = mapVoices(speechVoices);
    setAvailableVoices(mappedVoices);
    
    // Try to set default voices based on language if not already set
    if (settings) {
      if (!settings.defaultEnglishVoice) {
        const englishVoice = mappedVoices.find(v => 
          v.language.startsWith('en') && v.provider === 'browser'
        );
        if (englishVoice) {
          setSettings(prev => prev ? {
            ...prev,
            defaultEnglishVoice: englishVoice.id
          } : null);
        }
      }
      
      if (!settings.defaultItalianVoice) {
        const italianVoice = mappedVoices.find(v => 
          v.language.startsWith('it') && v.provider === 'browser'
        );
        if (italianVoice) {
          setSettings(prev => prev ? {
            ...prev,
            defaultItalianVoice: italianVoice.id
          } : null);
        }
      }
    }
  }, [settings]);
  
  // Map SpeechSynthesisVoice objects to our VoiceModel format
  const mapVoices = useCallback((speechVoices: SpeechSynthesisVoice[]): VoiceModel[] => {
    return speechVoices.map(voice => ({
      id: voice.voiceURI,
      name: voice.name,
      provider: 'browser',
      language: voice.lang,
      gender: voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('woman') 
        ? 'female' 
        : voice.name.toLowerCase().includes('male') || voice.name.toLowerCase().includes('man')
        ? 'male'
        : 'neutral',
      isPremium: false,
      isDefault: voice.default
    }));
  }, []);
  
  // Speak text using browser's speech synthesis
  const speakWithBrowser = useCallback(async (
    text: string, 
    language: 'en' | 'it' = options.defaultLanguage || 'en',
    voiceOptions?: { rate?: number; pitch?: number; volume?: number; voiceId?: string }
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!settings?.enableTextToSpeech) {
        reject(new Error('Text-to-speech is disabled in settings'));
        return;
      }
      
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        reject(new Error('Speech synthesis not supported in this browser'));
        return;
      }
      
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set language
      utterance.lang = language === 'en' ? 'en-US' : 'it-IT';
      
      // Set rate and pitch from options or settings
      utterance.rate = voiceOptions?.rate || settings.defaultVoiceRate;
      utterance.pitch = voiceOptions?.pitch || settings.defaultVoicePitch;
      utterance.volume = voiceOptions?.volume || settings.defaultVoiceVolume;
      
      // Set voice if voiceId is provided
      if (voiceOptions?.voiceId) {
        const voices = window.speechSynthesis.getVoices();
        const voice = voices.find(v => v.voiceURI === voiceOptions.voiceId);
        if (voice) {
          utterance.voice = voice;
        }
      } else {
        // Use default voice based on language
        const defaultVoiceId = language === 'en' 
          ? settings.defaultEnglishVoice 
          : settings.defaultItalianVoice;
        
        if (defaultVoiceId) {
          const voices = window.speechSynthesis.getVoices();
          const voice = voices.find(v => v.voiceURI === defaultVoiceId);
          if (voice) {
            utterance.voice = voice;
          }
        }
      }
      
      // Set event handlers
      utterance.onstart = () => {
        setIsSpeaking(true);
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
        resolve();
      };
      
      utterance.onerror = (event) => {
        setIsSpeaking(false);
        reject(new Error(`Speech synthesis error: ${event.error}`));
      };
      
      // Speak the text
      window.speechSynthesis.speak(utterance);
    });
  }, [options.defaultLanguage, settings]);
  
  // Speak text using ElevenLabs API
  const speakWithElevenLabs = useCallback(async (
    text: string,
    language: 'en' | 'it' = options.defaultLanguage || 'en',
    voiceOptions?: { rate?: number; pitch?: number; voiceId?: string }
  ): Promise<void> => {
    if (!settings?.enableTextToSpeech) {
      throw new Error('Text-to-speech is disabled in settings');
    }
    
    if (!settings.apiKeys.elevenlabs) {
      throw new Error('ElevenLabs API key not set');
    }
    
    setIsSpeaking(true);
    
    try {
      // Get the appropriate voice ID
      const voiceId = voiceOptions?.voiceId || 
        (language === 'en' ? settings.defaultEnglishVoice : settings.defaultItalianVoice);
      
      if (!voiceId) {
        throw new Error(`No ${language === 'en' ? 'English' : 'Italian'} voice selected`);
      }
      
      // Call Edge Function for ElevenLabs TTS
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: {
          text,
          voice: voiceId,
          model: 'eleven_multilingual_v2'
        }
      });
      
      if (error) {
        throw new Error(`Text-to-speech error: ${error.message}`);
      }
      
      if (!data?.audioContent) {
        throw new Error('No audio content returned from API');
      }
      
      // Play the audio
      const audioBlob = base64ToBlob(data.audioContent, 'audio/mp3');
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      // Apply volume
      audio.volume = settings.defaultVoiceVolume;
      
      // Play and track completion
      return new Promise((resolve, reject) => {
        audio.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
          resolve();
        };
        
        audio.onerror = (e) => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
          reject(new Error(`Audio playback error: ${e}`));
        };
        
        audio.play().catch(err => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
          reject(err);
        });
      });
    } catch (error) {
      setIsSpeaking(false);
      throw error;
    }
  }, [options.defaultLanguage, settings]);
  
  // Speak text using OpenAI API
  const speakWithOpenAI = useCallback(async (
    text: string,
    language: 'en' | 'it' = options.defaultLanguage || 'en',
    voiceOptions?: { voiceId?: string }
  ): Promise<void> => {
    if (!settings?.enableTextToSpeech) {
      throw new Error('Text-to-speech is disabled in settings');
    }
    
    if (!settings.apiKeys.openai) {
      throw new Error('OpenAI API key not set');
    }
    
    setIsSpeaking(true);
    
    try {
      // Get the appropriate voice ID (for OpenAI, this is just the voice name)
      const voiceId = voiceOptions?.voiceId || 
        (language === 'en' ? 'echo' : 'alloy'); // Default voices
      
      // Call Edge Function for OpenAI TTS
      const { data, error } = await supabase.functions.invoke('ai-text-to-speech', {
        body: {
          text,
          voice: voiceId,
          model: 'tts-1'
        }
      });
      
      if (error) {
        throw new Error(`Text-to-speech error: ${error.message}`);
      }
      
      if (!data?.audioContent) {
        throw new Error('No audio content returned from API');
      }
      
      // Play the audio
      const audioBlob = base64ToBlob(data.audioContent, 'audio/mp3');
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      // Apply volume
      audio.volume = settings.defaultVoiceVolume;
      
      // Play and track completion
      return new Promise((resolve, reject) => {
        audio.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
          resolve();
        };
        
        audio.onerror = (e) => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
          reject(new Error(`Audio playback error: ${e}`));
        };
        
        audio.play().catch(err => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
          reject(err);
        });
      });
    } catch (error) {
      setIsSpeaking(false);
      throw error;
    }
  }, [options.defaultLanguage, settings]);
  
  // Utility to convert base64 to Blob
  const base64ToBlob = (base64: string, mimeType: string): Blob => {
    const byteCharacters = atob(base64);
    const byteArrays = [];
    
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    
    return new Blob(byteArrays, { type: mimeType });
  };
  
  // Main speak function that routes to the appropriate provider
  const speak = useCallback(async (
    text: string,
    options: {
      language?: 'en' | 'it';
      rate?: number;
      pitch?: number;
      volume?: number;
      voiceId?: string;
    } = {}
  ): Promise<void> => {
    if (!settings) {
      await initializeVoiceSystem();
    }
    
    if (!settings?.enableTextToSpeech) {
      throw new Error('Text-to-speech is disabled in settings');
    }
    
    setError(null);
    
    try {
      const language = options.language || options.defaultLanguage || 'en';
      
      switch (settings.provider) {
        case 'elevenlabs':
          return speakWithElevenLabs(text, language, options);
        case 'openai':
          return speakWithOpenAI(text, language, options);
        case 'browser':
        default:
          return speakWithBrowser(text, language, options);
      }
    } catch (err) {
      console.error('Error speaking text:', err);
      setError(err instanceof Error ? err : new Error('Unknown error speaking text'));
      
      // If we're using a premium provider and it fails, try falling back to browser
      if (settings.provider !== 'browser' && settings.fallbackToRemote) {
        try {
          toast({
            title: 'Falling back to browser voices',
            description: 'There was an issue with the premium voice service.',
            variant: 'destructive'
          });
          
          return speakWithBrowser(text, options.language || options.defaultLanguage || 'en', options);
        } catch (fallbackErr) {
          console.error('Error with fallback speech:', fallbackErr);
          throw fallbackErr;
        }
      }
      
      throw err;
    }
  }, [
    settings, 
    initializeVoiceSystem, 
    speakWithBrowser, 
    speakWithElevenLabs, 
    speakWithOpenAI, 
    toast, 
    options.defaultLanguage
  ]);
  
  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);
  
  // Update settings
  const updateSettings = useCallback(async (newSettings: Partial<VoiceIntegrationSettings>): Promise<void> => {
    if (!settings) {
      throw new Error('Voice system not initialized');
    }
    
    const updatedSettings = {
      ...settings,
      ...newSettings
    };
    
    try {
      // Save to server
      const { error } = await supabase
        .from('system_settings')
        .upsert(
          { 
            key: 'voice_settings', 
            value: updatedSettings,
            updated_at: new Date().toISOString()
          }, 
          { onConflict: 'key' }
        );
      
      if (error) {
        throw error;
      }
      
      // Save to local state
      setSettings(updatedSettings);
      
      // Backup to localStorage
      localStorage.setItem('voiceSettings', JSON.stringify(updatedSettings));
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error updating voice settings:', error);
      throw error;
    }
  }, [settings]);
  
  return {
    isReady,
    isLoading,
    isSpeaking,
    isRecording,
    error,
    currentVoice,
    availableVoices,
    settings,
    speak,
    stopSpeaking,
    updateSettings,
    initializeVoiceSystem,
    refreshVoices: loadAvailableVoices
  };
};

export default useVoiceSystem;
