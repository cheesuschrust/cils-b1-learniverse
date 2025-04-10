
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './EnhancedAuthContext';
import { supabase } from '@/lib/supabase-client';

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'it';
  notifications: {
    email: boolean;
    push: boolean;
  };
  studyPreferences: {
    dailyGoal: number;
    difficultySetting: 'beginner' | 'intermediate' | 'advanced';
    focusAreas: string[];
  };
  accessibility: {
    fontSize: 'small' | 'medium' | 'large';
    highContrast: boolean;
  };
}

const defaultPreferences: UserPreferences = {
  theme: 'system',
  language: 'en',
  notifications: {
    email: true,
    push: true,
  },
  studyPreferences: {
    dailyGoal: 15,
    difficultySetting: 'intermediate',
    focusAreas: ['vocabulary', 'grammar'],
  },
  accessibility: {
    fontSize: 'medium',
    highContrast: false,
  },
};

interface UserPreferencesContextType {
  preferences: UserPreferences;
  isLoading: boolean;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => Promise<void>;
  resetToDefaults: () => void;
}

const UserPreferencesContext = createContext<UserPreferencesContextType>({
  preferences: defaultPreferences,
  isLoading: false,
  updatePreferences: async () => {},
  resetToDefaults: () => {},
});

export const useUserPreferences = () => useContext(UserPreferencesContext);

export const UserPreferencesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(false);

  // Load preferences from localStorage or database
  useEffect(() => {
    const loadPreferences = async () => {
      setIsLoading(true);
      try {
        if (user) {
          // Try to load from database if user is logged in
          const { data, error } = await supabase
            .from('user_preferences')
            .select('preferences')
            .eq('user_id', user.id)
            .single();

          if (error || !data) {
            // Fallback to localStorage
            const storedPrefs = localStorage.getItem('userPreferences');
            if (storedPrefs) {
              setPreferences({
                ...defaultPreferences,
                ...JSON.parse(storedPrefs),
              });
            }
          } else {
            setPreferences({
              ...defaultPreferences,
              ...data.preferences,
            });
          }
        } else {
          // Not logged in, use localStorage
          const storedPrefs = localStorage.getItem('userPreferences');
          if (storedPrefs) {
            setPreferences({
              ...defaultPreferences,
              ...JSON.parse(storedPrefs),
            });
          }
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, [user]);

  const updatePreferences = async (newPreferences: Partial<UserPreferences>) => {
    const updatedPreferences = {
      ...preferences,
      ...newPreferences,
    };

    setPreferences(updatedPreferences);
    
    // Save to localStorage
    localStorage.setItem('userPreferences', JSON.stringify(updatedPreferences));

    // If user is logged in, also save to database
    if (user) {
      try {
        const { error } = await supabase
          .from('user_preferences')
          .upsert({ 
            user_id: user.id, 
            preferences: updatedPreferences,
            updated_at: new Date().toISOString()
          });

        if (error) {
          console.error('Error saving preferences to database:', error);
        }
      } catch (error) {
        console.error('Error saving preferences:', error);
      }
    }
  };

  const resetToDefaults = () => {
    setPreferences(defaultPreferences);
    localStorage.setItem('userPreferences', JSON.stringify(defaultPreferences));
    
    if (user) {
      supabase
        .from('user_preferences')
        .upsert({ 
          user_id: user.id, 
          preferences: defaultPreferences,
          updated_at: new Date().toISOString()
        })
        .then(({ error }) => {
          if (error) {
            console.error('Error resetting preferences in database:', error);
          }
        });
    }
  };

  return (
    <UserPreferencesContext.Provider
      value={{
        preferences,
        isLoading,
        updatePreferences,
        resetToDefaults,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};
