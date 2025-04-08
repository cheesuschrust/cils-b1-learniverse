
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, GraduationCap, User, Settings } from 'lucide-react';

const UserDocumentation: React.FC = () => {
  return (
    <div className="space-y-8">
      <Tabs defaultValue="getting-started" className="w-full">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="getting-started" className="flex-1">
            <Book className="h-4 w-4 mr-2" />
            Getting Started
          </TabsTrigger>
          <TabsTrigger value="learning" className="flex-1">
            <GraduationCap className="h-4 w-4 mr-2" />
            Learning Features
          </TabsTrigger>
          <TabsTrigger value="account" className="flex-1">
            <User className="h-4 w-4 mr-2" />
            Account Management
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex-1">
            <Settings className="h-4 w-4 mr-2" />
            Settings & Privacy
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="getting-started">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started with Our Platform</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Welcome to CILS Italian Citizenship Test Preparation</h3>
                <p className="text-muted-foreground mb-4">
                  This guide will help you get started with our platform and make the most of our features for your Italian citizenship test preparation.
                </p>
                
                <h4 className="font-medium mb-1">1. Create Your Account</h4>
                <p className="text-muted-foreground mb-3">
                  If you haven't already, sign up for an account to track your progress and access personalized features.
                </p>
                
                <h4 className="font-medium mb-1">2. Complete Your Profile</h4>
                <p className="text-muted-foreground mb-3">
                  Add information about your current Italian language level and citizenship goals to help us personalize your experience.
                </p>
                
                <h4 className="font-medium mb-1">3. Take the Initial Assessment</h4>
                <p className="text-muted-foreground mb-3">
                  Complete a short assessment to help us determine your starting level and provide personalized practice materials.
                </p>
                
                <h4 className="font-medium mb-1">4. Explore Daily Questions</h4>
                <p className="text-muted-foreground mb-3">
                  Start with the daily practice questions to begin building your knowledge and familiarity with the test format.
                </p>
                
                <h4 className="font-medium mb-1">5. Set Your Study Schedule</h4>
                <p className="text-muted-foreground">
                  Set up reminders and create a study schedule to maintain consistent practice leading up to your test date.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="learning">
          <Card>
            <CardHeader>
              <CardTitle>Learning Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Practice Features</h3>
                <p className="text-muted-foreground mb-4">
                  Our platform offers various practice features to help you prepare for all aspects of the CILS B1 citizenship test.
                </p>
                
                <h4 className="font-medium mb-1">Daily Questions</h4>
                <p className="text-muted-foreground mb-3">
                  Every day, you'll receive new questions tailored to your level and progress to help maintain consistent practice.
                </p>
                
                <h4 className="font-medium mb-1">Flashcards</h4>
                <p className="text-muted-foreground mb-3">
                  Build your vocabulary with interactive flashcards featuring important terms and phrases for the citizenship test.
                </p>
                
                <h4 className="font-medium mb-1">Reading Exercises</h4>
                <p className="text-muted-foreground mb-3">
                  Practice your reading comprehension with passages and questions similar to those on the actual test.
                </p>
                
                <h4 className="font-medium mb-1">Listening Exercises</h4>
                <p className="text-muted-foreground mb-3">
                  Improve your listening skills with audio clips and comprehension questions that simulate the test environment.
                </p>
                
                <h4 className="font-medium mb-1">Mock Tests</h4>
                <p className="text-muted-foreground mb-3">
                  Take full-length practice tests under timed conditions to prepare for the actual experience (Premium feature).
                </p>
                
                <h4 className="font-medium mb-1">Progress Tracking</h4>
                <p className="text-muted-foreground">
                  Monitor your improvement over time with detailed analytics that show your strengths and areas for improvement.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Managing Your Account</h3>
                <p className="text-muted-foreground mb-4">
                  Learn how to manage your account settings, subscription, and personal information.
                </p>
                
                <h4 className="font-medium mb-1">Profile Settings</h4>
                <p className="text-muted-foreground mb-3">
                  Update your personal information, language preferences, and learning goals from your profile page.
                </p>
                
                <h4 className="font-medium mb-1">Subscription Management</h4>
                <p className="text-muted-foreground mb-3">
                  View, upgrade, or manage your current subscription plan from the subscription page in your account settings.
                </p>
                
                <h4 className="font-medium mb-1">Change Password</h4>
                <p className="text-muted-foreground mb-3">
                  Regularly update your password to keep your account secure. You can do this from the security section.
                </p>
                
                <h4 className="font-medium mb-1">Notification Preferences</h4>
                <p className="text-muted-foreground mb-3">
                  Control which notifications you receive via email and within the platform from your notification settings.
                </p>
                
                <h4 className="font-medium mb-1">Data Export</h4>
                <p className="text-muted-foreground">
                  Request an export of all your personal data and learning progress from the privacy section of your account.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Settings & Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Platform Settings & Privacy Options</h3>
                <p className="text-muted-foreground mb-4">
                  Customize your learning experience and manage your privacy preferences.
                </p>
                
                <h4 className="font-medium mb-1">App Appearance</h4>
                <p className="text-muted-foreground mb-3">
                  Change the theme (light/dark mode) and other visual preferences in the appearance settings.
                </p>
                
                <h4 className="font-medium mb-1">Study Reminders</h4>
                <p className="text-muted-foreground mb-3">
                  Set up daily or weekly reminders to maintain a consistent study schedule.
                </p>
                
                <h4 className="font-medium mb-1">Privacy Settings</h4>
                <p className="text-muted-foreground mb-3">
                  Control what data is collected and how it's used to personalize your experience.
                </p>
                
                <h4 className="font-medium mb-1">Data Retention</h4>
                <p className="text-muted-foreground mb-3">
                  View our data retention policies and set your preferences for how long we keep your learning data.
                </p>
                
                <h4 className="font-medium mb-1">Accessibility Options</h4>
                <p className="text-muted-foreground">
                  Adjust font sizes, enable screen reader compatibility, and other accessibility features to make learning easier.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDocumentation;
