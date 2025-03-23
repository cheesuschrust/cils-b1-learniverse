
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { VoicePreference } from '@/utils/textToSpeech';

interface UserPreferencesContextType {
  theme: 'light' | 'dark' | 'system';
  setTheme?: (theme: 'light' | 'dark' | 'system') => void;
  preferredLanguage: 'english' | 'italian' | 'both';
  setPreferredLanguage?: (language: 'english' | 'italian' | 'both') => void;
  autoPlayAudio: boolean;
  setAutoPlayAudio?: (autoPlay: boolean) => void;
  voicePreference: VoicePreference;
  setVoicePreference?: (preference: VoicePreference) => void;
}

// Default voice preference
const defaultVoicePreference: VoicePreference = {
  italianVoiceURI: '',
  englishVoiceURI: '',
  voiceRate: 1.0,
  voicePitch: 1.0
};

const defaultPreferences: UserPreferencesContextType = {
  theme: 'light',
  preferredLanguage: 'both',
  autoPlayAudio: false, // Changed from true to false to disable auto-reading
  voicePreference: defaultVoicePreference,
};

const UserPreferencesContext = createContext<UserPreferencesContextType>(defaultPreferences);

export const UserPreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(
    () => (localStorage.getItem('theme') as 'light' | 'dark' | 'system') || 'light'
  );
  
  const [preferredLanguage, setPreferredLanguage] = useState<'english' | 'italian' | 'both'>(
    () => (localStorage.getItem('preferredLanguage') as 'english' | 'italian' | 'both') || 'both'
  );
  
  const [autoPlayAudio, setAutoPlayAudio] = useState<boolean>(
    () => {
      const saved = localStorage.getItem('autoPlayAudio');
      // Default to false (auto-reading off) if not set
      return saved === 'true' ? true : false;
    }
  );
  
  const [voicePreference, setVoicePreference] = useState<VoicePreference>(() => {
    const savedPreference = localStorage.getItem('voicePreference');
    return savedPreference 
      ? JSON.parse(savedPreference) 
      : defaultVoicePreference;
  });
  
  // Save preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  useEffect(() => {
    localStorage.setItem('preferredLanguage', preferredLanguage);
  }, [preferredLanguage]);
  
  useEffect(() => {
    localStorage.setItem('autoPlayAudio', String(autoPlayAudio));
  }, [autoPlayAudio]);
  
  useEffect(() => {
    localStorage.setItem('voicePreference', JSON.stringify(voicePreference));
  }, [voicePreference]);
  
  return (
    <UserPreferencesContext.Provider 
      value={{
        theme,
        setTheme,
        preferredLanguage,
        setPreferredLanguage,
        autoPlayAudio,
        setAutoPlayAudio,
        voicePreference,
        setVoicePreference
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = () => useContext(UserPreferencesContext);
