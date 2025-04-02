
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    if (!email) {
      setFormError('Email is required');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await resetPassword(email);
      if (success) {
        setIsSubmitted(true);
      }
    } catch (error: any) {
      setFormError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Forgot password</CardTitle>
        <CardDescription>
          Enter your email to receive a password reset link
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isSubmitted ? (
          <div className="space-y-4">
            <Alert>
              <AlertDescription>
                If an account exists with the email you provided, you will receive a password reset link shortly.
              </AlertDescription>
            </Alert>
            <Button className="w-full" asChild>
              <Link to="/auth/login">Back to login</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {formError && (
              <Alert variant="destructive">
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="pl-10"
                    autoComplete="email"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending link...
                  </>
                ) : (
                  'Send reset link'
                )}
              </Button>
            </form>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <div className="text-sm text-muted-foreground text-center w-full">
          Remember your password?{" "}
          <Link to="/auth/login" className="text-primary underline-offset-4 hover:underline">
            Back to login
          </Link>
        </div>
      </CardFooter>
    </>
  );
};

export default ForgotPasswordPage;
