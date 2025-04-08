
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export type LanguageOption = 'english' | 'italian' | 'both';

interface LanguageContextType {
  language: LanguageOption;
  setLanguage: (language: LanguageOption) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { user, updateProfile } = useAuth();
  const [language, setLanguageState] = useState<LanguageOption>(
    (user?.preferredLanguage as LanguageOption) || 'both'
  );

  useEffect(() => {
    if (user?.preferredLanguage) {
      setLanguageState(user.preferredLanguage as LanguageOption);
    }
  }, [user?.preferredLanguage]);

  const setLanguage = (newLanguage: LanguageOption) => {
    setLanguageState(newLanguage);
    if (user && updateProfile) {
      updateProfile({ preferredLanguage: newLanguage });
    } else {
      localStorage.setItem('preferredLanguage', newLanguage);
    }
  };

  const toggleLanguage = () => {
    const nextLanguage: LanguageOption = 
      language === 'english' ? 'italian' : 
      language === 'italian' ? 'both' : 'english';
    
    setLanguage(nextLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
