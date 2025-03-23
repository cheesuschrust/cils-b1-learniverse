
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface UserPreferencesContextType {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  fontSize: 'small' | 'medium' | 'large';
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  voicePreference: string | undefined;
  setVoicePreference: (voice: string | undefined) => void;
  autoPlay: boolean;
  setAutoPlay: (autoPlay: boolean) => void;
  showTranslations: boolean;
  setShowTranslations: (show: boolean) => void;
  dailyGoal: number;
  setDailyGoal: (goal: number) => void;
  savePreferences: () => Promise<boolean>;
}

const defaultPreferences = {
  theme: 'system' as const,
  fontSize: 'medium' as const,
  voicePreference: undefined,
  autoPlay: false,
  showTranslations: true,
  dailyGoal: 5,
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
  
  const setVoicePreference = (voicePreference: string | undefined) => {
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
        ...preferences,
        setTheme,
        setFontSize,
        setVoicePreference,
        setAutoPlay,
        setShowTranslations,
        setDailyGoal,
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
