
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { UserService, UpdateProfileData } from '@/services/UserService';
import { User, Check, Save, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const UserProfile = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    displayName: user?.displayName || '',
    phoneNumber: user?.phoneNumber || '',
    address: user?.address || '',
    preferredLanguage: user?.preferredLanguage || 'both'
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setProfileData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const updateData: UpdateProfileData = { ...profileData };
      await updateProfile(updateData);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!user) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="text-center">
            <p>Please sign in to view your profile.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatarUrl} alt={user.displayName || user.firstName} />
            <AvatarFallback className="text-lg">
              {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{user.displayName || `${user.firstName} ${user.lastName}`}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-sm font-medium flex items-center gap-1">
                <User className="h-4 w-4 text-muted-foreground" />
                First Name
              </label>
              <Input
                id="firstName"
                name="firstName"
                value={profileData.firstName}
                onChange={handleChange}
                placeholder="Enter your first name"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="lastName" className="text-sm font-medium flex items-center gap-1">
                <User className="h-4 w-4 text-muted-foreground" />
                Last Name
              </label>
              <Input
                id="lastName"
                name="lastName"
                value={profileData.lastName}
                onChange={handleChange}
                placeholder="Enter your last name"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="displayName" className="text-sm font-medium flex items-center gap-1">
              <User className="h-4 w-4 text-muted-foreground" />
              Display Name
            </label>
            <Input
              id="displayName"
              name="displayName"
              value={profileData.displayName}
              onChange={handleChange}
              placeholder="How you want to be called on the platform"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="phoneNumber" className="text-sm font-medium">Phone Number</label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={profileData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter your phone number (optional)"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="address" className="text-sm font-medium">Address</label>
            <Input
              id="address"
              name="address"
              value={profileData.address}
              onChange={handleChange}
              placeholder="Enter your address (optional)"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="preferredLanguage" className="text-sm font-medium">Preferred Language</label>
            <Select
              value={profileData.preferredLanguage}
              onValueChange={(value) => handleSelectChange('preferredLanguage', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your preferred language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English Only</SelectItem>
                <SelectItem value="italian">Italian Only</SelectItem>
                <SelectItem value="both">Both Languages</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              This sets your preferred language for instructions and explanations across the platform.
            </p>
          </div>
          
          <div className="pt-2">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-xs text-muted-foreground">
          <p>Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
          <p>Last login: {new Date(user.lastLoginAt).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <Check className="h-3 w-3 text-green-500" />
          <span className="text-green-500">
            {user.emailVerified ? 'Email verified' : 'Email not verified'}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default UserProfile;
