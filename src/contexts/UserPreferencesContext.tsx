
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface VoicePreference {
  italianVoiceURI: string;
  englishVoiceURI: string;
  voiceRate: number;
  voicePitch: number;
}

export interface AIPreference {
  enabled: boolean;
  modelSize: 'small' | 'medium' | 'large';
  processOnDevice: boolean;
  showConfidenceScores: boolean;
  fallbackToManual: boolean;
}

interface UserPreferencesContextType {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  preferredLanguage: 'english' | 'italian' | 'both';
  setPreferredLanguage: (language: 'english' | 'italian' | 'both') => void;
  autoPlayAudio: boolean;
  setAutoPlayAudio: (autoPlay: boolean) => void;
  voicePreference: VoicePreference;
  setVoicePreference: (preference: VoicePreference) => void;
  aiPreference: AIPreference;
  setAIPreference: (preference: AIPreference) => void;
}

// Default voice preference
const defaultVoicePreference: VoicePreference = {
  italianVoiceURI: '',
  englishVoiceURI: '',
  voiceRate: 1.0,
  voicePitch: 1.0
};

// Default AI preference
const defaultAIPreference: AIPreference = {
  enabled: true,
  modelSize: 'medium',
  processOnDevice: true,
  showConfidenceScores: true,
  fallbackToManual: true
};

const defaultPreferences: UserPreferencesContextType = {
  theme: 'light', // Changed from 'light' to reinforce default
  setTheme: () => {},
  preferredLanguage: 'both',
  setPreferredLanguage: () => {},
  autoPlayAudio: false, // Default to false to prevent auto-play
  setAutoPlayAudio: () => {},
  voicePreference: defaultVoicePreference,
  setVoicePreference: () => {},
  aiPreference: defaultAIPreference,
  setAIPreference: () => {}
};

const UserPreferencesContext = createContext<UserPreferencesContextType>(defaultPreferences);

export const UserPreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(
    () => (localStorage.getItem('theme') as 'light' | 'dark' | 'system') || 'light'
  );
  
  const [preferredLanguage, setPreferredLanguage] = useState<'english' | 'italian' | 'both'>(
    () => (localStorage.getItem('preferredLanguage') as 'english' | 'italian' | 'both') || 'both'
  );
  
  // Default autoPlayAudio to false
  const [autoPlayAudio, setAutoPlayAudio] = useState<boolean>(
    () => localStorage.getItem('autoPlayAudio') === 'true' ? true : false
  );
  
  const [voicePreference, setVoicePreference] = useState<VoicePreference>(() => {
    const savedPreference = localStorage.getItem('voicePreference');
    return savedPreference 
      ? JSON.parse(savedPreference) 
      : defaultVoicePreference;
  });
  
  const [aiPreference, setAIPreference] = useState<AIPreference>(() => {
    const savedPreference = localStorage.getItem('aiPreference');
    return savedPreference 
      ? JSON.parse(savedPreference) 
      : defaultAIPreference;
  });
  
  // Save preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    
    // Apply light/dark mode to the document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else if (theme === 'system') {
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      isDarkMode 
        ? document.documentElement.classList.add('dark') 
        : document.documentElement.classList.remove('dark');
    }
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
  
  useEffect(() => {
    localStorage.setItem('aiPreference', JSON.stringify(aiPreference));
  }, [aiPreference]);
  
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
        setVoicePreference,
        aiPreference,
        setAIPreference
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = () => useContext(UserPreferencesContext);
