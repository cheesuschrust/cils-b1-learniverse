
import { useState, useEffect } from '@/adapters/ReactImports';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/adapters/ToastAdapter';

export interface FeatureLimits {
  flashcards: {
    maxCards: number;
    maxSets: number;
    maxCardsPerDay: number;
    currentUsage: number;
  };
  exercises: {
    maxDailyLessons: number;
    currentUsage: number;
  };
  premium: {
    isPremium: boolean;
    expiresAt: Date | null;
  };
}

// Default limits for free and premium users
const DEFAULT_FREE_LIMITS: FeatureLimits = {
  flashcards: {
    maxCards: 100,
    maxSets: 5,
    maxCardsPerDay: 50,
    currentUsage: 0
  },
  exercises: {
    maxDailyLessons: 3,
    currentUsage: 0
  },
  premium: {
    isPremium: false,
    expiresAt: null
  }
};

const DEFAULT_PREMIUM_LIMITS: FeatureLimits = {
  flashcards: {
    maxCards: Infinity,
    maxSets: Infinity,
    maxCardsPerDay: Infinity,
    currentUsage: 0
  },
  exercises: {
    maxDailyLessons: Infinity,
    currentUsage: 0
  },
  premium: {
    isPremium: true,
    expiresAt: null
  }
};

export const useFeatureLimits = () => {
  const { user, isAuthenticated } = useAuth();
  const [limits, setLimits] = useState<FeatureLimits>(DEFAULT_FREE_LIMITS);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserLimits = async () => {
      if (!isAuthenticated || !user) {
        setLimits(DEFAULT_FREE_LIMITS);
        setIsLoading(false);
        return;
      }

      try {
        // In a real app, this would fetch from Supabase
        // For now, we'll simulate a fetch with a delay
        setTimeout(() => {
          // Example: check if user has premium based on user object
          const isPremium = user.role === 'premium' || false;
          
          if (isPremium) {
            setLimits({
              ...DEFAULT_PREMIUM_LIMITS,
              premium: {
                isPremium: true,
                // Set expiration date to 30 days from now for demo purposes
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
              }
            });
          } else {
            // For free users, we would normally fetch their current usage
            // Here we'll just use default limits with random usage
            setLimits({
              ...DEFAULT_FREE_LIMITS,
              flashcards: {
                ...DEFAULT_FREE_LIMITS.flashcards,
                currentUsage: Math.floor(Math.random() * 30) // Random number for demo
              },
              exercises: {
                ...DEFAULT_FREE_LIMITS.exercises,
                currentUsage: Math.floor(Math.random() * 2) // Random number for demo
              }
            });
          }
          
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching feature limits:", error);
        setLimits(DEFAULT_FREE_LIMITS);
        setIsLoading(false);
      }
    };

    fetchUserLimits();
  }, [isAuthenticated, user]);

  const incrementUsage = (feature: 'flashcards' | 'exercises', amount: number = 1) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to use this feature.",
        variant: "error" // Will be mapped to destructive
      });
      return false;
    }

    setLimits(prev => {
      const currentUsage = prev[feature].currentUsage;
      const maxUsage = feature === 'flashcards' ? prev.flashcards.maxCardsPerDay : prev.exercises.maxDailyLessons;
      
      // Check if adding amount would exceed limits
      if (currentUsage + amount > maxUsage && !prev.premium.isPremium) {
        toast({
          title: "Usage Limit Reached",
          description: `You've reached your daily ${feature} limit. Upgrade to Premium for unlimited usage.`,
          variant: "error" // Will be mapped to destructive
        });
        return prev;
      }
      
      // If user is within limits or is premium, increment usage
      return {
        ...prev,
        [feature]: {
          ...prev[feature],
          currentUsage: prev.premium.isPremium ? currentUsage : currentUsage + amount
        }
      };
    });
    
    return true;
  };

  const checkCanUseFeature = (feature: 'flashcards' | 'exercises', amount: number = 1): boolean => {
    if (!isAuthenticated) {
      return false;
    }
    
    if (limits.premium.isPremium) {
      return true;
    }
    
    const currentUsage = limits[feature].currentUsage;
    const maxUsage = feature === 'flashcards' ? limits.flashcards.maxCardsPerDay : limits.exercises.maxDailyLessons;
    
    return currentUsage + amount <= maxUsage;
  };

  const resetDailyUsage = () => {
    setLimits(prev => ({
      ...prev,
      flashcards: {
        ...prev.flashcards,
        currentUsage: 0
      },
      exercises: {
        ...prev.exercises,
        currentUsage: 0
      }
    }));
  };

  return {
    limits,
    isLoading,
    incrementUsage,
    checkCanUseFeature,
    resetDailyUsage,
    isPremium: limits.premium.isPremium
  };
};

export default useFeatureLimits;
