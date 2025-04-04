
import { appConfig } from "@/config/appConfig";
import { useCallback } from "react";
import type { AppConfig, AppLevel, AppFeature, AppColor, AppTestimonial, AppMarketingFeature } from "@/types/config-types";

/**
 * Hook for accessing the app configuration
 * 
 * This hook provides access to the central app configuration along with helper functions
 * for accessing specific configuration elements more easily.
 */
export function useAppConfig() {
  // Get a specific level configuration by ID
  const getLevelById = useCallback((levelId: string): AppLevel | undefined => {
    return appConfig.levels.find(level => level.id === levelId);
  }, []);

  // Get a specific level configuration by CILS level
  const getLevelByCILS = useCallback((cilsLevel: string): AppLevel | undefined => {
    return appConfig.levels.find(level => level.cils === cilsLevel);
  }, []);

  // Check if a specific feature is enabled
  const isFeatureEnabled = useCallback((feature: AppFeature): boolean => {
    const featureConfig = appConfig.features[feature];
    if (typeof featureConfig === 'boolean') {
      return featureConfig;
    }
    if (typeof featureConfig === 'object' && 'enabled' in featureConfig) {
      return !!featureConfig.enabled;
    }
    return false;
  }, []);

  // Get a specific color by key
  const getColor = useCallback((color: AppColor): string => {
    return appConfig.branding.colors[color] || '';
  }, []);

  // Get the CILS B1 level configuration
  const getCILSB1Level = useCallback((): AppLevel | undefined => {
    return getLevelByCILS('B1');
  }, [getLevelByCILS]);

  return {
    ...appConfig,
    getLevelById,
    getLevelByCILS,
    isFeatureEnabled,
    getColor,
    getCILSB1Level
  };
}

export default useAppConfig;
