
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { VoicePreference } from '@/utils/textToSpeech';

interface UserPreferencesContextType {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  fontSize: 'small' | 'medium' | 'large';
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  voicePreference: VoicePreference;
  setVoicePreference: (voice: VoicePreference) => void;
  autoPlay: boolean;
  setAutoPlay: (autoPlay: boolean) => void;
  showTranslations: boolean;
  setShowTranslations: (show: boolean) => void;
  dailyGoal: number;
  setDailyGoal: (goal: number) => void;
  savePreferences: () => Promise<boolean>;
  preferredLanguage: 'english' | 'italian' | 'both';
  setPreferredLanguage: (language: 'english' | 'italian' | 'both') => void;
  autoPlayAudio: boolean;
  setAutoPlayAudio: (autoPlay: boolean) => void;
}

const defaultPreferences = {
  theme: 'system' as const,
  fontSize: 'medium' as const,
  voicePreference: {
    italianVoiceURI: '',
    englishVoiceURI: '',
    voiceRate: 1.0,
    voicePitch: 1.0
  },
  autoPlay: false,
  showTranslations: true,
  dailyGoal: 5,
  preferredLanguage: 'both' as const,
  autoPlayAudio: true
};

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export const UserPreferencesProvider = ({ children }: { children: ReactNode }) => {
  const { user, updateUserPreferences, isAuthenticated } = useAuth();
  const [preferences, setPreferences] = useState({
    ...defaultPreferences,
    ...(user?.preferences || {}),
  });
  
  // Update preferences when user changes
  useEffect(() => {
    if (user?.preferences) {
      setPreferences(prev => ({
        ...prev,
        ...user.preferences,
      }));
    }
  }, [user]);
  
  // Load preferences from localStorage when not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      const storedPrefs = localStorage.getItem('userPreferences');
      if (storedPrefs) {
        try {
          setPreferences(prev => ({
            ...prev,
            ...JSON.parse(storedPrefs),
          }));
        } catch (e) {
          console.error('Failed to parse stored preferences:', e);
        }
      }
    }
  }, [isAuthenticated]);
  
  const setTheme = (theme: 'light' | 'dark' | 'system') => {
    setPreferences(prev => ({
      ...prev,
      theme,
    }));
    
    if (!isAuthenticated) {
      storePreferencesLocally({ ...preferences, theme });
    }
  };
  
  const setFontSize = (fontSize: 'small' | 'medium' | 'large') => {
    setPreferences(prev => ({
      ...prev,
      fontSize,
    }));
    
    if (!isAuthenticated) {
      storePreferencesLocally({ ...preferences, fontSize });
    }
  };
  
  const setVoicePreference = (voicePreference: VoicePreference) => {
    setPreferences(prev => ({
      ...prev,
      voicePreference,
    }));
    
    if (!isAuthenticated) {
      storePreferencesLocally({ ...preferences, voicePreference });
    }
  };
  
  const setAutoPlay = (autoPlay: boolean) => {
    setPreferences(prev => ({
      ...prev,
      autoPlay,
    }));
    
    if (!isAuthenticated) {
      storePreferencesLocally({ ...preferences, autoPlay });
    }
  };
  
  const setShowTranslations = (showTranslations: boolean) => {
    setPreferences(prev => ({
      ...prev,
      showTranslations,
    }));
    
    if (!isAuthenticated) {
      storePreferencesLocally({ ...preferences, showTranslations });
    }
  };
  
  const setDailyGoal = (dailyGoal: number) => {
    setPreferences(prev => ({
      ...prev,
      dailyGoal,
    }));
    
    if (!isAuthenticated) {
      storePreferencesLocally({ ...preferences, dailyGoal });
    }
  };
  
  const setPreferredLanguage = (preferredLanguage: 'english' | 'italian' | 'both') => {
    setPreferences(prev => ({
      ...prev,
      preferredLanguage,
    }));
    
    if (!isAuthenticated) {
      storePreferencesLocally({ ...preferences, preferredLanguage });
    }
  };
  
  const setAutoPlayAudio = (autoPlayAudio: boolean) => {
    setPreferences(prev => ({
      ...prev,
      autoPlayAudio,
    }));
    
    if (!isAuthenticated) {
      storePreferencesLocally({ ...preferences, autoPlayAudio });
    }
  };
  
  const storePreferencesLocally = (prefs: typeof preferences) => {
    localStorage.setItem('userPreferences', JSON.stringify(prefs));
  };
  
  const savePreferences = async () => {
    if (isAuthenticated) {
      const success = await updateUserPreferences(preferences);
      return success;
    } else {
      storePreferencesLocally(preferences);
      return true;
    }
  };
  
  return (
    <UserPreferencesContext.Provider
      value={{
        theme: preferences.theme,
        fontSize: preferences.fontSize,
        voicePreference: preferences.voicePreference,
        autoPlay: preferences.autoPlay,
        showTranslations: preferences.showTranslations,
        dailyGoal: preferences.dailyGoal,
        preferredLanguage: preferences.preferredLanguage,
        autoPlayAudio: preferences.autoPlayAudio,
        setTheme,
        setFontSize,
        setVoicePreference,
        setAutoPlay,
        setShowTranslations,
        setDailyGoal,
        setPreferredLanguage,
        setAutoPlayAudio,
        savePreferences,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
};
