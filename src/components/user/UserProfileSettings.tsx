
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Save, User, Languages } from 'lucide-react';
import { User as UserType } from '@/types/user';

interface FormState {
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  photoURL: string;
  preferredLanguage: string;
}

const UserProfileSettings: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formState, setFormState] = useState<FormState>({
    firstName: '',
    lastName: '',
    displayName: '',
    email: '',
    photoURL: '',
    preferredLanguage: 'both',
  });
  
  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormState({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        displayName: user.displayName || '',
        email: user.email || '',
        photoURL: user.photoURL || '',
        preferredLanguage: user.preferredLanguage || 'both',
      });
    }
  }, [user]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleLanguageChange = (value: string) => {
    setFormState(prev => ({
      ...prev,
      preferredLanguage: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsLoading(true);
    try {
      // This is a placeholder for the actual update logic that would be implemented
      // in the AuthContext
      if (typeof updateUserProfile === 'function') {
        await updateUserProfile({
          firstName: formState.firstName,
          lastName: formState.lastName,
          displayName: formState.displayName,
          preferredLanguage: formState.preferredLanguage,
          // photoURL would be updated separately through a file upload
        });
      }
      
      toast({
        title: 'Profile updated',
        description: 'Your profile information has been successfully updated.',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Update failed',
        description: 'There was a problem updating your profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getInitials = (user: UserType) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user.displayName) {
      return user.displayName[0].toUpperCase();
    }
    return user.email[0].toUpperCase();
  };
  
  if (!user) {
    return null;
  }
  
  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your personal information and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.photoURL || ''} alt={user.displayName || user.email} />
                <AvatarFallback className="text-xl">{user ? getInitials(user) : '?'}</AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-primary-foreground"
                type="button"
              >
                <Camera className="h-4 w-4" />
                <span className="sr-only">Upload avatar</span>
              </Button>
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    value={formState.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    value={formState.lastName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  name="displayName"
                  placeholder="How you want to be called"
                  value={formState.displayName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formState.email}
              disabled
            />
            <p className="text-sm text-muted-foreground">
              Your email address is used for login and cannot be changed here.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="preferredLanguage">Preferred Language for Feedback</Label>
            <Select
              value={formState.preferredLanguage}
              onValueChange={handleLanguageChange}
            >
              <SelectTrigger id="preferredLanguage" className="w-full">
                <SelectValue placeholder="Select language preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English Only</SelectItem>
                <SelectItem value="italian">Italian Only</SelectItem>
                <SelectItem value="both">Both Languages</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Choose how you want to receive feedback and explanations.
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="emailNotifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive learning reminders and updates
              </p>
            </div>
            <Switch
              id="emailNotifications"
              checked={user.preferences?.emailNotifications}
              // This would need to be implemented in the Auth context
              // onCheckedChange={handleNotificationToggle}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default UserProfileSettings;
