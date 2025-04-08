
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// Define all feature flags with their defaults
export const FEATURES = {
  // Premium features
  premium: {
    advancedExercises: { default: false, requiresAuth: true },
    aiAssistant: { default: false, requiresAuth: true },
    downloadableContent: { default: false, requiresAuth: true },
    unlimitedPractice: { default: false, requiresAuth: true },
    prioritySupport: { default: false, requiresAuth: true },
    mockTests: { default: false, requiresAuth: true },
  },
  
  // Features available to all users (potentially with limitations)
  general: {
    dailyQuestion: { default: true, requiresAuth: false },
    basicFlashcards: { default: true, requiresAuth: false },
    basicReading: { default: true, requiresAuth: false },
    basicListening: { default: true, requiresAuth: false },
    progressTracking: { default: true, requiresAuth: true },
  },
  
  // Beta features
  beta: {
    newDesign: { default: false, requiresAuth: false },
    voiceInput: { default: false, requiresAuth: false },
  }
};

// Local cache for override flags from localStorage
let overrideFlags: Record<string, boolean> | null = null;

// Check if a feature is enabled
export function isFeatureEnabled(featureKey: string, user: any = null): boolean {
  // Find the feature in our feature groups
  let featureConfig = null;
  
  // Check all feature categories
  for (const category of Object.keys(FEATURES)) {
    if (featureConfig) break;
    if (FEATURES[category as keyof typeof FEATURES][featureKey as any]) {
      featureConfig = FEATURES[category as keyof typeof FEATURES][featureKey as any];
    }
  }
  
  // Feature doesn't exist
  if (!featureConfig) return false;
  
  // Check for localStorage override (useful for testing)
  if (overrideFlags === null) {
    try {
      const stored = localStorage.getItem('feature_flags');
      overrideFlags = stored ? JSON.parse(stored) : {};
    } catch (e) {
      overrideFlags = {};
    }
  }
  
  if (typeof overrideFlags[featureKey] === 'boolean') {
    return overrideFlags[featureKey];
  }
  
  // If feature requires auth and user isn't authenticated, disable it
  if (featureConfig.requiresAuth && !user) {
    return false;
  }
  
  // For premium features, check if user has premium access
  if (Object.keys(FEATURES.premium).includes(featureKey)) {
    return user?.isPremium || false;
  }
  
  // Return default value
  return featureConfig.default;
}

// React hook for feature flags
export function useFeatureFlag(featureKey: string): [boolean, (enabled: boolean) => void] {
  const { user } = useAuth();
  const [isEnabled, setIsEnabled] = useState(isFeatureEnabled(featureKey, user));
  
  // Toggle the feature flag (stores in localStorage)
  const toggleFeature = (enabled: boolean) => {
    try {
      const stored = localStorage.getItem('feature_flags') || '{}';
      const flags = JSON.parse(stored);
      flags[featureKey] = enabled;
      localStorage.setItem('feature_flags', JSON.stringify(flags));
      overrideFlags = flags;
      setIsEnabled(enabled);
    } catch (e) {
      console.error('Error saving feature flag:', e);
    }
  };
  
  // Check if the feature status needs to be updated when user changes
  useEffect(() => {
    setIsEnabled(isFeatureEnabled(featureKey, user));
  }, [user, featureKey]);
  
  return [isEnabled, toggleFeature];
}

// For admin usage - get all feature flags and their status
export function getAllFeatureFlags(user: any = null): Record<string, boolean> {
  const result: Record<string, boolean> = {};
  
  // Process all feature categories
  Object.keys(FEATURES).forEach(category => {
    Object.keys(FEATURES[category as keyof typeof FEATURES]).forEach(featureKey => {
      result[featureKey] = isFeatureEnabled(featureKey, user);
    });
  });
  
  return result;
}
