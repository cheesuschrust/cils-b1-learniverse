
// Check if service workers are supported
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(registration => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        })
        .catch(error => {
          console.error('ServiceWorker registration failed: ', error);
        });
    });
  }
}

// Detect if the app is offline
export function setupOfflineDetection(callback: (isOffline: boolean) => void) {
  const updateOnlineStatus = () => {
    const isOffline = !navigator.onLine;
    callback(isOffline);
  };

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  
  // Initial check
  updateOnlineStatus();
  
  // Return cleanup function
  return () => {
    window.removeEventListener('online', updateOnlineStatus);
    window.removeEventListener('offline', updateOnlineStatus);
  };
}
