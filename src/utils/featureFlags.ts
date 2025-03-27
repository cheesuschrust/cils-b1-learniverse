
/**
 * Feature flag system to enable/disable features based on environment,
 * user preferences, or to disable problematic features when needed.
 */

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

// Override flags based on environment
const ENV_FLAGS = process.env.NODE_ENV === 'production' 
  ? {
      // Disable unstable features in production
      documentUpload: false,
    }
  : {};

// Get feature flags from localStorage if available
const getLocalFlags = (): Record<string, boolean> => {
  try {
    const storedFlags = localStorage.getItem('featureFlags');
    return storedFlags ? JSON.parse(storedFlags) : {};
  } catch (error) {
    console.error('Error reading feature flags from localStorage:', error);
    return {};
  }
};

// Save feature flags to localStorage
const saveLocalFlags = (flags: Record<string, boolean>): void => {
  try {
    localStorage.setItem('featureFlags', JSON.stringify(flags));
  } catch (error) {
    console.error('Error saving feature flags to localStorage:', error);
  }
};

// Get the current state of all feature flags
export const getFeatureFlags = (): Record<string, boolean> => {
  const localFlags = getLocalFlags();
  
  // Combine all flags, with local overrides taking precedence
  return {
    ...DEFAULT_FLAGS,
    ...ENV_FLAGS,
    ...localFlags
  };
};

// Check if a feature is enabled
export const isFeatureEnabled = (featureKey: keyof typeof DEFAULT_FLAGS): boolean => {
  const flags = getFeatureFlags();
  return flags[featureKey] ?? DEFAULT_FLAGS[featureKey] ?? false;
};

// Enable a specific feature
export const enableFeature = (featureKey: string): void => {
  const localFlags = getLocalFlags();
  localFlags[featureKey] = true;
  saveLocalFlags(localFlags);
};

// Disable a specific feature
export const disableFeature = (featureKey: string): void => {
  const localFlags = getLocalFlags();
  localFlags[featureKey] = false;
  saveLocalFlags(localFlags);
};

// Reset feature flags to default
export const resetFeatureFlags = (): void => {
  saveLocalFlags({});
};

// Toggle a specific feature
export const toggleFeature = (featureKey: string): boolean => {
  const isEnabled = isFeatureEnabled(featureKey as keyof typeof DEFAULT_FLAGS);
  const localFlags = getLocalFlags();
  localFlags[featureKey] = !isEnabled;
  saveLocalFlags(localFlags);
  return !isEnabled;
};

export default {
  isFeatureEnabled,
  enableFeature,
  disableFeature,
  resetFeatureFlags,
  toggleFeature,
  getFeatureFlags
};
