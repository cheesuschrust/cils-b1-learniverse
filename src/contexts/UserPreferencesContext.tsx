
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getDefaultVoicePreferences, VoicePreference } from '@/utils/textToSpeech';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export type Theme = 'dark' | 'light' | 'system';

interface UserPreferencesContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  fontSize: 'small' | 'medium' | 'large';
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  autoPlayAudio: boolean;
  setAutoPlayAudio: (autoPlay: boolean) => void;
  showTranslation: boolean;
  setShowTranslation: (show: boolean) => void;
  voicePreference: VoicePreference;
  setVoicePreference: (preference: VoicePreference) => void;
  language: 'en' | 'it';
  setLanguage: (lang: 'en' | 'it') => void;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  setDifficulty: (level: 'beginner' | 'intermediate' | 'advanced') => void;
  notifications: boolean;
  setNotifications: (enabled: boolean) => void;
  dailyGoal: number;
  setDailyGoal: (minutes: number) => void;
}

const defaultPreferences: UserPreferencesContextType = {
  theme: 'system',
  setTheme: () => {},
  fontSize: 'medium',
  setFontSize: () => {},
  autoPlayAudio: true,
  setAutoPlayAudio: () => {},
  showTranslation: true,
  setShowTranslation: () => {},
  voicePreference: {
    englishVoiceURI: '',
    italianVoiceURI: '',
    voiceRate: 1,
    voicePitch: 1
  },
  setVoicePreference: () => {},
  language: 'it',
  setLanguage: () => {},
  difficulty: 'intermediate',
  setDifficulty: () => {},
  notifications: true,
  setNotifications: () => {},
  dailyGoal: 15,
  setDailyGoal: () => {}
};

const UserPreferencesContext = createContext<UserPreferencesContextType>(defaultPreferences);

export const useUserPreferences = () => useContext(UserPreferencesContext);

export const UserPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeValue] = useLocalStorage<Theme>('theme', 'system');
  const [fontSize, setFontSizeValue] = useLocalStorage<'small' | 'medium' | 'large'>('fontSize', 'medium');
  const [autoPlayAudio, setAutoPlayAudioValue] = useLocalStorage<boolean>('autoPlayAudio', true);
  const [showTranslation, setShowTranslationValue] = useLocalStorage<boolean>('showTranslation', true);
  const [voicePreference, setVoicePreferenceValue] = useLocalStorage<VoicePreference>('voicePreference', defaultPreferences.voicePreference);
  const [language, setLanguageValue] = useLocalStorage<'en' | 'it'>('language', 'it');
  const [difficulty, setDifficultyValue] = useLocalStorage<'beginner' | 'intermediate' | 'advanced'>('difficulty', 'intermediate');
  const [notifications, setNotificationsValue] = useLocalStorage<boolean>('notifications', true);
  const [dailyGoal, setDailyGoalValue] = useLocalStorage<number>('dailyGoal', 15);

  // Initialize voice preferences with system defaults if not already set
  useEffect(() => {
    const initVoicePreferences = async () => {
      if (!voicePreference.englishVoiceURI && !voicePreference.italianVoiceURI) {
        const defaults = await getDefaultVoicePreferences();
        setVoicePreferenceValue(defaults);
      }
    };
    
    initVoicePreferences();
  }, [voicePreference, setVoicePreferenceValue]);

  // Set theme on body element
  useEffect(() => {
    const root = window.document.documentElement;
    
    root.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  // Set font size on body element
  useEffect(() => {
    const body = window.document.body;
    
    body.classList.remove('text-sm', 'text-base', 'text-lg');
    
    switch (fontSize) {
      case 'small':
        body.classList.add('text-sm');
        break;
      case 'medium':
        body.classList.add('text-base');
        break;
      case 'large':
        body.classList.add('text-lg');
        break;
      default:
        body.classList.add('text-base');
    }
  }, [fontSize]);

  const setTheme = (value: Theme) => setThemeValue(value);
  const setFontSize = (value: 'small' | 'medium' | 'large') => setFontSizeValue(value);
  const setAutoPlayAudio = (value: boolean) => setAutoPlayAudioValue(value);
  const setShowTranslation = (value: boolean) => setShowTranslationValue(value);
  const setVoicePreference = (value: VoicePreference) => setVoicePreferenceValue(value);
  const setLanguage = (value: 'en' | 'it') => setLanguageValue(value);
  const setDifficulty = (value: 'beginner' | 'intermediate' | 'advanced') => setDifficultyValue(value);
  const setNotifications = (value: boolean) => setNotificationsValue(value);
  const setDailyGoal = (value: number) => setDailyGoalValue(value);

  return (
    <UserPreferencesContext.Provider
      value={{
        theme,
        setTheme,
        fontSize,
        setFontSize,
        autoPlayAudio,
        setAutoPlayAudio,
        showTranslation,
        setShowTranslation,
        voicePreference,
        setVoicePreference,
        language,
        setLanguage,
        difficulty,
        setDifficulty,
        notifications,
        setNotifications,
        dailyGoal,
        setDailyGoal
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};
