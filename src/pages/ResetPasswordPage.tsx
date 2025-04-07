
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Validation schema
const resetSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' })
});

type ResetFormValues = z.infer<typeof resetSchema>;

const ResetPasswordPage = () => {
  const { resetPassword } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: '',
    }
  });

  const onSubmit = async (values: ResetFormValues) => {
    setIsLoading(true);
    try {
      await resetPassword(values.email);
      setEmailSent(true);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center mb-2">
            <Link to="/login" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
            </Link>
            <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          </div>
          <CardDescription>
            Enter your email address and we'll send you instructions to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {emailSent ? (
            <div className="text-center py-4">
              <div className="bg-green-100 text-green-800 p-4 rounded-md mb-4">
                <p>If an account exists with that email, we've sent instructions to reset your password.</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Didn't receive the email? Check your spam folder or{" "}
                <button 
                  onClick={() => form.handleSubmit(onSubmit)()}
                  className="text-primary hover:underline"
                >
                  try again
                </button>
              </p>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="john.doe@example.com" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Instructions"
                  )}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full">
            Remember your password?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Back to login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
