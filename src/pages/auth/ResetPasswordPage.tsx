
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { updatePassword, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Check if user is authenticated via the reset link
  useEffect(() => {
    if (!isAuthenticated) {
      setFormError('Invalid or expired password reset link. Please try again.');
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    if (!password) {
      setFormError('Password is required');
      return;
    }
    
    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    // Password strength check
    if (password.length < 8) {
      setFormError('Password must be at least 8 characters long');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await updatePassword(password);
      if (success) {
        setIsSubmitted(true);
        // Redirect after a delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
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
        <CardTitle className="text-2xl font-bold">Reset password</CardTitle>
        <CardDescription>
          Enter your new password
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isSubmitted ? (
          <div className="space-y-4">
            <Alert>
              <AlertDescription>
                Your password has been successfully reset. You will be redirected to the dashboard shortly.
              </AlertDescription>
            </Alert>
            <Button className="w-full" onClick={() => navigate('/dashboard')}>
              Go to dashboard
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
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    autoComplete="new-password"
                    disabled={isSubmitting || !isAuthenticated}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10"
                    autoComplete="new-password"
                    disabled={isSubmitting || !isAuthenticated}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={isSubmitting || !isAuthenticated}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting password...
                  </>
                ) : (
                  'Reset password'
                )}
              </Button>
            </form>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <div className="text-sm text-muted-foreground text-center w-full">
          Need assistance?{" "}
          <a href="/contact" className="text-primary underline-offset-4 hover:underline">
            Contact support
          </a>
        </div>
      </CardFooter>
    </>
  );
};

export default ResetPasswordPage;
