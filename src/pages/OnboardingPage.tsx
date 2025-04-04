
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import { supabase } from '@/lib/supabase-client';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { useToast } from '@/hooks/use-toast';
import { useOfflineCapability } from '@/hooks/useOfflineCapability';

const OnboardingPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isOnline, isOfflineReady } = useOfflineCapability('/onboarding');

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('onboarding_completed')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        
        setHasCompletedOnboarding(data?.onboarding_completed || false);
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        toast({
          title: "Error",
          description: "Failed to load your onboarding status. Please try again.",
          variant: "destructive"
        });
        setHasCompletedOnboarding(false);
      } finally {
        setIsLoading(false);
      }
    };

    // If offline but we have cached data, use it
    if (!isOnline && isOfflineReady) {
      const cachedStatus = localStorage.getItem(`onboarding_status_${user?.id}`);
      if (cachedStatus) {
        setHasCompletedOnboarding(JSON.parse(cachedStatus));
        setIsLoading(false);
        return;
      }
    }

    checkOnboardingStatus();
  }, [user?.id, toast, isOnline, isOfflineReady]);

  // Cache onboarding status when it changes
  useEffect(() => {
    if (user?.id && hasCompletedOnboarding !== null) {
      localStorage.setItem(`onboarding_status_${user.id}`, JSON.stringify(hasCompletedOnboarding));
    }
  }, [user?.id, hasCompletedOnboarding]);

  useEffect(() => {
    // If user isn't authenticated, redirect to login
    if (!isLoading && !isAuthenticated) {
      navigate('/auth/login', { 
        state: { 
          redirectTo: location.pathname,
          message: 'Please sign in to complete onboarding'
        } 
      });
      return;
    }

    // If user has already completed onboarding, redirect to dashboard
    if (!isLoading && hasCompletedOnboarding) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, hasCompletedOnboarding, isLoading, navigate, location.pathname]);

  const handleOnboardingComplete = async () => {
    try {
      if (user?.id) {
        // Update user profile in Supabase
        const { error } = await supabase
          .from('user_profiles')
          .update({ onboarding_completed: true })
          .eq('id', user.id);
          
        if (error) throw error;
        
        // Update local state
        setHasCompletedOnboarding(true);
        
        // Store in local storage for offline access
        localStorage.setItem(`onboarding_status_${user.id}`, JSON.stringify(true));
        
        toast({
          title: "Success",
          description: "Your profile has been set up successfully!",
          variant: "default"
        });
      }
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        title: "Error",
        description: "Failed to complete onboarding. Please try again.",
        variant: "destructive"
      });
      
      // Navigate anyway to avoid blocking user
      navigate('/dashboard');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show offline message if needed
  if (!isOnline && !isOfflineReady) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-bold mb-4">You're offline</h2>
          <p className="mb-4">
            You need to complete onboarding while online for the first time.
            Please connect to the internet and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-10">
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      </div>
    </ErrorBoundary>
  );
};

export default OnboardingPage;
