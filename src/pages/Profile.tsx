
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, Award, BookOpen, Clock, Settings } from 'lucide-react';

const ProfilePage = () => {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      // In a real app, we would fetch the user profile from the database
      // For now, we'll just extract the first part of the email as the first name
      const emailFirstPart = user.email?.split('@')[0] || '';
      setFirstName(emailFirstPart);
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      // In a real app, we would update the user profile in the database
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: 'Profile updated',
        description: 'Your profile information has been updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Update failed',
        description: 'An error occurred while updating your profile',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>You need to be logged in to view this page.</p>
      </div>
    );
  }

  const achievements = [
    { name: 'Early Bird', description: 'Completed first lesson', icon: CheckCircle2, date: '2 weeks ago' },
    { name: 'Vocabulary Master', description: 'Learned 100 words', icon: Award, date: '1 week ago' },
    { name: 'Consistent Learner', description: '7-day streak', icon: Clock, date: '3 days ago' },
    { name: 'Reading Enthusiast', description: 'Completed 5 reading exercises', icon: BookOpen, date: 'Today' },
  ];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex flex-col items-center space-y-3">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="" alt={firstName} />
                  <AvatarFallback className="text-2xl">{firstName.charAt(0)}{lastName.charAt(0) || ''}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h2 className="text-2xl font-bold">{firstName} {lastName}</h2>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Member since</span>
                <span>April 2023</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subscription</span>
                <Badge>Free</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Active
                </Badge>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <a href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </a>
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Tabs defaultValue="profile">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="statistics">Statistics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First name</Label>
                        <Input
                          id="firstName"
                          value={firstName}
                          onChange={e => setFirstName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last name</Label>
                        <Input
                          id="lastName"
                          value={lastName}
                          onChange={e => setLastName(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={user.email || ''}
                        disabled
                      />
                      <p className="text-sm text-muted-foreground">You cannot change your email address</p>
                    </div>
                    
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Changes
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="achievements" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Achievements</CardTitle>
                  <CardDescription>Track your learning milestones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start p-3 border rounded-lg">
                        <div className="bg-primary/10 p-2 rounded-lg mr-4">
                          <achievement.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{achievement.name}</h3>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>
                        <div className="text-sm text-muted-foreground">{achievement.date}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="statistics" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Statistics</CardTitle>
                  <CardDescription>Your progress so far</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-background border rounded-lg p-4 text-center">
                      <h3 className="text-3xl font-bold">1250</h3>
                      <p className="text-sm text-muted-foreground">Total XP Points</p>
                    </div>
                    <div className="bg-background border rounded-lg p-4 text-center">
                      <h3 className="text-3xl font-bold">5</h3>
                      <p className="text-sm text-muted-foreground">Current Level</p>
                    </div>
                    <div className="bg-background border rounded-lg p-4 text-center">
                      <h3 className="text-3xl font-bold">7</h3>
                      <p className="text-sm text-muted-foreground">Day Streak</p>
                    </div>
                    <div className="bg-background border rounded-lg p-4 text-center">
                      <h3 className="text-3xl font-bold">45</h3>
                      <p className="text-sm text-muted-foreground">Activities Completed</p>
                    </div>
                  </div>
                  
                  <div className="bg-background border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Module Completion</h3>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Reading</span>
                          <span>65%</span>
                        </div>
                        <div className="w-full bg-secondary h-2 rounded-full">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Writing</span>
                          <span>42%</span>
                        </div>
                        <div className="w-full bg-secondary h-2 rounded-full">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '42%' }}></div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Listening</span>
                          <span>78%</span>
                        </div>
                        <div className="w-full bg-secondary h-2 rounded-full">
                          <div className="bg-amber-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Speaking</span>
                          <span>36%</span>
                        </div>
                        <div className="w-full bg-secondary h-2 rounded-full">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: '36%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
