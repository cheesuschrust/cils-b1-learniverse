
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Mail, CheckCircle, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type EmailFormValues = z.infer<typeof emailSchema>;

const VerifyEmailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyEmail, resendVerificationEmail, user } = useAuth();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<"success" | "error" | "pending" | null>(null);
  const [isSending, setIsSending] = useState(false);
  
  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: user?.email || '',
    },
  });
  
  // Process token from URL
  useEffect(() => {
    const processVerification = async () => {
      // Check if there's a token in the URL
      const url = new URL(window.location.href);
      const token = url.searchParams.get("token");
      
      if (token) {
        setIsVerifying(true);
        setVerificationResult("pending");
        
        try {
          const result = await verifyEmail(token);
          setVerificationResult(result ? "success" : "error");
        } catch (error) {
          console.error("Verification error:", error);
          setVerificationResult("error");
        } finally {
          setIsVerifying(false);
        }
      }
    };
    
    processVerification();
  }, [location]);
  
  // Update form when user changes
  useEffect(() => {
    if (user?.email) {
      form.setValue('email', user.email);
    }
  }, [user, form]);
  
  const handleResendVerification = async (data: EmailFormValues) => {
    setIsSending(true);
    try {
      await resendVerificationEmail(data.email);
    } catch (error) {
      console.error("Error sending verification email:", error);
    } finally {
      setIsSending(false);
    }
  };
  
  const goToDashboard = () => {
    navigate('/dashboard');
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Email Verification</CardTitle>
          <CardDescription>
            Verify your email address to access all features
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {isVerifying ? (
            <div className="text-center py-6">
              <Loader2 className="inline-block h-8 w-8 animate-spin" />
              <p className="mt-4">Verifying your email...</p>
            </div>
          ) : verificationResult === "success" ? (
            <Alert className="bg-green-50 border-green-200 text-green-800">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle>Email Verified</AlertTitle>
              <AlertDescription>
                Your email has been successfully verified. You can now access all features.
              </AlertDescription>
            </Alert>
          ) : verificationResult === "error" ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Verification Failed</AlertTitle>
              <AlertDescription>
                The verification link is invalid or has expired. Please request a new verification email.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <Alert variant="default" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Verification Required</AlertTitle>
                <AlertDescription>
                  Please check your inbox for a verification email or request a new one below.
                </AlertDescription>
              </Alert>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleResendVerification)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email address</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your email address"
                            type="email"
                            {...field}
                            disabled={isSending || !!user}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit"
                    className="w-full" 
                    disabled={isSending}
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Verification Email'
                    )}
                  </Button>
                </form>
              </Form>
            </>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col gap-2">
          {verificationResult === "success" && (
            <Button 
              className="w-full" 
              onClick={goToDashboard}
            >
              Continue to Dashboard
            </Button>
          )}
          
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => navigate("/auth/login")}
          >
            Back to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifyEmailPage;
