
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface AISettings {
  modelProvider: 'openai' | 'huggingface' | 'azure' | 'google' | 'local';
  apiKey: string;
  modelName: string;
  temperature: number;
  maxTokens: number;
  contextWindow: number;
  systemPrompt: string;
  enableVoice: boolean;
}

export interface AIContextType {
  settings: AISettings;
  updateSettings: (newSettings: Partial<AISettings>) => void;
  isConfigured: boolean;
  resetSettings: () => void;
}

const defaultSettings: AISettings = {
  modelProvider: 'openai',
  apiKey: '',
  modelName: 'gpt-4o-mini',
  temperature: 0.7,
  maxTokens: 1000,
  contextWindow: 4000,
  systemPrompt: 'You are an Italian language tutor helping students prepare for the CILS B1 exam.',
  enableVoice: true
};

const AIContext = createContext<AIContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
  isConfigured: false,
  resetSettings: () => {},
});

export const useAI = () => useContext(AIContext);

interface AIProviderProps {
  children: ReactNode;
}

export const AIProvider: React.FC<AIProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AISettings>(() => {
    const savedSettings = localStorage.getItem('aiSettings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });
  
  const { toast } = useToast();
  
  const isConfigured = Boolean(settings.apiKey && settings.modelName);
  
  const updateSettings = (newSettings: Partial<AISettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('aiSettings', JSON.stringify(updatedSettings));
    
    toast({
      title: "Settings updated",
      description: "Your AI settings have been saved.",
    });
  };
  
  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('aiSettings');
    
    toast({
      title: "Settings reset",
      description: "AI settings have been reset to defaults.",
    });
  };

  return (
    <AIContext.Provider value={{ settings, updateSettings, isConfigured, resetSettings }}>
      {children}
    </AIContext.Provider>
  );
};

export default AIContext;
