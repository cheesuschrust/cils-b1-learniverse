
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase-client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL hash
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (data?.session) {
          toast({
            title: 'Authentication successful',
            description: 'You are now logged in',
          });
          navigate('/dashboard');
        } else {
          navigate('/auth/login');
        }
      } catch (error: any) {
        console.error('Error during auth callback:', error);
        toast({
          title: 'Authentication error',
          description: error.message || 'An error occurred during authentication',
          variant: 'destructive',
        });
        navigate('/auth/login');
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loader2 className="animate-spin h-12 w-12 text-primary mx-auto" />
        <p className="mt-4 text-lg">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
