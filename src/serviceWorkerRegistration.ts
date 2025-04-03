
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

// Used to check if a particular path was previously accessed while online
export function registerOfflineAccessibleRoute(path: string) {
  try {
    // Get current offline accessible routes
    const offlineRoutes = JSON.parse(localStorage.getItem('offlineAccessibleRoutes') || '[]');
    
    // Add this route if it doesn't exist
    if (!offlineRoutes.includes(path)) {
      offlineRoutes.push(path);
      localStorage.setItem('offlineAccessibleRoutes', JSON.stringify(offlineRoutes));
    }
  } catch (error) {
    console.error('Error registering offline route:', error);
  }
}

// Check if a route is accessible offline
export function isRouteOfflineAccessible(path: string): boolean {
  try {
    const offlineRoutes = JSON.parse(localStorage.getItem('offlineAccessibleRoutes') || '[]');
    return offlineRoutes.includes(path);
  } catch (error) {
    console.error('Error checking offline access:', error);
    return false;
  }
}

// Clear cached offline accessible routes
export function clearOfflineAccessibleRoutes() {
  localStorage.removeItem('offlineAccessibleRoutes');
}
