
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { FileEdit, Save, HelpCircle, Book, FileQuestion, Settings, Users, BarChart2, Upload } from 'lucide-react';
import { useSystemLog } from '@/hooks/use-system-log';

const AdminGuide = () => {
  const { toast } = useToast();
  const { logSystemAction } = useSystemLog();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [sections, setSections] = useState({
    dashboard: {
      title: "Dashboard",
      content: `
## Dashboard Overview

The admin dashboard provides a comprehensive overview of your platform's activities, user statistics, and system health.

### Key Metrics

- **Total Users**: Shows the count of all registered users on the platform.
- **Active Users**: Users who have logged in within the last 30 days.
- **Premium Subscriptions**: Number of users with active premium subscriptions.
- **System Logs**: Count of system logs, categorized by severity (info, warning, error).

### Notifications

The notification center displays recent system events like:
- New user registrations
- Content uploads
- Subscription purchases
- System alerts

### System Logs

This section shows the most recent log entries, allowing you to quickly identify issues or interesting activity. For a more detailed view, use the Logs screen.
      `
    },
    users: {
      title: "User Management",
      content: `
## Managing Users

The User Management section allows you to view, edit, and manage all users on the platform.

### Key Features

- **User List**: View all registered users with filters for active/inactive status.
- **User Details**: View complete user profiles including contact information, subscription status, and activity history.
- **Edit Users**: Modify user information, change subscription levels, or reset passwords.
- **Disable/Enable Accounts**: Temporarily disable accounts or re-enable previously disabled accounts.
- **Admin Rights**: Grant or revoke administrative privileges to trusted users.

### Best Practices

- Regularly review inactive users to identify potential engagement opportunities.
- Be cautious when granting admin privileges - only assign to trusted team members.
- Document reasons for disabling accounts for future reference.
      `
    },
    content: {
      title: "Content Management",
      content: `
## Managing Content

The Content Management section allows you to create, upload, and organize all learning materials on the platform.

### Content Types

- **Flashcards**: Vocabulary pairs for language memorization.
- **Multiple Choice**: Questions with several possible answers.
- **Writing Prompts**: Open-ended writing exercises with evaluation criteria.
- **Speaking Practice**: Conversation prompts with expected responses.
- **Listening Exercises**: Audio-based comprehension questions.

### AI Content Generation

Our platform can automatically generate learning content from source materials:

1. Upload source text (Italian passages, articles, etc.)
2. The AI will analyze the content and identify potential vocabulary and grammar points
3. The system will generate appropriate exercises based on the content
4. Review and edit the generated content before publishing

### Content Organization

- Group content by difficulty level (A1-C2)
- Organize by topic or theme
- Create structured learning paths by connecting related content
      `
    },
    ai: {
      title: "AI Integration",
      content: `
## AI Integration Guide

The platform uses AI throughout to enhance the learning experience and reduce administrative workload.

### AI Features

- **Content Analysis**: Automatically categorize and extract learning materials from uploaded texts.
- **Question Generation**: Create various question types from source materials.
- **Pronunciation Assessment**: Evaluate user speaking accuracy.
- **Personalized Learning**: Adapt content difficulty based on user performance.
- **Content Translation**: Assist with translations between Italian and English.

### Training the AI

The AI system improves over time through:

1. **User Interactions**: The system learns from how users interact with content.
2. **Admin Feedback**: When you edit AI-generated content, the system learns from your corrections.
3. **Direct Training**: Upload examples of ideal content to train the system.

### Best Practices

- Regularly review AI-generated content before publishing
- Provide specific feedback when editing AI content
- Use the "Train AI" feature to upload high-quality examples for better results
      `
    },
    settings: {
      title: "System Settings",
      content: `
## System Settings Guide

The Settings section allows you to configure all aspects of the platform.

### Email Configuration

- Set up email delivery services (SMTP, SendGrid, etc.)
- Customize email templates for user communications
- Configure notification preferences

### Subscription Plans

- Create and modify subscription tiers
- Set pricing and feature availability
- Configure trial periods and promotions

### Integration Settings

- Connect with third-party services (payment processors, analytics, etc.)
- Manage API keys and external connections
- Configure SSO and authentication providers

### General Settings

- Platform name and branding
- Default language preferences
- Privacy and data retention policies
- System maintenance options
      `
    }
  });
  
  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
  };
  
  const handleContentChange = (section: string, newContent: string) => {
    setSections({
      ...sections,
      [section]: {
        ...sections[section as keyof typeof sections],
        content: newContent
      }
    });
  };
  
  const handleSave = () => {
    setIsLoading(true);
    
    // In a real app, this would save to a database
    setTimeout(() => {
      setIsLoading(false);
      setIsEditMode(false);
      
      toast({
        title: "Guide updated",
        description: "The admin guide has been updated successfully.",
      });
      
      logSystemAction('Updated admin guide');
    }, 1000);
  };
  
  return (
    <div className="container py-6">
      <Helmet>
        <title>Admin Guide | CILS B2 Cittadinanza</title>
      </Helmet>
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">Admin Guide</h1>
          <HelpCircle className="h-4 w-4 text-muted-foreground" />
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={isEditMode ? "default" : "outline"}
            size="sm"
            onClick={handleEditToggle}
          >
            <FileEdit className="h-4 w-4 mr-2" />
            {isEditMode ? "Cancel Editing" : "Edit Guide"}
          </Button>
          
          {isEditMode && (
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Guide Sections</CardTitle>
            <CardDescription>
              Browse different sections of the admin guide
            </CardDescription>
          </CardHeader>
          <CardContent>
            <nav className="space-y-2">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="getting-started">
                  <AccordionTrigger className="py-2 hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Book className="h-4 w-4" />
                      <span>Getting Started</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="pl-6 py-1 space-y-1">
                      <li className="text-sm hover:text-primary cursor-pointer">Platform Overview</li>
                      <li className="text-sm hover:text-primary cursor-pointer">Quick Start Guide</li>
                      <li className="text-sm hover:text-primary cursor-pointer">Key Features</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="core-sections">
                  <AccordionTrigger className="py-2 hover:no-underline">
                    <div className="flex items-center gap-2">
                      <FileQuestion className="h-4 w-4" />
                      <span>Core Functions</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="pl-6 py-1 space-y-1">
                      <li className="text-sm hover:text-primary cursor-pointer flex items-center gap-1">
                        <BarChart2 className="h-3 w-3" />
                        <span>Dashboard</span>
                      </li>
                      <li className="text-sm hover:text-primary cursor-pointer flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>User Management</span>
                      </li>
                      <li className="text-sm hover:text-primary cursor-pointer flex items-center gap-1">
                        <Upload className="h-3 w-3" />
                        <span>Content Management</span>
                      </li>
                      <li className="text-sm hover:text-primary cursor-pointer flex items-center gap-1">
                        <Settings className="h-3 w-3" />
                        <span>System Settings</span>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </nav>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Admin Documentation</CardTitle>
            <CardDescription>
              Comprehensive guide for platform administrators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="dashboard" className="space-y-4">
              <TabsList className="grid grid-cols-5">
                <TabsTrigger value="dashboard" className="text-xs">Dashboard</TabsTrigger>
                <TabsTrigger value="users" className="text-xs">Users</TabsTrigger>
                <TabsTrigger value="content" className="text-xs">Content</TabsTrigger>
                <TabsTrigger value="ai" className="text-xs">AI</TabsTrigger>
                <TabsTrigger value="settings" className="text-xs">Settings</TabsTrigger>
              </TabsList>
              
              {Object.keys(sections).map((section) => (
                <TabsContent key={section} value={section}>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    {isEditMode ? (
                      <textarea
                        className="w-full h-[500px] p-4 border rounded-md font-mono text-sm"
                        value={sections[section as keyof typeof sections].content}
                        onChange={(e) => handleContentChange(section, e.target.value)}
                      />
                    ) : (
                      <div className="markdown-content">
                        <h1>{sections[section as keyof typeof sections].title}</h1>
                        {sections[section as keyof typeof sections].content.split('\n').map((line, i) => {
                          if (line.startsWith('## ')) {
                            return <h2 key={i}>{line.replace('## ', '')}</h2>;
                          } else if (line.startsWith('### ')) {
                            return <h3 key={i}>{line.replace('### ', '')}</h3>;
                          } else if (line.startsWith('- ')) {
                            return <p key={i} className="flex items-start mb-1">
                              <span className="mr-2">•</span>
                              <span>{line.replace('- ', '')}</span>
                            </p>;
                          } else if (line.startsWith('1. ')) {
                            return <p key={i} className="flex items-start mb-1">
                              <span className="mr-2">{line.split('.')[0]}.</span>
                              <span>{line.replace(/^\d+\.\s/, '')}</span>
                            </p>;
                          } else {
                            return <p key={i}>{line}</p>;
                          }
                        })}
                      </div>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminGuide;
