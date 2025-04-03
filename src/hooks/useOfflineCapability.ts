
import { useState, useEffect } from 'react';
import { useOnlineStatus } from './useOnlineStatus';
import { registerOfflineAccessibleRoute, isRouteOfflineAccessible } from '@/serviceWorkerRegistration';

/**
 * Hook to manage offline capabilities for learning modules
 */
export function useOfflineCapability(modulePath: string) {
  const isOnline = useOnlineStatus();
  const [isOfflineReady, setIsOfflineReady] = useState<boolean>(false);
  const [isCaching, setIsCaching] = useState<boolean>(false);

  // Check if this route is available offline
  useEffect(() => {
    const checkOfflineAvailability = () => {
      const isAvailable = isRouteOfflineAccessible(modulePath);
      setIsOfflineReady(isAvailable);
    };
    
    checkOfflineAvailability();
    
    // If online, register this route as accessible offline
    if (isOnline) {
      registerOfflineAccessibleRoute(modulePath);
      setIsOfflineReady(true);
    }
  }, [isOnline, modulePath]);

  // Function to enable offline access for this module
  const enableOfflineAccess = async () => {
    if (isOnline) {
      setIsCaching(true);
      
      try {
        // Register the route for offline access
        registerOfflineAccessibleRoute(modulePath);
        
        // Small delay to simulate caching process
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setIsOfflineReady(true);
      } catch (error) {
        console.error('Error enabling offline access:', error);
      } finally {
        setIsCaching(false);
      }
    }
  };

  return {
    isOnline,
    isOfflineReady,
    isCaching,
    enableOfflineAccess
  };
}

export default useOfflineCapability;
