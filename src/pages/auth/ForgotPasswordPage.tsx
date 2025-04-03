
import React, { useState } from "react";
import { useAuth } from "@/contexts/EnhancedAuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, AlertCircle, Check } from "lucide-react";
import { Link } from "react-router-dom";
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
const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { resetPassword } = useAuth();
  const [submittedEmail, setSubmittedEmail] = useState("");
  
  // Define form with validation
  const form = useForm<FormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  
  const { isSubmitting } = form.formState;
  
  const onSubmit = async (data: FormValues) => {
    try {
      await resetPassword(data.email);
      setSubmittedEmail(data.email);
      setIsSubmitted(true);
    } catch (error) {
      console.error(error);
      form.setError("email", { 
        type: "manual",
        message: "There was a problem sending the reset link. Please try again." 
      });
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
            {isSubmitted 
              ? "Check your email for reset instructions"
              : "Enter your email address and we'll send you a link to reset your password"}
          </CardDescription>
        </CardHeader>
        
        {!isSubmitted ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email address
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email" 
                          placeholder="name@example.com" 
                          autoComplete="email"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
                <div className="text-center text-sm">
                  <Link 
                    to="/login" 
                    className="text-primary hover:underline flex items-center justify-center gap-1"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Login
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Form>
        ) : (
          <CardContent className="space-y-4">
            <Alert variant="success" className="bg-green-50 border-green-200 text-green-800">
              <Check className="h-4 w-4 text-green-500" />
              <AlertTitle>Check your email</AlertTitle>
              <AlertDescription>
                We've sent a password reset link to <strong>{submittedEmail}</strong>.
                It may take a few minutes to arrive. Be sure to check your spam folder.
              </AlertDescription>
            </Alert>
            <div className="text-center pt-4">
              <Link 
                to="/login" 
                className="text-primary hover:underline flex items-center justify-center gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Link>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
