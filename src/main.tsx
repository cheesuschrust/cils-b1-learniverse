
import { createRoot } from 'react-dom/client';
import React from 'react';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from "@/components/ui/theme-provider";
import { UserPreferencesProvider } from "@/contexts/UserPreferencesContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";

// Ensure we have a valid DOM element
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

createRoot(rootElement).render(
  <React.StrictMode>
    <UserPreferencesProvider>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <App />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </UserPreferencesProvider>
  </React.StrictMode>
);
