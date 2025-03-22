
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { User, Shield, Key, Languages, CreditCard, Calendar, CheckCircle, Save, Settings } from "lucide-react";
import UserPreferences from "@/components/user/UserPreferences";

const UserProfile = () => {
  const { user, updateProfile, updatePassword } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    displayName: "",
    email: "",
    phoneNumber: "",
    address: "",
    preferredLanguage: "both",
  });
  
  // Update form when user data changes
  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
        displayName: user.displayName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
        preferredLanguage: user.preferredLanguage || "both",
      });
    }
  }, [user]);
  
  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleLanguageChange = (value: string) => {
    setProfileForm(prev => ({ 
      ...prev, 
      preferredLanguage: value as "english" | "italian" | "both" 
    }));
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };
  
  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };
  
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await updateProfile({
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        username: profileForm.username,
        displayName: profileForm.displayName,
        phoneNumber: profileForm.phoneNumber,
        address: profileForm.address,
        preferredLanguage: profileForm.preferredLanguage as "english" | "italian" | "both",
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been successfully updated.",
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "The new password and confirmation do not match.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await updatePassword(passwordForm.currentPassword, passwordForm.newPassword);
      
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Update failed",
        description: "There was a problem updating your password.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>You must be logged in to view your profile.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <div className="flex gap-2">
          <Button onClick={() => setActiveTab("preferences")} variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Preferences
          </Button>
          <Button onClick={toggleEditing} variant={isEditing ? "destructive" : "outline"}>
            {isEditing ? "Cancel Editing" : "Edit Profile"}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Questions Today</CardTitle>
            <CardDescription>Your daily practice</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Flashcards</span>
                <Badge variant={user.subscription === "premium" ? "default" : user.dailyQuestionCounts.flashcards >= 1 ? "destructive" : "outline"}>
                  {user.dailyQuestionCounts.flashcards} / {user.subscription === "premium" ? "∞" : "1"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Multiple Choice</span>
                <Badge variant={user.subscription === "premium" ? "default" : user.dailyQuestionCounts.multipleChoice >= 1 ? "destructive" : "outline"}>
                  {user.dailyQuestionCounts.multipleChoice} / {user.subscription === "premium" ? "∞" : "1"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Listening</span>
                <Badge variant={user.subscription === "premium" ? "default" : user.dailyQuestionCounts.listening >= 1 ? "destructive" : "outline"}>
                  {user.dailyQuestionCounts.listening} / {user.subscription === "premium" ? "∞" : "1"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Writing</span>
                <Badge variant={user.subscription === "premium" ? "default" : user.dailyQuestionCounts.writing >= 1 ? "destructive" : "outline"}>
                  {user.dailyQuestionCounts.writing} / {user.subscription === "premium" ? "∞" : "1"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Speaking</span>
                <Badge variant={user.subscription === "premium" ? "default" : user.dailyQuestionCounts.speaking >= 1 ? "destructive" : "outline"}>
                  {user.dailyQuestionCounts.speaking} / {user.subscription === "premium" ? "∞" : "1"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Subscription</CardTitle>
            <CardDescription>Your current plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge className={user.subscription === "premium" ? "bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-0" : ""}>
                {user.subscription === "premium" ? "Premium" : "Free"}
              </Badge>
              
              {user.subscription === "premium" ? (
                <div className="text-sm space-y-1 mt-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Unlimited questions</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>No advertisements</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Advanced analytics</span>
                  </div>
                </div>
              ) : (
                <div className="mt-4">
                  <Button size="sm" variant="default" className="w-full">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Upgrade to Premium
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Unlock unlimited questions and remove ads
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Account Info</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant={user.status === "active" ? "outline" : "destructive"}>
                  {user.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Member since:</span>
                <span>{user.created ? formatDate(user.created) : "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last active:</span>
                <span>{user.lastActive ? formatDate(user.lastActive) : "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Role:</span>
                <Badge variant={user.role === "admin" ? "default" : "outline"}>
                  {user.role}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Questions completed:</span>
                <span>{user.metrics.totalQuestions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current streak:</span>
                <span>{user.metrics.streak} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Correct answers:</span>
                <span>{user.metrics.correctAnswers} ({user.metrics.totalQuestions > 0 ? Math.round((user.metrics.correctAnswers / user.metrics.totalQuestions) * 100) : 0}%)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Preferences</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  {isEditing ? "Edit your personal information" : "Your personal information and preferences"}
                </CardDescription>
              </div>
              {isEditing && (
                <Button type="submit" form="profile-form" disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              )}
            </CardHeader>
            <form id="profile-form" onSubmit={handleProfileSubmit}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="John"
                      value={profileForm.firstName}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Doe"
                      value={profileForm.lastName}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      placeholder="johndoe"
                      value={profileForm.username}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                      required
                    />
                    {!profileForm.username && isEditing && (
                      <p className="text-xs text-destructive">Username is required</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      name="displayName"
                      placeholder="How you want to be called"
                      value={profileForm.displayName}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profileForm.email}
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    For security reasons, email cannot be changed directly.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      placeholder="+1 (555) 123-4567"
                      value={profileForm.phoneNumber}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="preferredLanguage">Preferred Language for Feedback</Label>
                    <Select
                      value={profileForm.preferredLanguage}
                      onValueChange={handleLanguageChange}
                      disabled={!isEditing}
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
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="123 Main St, City, Country"
                    value={profileForm.address}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
              {!isEditing && (
                <CardFooter>
                  <Button type="button" onClick={toggleEditing}>
                    Edit Profile
                  </Button>
                </CardFooter>
              )}
            </form>
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
            <form onSubmit={handlePasswordSubmit}>
              <CardContent className="space-y-4">
                {user.subscription === "free" && (
                  <Alert>
                    <AlertDescription className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-2" />
                      <span>Upgrade to Premium to remove advertisements and get unlimited questions.</span>
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex-col items-start space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Password"}
                </Button>
                
                {user.subscription === "free" && (
                  <Button type="button" variant="outline">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Upgrade to Premium
                  </Button>
                )}
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences">
          <UserPreferences onClose={() => setActiveTab("profile")} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
