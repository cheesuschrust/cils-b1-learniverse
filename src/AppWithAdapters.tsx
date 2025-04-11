
import React from 'react';
import App from './App';
import './adapters';

/**
 * This wrapper component ensures our adapter files are loaded
 * before the main App is rendered.
 */
const AppWithAdapters = () => {
  return <App />;
};

export default AppWithAdapters;
