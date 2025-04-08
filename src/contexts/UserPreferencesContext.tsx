import React, { createContext, useContext, useState, useEffect } from 'react';
import { getDefaultVoicePreferences, VoicePreference } from '@/utils/textToSpeech';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ContentType } from '@/utils/textAnalysis';
import { useLanguage } from '@/contexts/LanguageContext';

export type Theme = 'dark' | 'light' | 'system';

// AI preference settings interface
export interface AIPreference {
  processOnDevice: boolean;
  modelSize: 'small' | 'medium' | 'large';
  dataCollection: boolean;
  assistanceLevel: number;
  provider: 'openai' | 'anthropic' | 'google' | 'local';
  voiceProvider: 'elevenlabs' | 'google' | 'browser';
}

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
  preferredLanguage: 'english' | 'italian' | 'both';
  setPreferredLanguage: (lang: 'english' | 'italian' | 'both') => void;
  aiPreference: AIPreference;
  setAIPreference: (preference: AIPreference) => void;
  highContrastMode: boolean;
  setHighContrastMode: (enabled: boolean) => void;
  animationsEnabled: boolean;
  setAnimationsEnabled: (enabled: boolean) => void;
  showProgressMetrics: boolean;
  setShowProgressMetrics: (show: boolean) => void;
}

const defaultAIPreference: AIPreference = {
  processOnDevice: false,
  modelSize: 'medium',
  dataCollection: true,
  assistanceLevel: 5,
  provider: 'openai',
  voiceProvider: 'browser'
};

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
  setDailyGoal: () => {},
  preferredLanguage: 'both',
  setPreferredLanguage: () => {},
  aiPreference: defaultAIPreference,
  setAIPreference: () => {},
  highContrastMode: false,
  setHighContrastMode: () => {},
  animationsEnabled: true,
  setAnimationsEnabled: () => {},
  showProgressMetrics: true,
  setShowProgressMetrics: () => {}
};

const UserPreferencesContext = createContext<UserPreferencesContextType>(defaultPreferences);

export const useUserPreferences = () => useContext(UserPreferencesContext);

export const UserPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language: displayLanguage } = useLanguage();
  const [theme, setThemeValue] = useLocalStorage<Theme>('theme', 'system');
  const [fontSize, setFontSizeValue] = useLocalStorage<'small' | 'medium' | 'large'>('fontSize', 'medium');
  const [autoPlayAudio, setAutoPlayAudioValue] = useLocalStorage<boolean>('autoPlayAudio', true);
  const [showTranslation, setShowTranslationValue] = useLocalStorage<boolean>('showTranslation', true);
  const [voicePreference, setVoicePreferenceValue] = useLocalStorage<VoicePreference>('voicePreference', defaultPreferences.voicePreference);
  const [language, setLanguageValue] = useLocalStorage<'en' | 'it'>('language', 'it');
  const [difficulty, setDifficultyValue] = useLocalStorage<'beginner' | 'intermediate' | 'advanced'>('difficulty', 'intermediate');
  const [notifications, setNotificationsValue] = useLocalStorage<boolean>('notifications', true);
  const [dailyGoal, setDailyGoalValue] = useLocalStorage<number>('dailyGoal', 15);
  const [preferredLanguage, setPreferredLanguageValue] = useLocalStorage<'english' | 'italian' | 'both'>('preferredLanguage', 'both');
  const [aiPreference, setAIPreferenceValue] = useLocalStorage<AIPreference>('aiPreference', defaultAIPreference);
  const [highContrastMode, setHighContrastModeValue] = useLocalStorage<boolean>('highContrastMode', false);
  const [animationsEnabled, setAnimationsEnabledValue] = useLocalStorage<boolean>('animationsEnabled', true);
  const [showProgressMetrics, setShowProgressMetricsValue] = useLocalStorage<boolean>('showProgressMetrics', true);

  useEffect(() => {
    const initVoicePreferences = async () => {
      if (!voicePreference.englishVoiceURI && !voicePreference.italianVoiceURI) {
        const defaults = await getDefaultVoicePreferences();
        setVoicePreferenceValue(defaults);
      }
    };
    
    initVoicePreferences();
  }, [voicePreference, setVoicePreferenceValue]);

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

  useEffect(() => {
    const root = window.document.documentElement;
    if (highContrastMode) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  }, [highContrastMode]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (!animationsEnabled) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
  }, [animationsEnabled]);

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

  useEffect(() => {
    if (displayLanguage !== preferredLanguage) {
      setPreferredLanguageValue(displayLanguage);
    }
  }, [displayLanguage]);

  const setTheme = (value: Theme) => setThemeValue(value);
  const setFontSize = (value: 'small' | 'medium' | 'large') => setFontSizeValue(value);
  const setAutoPlayAudio = (value: boolean) => setAutoPlayAudioValue(value);
  const setShowTranslation = (value: boolean) => setShowTranslationValue(value);
  const setVoicePreference = (value: VoicePreference) => setVoicePreferenceValue(value);
  const setLanguage = (value: 'en' | 'it') => setLanguageValue(value);
  const setDifficulty = (value: 'beginner' | 'intermediate' | 'advanced') => setDifficultyValue(value);
  const setNotifications = (value: boolean) => setNotificationsValue(value);
  const setDailyGoal = (value: number) => setDailyGoalValue(value);
  const setPreferredLanguage = (value: 'english' | 'italian' | 'both') => setPreferredLanguageValue(value);
  const setAIPreference = (value: AIPreference) => setAIPreferenceValue(value);
  const setHighContrastMode = (value: boolean) => setHighContrastModeValue(value);
  const setAnimationsEnabled = (value: boolean) => setAnimationsEnabledValue(value);
  const setShowProgressMetrics = (value: boolean) => setShowProgressMetricsValue(value);

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
        setDailyGoal,
        preferredLanguage,
        setPreferredLanguage,
        aiPreference,
        setAIPreference,
        highContrastMode,
        setHighContrastMode,
        animationsEnabled,
        setAnimationsEnabled,
        showProgressMetrics,
        setShowProgressMetrics
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};
