
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type LanguageType = 'english' | 'italian' | 'both';

interface LanguageContextType {
  language: LanguageType;
  setLanguage: (language: LanguageType) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageType>(() => {
    // Check if language preference is stored in localStorage
    const storedLanguage = localStorage.getItem('language') as LanguageType;
    return storedLanguage || 'english'; // Default to English
  });

  const setLanguage = (newLanguage: LanguageType) => {
    setLanguageState(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  useEffect(() => {
    // Set html lang attribute for accessibility
    const htmlTag = document.querySelector('html');
    if (htmlTag) {
      htmlTag.setAttribute('lang', language === 'italian' ? 'it' : 'en');
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
