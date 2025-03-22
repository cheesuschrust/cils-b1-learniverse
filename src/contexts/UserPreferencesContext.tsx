
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getCurrentVoicePreference, saveVoicePreference, VoicePreference } from '@/utils/textToSpeech';

type Theme = 'light' | 'dark' | 'system';
type FontSize = 'small' | 'medium' | 'large';
type PreferredLanguage = 'english' | 'italian' | 'both';

interface UserPreferencesContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  soundEffects: boolean;
  setSoundEffects: (enabled: boolean) => void;
  notifications: boolean;
  setNotifications: (enabled: boolean) => void;
  autoPlayAudio: boolean;
  setAutoPlayAudio: (enabled: boolean) => void;
  preferredLanguage: PreferredLanguage;
  setPreferredLanguage: (language: PreferredLanguage) => void;
  showTranslations: boolean;
  setShowTranslations: (show: boolean) => void;
  voicePreference: VoicePreference;
  setVoicePreference: (preference: VoicePreference) => void;
}

const defaultVoicePreference = getCurrentVoicePreference();

const defaultPreferences: UserPreferencesContextType = {
  theme: 'system',
  setTheme: () => {},
  fontSize: 'medium',
  setFontSize: () => {},
  soundEffects: true,
  setSoundEffects: () => {},
  notifications: true,
  setNotifications: () => {},
  autoPlayAudio: false,
  setAutoPlayAudio: () => {},
  preferredLanguage: 'both',
  setPreferredLanguage: () => {},
  showTranslations: true,
  setShowTranslations: () => {},
  voicePreference: defaultVoicePreference,
  setVoicePreference: () => {},
};

const UserPreferencesContext = createContext<UserPreferencesContextType>(defaultPreferences);

export const useUserPreferences = () => useContext(UserPreferencesContext);

export const UserPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferencesContextType>(defaultPreferences);

  // Load preferences from localStorage on mount
  useEffect(() => {
    if (user) {
      const savedPreferences = localStorage.getItem(`userPreferences_${user.id}`);
      if (savedPreferences) {
        setPreferences(prev => ({
          ...prev,
          ...JSON.parse(savedPreferences)
        }));
      }
    }
  }, [user]);

  // Save preferences to localStorage when they change
  useEffect(() => {
    if (user) {
      const prefsToSave = {
        theme: preferences.theme,
        fontSize: preferences.fontSize,
        soundEffects: preferences.soundEffects,
        notifications: preferences.notifications,
        autoPlayAudio: preferences.autoPlayAudio,
        preferredLanguage: preferences.preferredLanguage,
        showTranslations: preferences.showTranslations,
        voicePreference: preferences.voicePreference,
      };
      localStorage.setItem(`userPreferences_${user.id}`, JSON.stringify(prefsToSave));
      
      // Also save voice preferences to the global storage for easy access
      saveVoicePreference(preferences.voicePreference);
    }
  }, [preferences, user]);

  return (
    <UserPreferencesContext.Provider
      value={{
        theme: preferences.theme,
        setTheme: (theme) => setPreferences(prev => ({ ...prev, theme })),
        fontSize: preferences.fontSize,
        setFontSize: (fontSize) => setPreferences(prev => ({ ...prev, fontSize })),
        soundEffects: preferences.soundEffects,
        setSoundEffects: (soundEffects) => setPreferences(prev => ({ ...prev, soundEffects })),
        notifications: preferences.notifications,
        setNotifications: (notifications) => setPreferences(prev => ({ ...prev, notifications })),
        autoPlayAudio: preferences.autoPlayAudio,
        setAutoPlayAudio: (autoPlayAudio) => setPreferences(prev => ({ ...prev, autoPlayAudio })),
        preferredLanguage: preferences.preferredLanguage,
        setPreferredLanguage: (preferredLanguage) => setPreferences(prev => ({ ...prev, preferredLanguage })),
        showTranslations: preferences.showTranslations,
        setShowTranslations: (showTranslations) => setPreferences(prev => ({ ...prev, showTranslations })),
        voicePreference: preferences.voicePreference || defaultVoicePreference,
        setVoicePreference: (voicePreference) => setPreferences(prev => ({ ...prev, voicePreference })),
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};
