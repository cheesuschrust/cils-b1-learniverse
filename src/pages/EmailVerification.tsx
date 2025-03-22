
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle, Lock, Mail, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const EmailVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyEmail, resendVerificationEmail, user } = useAuth();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<"success" | "error" | null>(null);
  const [email, setEmail] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  
  // Get token from query string
  const query = new URLSearchParams(location.search);
  const token = query.get("token");
  
  // Process token verification
  useEffect(() => {
    const processVerification = async () => {
      if (token) {
        setIsVerifying(true);
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
  }, [token]);
  
  // Send verification email
  const handleResendVerification = async () => {
    const emailToUse = email || (user?.email || "");
    if (!emailToUse) {
      return;
    }
    
    setIsSending(true);
    try {
      await resendVerificationEmail(emailToUse);
    } catch (error) {
      console.error("Error sending verification email:", error);
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <div className="container max-w-lg mx-auto px-4 py-12">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Email Verification</CardTitle>
          <CardDescription>
            Verify your email address to access all features
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {isVerifying ? (
            <div className="text-center py-6">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-primary border-r-transparent mb-4"></div>
              <p>Verifying your email...</p>
            </div>
          ) : verificationResult === "success" ? (
            <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
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
              {user ? (
                <Alert variant="default" className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Verification Required</AlertTitle>
                  <AlertDescription>
                    Please check your inbox for a verification email or request a new one below.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="default" className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Email Verification</AlertTitle>
                  <AlertDescription>
                    Enter your email address to receive a verification link.
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="mt-4">
                <Input
                  placeholder="Enter your email address"
                  type="email"
                  value={email || (user?.email || "")}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!!user}
                />
              </div>
            </>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col gap-2">
          {verificationResult === "success" ? (
            <Button 
              className="w-full" 
              onClick={() => navigate("/dashboard")}
            >
              Continue to Dashboard
            </Button>
          ) : verificationResult === "error" || !token ? (
            <>
              <Button 
                className="w-full" 
                onClick={handleResendVerification}
                disabled={isSending || (!email && !user)}
              >
                {isSending ? "Sending..." : "Send Verification Email"}
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate("/login")}
              >
                Back to Login
              </Button>
            </>
          ) : null}
        </CardFooter>
      </Card>
    </div>
  );
};

export default EmailVerification;
