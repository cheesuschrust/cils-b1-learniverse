
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Settings, 
  BookOpen, 
  Award, 
  Loader2,
  UserCircle,
  Key,
  LogOut
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { fetchUserAchievements, fetchUserStats } from '@/lib/supabase-client';
import { useNavigate } from 'react-router-dom';

const profileFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  displayName: z.string().optional(),
  bio: z.string().max(160).optional(),
  avatarUrl: z.string().url().optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

const UserProfilePage = () => {
  const { user, profile, updateProfile, updatePassword, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [achievements, setAchievements] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const navigate = useNavigate();
  
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: profile?.first_name || '',
      lastName: profile?.last_name || '',
      displayName: profile?.display_name || '',
      bio: profile?.bio || '',
      avatarUrl: profile?.avatar_url || '',
    },
  });
  
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });
  
  React.useEffect(() => {
    if (profile) {
      profileForm.reset({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        displayName: profile.display_name || '',
        bio: profile.bio || '',
        avatarUrl: profile.avatar_url || '',
      });
    }
  }, [profile, profileForm]);
  
  React.useEffect(() => {
    if (activeTab === 'achievements' && user) {
      loadUserData();
    }
  }, [activeTab, user]);
  
  const loadUserData = async () => {
    if (!user) return;
    
    setIsLoadingData(true);
    try {
      const achievementsData = await fetchUserAchievements(user.id);
      const statsData = await fetchUserStats(user.id);
      
      setAchievements(achievementsData || []);
      setStats(statsData || null);
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setIsLoadingData(false);
    }
  };
  
  const onProfileSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    try {
      await updateProfile({
        first_name: data.firstName,
        last_name: data.lastName,
        display_name: data.displayName || null,
        bio: data.bio || null,
        avatar_url: data.avatarUrl || null,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const onPasswordSubmit = async (data: PasswordFormValues) => {
    setIsLoading(true);
    try {
      // For Supabase, we don't actually need to provide the current password
      await updatePassword(data.newPassword);
      passwordForm.reset();
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };
  
  const getInitials = () => {
    if (!profile) return 'U';
    
    const first = profile.first_name?.[0] || '';
    const last = profile.last_name?.[0] || '';
    
    return (first + last).toUpperCase();
  };
  
  if (!user || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="container max-w-4xl py-10">
      <div className="mb-10 flex items-center">
        <Avatar className="h-16 w-16 mr-4">
          <AvatarImage src={profile.avatar_url || ''} />
          <AvatarFallback>{getInitials()}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">
            {profile.display_name || `${profile.first_name} ${profile.last_name}`}
          </h1>
          <p className="text-muted-foreground">
            {profile.is_premium ? 'Premium Member' : 'Free Member'}
          </p>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            <span className="hidden sm:inline">Achievements</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and how others see you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={profileForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Your first name" 
                              {...field}
                              disabled={isLoading}
                            />
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
                          <FormLabel>Last name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Your last name" 
                              {...field}
                              disabled={isLoading}
                            />
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
                        <FormLabel>Display name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="How you want to be called" 
                            {...field}
                            value={field.value || ''}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormDescription>
                          This is the name that will be displayed to others.
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
                            placeholder="Tell us a little about yourself" 
                            className="resize-none"
                            {...field}
                            value={field.value || ''}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormDescription>
                          Brief description for your profile. Max 160 characters.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={profileForm.control}
                    name="avatarUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profile picture URL</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://example.com/avatar.jpg" 
                            {...field}
                            value={field.value || ''}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter a URL for your profile picture.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save changes'
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
                Update your password and manage your account security
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password"
                            placeholder="••••••••"
                            {...field}
                            disabled={isLoading}
                          />
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
                        <FormLabel>New password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password"
                            placeholder="••••••••"
                            {...field}
                            disabled={isLoading}
                          />
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
                        <FormLabel>Confirm new password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password"
                            placeholder="••••••••"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex flex-col gap-4">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        'Update password'
                      )}
                    </Button>
                    
                    <div className="mt-6 pt-6 border-t">
                      <h3 className="text-lg font-medium mb-4">Account actions</h3>
                      <Button 
                        variant="destructive"
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out of all sessions
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="achievements">
          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>
                Track your progress and see your achievements
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingData ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground">Questions Answered</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold">{stats?.questions_answered || 0}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground">Current Streak</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold">{stats?.streak_days || 0} days</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground">Accuracy</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold">
                          {stats?.questions_answered ? 
                            Math.round((stats.correct_answers / stats.questions_answered) * 100) : 0}%
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {achievements.length > 0 ? (
                    <div className="space-y-4">
                      {achievements.map((achievement) => (
                        <Card key={achievement.id}>
                          <CardHeader className="pb-2">
                            <div className="flex items-center space-x-4">
                              <div className="bg-primary/10 p-2 rounded-full">
                                <Award className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <CardTitle>{achievement.achievement_name}</CardTitle>
                                <CardDescription>{achievement.description}</CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              Achieved on {new Date(achievement.achieved_at).toLocaleDateString()}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                      <h3 className="mt-4 text-lg font-medium">No achievements yet</h3>
                      <p className="mt-2 text-muted-foreground">
                        Complete challenges and quizzes to earn achievements
                      </p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Management</CardTitle>
              <CardDescription>
                Manage your subscription and billing information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-medium mb-2">Current Plan</h3>
                <p className="text-2xl font-bold mb-2">
                  {profile.is_premium ? 'Premium' : 'Free'}
                </p>
                <p className="text-muted-foreground mb-4">
                  {profile.is_premium
                    ? `Premium access until ${new Date(profile.premium_until || '').toLocaleDateString()}`
                    : 'Limited access to features and content'}
                </p>
                
                {!profile.is_premium && (
                  <Button onClick={() => navigate('/subscription')}>
                    Upgrade to Premium
                  </Button>
                )}
                
                {profile.is_premium && (
                  <Button variant="outline">
                    Manage Subscription
                  </Button>
                )}
              </div>
              
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">Account details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-muted-foreground">Member since</p>
                    <p className="font-medium">{new Date(profile.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-muted-foreground">Last login</p>
                    <p className="font-medium">
                      {profile.last_login_at 
                        ? new Date(profile.last_login_at).toLocaleDateString() 
                        : 'Never'}
                    </p>
                  </div>
                </div>
              </div>
              
              <Alert className="bg-red-50 border-red-200">
                <AlertDescription className="flex flex-col gap-2">
                  <p>Danger zone</p>
                  <Button variant="destructive">
                    Delete Account
                  </Button>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfilePage;
