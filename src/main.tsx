
import { createRoot } from 'react-dom/client';
import React from 'react';
import App from './App.tsx';
import './index.css';
import { Toaster } from "@/components/ui/toaster";

// Ensure we have a valid DOM element
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
    <Toaster />
  </React.StrictMode>
);
