
import { useState, useEffect } from 'react';

export function useOfflineCapability(featurePath: string) {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isOfflineReady, setIsOfflineReady] = useState<boolean>(false);
  
  // Local storage key for tracking offline-enabled features
  const storageKey = 'offline_enabled_features';

  // Check if feature is already enabled for offline use
  useEffect(() => {
    const enabledFeatures = JSON.parse(localStorage.getItem(storageKey) || '[]');
    setIsOfflineReady(enabledFeatures.includes(featurePath));
    
    // Set up online/offline event listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [featurePath, storageKey]);
  
  /**
   * Enable offline access for a specific feature
   */
  const enableOfflineAccess = () => {
    if (!isOnline) return false; // Can't enable offline mode while offline
    
    try {
      const enabledFeatures = JSON.parse(localStorage.getItem(storageKey) || '[]');
      
      if (!enabledFeatures.includes(featurePath)) {
        enabledFeatures.push(featurePath);
        localStorage.setItem(storageKey, JSON.stringify(enabledFeatures));
      }
      
      setIsOfflineReady(true);
      return true;
    } catch (error) {
      console.error('Failed to enable offline access:', error);
      return false;
    }
  };
  
  /**
   * Disable offline access for a specific feature
   */
  const disableOfflineAccess = () => {
    try {
      const enabledFeatures = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const updatedFeatures = enabledFeatures.filter((path: string) => path !== featurePath);
      
      localStorage.setItem(storageKey, JSON.stringify(updatedFeatures));
      setIsOfflineReady(false);
      return true;
    } catch (error) {
      console.error('Failed to disable offline access:', error);
      return false;
    }
  };
  
  return {
    isOnline,
    isOfflineReady,
    enableOfflineAccess,
    disableOfflineAccess
  };
}

export default useOfflineCapability;
