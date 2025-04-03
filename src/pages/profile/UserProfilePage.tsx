
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/EnhancedAuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Helmet } from "react-helmet-async";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Validation schema for profile form
const profileFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  displayName: z.string().optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Validation schema for password form
const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

const UserProfilePage: React.FC = () => {
  const { user, updateProfile, updatePassword, displayName, isPremium } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Form initialization
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      displayName: "",
      bio: "",
    },
  });
  
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  
  // Load user data into form
  useEffect(() => {
    if (user) {
      // This assumes user metadata contains first_name and last_name
      const firstName = user.user_metadata?.first_name || "";
      const lastName = user.user_metadata?.last_name || "";
      
      profileForm.reset({
        firstName,
        lastName,
        displayName: displayName || firstName,
        bio: "",
      });
    }
  }, [user, displayName]);
  
  // Handle profile form submission
  const onProfileSubmit = async (data: ProfileFormValues) => {
    try {
      if (!user) return;
      
      const success = await updateProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        displayName: data.displayName,
        bio: data.bio,
      });
      
      if (success) {
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully",
        });
      }
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    }
  };
  
  // Handle password form submission
  const onPasswordSubmit = async (data: PasswordFormValues) => {
    try {
      const success = await updatePassword(data.newPassword);
      
      if (success) {
        toast({
          title: "Password updated",
          description: "Your password has been updated successfully",
        });
        passwordForm.reset();
      }
    } catch (error: any) {
      console.error("Failed to update password:", error);
      toast({
        title: "Update failed",
        description: error.message || "Failed to update password",
        variant: "destructive",
      });
    }
  };
  
  // Generate initials for avatar fallback
  const getInitials = () => {
    if (displayName) {
      return displayName.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    if (user?.user_metadata?.first_name) {
      const first = user.user_metadata.first_name[0] || '';
      const last = user.user_metadata.last_name?.[0] || '';
      return (first + last).toUpperCase();
    }
    return user?.email?.[0].toUpperCase() || '?';
  };
  
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <Helmet>
        <title>User Profile - CILS Italian Citizenship</title>
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
        <p className="text-muted-foreground">
          Manage your personal information and account settings
        </p>
      </div>
      
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid grid-cols-3 md:w-[400px]">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and how others see you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/placeholder-avatar.jpg" alt={displayName || "User"} />
                  <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{displayName || user?.email}</h3>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  <div className="mt-2">
                    <Button variant="outline" size="sm" disabled>
                      Change Avatar
                    </Button>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={profileForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={profileForm.control}
                    name="displayName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Name</FormLabel>
                        <FormControl>
                          <Input placeholder="How you want your name to appear" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is how your name will appear publicly.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={profileForm.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us a bit about yourself..." 
                            className="min-h-32"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Brief description for your profile. Max 500 characters.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    disabled={profileForm.formState.isSubmitting}
                    className="mt-2"
                  >
                    {profileForm.formState.isSubmitting ? (
                      <>
                        <Spinner className="mr-2 h-4 w-4" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Update your password and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormDescription>
                          Password must be at least 8 characters and include uppercase, lowercase, and numbers.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    disabled={passwordForm.formState.isSubmitting}
                    className="mt-2"
                  >
                    {passwordForm.formState.isSubmitting ? (
                      <>
                        <Spinner className="mr-2 h-4 w-4" />
                        Updating...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                </form>
              </Form>
              
              <Separator className="my-6" />
              
              <div>
                <h3 className="font-medium mb-2">Email Verification</h3>
                {user?.email_confirmed_at ? (
                  <Alert variant="success" className="bg-green-50 text-green-800 border-green-200">
                    <AlertDescription className="flex items-center">
                      Your email has been verified
                      <span className="ml-2 bg-green-100 text-green-800 text-xs rounded-full py-1 px-2">
                        Verified
                      </span>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    <Alert variant="warning" className="bg-yellow-50 text-yellow-800 border-yellow-200 mb-4">
                      <AlertDescription>
                        Please verify your email address to access all features.
                      </AlertDescription>
                    </Alert>
                    <Button variant="outline" onClick={() => /* resendVerificationEmail() */ {}}>
                      Resend Verification Email
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="subscription">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Status</CardTitle>
              <CardDescription>
                Manage your subscription and payment settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 text-center">
                <h3 className="font-bold text-xl mb-2">
                  {isPremium ? "Premium Subscription" : "Free Plan"}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {isPremium
                    ? "You're enjoying all premium features of our platform."
                    : "Upgrade to premium for full access to all features."}
                </p>
                
                {isPremium ? (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="inline-flex items-center justify-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                      Active
                    </div>
                    <Button variant="outline" onClick={() => navigate("/subscription/manage")}>
                      Manage Subscription
                    </Button>
                  </div>
                ) : (
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600" onClick={() => navigate("/subscription/plans")}>
                    Upgrade to Premium
                  </Button>
                )}
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-4">Subscription Benefits</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-800 rounded-full p-1 mr-2 mt-0.5">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span>Unlimited daily questions and practice tests</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-800 rounded-full p-1 mr-2 mt-0.5">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span>Advanced grammar and vocabulary tools</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-800 rounded-full p-1 mr-2 mt-0.5">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span>Full access to all study materials and guides</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-800 rounded-full p-1 mr-2 mt-0.5">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span>AI-powered personalized learning path</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-800 rounded-full p-1 mr-2 mt-0.5">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span>Priority customer support</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfilePage;
