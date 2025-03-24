
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { VoicePreference } from '@/utils/textToSpeech';

interface AIPreference {
  modelSize: 'small' | 'medium' | 'large';
  processOnDevice: boolean;
  dataCollection: boolean;
  assistanceLevel: number;
}

interface UserPreferencesContextType {
  theme: 'light' | 'dark' | 'system';
  setTheme?: (theme: 'light' | 'dark' | 'system') => void;
  autoPlayAudio: boolean;
  setAutoPlayAudio?: (autoPlay: boolean) => void;
  preferredLanguage: 'english' | 'italian' | 'both';
  setPreferredLanguage?: (language: 'english' | 'italian' | 'both') => void;
  voicePreference: VoicePreference;
  setVoicePreference: (preferences: VoicePreference) => void;
  aiPreference: AIPreference;
  setAIPreference: (preferences: AIPreference) => void;
}

const defaultVoicePreference: VoicePreference = {
  italianVoiceURI: '',
  englishVoiceURI: '',
  voiceRate: 1.0,
  voicePitch: 1.0
};

const defaultAIPreference: AIPreference = {
  modelSize: 'medium',
  processOnDevice: false,
  dataCollection: true,
  assistanceLevel: 5
};

const defaultUserPreferences: UserPreferencesContextType = {
  theme: 'system',
  autoPlayAudio: false,
  preferredLanguage: 'both',
  voicePreference: defaultVoicePreference,
  setVoicePreference: () => {},
  aiPreference: defaultAIPreference,
  setAIPreference: () => {}
};

const UserPreferencesContext = createContext<UserPreferencesContextType>(defaultUserPreferences);

export const useUserPreferences = () => useContext(UserPreferencesContext);

export const UserPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [storedTheme, setStoredTheme] = useLocalStorage<'light' | 'dark' | 'system'>(
    'theme',
    'system'
  );
  
  const [storedAutoPlayAudio, setStoredAutoPlayAudio] = useLocalStorage<boolean>(
    'autoPlayAudio',
    false
  );
  
  const [storedPreferredLanguage, setStoredPreferredLanguage] = useLocalStorage<'english' | 'italian' | 'both'>(
    'preferredLanguage',
    'both'
  );
  
  const [storedVoicePreference, setStoredVoicePreference] = useLocalStorage<VoicePreference>(
    'voicePreference',
    defaultVoicePreference
  );
  
  const [storedAIPreference, setStoredAIPreference] = useLocalStorage<AIPreference>(
    'aiPreference',
    defaultAIPreference
  );
  
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(storedTheme);
  const [autoPlayAudio, setAutoPlayAudio] = useState<boolean>(storedAutoPlayAudio);
  const [preferredLanguage, setPreferredLanguage] = useState<'english' | 'italian' | 'both'>(storedPreferredLanguage);
  const [voicePreference, setVoicePreference] = useState<VoicePreference>(storedVoicePreference);
  const [aiPreference, setAIPreference] = useState<AIPreference>(storedAIPreference);
  
  // Update localStorage when preferences change
  useEffect(() => {
    setStoredTheme(theme);
  }, [theme, setStoredTheme]);
  
  useEffect(() => {
    setStoredAutoPlayAudio(autoPlayAudio);
  }, [autoPlayAudio, setStoredAutoPlayAudio]);
  
  useEffect(() => {
    setStoredPreferredLanguage(preferredLanguage);
  }, [preferredLanguage, setStoredPreferredLanguage]);
  
  useEffect(() => {
    setStoredVoicePreference(voicePreference);
  }, [voicePreference, setStoredVoicePreference]);
  
  useEffect(() => {
    setStoredAIPreference(aiPreference);
  }, [aiPreference, setStoredAIPreference]);
  
  // Handle system theme changes
  useEffect(() => {
    const handleSystemThemeChange = (event: MediaQueryListEvent) => {
      if (theme === 'system') {
        document.documentElement.classList.toggle('dark', event.matches);
      }
    };
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    // Apply theme
    if (theme === 'system') {
      document.documentElement.classList.toggle('dark', mediaQuery.matches);
    } else {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
    
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [theme]);
  
  const handleSetTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    
    if (newTheme === 'system') {
      const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', systemIsDark);
    } else {
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
    }
  };
  
  const handleSetVoicePreference = (newPreferences: VoicePreference) => {
    setVoicePreference(newPreferences);
  };
  
  const handleSetAIPreference = (newPreferences: AIPreference) => {
    setAIPreference(newPreferences);
  };
  
  return (
    <UserPreferencesContext.Provider
      value={{
        theme,
        setTheme: handleSetTheme,
        autoPlayAudio,
        setAutoPlayAudio,
        preferredLanguage,
        setPreferredLanguage,
        voicePreference,
        setVoicePreference: handleSetVoicePreference,
        aiPreference,
        setAIPreference: handleSetAIPreference
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};
