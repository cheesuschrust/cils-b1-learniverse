
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, Key, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { login, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSocialLoading, setIsSocialLoading] = useState<{
    google: boolean;
    apple: boolean;
  }>({ google: false, apple: false });
  
  // Get the intended destination from location state, or default to /app/dashboard
  const from = location.state?.from?.pathname || "/app/dashboard";
  
  // Define form with validation
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/app/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const success = await login(data.email, data.password);
      if (success) {
        toast({
          title: "Login successful",
          description: "Welcome back to CILS B2 Cittadinanza Question of the Day!",
        });
        // Navigate to the dashboard with the correct path
        navigate("/app/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleSocialLogin = async (provider: "google" | "apple") => {
    try {
      // Set loading state for the specific provider
      setIsSocialLoading(prev => ({ ...prev, [provider]: true }));
      
      // Call the social login method from AuthContext
      const success = await login(`${provider}@example.com`, 'social-login-password');
      
      if (success) {
        toast({
          title: "Login successful",
          description: `Welcome to CILS B2 Cittadinanza Question of the Day!`,
        });
        navigate(from);
      }
    } catch (error) {
      console.error(`${provider} login error:`, error);
      toast({
        title: "Login failed",
        description: `Could not log in with ${provider}. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setIsSocialLoading(prev => ({ ...prev, [provider]: false }));
    }
  };

  return (
    <div className="container max-w-md mx-auto py-16 px-4 bg-white">
      <Card className="shadow-lg border border-gray-100 bg-white">
        <CardHeader className="space-y-1 bg-white">
          <CardTitle className="text-2xl font-bold text-gray-800">Sign in</CardTitle>
          <CardDescription className="text-gray-600">
            Enter your credentials to access your CILS B2 Cittadinanza account
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-white">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Button 
              variant="outline" 
              className="w-full bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              onClick={() => handleSocialLogin("google")}
              disabled={isLoading || isSocialLoading.google}
            >
              {isSocialLoading.google ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <svg className="w-4 h-4 mr-2" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                  <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                </svg>
              )}
              Google
            </Button>
            <Button 
              variant="outline" 
              className="w-full bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              onClick={() => handleSocialLogin("apple")}
              disabled={isLoading || isSocialLoading.apple}
            >
              {isSocialLoading.apple ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <svg className="w-4 h-4 mr-2" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="apple" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                  <path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"></path>
                </svg>
              )}
              Apple
            </Button>
          </div>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <Separator className="bg-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-gray-700">
                      <Mail className="w-4 h-4 mr-2 text-gray-500" />
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john.doe@example.com"
                        className="bg-white border-gray-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="flex items-center text-gray-700">
                        <Key className="w-4 h-4 mr-2 text-gray-500" />
                        Password
                      </FormLabel>
                      <Link to="/reset-password" className="text-sm text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="bg-white border-gray-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="bg-white">
          <p className="text-sm text-center w-full text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
      
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Demo credentials: admin@italianlearning.app / Admin123!</p>
        <p className="mt-1">
          <Link to="/privacy-policy" className="hover:underline text-gray-600">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
