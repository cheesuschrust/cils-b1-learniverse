
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { Search, CheckCircle, ChevronRight, BookOpen, BookMarked, Bookmark, GraduationCap, Mic, Volume2, User, Settings, LineChart } from 'lucide-react';

interface SectionProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children, icon }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="py-2">
      <Button
        variant="ghost"
        className="w-full justify-between py-2 px-3 hover:bg-muted/50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          {icon}
          <span className="ml-2 font-medium">{title}</span>
        </div>
        <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
      </Button>
      
      {isExpanded && (
        <div className="mt-2 pl-9 pr-3 pb-2 text-sm">
          {children}
        </div>
      )}
    </div>
  );
};

const UserGuide = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const isAdmin = user?.role === 'admin';
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          User Guide
        </CardTitle>
        <CardDescription>
          Learn how to use all features of CILS B2 Cittadinanza
        </CardDescription>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search in user guide..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-1">
            <Section 
              title="Getting Started" 
              icon={<CheckCircle className="h-4 w-4 text-primary" />}
            >
              <div className="space-y-3">
                <h4 className="font-medium">Welcome to CILS B2 Cittadinanza</h4>
                <p>
                  This platform is designed to help you prepare for the CILS B2 Cittadinanza exam with comprehensive tools and resources.
                </p>
                
                <h4 className="font-medium">Your Dashboard</h4>
                <p>
                  After logging in, you'll be taken to your dashboard. Here you can:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li>View your progress on different skill areas</li>
                  <li>See recommended lessons based on your performance</li>
                  <li>Access quick links to practice exercises</li>
                  <li>Find the "Word of the Day" to expand your vocabulary</li>
                </ul>
                
                <h4 className="font-medium">Navigation</h4>
                <p>
                  Use the sidebar menu to navigate between different sections:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li>Dashboard - Your learning overview</li>
                  <li>Lessons - Structured learning content</li>
                  <li>Practice - Interactive exercises</li>
                  <li>Tests - Full-length and sectional practice tests</li>
                  <li>Progress - Detailed performance analytics</li>
                  <li>Profile - Your account settings</li>
                </ul>
              </div>
            </Section>
            
            <Section 
              title="Lesson Structure" 
              icon={<BookMarked className="h-4 w-4 text-blue-500" />}
            >
              <div className="space-y-3">
                <p>
                  Lessons are organized by skill area: Reading, Writing, Listening, and Speaking.
                </p>
                
                <h4 className="font-medium">Lesson Progression</h4>
                <p>
                  Each lesson follows a structured approach:
                </p>
                <ol className="list-decimal list-inside space-y-1 pl-2">
                  <li>Introduction to the topic</li>
                  <li>Vocabulary preparation</li>
                  <li>Core lesson content</li>
                  <li>Practice exercises</li>
                  <li>Knowledge check quiz</li>
                </ol>
                
                <h4 className="font-medium">Difficulty Levels</h4>
                <p>
                  Lessons are marked as:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li><span className="text-green-500 font-medium">Beginner</span> - Foundational concepts</li>
                  <li><span className="text-yellow-500 font-medium">Intermediate</span> - Building on basics</li>
                  <li><span className="text-red-500 font-medium">Advanced</span> - Complex B2 level content</li>
                </ul>
                
                <p>
                  Complete lessons in order for the best learning experience, but you can skip around if needed.
                </p>
              </div>
            </Section>
            
            <Section 
              title="Practice Exercises" 
              icon={<GraduationCap className="h-4 w-4 text-orange-500" />}
            >
              <div className="space-y-3">
                <p>
                  Regular practice is essential for language learning success. Our platform offers various exercise types.
                </p>
                
                <h4 className="font-medium">Exercise Types</h4>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li><strong>Multiple Choice</strong> - Test comprehension with options</li>
                  <li><strong>Fill in the Blanks</strong> - Complete sentences with appropriate words</li>
                  <li><strong>Matching</strong> - Connect related items</li>
                  <li><strong>Reordering</strong> - Put sentence parts in the correct order</li>
                  <li><strong>Writing Prompts</strong> - Practice free-form writing</li>
                </ul>
                
                <h4 className="font-medium">Spaced Repetition</h4>
                <p>
                  The system uses spaced repetition to help you review difficult concepts at optimal intervals for better retention.
                </p>
                
                <h4 className="font-medium">Progress Tracking</h4>
                <p>
                  Your performance on exercises contributes to your overall progress metrics, helping identify areas needing improvement.
                </p>
              </div>
            </Section>
            
            <Section 
              title="Speaking Practice" 
              icon={<Mic className="h-4 w-4 text-purple-500" />}
            >
              <div className="space-y-3">
                <p>
                  Speaking practice helps you develop confidence and fluency for the oral portion of the exam.
                </p>
                
                <h4 className="font-medium">Speaking Activities</h4>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li><strong>Pronunciation Practice</strong> - Focus on difficult sounds</li>
                  <li><strong>Guided Dialogues</strong> - Practice common conversations</li>
                  <li><strong>Topic Discussions</strong> - Speak about specific subjects</li>
                  <li><strong>Picture Description</strong> - Describe images in Italian</li>
                </ul>
                
                <h4 className="font-medium">Microphone Access</h4>
                <p>
                  You'll need to allow microphone access in your browser to use the speaking features. Click the microphone icon and follow the prompts.
                </p>
                
                <h4 className="font-medium">Feedback System</h4>
                <p>
                  Our system provides automated feedback on pronunciation and suggests improvements for common errors.
                </p>
              </div>
            </Section>
            
            <Section 
              title="Audio Features" 
              icon={<Volume2 className="h-4 w-4 text-green-500" />}
            >
              <div className="space-y-3">
                <h4 className="font-medium">Text-to-Speech</h4>
                <p>
                  All Italian text includes audio playback to help you with pronunciation:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li>Click the speaker icon next to any Italian text to hear it pronounced</li>
                  <li>Audio plays only when you click it - never automatically</li>
                  <li>You can adjust playback speed in your profile settings</li>
                </ul>
                
                <h4 className="font-medium">Voice Preferences</h4>
                <p>
                  You can select your preferred voice for both Italian and English in your profile settings:
                </p>
                <ol className="list-decimal list-inside space-y-1 pl-2">
                  <li>Go to Profile > Voice Settings</li>
                  <li>Choose from available voices for each language</li>
                  <li>Adjust speed and pitch to your preference</li>
                  <li>Test voices before saving your choices</li>
                </ol>
                
                <h4 className="font-medium">Listening Exercises</h4>
                <p>
                  Dedicated listening exercises help train your ear for the exam:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li>Dialogues with comprehension questions</li>
                  <li>Dictation exercises</li>
                  <li>Audio clips of varying speeds and accents</li>
                </ul>
              </div>
            </Section>
            
            <Section 
              title="Profile and Preferences" 
              icon={<User className="h-4 w-4 text-teal-500" />}
            >
              <div className="space-y-3">
                <p>
                  Customize your learning experience through your profile settings.
                </p>
                
                <h4 className="font-medium">Account Information</h4>
                <p>
                  You can update your:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li>Name and display name</li>
                  <li>Email address</li>
                  <li>Password</li>
                  <li>Profile picture</li>
                </ul>
                
                <h4 className="font-medium">Learning Preferences</h4>
                <p>
                  Customize your learning experience:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li>Preferred language for instructions (English, Italian, or both)</li>
                  <li>Daily study goal and reminders</li>
                  <li>Dark/Light theme</li>
                  <li>Font size for better readability</li>
                </ul>
                
                <h4 className="font-medium">Voice Settings</h4>
                <p>
                  Set your preferences for text-to-speech:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li>Italian voice selection</li>
                  <li>English voice selection</li>
                  <li>Speaking rate (0.5x to 2x)</li>
                  <li>Voice pitch adjustment</li>
                </ul>
              </div>
            </Section>
            
            <Section 
              title="Progress Tracking" 
              icon={<LineChart className="h-4 w-4 text-indigo-500" />}
            >
              <div className="space-y-3">
                <p>
                  Track your learning journey and see improvements over time.
                </p>
                
                <h4 className="font-medium">Progress Dashboard</h4>
                <p>
                  The Progress section shows:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li>Overall completion percentage</li>
                  <li>Skill area breakdowns (Reading, Writing, Listening, Speaking)</li>
                  <li>Weekly activity summary</li>
                  <li>Streak calendar</li>
                </ul>
                
                <h4 className="font-medium">Performance Analytics</h4>
                <p>
                  Detailed metrics help identify strengths and weaknesses:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li>Accuracy rates by question type</li>
                  <li>Response time trends</li>
                  <li>Vocabulary mastery level</li>
                  <li>Grammar concept proficiency</li>
                </ul>
                
                <h4 className="font-medium">Progress Reports</h4>
                <p>
                  Weekly progress reports are available in your email (if enabled) and on the platform, summarizing your activity and achievements.
                </p>
              </div>
            </Section>
            
            {isAdmin && (
              <>
                <Separator className="my-4" />
                <div className="text-lg font-medium my-2">Administrator Guide</div>
                
                <Section 
                  title="Admin Dashboard" 
                  icon={<Settings className="h-4 w-4 text-red-500" />}
                >
                  <div className="space-y-3">
                    <p>
                      The Admin Dashboard provides a comprehensive overview of the platform.
                    </p>
                    
                    <h4 className="font-medium">User Management</h4>
                    <p>
                      As an admin, you can:
                    </p>
                    <ul className="list-disc list-inside space-y-1 pl-2">
                      <li>View all registered users</li>
                      <li>Edit user information and permissions</li>
                      <li>Activate/deactivate accounts</li>
                      <li>Manage subscription status</li>
                    </ul>
                    
                    <h4 className="font-medium">Content Management</h4>
                    <p>
                      Control the learning content:
                    </p>
                    <ul className="list-disc list-inside space-y-1 pl-2">
                      <li>Upload new lesson materials</li>
                      <li>Create and edit practice exercises</li>
                      <li>Manage the question bank</li>
                      <li>Set the Word of the Day</li>
                    </ul>
                    
                    <h4 className="font-medium">System Settings</h4>
                    <p>
                      Configure platform settings:
                    </p>
                    <ul className="list-disc list-inside space-y-1 pl-2">
                      <li>Email templates and settings</li>
                      <li>Default voice preferences</li>
                      <li>Feature toggles</li>
                      <li>Support ticket management</li>
                    </ul>
                  </div>
                </Section>
                
                <Section 
                  title="Content Analysis" 
                  icon={<BookOpen className="h-4 w-4 text-blue-500" />}
                >
                  <div className="space-y-3">
                    <h4 className="font-medium">AI Content Processing</h4>
                    <p>
                      The Content Analysis tool allows you to:
                    </p>
                    <ul className="list-disc list-inside space-y-1 pl-2">
                      <li>Upload document, audio, or text content</li>
                      <li>Automatically extract vocabulary and phrases</li>
                      <li>Generate practice questions from the content</li>
                      <li>Add processed content to the learning materials</li>
                    </ul>
                    
                    <h4 className="font-medium">Upload Process</h4>
                    <ol className="list-decimal list-inside space-y-1 pl-2">
                      <li>Navigate to Admin > Content Analysis</li>
                      <li>Select the "Upload Content" tab</li>
                      <li>Choose your file or paste text content</li>
                      <li>Click "Process Content" to begin analysis</li>
                      <li>Review the extracted content and generated questions</li>
                      <li>Edit questions if needed before saving</li>
                      <li>Add to the question bank for use in exercises and tests</li>
                    </ol>
                    
                    <p>
                      The system will automatically categorize content by difficulty level and topic area based on analysis.
                    </p>
                  </div>
                </Section>
                
                <Section 
                  title="Email Configuration" 
                  icon={<Mail className="h-4 w-4 text-purple-500" />}
                >
                  <div className="space-y-3">
                    <p>
                      Configure email communications from the platform.
                    </p>
                    
                    <h4 className="font-medium">Email Provider Setup</h4>
                    <p>
                      Set up your preferred email service:
                    </p>
                    <ul className="list-disc list-inside space-y-1 pl-2">
                      <li>SMTP server configuration</li>
                      <li>SendGrid integration</li>
                      <li>Mailgun settings</li>
                      <li>Amazon SES options</li>
                    </ul>
                    
                    <h4 className="font-medium">Email Templates</h4>
                    <p>
                      Customize system email templates:
                    </p>
                    <ul className="list-disc list-inside space-y-1 pl-2">
                      <li>Welcome emails</li>
                      <li>Password reset messages</li>
                      <li>Email verification</li>
                      <li>Weekly progress reports</li>
                      <li>Subscription notifications</li>
                    </ul>
                    
                    <h4 className="font-medium">Test Email Functionality</h4>
                    <p>
                      Before implementing changes, you can send test emails to verify your configuration is working correctly.
                    </p>
                  </div>
                </Section>
              </>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default UserGuide;
