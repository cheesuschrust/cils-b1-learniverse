
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, CheckCircle, AlertCircle, Mail } from 'lucide-react';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const { verifyEmail, resendVerificationEmail } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [verificationState, setVerificationState] = useState<'loading' | 'success' | 'error'>('loading');
  const [email, setEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  
  const userId = searchParams.get('userId');
  const token = searchParams.get('token');
  
  useEffect(() => {
    const verifyEmailToken = async () => {
      if (!userId || !token) {
        setVerificationState('error');
        return;
      }
      
      try {
        const success = await verifyEmail(userId, token);
        setVerificationState(success ? 'success' : 'error');
      } catch (error) {
        console.error('Error verifying email:', error);
        setVerificationState('error');
      }
    };
    
    verifyEmailToken();
  }, [userId, token, verifyEmail]);
  
  const handleResendVerification = async () => {
    if (!email) {
      toast({
        title: 'Email Required',
        description: 'Please enter your email address to resend the verification.',
        variant: 'destructive',
      });
      return;
    }
    
    setResendLoading(true);
    
    try {
      const success = await resendVerificationEmail(email);
      
      if (success) {
        toast({
          title: 'Verification Email Sent',
          description: 'If an account exists with this email, a new verification link has been sent.',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to send verification email. Please try again later.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error resending verification:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setResendLoading(false);
    }
  };
  
  return (
    <div className="container max-w-md mx-auto py-16 px-4">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Email Verification</CardTitle>
          {verificationState === 'loading' && (
            <CardDescription>Verifying your email...</CardDescription>
          )}
          {verificationState === 'success' && (
            <CardDescription>Your email has been verified!</CardDescription>
          )}
          {verificationState === 'error' && (
            <CardDescription>There was a problem verifying your email.</CardDescription>
          )}
        </CardHeader>
        
        <CardContent className="flex flex-col items-center justify-center space-y-4">
          {verificationState === 'loading' && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p>Verifying your email address...</p>
            </div>
          )}
          
          {verificationState === 'success' && (
            <div className="flex flex-col items-center justify-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
              <p className="text-center">
                Your email has been successfully verified. You can now log in to your account.
              </p>
            </div>
          )}
          
          {verificationState === 'error' && (
            <div className="flex flex-col items-center justify-center py-4">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <p className="text-center mb-4">
                The verification link is invalid or has expired. Please request a new verification link.
              </p>
              
              <div className="w-full space-y-4">
                <div className="flex flex-col space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="flex-1 px-3 py-2 border rounded-md"
                    />
                    <Button 
                      onClick={handleResendVerification}
                      disabled={resendLoading}
                    >
                      {resendLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Resend'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate('/login')}
          >
            Return to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EmailVerification;
