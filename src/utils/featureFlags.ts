
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Default feature flags
const defaultFeatures: Record<string, boolean> = {
  aiAssistant: true,
  voiceInput: true,
  darkMode: true,
  italianDialects: false,
  subscriptionManagement: true,
  advancedAnalytics: false,
  betaFeatures: false,
  communityFeatures: false,
};

// Cache for feature flags
let featureCache: Record<string, boolean> | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Check if a feature is enabled
export function isFeatureEnabled(featureName: string): boolean {
  if (!featureName) return false;
  
  if (featureCache && featureName in featureCache) {
    return featureCache[featureName];
  }
  
  // If we don't have it in cache, fallback to defaults
  return defaultFeatures[featureName] || false;
}

// Hook to get and subscribe to feature flag changes
export function useFeatureFlag(featureName: string): [boolean, (enabled: boolean) => void] {
  const [isEnabled, setIsEnabled] = useState(() => isFeatureEnabled(featureName));
  
  useEffect(() => {
    // Initial load from cache or defaults
    setIsEnabled(isFeatureEnabled(featureName));
    
    // Fetch feature flags if cache is stale
    const fetchFlags = async () => {
      if (featureCache && Date.now() - lastFetchTime < CACHE_DURATION) {
        return;
      }
      
      try {
        // In a real app, we would fetch from a database or API
        // const { data, error } = await supabase
        //   .from('feature_flags')
        //   .select('name, enabled');
        
        // if (error) throw error;
        
        // Update cache with current values
        // featureCache = data.reduce((acc, flag) => {
        //   acc[flag.name] = flag.enabled;
        //   return acc;
        // }, {} as Record<string, boolean>);
        
        // For now, use default values
        featureCache = { ...defaultFeatures };
        lastFetchTime = Date.now();
        
        // Update state if this specific feature changed
        if (featureName in featureCache) {
          setIsEnabled(featureCache[featureName]);
        }
      } catch (error) {
        console.error('Error fetching feature flags:', error);
      }
    };
    
    fetchFlags();
    
    // In a real app, we might subscribe to realtime updates
    // const subscription = supabase
    //   .channel('feature-flags')
    //   .on('postgres_changes', { event: '*', schema: 'public', table: 'feature_flags' }, handleChange)
    //   .subscribe();
    
    // return () => {
    //   supabase.removeChannel(subscription);
    // };
  }, [featureName]);
  
  // Function to toggle the feature (admin only)
  const setFeatureEnabled = async (enabled: boolean) => {
    try {
      // In a real app, we would update the database
      // const { error } = await supabase
      //   .from('feature_flags')
      //   .update({ enabled })
      //   .eq('name', featureName);
      
      // if (error) throw error;
      
      // Update local cache
      if (featureCache) {
        featureCache[featureName] = enabled;
      }
      
      // Update state
      setIsEnabled(enabled);
      
      console.log(`Feature "${featureName}" ${enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error(`Error updating feature flag "${featureName}":`, error);
    }
  };
  
  return [isEnabled, setFeatureEnabled];
}
