
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/EnhancedAuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Lock, Eye, EyeOff, Check, AlertCircle } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Validation schema
const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof resetPasswordSchema>;

const ResetPasswordPage: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Define form with validation
  const form = useForm<FormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  
  const { isSubmitting } = form.formState;
  
  // Extract token from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlToken = params.get('token');
    
    if (!urlToken) {
      setError("Invalid or missing reset token. Please request a new password reset link.");
    } else {
      setToken(urlToken);
    }
  }, [location]);
  
  const onSubmit = async (data: FormValues) => {
    if (!token) {
      setError("Invalid or missing reset token. Please request a new password reset link.");
      return;
    }
    
    try {
      // In a real implementation, this would pass the token
      // For now, we're just updating the password
      const success = await updatePassword(data.password);
      
      if (success) {
        setIsSuccessful(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 3000);
      } else {
        setError("Failed to reset password. Please try again.");
      }
    } catch (error: any) {
      console.error(error);
      setError(error.message || "Failed to reset password. Please try again.");
    }
  };
  
  return (
    <div className="container max-w-md mx-auto px-4 py-16">
      <Helmet>
        <title>Reset Password - CILS Italian Citizenship</title>
      </Helmet>
      
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription>
            {isSuccessful 
              ? "Your password has been reset successfully"
              : "Create a new password for your account"}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {isSuccessful ? (
            <div className="space-y-4">
              <Alert variant="success" className="bg-green-50 border-green-200 text-green-800">
                <Check className="h-4 w-4 text-green-500" />
                <AlertTitle>Password updated</AlertTitle>
                <AlertDescription>
                  Your password has been reset successfully. You will be redirected to the login page.
                </AlertDescription>
              </Alert>
              <div className="flex justify-center">
                <Spinner size="md" />
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        New Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            disabled={isSubmitting || !token}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex={-1}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showConfirmPassword ? "text" : "password"}
                            disabled={isSubmitting || !token}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            tabIndex={-1}
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting || !token}
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner className="mr-2 h-4 w-4" />
                        Resetting Password...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
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

export default ResetPasswordPage;
