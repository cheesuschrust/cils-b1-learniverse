
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface FeatureLimits {
  flashcards: {
    maxCardsPerDay: number;
    currentUsage: number;
  };
  listening: {
    maxExercisesPerDay: number;
    currentUsage: number;
  };
  reading: {
    maxExercisesPerDay: number;
    currentUsage: number;
  };
  speaking: {
    maxExercisesPerDay: number;
    currentUsage: number;
  };
  premium: {
    isPremium: boolean;
    expiresAt: string | null;
  };
}

type FeatureType = 'flashcards' | 'listening' | 'reading' | 'speaking';

const useFeatureLimits = () => {
  const { user } = useAuth();
  
  // Default feature limits
  const [limits, setLimits] = useState<FeatureLimits>({
    flashcards: {
      maxCardsPerDay: 20,
      currentUsage: 0
    },
    listening: {
      maxExercisesPerDay: 3,
      currentUsage: 0
    },
    reading: {
      maxExercisesPerDay: 3,
      currentUsage: 0
    },
    speaking: {
      maxExercisesPerDay: 3,
      currentUsage: 0
    },
    premium: {
      isPremium: false,
      expiresAt: null
    }
  });
  
  useEffect(() => {
    if (user) {
      // In a real implementation, fetch the user's feature limits from the database
      // For now, just check if the user has premium features in their metadata
      const isPremium = user.user_metadata?.isPremium || false;
      
      if (isPremium) {
        setLimits(prev => ({
          ...prev,
          flashcards: {
            ...prev.flashcards,
            maxCardsPerDay: 999 // Unlimited for premium
          },
          listening: {
            ...prev.listening,
            maxExercisesPerDay: 999
          },
          reading: {
            ...prev.reading,
            maxExercisesPerDay: 999
          },
          speaking: {
            ...prev.speaking,
            maxExercisesPerDay: 999
          },
          premium: {
            isPremium: true,
            expiresAt: user.user_metadata?.premiumExpires || null
          }
        }));
      }
      
      // Load current usage from localStorage
      const storedUsage = localStorage.getItem(`usage_${user.id}`);
      if (storedUsage) {
        try {
          const usage = JSON.parse(storedUsage);
          const today = new Date().toISOString().split('T')[0];
          
          // Only use stored usage if it's from today
          if (usage.date === today) {
            setLimits(prev => ({
              ...prev,
              flashcards: {
                ...prev.flashcards,
                currentUsage: usage.flashcards || 0
              },
              listening: {
                ...prev.listening,
                currentUsage: usage.listening || 0
              },
              reading: {
                ...prev.reading,
                currentUsage: usage.reading || 0
              },
              speaking: {
                ...prev.speaking,
                currentUsage: usage.speaking || 0
              }
            }));
          }
        } catch (error) {
          console.error('Error parsing stored usage:', error);
        }
      }
    }
  }, [user]);
  
  // Check if a user can use a feature based on their limits
  const checkCanUseFeature = (feature: FeatureType): boolean => {
    if (!user) return true; // Allow using features if not logged in
    
    if (limits.premium.isPremium) return true; // Premium users have unlimited access
    
    const featureLimits = limits[feature];
    return featureLimits.currentUsage < featureLimits.maxCardsPerDay;
  };
  
  // Increment the usage counter for a feature
  const incrementUsage = (feature: FeatureType): void => {
    if (!user) return;
    
    setLimits(prev => {
      // Don't increment if user is premium
      if (prev.premium.isPremium) return prev;
      
      const updatedLimits = {
        ...prev,
        [feature]: {
          ...prev[feature],
          currentUsage: prev[feature].currentUsage + 1
        }
      };
      
      // Store updated usage in localStorage
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem(`usage_${user.id}`, JSON.stringify({
        date: today,
        flashcards: updatedLimits.flashcards.currentUsage,
        listening: updatedLimits.listening.currentUsage,
        reading: updatedLimits.reading.currentUsage,
        speaking: updatedLimits.speaking.currentUsage
      }));
      
      return updatedLimits;
    });
  };
  
  // Reset usage counters (e.g., at the start of a new day)
  const resetUsage = (): void => {
    if (!user) return;
    
    setLimits(prev => ({
      ...prev,
      flashcards: {
        ...prev.flashcards,
        currentUsage: 0
      },
      listening: {
        ...prev.listening,
        currentUsage: 0
      },
      reading: {
        ...prev.reading,
        currentUsage: 0
      },
      speaking: {
        ...prev.speaking,
        currentUsage: 0
      }
    }));
    
    // Clear stored usage
    localStorage.removeItem(`usage_${user.id}`);
  };
  
  return {
    limits,
    checkCanUseFeature,
    incrementUsage,
    resetUsage
  };
};

export default useFeatureLimits;
