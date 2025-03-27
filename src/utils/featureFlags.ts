
/**
 * Feature flag system to enable/disable features based on environment,
 * user preferences, or to disable problematic features when needed.
 */
import { useCallback, useEffect, useState } from 'react';

// Flag type definitions for type safety
export type FeatureFlag = keyof typeof DEFAULT_FLAGS;

// Default feature flags
const DEFAULT_FLAGS = {
  // Core features
  darkMode: true,
  notifications: true,
  gamification: true,
  
  // AI features - set to false by default to ensure build stability
  aiAssistant: false,
  aiContentGeneration: false,
  aiTranslation: false,
  aiPronunciation: false,
  aiPersonalization: false,
  
  // Learning features
  spacedRepetition: true,
  multipleChoice: true,
  writingFeedback: true,
  speakingPractice: true,
  listeningPractice: true,
  
  // Advanced features
  analyticsReports: false,
  exportToCSV: true,
  importFromCSV: true,
  documentsUpload: false
};

// Type for feature flag values - extracted from DEFAULT_FLAGS
export type FeatureFlags = {
  [K in FeatureFlag]: boolean;
};

// Override flags based on environment
const ENV_FLAGS: Partial<FeatureFlags> = process.env.NODE_ENV === 'production' 
  ? {
      // Disable unstable features in production
      documentUpload: false,
    }
  : {};

// Get feature flags from localStorage if available
const getLocalFlags = (): Partial<FeatureFlags> => {
  try {
    const storedFlags = localStorage.getItem('featureFlags');
    return storedFlags ? JSON.parse(storedFlags) : {};
  } catch (error) {
    console.error('Error reading feature flags from localStorage:', error);
    return {};
  }
};

// Save feature flags to localStorage
const saveLocalFlags = (flags: Partial<FeatureFlags>): void => {
  try {
    localStorage.setItem('featureFlags', JSON.stringify(flags));
  } catch (error) {
    console.error('Error saving feature flags to localStorage:', error);
  }
};

// Get the current state of all feature flags
export const getFeatureFlags = (): FeatureFlags => {
  const localFlags = getLocalFlags();
  
  // Combine all flags, with local overrides taking precedence
  return {
    ...DEFAULT_FLAGS,
    ...ENV_FLAGS,
    ...localFlags
  } as FeatureFlags;
};

// Check if a feature is enabled
export const isFeatureEnabled = (featureKey: FeatureFlag): boolean => {
  const flags = getFeatureFlags();
  return flags[featureKey] ?? DEFAULT_FLAGS[featureKey] ?? false;
};

// Enable a specific feature
export const enableFeature = (featureKey: FeatureFlag): void => {
  const localFlags = getLocalFlags();
  localFlags[featureKey] = true;
  saveLocalFlags(localFlags);
};

// Disable a specific feature
export const disableFeature = (featureKey: FeatureFlag): void => {
  const localFlags = getLocalFlags();
  localFlags[featureKey] = false;
  saveLocalFlags(localFlags);
};

// Reset feature flags to default
export const resetFeatureFlags = (): void => {
  saveLocalFlags({});
};

// Toggle a specific feature
export const toggleFeature = (featureKey: FeatureFlag): boolean => {
  const isEnabled = isFeatureEnabled(featureKey);
  const localFlags = getLocalFlags();
  localFlags[featureKey] = !isEnabled;
  saveLocalFlags(localFlags);
  return !isEnabled;
};

// React hook for feature flags
export const useFeatureFlag = (featureKey: FeatureFlag): [boolean, () => void] => {
  const [isEnabled, setIsEnabled] = useState(() => isFeatureEnabled(featureKey));
  
  useEffect(() => {
    // Update state when feature flag changes externally
    const checkFlag = () => {
      const newValue = isFeatureEnabled(featureKey);
      setIsEnabled(newValue);
    };
    
    // Check initially
    checkFlag();
    
    // Listen for storage events to handle changes from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'featureFlags') {
        checkFlag();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [featureKey]);
  
  const toggle = useCallback(() => {
    const newValue = toggleFeature(featureKey);
    setIsEnabled(newValue);
  }, [featureKey]);
  
  return [isEnabled, toggle];
};

export default {
  isFeatureEnabled,
  enableFeature,
  disableFeature,
  resetFeatureFlags,
  toggleFeature,
  getFeatureFlags,
  useFeatureFlag
};
