
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import UserPreferences from '@/components/user/UserPreferences';
import { User, Mail, Calendar, MapPin, Briefcase, GraduationCap, Languages } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { theme } = useUserPreferences();
  
  const [isEditing, setIsEditing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  
  // Mock user profile data
  const mockUser = {
    id: '1',
    name: user?.displayName || 'John Doe',
    email: user?.email || 'john.doe@example.com',
    avatar: user?.photoURL || 'https://github.com/shadcn.png',
    joinDate: 'January 2023',
    location: 'Milan, Italy',
    occupation: 'Software Developer',
    education: "Bachelor's in Computer Science",
    about: "I'm learning Italian for an upcoming trip to Italy. I'm particularly interested in Italian cuisine and culture.",
    languageLevel: 'Intermediate',
    learningGoals: 'Travel, Conversation, Reading Literature',
    completedLessons: 23,
    completedExercises: 156,
    streakDays: 14,
    badges: ['10-day streak', 'Vocabulary Master', 'Grammar Expert'],
  };
  
  const handleSaveProfile = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      toast({
        title: 'Profile Updated',
        description: 'Your profile information has been updated successfully.',
      });
    }, 1000);
  };
  
  return (
    <>
      <Helmet>
        <title>User Profile - Italian Learning</title>
      </Helmet>
      
      <div className="container max-w-5xl mx-auto py-8 px-4">
        <div className="grid gap-6 md:grid-cols-4">
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-28 w-28">
                    <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                    <AvatarFallback>{mockUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h2 className="text-xl font-bold">{mockUser.name}</h2>
                    <p className="text-sm text-muted-foreground">{mockUser.email}</p>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                  </Button>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Joined {mockUser.joinDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{mockUser.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{mockUser.occupation}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{mockUser.education}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Languages className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{mockUser.languageLevel} Level</span>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Learning Stats</h3>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="rounded-lg bg-muted px-3 py-2">
                      <h4 className="text-sm font-medium">{mockUser.completedLessons}</h4>
                      <p className="text-xs text-muted-foreground">Lessons</p>
                    </div>
                    <div className="rounded-lg bg-muted px-3 py-2">
                      <h4 className="text-sm font-medium">{mockUser.completedExercises}</h4>
                      <p className="text-xs text-muted-foreground">Exercises</p>
                    </div>
                    <div className="rounded-lg bg-muted px-3 py-2">
                      <h4 className="text-sm font-medium">{mockUser.streakDays}</h4>
                      <p className="text-xs text-muted-foreground">Day Streak</p>
                    </div>
                    <div className="rounded-lg bg-muted px-3 py-2">
                      <h4 className="text-sm font-medium">{mockUser.badges.length}</h4>
                      <p className="text-xs text-muted-foreground">Badges</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-3">
            <Tabs defaultValue="profile">
              <TabsList className="mb-6">
                <TabsTrigger value="profile" className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </TabsTrigger>
                <TabsTrigger value="preferences" className="flex items-center gap-1">
                  <Settings className="h-4 w-4" />
                  <span>Preferences</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                {isEditing ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Edit Profile</CardTitle>
                      <CardDescription>
                        Update your profile information
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" defaultValue={mockUser.name} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" defaultValue={mockUser.email} />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input id="location" defaultValue={mockUser.location} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="occupation">Occupation</Label>
                          <Input id="occupation" defaultValue={mockUser.occupation} />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="education">Education</Label>
                          <Input id="education" defaultValue={mockUser.education} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="language-level">Language Level</Label>
                          <select 
                            id="language-level" 
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                            defaultValue={mockUser.languageLevel}
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Elementary">Elementary</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Proficient">Proficient</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="about">About Me</Label>
                        <textarea 
                          id="about" 
                          className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2"
                          defaultValue={mockUser.about}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="learning-goals">Learning Goals</Label>
                        <Input id="learning-goals" defaultValue={mockUser.learningGoals} />
                        <p className="text-xs text-muted-foreground mt-1">
                          Separate multiple goals with commas
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleSaveProfile}
                          disabled={isSaving}
                        >
                          {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile</CardTitle>
                      <CardDescription>
                        View and manage your personal information
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-3">
                        <h3 className="text-lg font-medium">About Me</h3>
                        <p className="text-sm text-muted-foreground">
                          {mockUser.about}
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        <h3 className="text-lg font-medium">Learning Goals</h3>
                        <div className="flex flex-wrap gap-2">
                          {mockUser.learningGoals.split(', ').map((goal, i) => (
                            <span key={i} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                              {goal}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-3">
                        <h3 className="text-lg font-medium">Achievements</h3>
                        <div className="flex flex-wrap gap-2">
                          {mockUser.badges.map((badge, i) => (
                            <span key={i} className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                              {badge}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h3 className="text-lg font-medium">Account Details</h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Name:</span>
                            <span className="text-sm">{mockUser.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Email:</span>
                            <span className="text-sm">{mockUser.email}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="preferences">
                <UserPreferences />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
