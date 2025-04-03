
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

// Add an offline UI component
export function createOfflineUI() {
  const offlineDiv = document.createElement('div');
  offlineDiv.id = 'offline-notification';
  offlineDiv.style.display = 'none';
  offlineDiv.style.position = 'fixed';
  offlineDiv.style.bottom = '20px';
  offlineDiv.style.right = '20px';
  offlineDiv.style.backgroundColor = '#ff5252';
  offlineDiv.style.color = 'white';
  offlineDiv.style.padding = '10px 20px';
  offlineDiv.style.borderRadius = '4px';
  offlineDiv.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
  offlineDiv.style.zIndex = '10000';
  offlineDiv.textContent = 'You are offline. Some features may be limited.';
  document.body.appendChild(offlineDiv);

  return offlineDiv;
}
