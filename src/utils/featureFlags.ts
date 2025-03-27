
import { useState, useEffect } from 'react';

// Define types for feature flags
export type FeatureFlag = 
  | 'aiAssistant'
  | 'darkMode'
  | 'analytics'
  | 'beta'
  | 'errorReporting'
  | 'pushNotifications'
  | 'premiumFeatures'
  | 'translationEngine'
  | 'audioRecording'
  | 'videoPlayback'
  | 'socialSharing'
  | 'infiniteScroll'
  | 'advancedFilters'
  | 'ttsEngine'
  | 'serverSideRendering';

// Define the feature flag configuration
export interface FeatureFlagConfig {
  name: FeatureFlag;
  description: string;
  defaultValue: boolean;
  groupOverrides?: Record<string, boolean>;
  userOverrides?: Record<string, boolean>;
  dependencies?: FeatureFlag[];
  rolloutPercentage?: number;
  expiresAt?: Date;
}

// Default configuration for all feature flags
const defaultFeatureFlags: Record<FeatureFlag, FeatureFlagConfig> = {
  aiAssistant: {
    name: 'aiAssistant',
    description: 'Enable AI-powered assistant features',
    defaultValue: true,
    rolloutPercentage: 100
  },
  darkMode: {
    name: 'darkMode',
    description: 'Enable dark mode theme option',
    defaultValue: true
  },
  analytics: {
    name: 'analytics',
    description: 'Enable analytics tracking',
    defaultValue: true
  },
  beta: {
    name: 'beta',
    description: 'Enable beta features',
    defaultValue: false,
    rolloutPercentage: 20
  },
  errorReporting: {
    name: 'errorReporting',
    description: 'Enable error reporting to backend',
    defaultValue: true
  },
  pushNotifications: {
    name: 'pushNotifications',
    description: 'Enable push notifications',
    defaultValue: false,
    rolloutPercentage: 50
  },
  premiumFeatures: {
    name: 'premiumFeatures',
    description: 'Enable premium features for paid users',
    defaultValue: false
  },
  translationEngine: {
    name: 'translationEngine',
    description: 'Enable translation engine',
    defaultValue: true
  },
  audioRecording: {
    name: 'audioRecording',
    description: 'Enable audio recording features',
    defaultValue: true
  },
  videoPlayback: {
    name: 'videoPlayback',
    description: 'Enable video playback features',
    defaultValue: true
  },
  socialSharing: {
    name: 'socialSharing',
    description: 'Enable social sharing features',
    defaultValue: true
  },
  infiniteScroll: {
    name: 'infiniteScroll',
    description: 'Enable infinite scrolling on lists',
    defaultValue: true
  },
  advancedFilters: {
    name: 'advancedFilters',
    description: 'Enable advanced filtering options',
    defaultValue: false,
    rolloutPercentage: 30
  },
  ttsEngine: {
    name: 'ttsEngine',
    description: 'Enable text-to-speech engine',
    defaultValue: true
  },
  serverSideRendering: {
    name: 'serverSideRendering',
    description: 'Enable server-side rendering',
    defaultValue: false
  }
};

// Get feature flags from local storage or set defaults
const getPersistedFeatureFlags = (): Record<FeatureFlag, boolean> => {
  try {
    const stored = localStorage.getItem('featureFlags');
    const storedFlags = stored ? JSON.parse(stored) : {};
    
    // Start with default values
    const flags = Object.entries(defaultFeatureFlags).reduce(
      (acc, [key, config]) => ({
        ...acc,
        [key]: config.defaultValue
      }),
      {} as Record<FeatureFlag, boolean>
    );
    
    // Override with stored values
    return { ...flags, ...storedFlags };
  } catch (e) {
    // Fallback to defaults if there's an error
    console.error('Error reading feature flags from localStorage', e);
    return Object.entries(defaultFeatureFlags).reduce(
      (acc, [key, config]) => ({
        ...acc,
        [key]: config.defaultValue
      }),
      {} as Record<FeatureFlag, boolean>
    );
  }
};

// Global feature flags state
let featureFlags = getPersistedFeatureFlags();

// User for storing changes to feature flags
const saveFeatureFlags = () => {
  try {
    localStorage.setItem('featureFlags', JSON.stringify(featureFlags));
  } catch (e) {
    console.error('Error saving feature flags to localStorage', e);
  }
};

// Subscribers for feature flag changes
const subscribers = new Set<(flags: Record<FeatureFlag, boolean>) => void>();

// Function to check if a feature is enabled
export const isFeatureEnabled = (feature: FeatureFlag): boolean => {
  return featureFlags[feature] ?? defaultFeatureFlags[feature]?.defaultValue ?? false;
};

// Function to enable a feature
export const enableFeature = (feature: FeatureFlag): void => {
  featureFlags = { ...featureFlags, [feature]: true };
  saveFeatureFlags();
  notifySubscribers();
};

// Function to disable a feature
export const disableFeature = (feature: FeatureFlag): void => {
  featureFlags = { ...featureFlags, [feature]: false };
  saveFeatureFlags();
  notifySubscribers();
};

// Function to toggle a feature
export const toggleFeature = (feature: FeatureFlag): void => {
  featureFlags = { ...featureFlags, [feature]: !featureFlags[feature] };
  saveFeatureFlags();
  notifySubscribers();
};

// Function to reset a feature to its default value
export const resetFeature = (feature: FeatureFlag): void => {
  featureFlags = { 
    ...featureFlags, 
    [feature]: defaultFeatureFlags[feature]?.defaultValue ?? false 
  };
  saveFeatureFlags();
  notifySubscribers();
};

// Function to reset all features to their default values
export const resetAllFeatures = (): void => {
  featureFlags = Object.entries(defaultFeatureFlags).reduce(
    (acc, [key, config]) => ({
      ...acc,
      [key]: config.defaultValue
    }),
    {} as Record<FeatureFlag, boolean>
  );
  saveFeatureFlags();
  notifySubscribers();
};

// Function to get all feature flags
export const getAllFeatureFlags = (): Record<FeatureFlag, boolean> => {
  return { ...featureFlags };
};

// Function to get feature flag configurations
export const getFeatureFlagConfigs = (): Record<FeatureFlag, FeatureFlagConfig> => {
  return { ...defaultFeatureFlags };
};

// Private function to notify subscribers of changes
const notifySubscribers = (): void => {
  subscribers.forEach(callback => callback(getAllFeatureFlags()));
};

// Subscribe to feature flag changes
export const subscribeToFeatureFlags = (
  callback: (flags: Record<FeatureFlag, boolean>) => void
): () => void => {
  subscribers.add(callback);
  // Initial call with current state
  callback(getAllFeatureFlags());
  
  // Return unsubscribe function
  return () => {
    subscribers.delete(callback);
  };
};

// React hook for using feature flags
export const useFeatureFlag = (
  feature: FeatureFlag
): [boolean, (enabled: boolean) => void] => {
  const [enabled, setEnabled] = useState<boolean>(isFeatureEnabled(feature));
  
  useEffect(() => {
    const unsubscribe = subscribeToFeatureFlags(flags => {
      setEnabled(flags[feature] ?? false);
    });
    
    return unsubscribe;
  }, [feature]);
  
  const setFeatureEnabled = (enabled: boolean) => {
    if (enabled) {
      enableFeature(feature);
    } else {
      disableFeature(feature);
    }
  };
  
  return [enabled, setFeatureEnabled];
};
