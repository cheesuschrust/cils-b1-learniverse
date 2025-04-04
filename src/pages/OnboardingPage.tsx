
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import { supabase } from '@/lib/supabase-client';

const OnboardingPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
        setHasCompletedOnboarding(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, [user?.id]);

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

  const handleOnboardingComplete = () => {
    navigate('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10">
      <OnboardingFlow onComplete={handleOnboardingComplete} />
    </div>
  );
};

export default OnboardingPage;
