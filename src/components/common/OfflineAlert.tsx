
import React, { useEffect, useState } from 'react';
import { setupOfflineDetection } from '@/serviceWorkerRegistration';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { WifiOff } from 'lucide-react';

const OfflineAlert: React.FC = () => {
  const [isOffline, setIsOffline] = useState<boolean>(false);
  
  useEffect(() => {
    // Setup offline detection
    const cleanup = setupOfflineDetection((offline) => {
      setIsOffline(offline);
    });
    
    // Cleanup listeners on unmount
    return cleanup;
  }, []);
  
  if (!isOffline) return null;
  
  return (
    <Alert 
      variant="destructive"
      className="fixed bottom-4 right-4 w-auto max-w-md z-50 animate-in slide-in-from-bottom"
    >
      <WifiOff className="h-4 w-4" />
      <AlertTitle>You're offline</AlertTitle>
      <AlertDescription>
        Your connection was lost. Some features may be limited until you're back online.
      </AlertDescription>
    </Alert>
  );
};

export default OfflineAlert;
