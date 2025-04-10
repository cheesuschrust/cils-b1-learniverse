
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useVoiceSystem } from '@/hooks/useVoiceSystem';
import { VoiceModel, VoiceIntegrationSettings } from '@/types/voice-integration';
import { useToast } from '@/hooks/use-toast';

interface VoiceSystemContextType {
  speak: (text: string, options?: { language?: 'en' | 'it'; voiceId?: string; rate?: number; pitch?: number; volume?: number }) => Promise<void>;
  stopSpeaking: () => void;
  isReady: boolean;
  isLoading: boolean;
  isSpeaking: boolean;
  error: Error | null;
  availableVoices: VoiceModel[];
  settings: VoiceIntegrationSettings | null;
  refreshVoices: () => Promise<VoiceModel[]>;
  updateSettings: (settings: Partial<VoiceIntegrationSettings>) => Promise<void>;
}

const VoiceSystemContext = createContext<VoiceSystemContextType | undefined>(undefined);

export const VoiceSystemProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [autoInitialized, setAutoInitialized] = useState(false);
  
  const voiceSystem = useVoiceSystem({
    autoConnect: false, // We'll handle initialization ourselves
  });
  
  // Initialize on first render
  useEffect(() => {
    if (!autoInitialized) {
      voiceSystem.initializeVoiceSystem()
        .catch(error => {
          console.error('Failed to initialize voice system:', error);
          toast({
            title: 'Voice System',
            description: 'Voice features may be limited due to initialization issues',
            variant: 'destructive',
          });
        })
        .finally(() => {
          setAutoInitialized(true);
        });
    }
  }, [autoInitialized, voiceSystem, toast]);
  
  const contextValue: VoiceSystemContextType = {
    speak: voiceSystem.speak,
    stopSpeaking: voiceSystem.stopSpeaking,
    isReady: voiceSystem.isReady,
    isLoading: voiceSystem.isLoading,
    isSpeaking: voiceSystem.isSpeaking,
    error: voiceSystem.error,
    availableVoices: voiceSystem.availableVoices,
    settings: voiceSystem.settings,
    refreshVoices: voiceSystem.refreshVoices,
    updateSettings: voiceSystem.updateSettings,
  };
  
  return (
    <VoiceSystemContext.Provider value={contextValue}>
      {children}
    </VoiceSystemContext.Provider>
  );
};

export const useVoiceSystemContext = (): VoiceSystemContextType => {
  const context = useContext(VoiceSystemContext);
  if (context === undefined) {
    throw new Error('useVoiceSystemContext must be used within a VoiceSystemProvider');
  }
  return context;
};
