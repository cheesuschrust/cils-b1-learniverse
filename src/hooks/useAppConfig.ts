
import { appConfig } from "@/config/appConfig";

/**
 * Hook for accessing the app configuration
 * 
 * This hook provides access to the central app configuration.
 * It can be extended with additional functionality as needed.
 */
export function useAppConfig() {
  return appConfig;
}

export default useAppConfig;
