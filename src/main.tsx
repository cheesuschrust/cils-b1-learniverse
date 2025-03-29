import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Add this import
import App from './App';
import './index.css';
import './styles/flashcard.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter> {/* Add this wrapper */}
      <App />
    </BrowserRouter> {/* Close the wrapper */}
  </React.StrictMode>
);
