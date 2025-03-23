
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface UserPreferencesContextType {
  theme: 'light' | 'dark' | 'system';
  setTheme?: (theme: 'light' | 'dark' | 'system') => void;
  preferredLanguage: 'english' | 'italian' | 'both';
  setPreferredLanguage?: (language: 'english' | 'italian' | 'both') => void;
  autoPlayAudio: boolean;
  setAutoPlayAudio?: (autoPlay: boolean) => void;
}

const defaultPreferences: UserPreferencesContextType = {
  theme: 'system',
  preferredLanguage: 'both',
  autoPlayAudio: true,
};

const UserPreferencesContext = createContext<UserPreferencesContextType>(defaultPreferences);

export const UserPreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(
    () => (localStorage.getItem('theme') as 'light' | 'dark' | 'system') || 'system'
  );
  
  const [preferredLanguage, setPreferredLanguage] = useState<'english' | 'italian' | 'both'>(
    () => (localStorage.getItem('preferredLanguage') as 'english' | 'italian' | 'both') || 'both'
  );
  
  const [autoPlayAudio, setAutoPlayAudio] = useState<boolean>(
    () => localStorage.getItem('autoPlayAudio') !== 'false'
  );
  
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
  
  return (
    <UserPreferencesContext.Provider 
      value={{
        theme,
        setTheme,
        preferredLanguage,
        setPreferredLanguage,
        autoPlayAudio,
        setAutoPlayAudio
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = () => useContext(UserPreferencesContext);
