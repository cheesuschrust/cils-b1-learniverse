
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import * as AuthService from './services/AuthService';

// Add global reference to authService for testing purposes
// This is a workaround for SystemTester.tsx which is read-only
interface WindowWithAuthService extends Window {
  authService: typeof AuthService;
}

// Properly declare authService as a property on the window object
declare global {
  interface Window {
    authService: typeof AuthService;
  }
}

// Assign the authService to the window object
window.authService = AuthService;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
