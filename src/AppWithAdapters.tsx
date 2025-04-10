
import React from 'react';
import App from './App';
import AppProviders from './providers';
import './adapters';

/**
 * This wrapper component ensures our adapter files are loaded
 * before the main App is rendered, and wraps the app with all necessary providers.
 */
const AppWithAdapters = () => {
  return (
    <AppProviders>
      <App />
    </AppProviders>
  );
};

export default AppWithAdapters;
