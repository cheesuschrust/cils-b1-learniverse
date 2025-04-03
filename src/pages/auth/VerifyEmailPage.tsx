
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/EnhancedAuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft, Check, AlertCircle, Mail, RefreshCw } from "lucide-react";

const VerifyEmailPage: React.FC = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  
  const { verifyEmail, resendVerificationEmail, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract token from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    
    if (token) {
      verifyEmailWithToken(token);
    }
  }, [location]);
  
  const verifyEmailWithToken = async (token: string) => {
    setIsVerifying(true);
    setError(null);
    
    try {
      const success = await verifyEmail(token);
      
      if (success) {
        setVerificationStatus('success');
        // Redirect to dashboard after successful verification
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 3000);
      } else {
        setVerificationStatus('error');
        setError("Failed to verify your email. The verification link may have expired.");
      }
    } catch (error: any) {
      console.error(error);
      setVerificationStatus('error');
      setError(error.message || "An unexpected error occurred during verification.");
    } finally {
      setIsVerifying(false);
    }
  };
  
  const handleResendVerification = async () => {
    setIsResending(true);
    setError(null);
    
    try {
      const success = await resendVerificationEmail();
      
      if (!success) {
        setError("Failed to resend verification email. Please try again.");
      }
    } catch (error: any) {
      console.error(error);
      setError(error.message || "An unexpected error occurred when resending verification email.");
    } finally {
      setIsResending(false);
    }
  };
  
  return (
    <div className="container max-w-md mx-auto px-4 py-16">
      <Helmet>
        <title>Verify Email - CILS Italian Citizenship</title>
      </Helmet>
      
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
          <CardDescription>
            {verificationStatus === 'success'
              ? "Your email has been verified successfully"
              : "Please verify your email address to continue"}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {isVerifying ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Spinner size="lg" className="mb-4" />
              <p className="text-center text-muted-foreground">Verifying your email address...</p>
            </div>
          ) : verificationStatus === 'success' ? (
            <div className="space-y-4">
              <Alert variant="success" className="bg-green-50 border-green-200 text-green-800">
                <Check className="h-4 w-4 text-green-500" />
                <AlertTitle>Email verified</AlertTitle>
                <AlertDescription>
                  Your email has been verified successfully. You will be redirected to the dashboard.
                </AlertDescription>
              </Alert>
              <div className="flex justify-center">
                <Spinner size="md" />
              </div>
            </div>
          ) : verificationStatus === 'error' ? (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Verification failed</AlertTitle>
                <AlertDescription>
                  {error || "Failed to verify your email. The verification link may have expired."}
                </AlertDescription>
              </Alert>
              
              <div className="text-center">
                <p className="mb-4">Need a new verification link?</p>
                <Button
                  onClick={handleResendVerification}
                  disabled={isResending}
                  className="w-full"
                >
                  {isResending ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Resend verification email
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-md p-4">
                <div className="flex gap-3">
                  <Mail className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">Check your inbox</h4>
                    <p className="text-sm mt-1">
                      We've sent a verification link to your email address.
                      Click the link in the email to verify your account.
                      {user?.email && <span className="block mt-1">Email sent to: <strong>{user.email}</strong></span>}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="mb-4 text-sm text-muted-foreground">
                  Didn't receive an email? Check your spam folder or request a new verification link.
                </p>
                <Button
                  onClick={handleResendVerification}
                  disabled={isResending}
                  className="w-full"
                >
                  {isResending ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Resend verification email
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <Link 
            to="/login" 
            className="text-primary hover:underline flex items-center gap-1 text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifyEmailPage;
