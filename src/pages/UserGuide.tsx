
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Book, Bookmark, HelpCircle, Search, Lightbulb, VolumeIcon, Sparkles, Brain, Languages, FileBadge } from 'lucide-react';

const UserGuide = () => {
  return (
    <div className="container py-6">
      <Helmet>
        <title>User Guide | CILS B2 Cittadinanza</title>
      </Helmet>
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">User Guide</h1>
          <HelpCircle className="h-4 w-4 text-muted-foreground" />
        </div>
        
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/support">
              <HelpCircle className="h-4 w-4 mr-2" />
              Get Support
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Guide Sections</CardTitle>
            <CardDescription>
              Browse different sections of the user guide
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
                      <li className="text-sm hover:text-primary cursor-pointer">Account Setup</li>
                      <li className="text-sm hover:text-primary cursor-pointer">Navigation</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="learning">
                  <AccordionTrigger className="py-2 hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      <span>Learning Tools</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="pl-6 py-1 space-y-1">
                      <li className="text-sm hover:text-primary cursor-pointer">Flashcards</li>
                      <li className="text-sm hover:text-primary cursor-pointer">Multiple Choice</li>
                      <li className="text-sm hover:text-primary cursor-pointer">Speaking Practice</li>
                      <li className="text-sm hover:text-primary cursor-pointer">Writing Exercises</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="features">
                  <AccordionTrigger className="py-2 hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      <span>Special Features</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="pl-6 py-1 space-y-1">
                      <li className="text-sm hover:text-primary cursor-pointer">AI Assistance</li>
                      <li className="text-sm hover:text-primary cursor-pointer">Voice Recognition</li>
                      <li className="text-sm hover:text-primary cursor-pointer">Progress Tracking</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </nav>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>User Documentation</CardTitle>
            <CardDescription>
              Learn how to make the most of our platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="introduction" className="space-y-4">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="introduction">Introduction</TabsTrigger>
                <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
                <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
                <TabsTrigger value="speaking">Speaking</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="introduction">
                <div className="prose max-w-none dark:prose-invert">
                  <h2>Welcome to CILS B2 Cittadinanza</h2>
                  <p>
                    Welcome to our comprehensive Italian language learning platform! This guide will help you navigate the platform and make the most of all available features to enhance your language learning journey.
                  </p>
                  
                  <h3>Key Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mt-4">
                    <div className="bg-muted/40 p-4 rounded-lg flex gap-3">
                      <Languages className="h-5 w-5 text-primary shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium">Comprehensive Language Learning</h4>
                        <p className="text-sm text-muted-foreground">Learn Italian through interactive exercises covering vocabulary, grammar, speaking, and listening.</p>
                      </div>
                    </div>
                    
                    <div className="bg-muted/40 p-4 rounded-lg flex gap-3">
                      <VolumeIcon className="h-5 w-5 text-primary shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium">Pronunciation Practice</h4>
                        <p className="text-sm text-muted-foreground">Practice and receive feedback on your pronunciation with our voice recognition technology.</p>
                      </div>
                    </div>
                    
                    <div className="bg-muted/40 p-4 rounded-lg flex gap-3">
                      <Sparkles className="h-5 w-5 text-primary shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium">AI-Powered Learning</h4>
                        <p className="text-sm text-muted-foreground">Benefit from personalized learning paths adapted to your progress and learning style.</p>
                      </div>
                    </div>
                    
                    <div className="bg-muted/40 p-4 rounded-lg flex gap-3">
                      <FileBadge className="h-5 w-5 text-primary shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium">CILS B2 Preparation</h4>
                        <p className="text-sm text-muted-foreground">Specifically designed to help you prepare for the CILS B2 citizenship exam.</p>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="mt-6">Getting Started</h3>
                  <p>
                    To begin your learning journey, we recommend starting with these steps:
                  </p>
                  <ol>
                    <li><strong>Complete your profile</strong> - Update your language preferences and goals</li>
                    <li><strong>Take the placement test</strong> - This helps us recommend the right content for your level</li>
                    <li><strong>Explore the flashcards</strong> - Build your vocabulary with our interactive flashcards</li>
                    <li><strong>Practice daily</strong> - Consistent practice is key to language learning success</li>
                  </ol>
                  
                  <div className="bg-primary/10 border-l-4 border-primary p-4 rounded my-6">
                    <div className="flex gap-2">
                      <Lightbulb className="h-5 w-5 text-primary shrink-0" />
                      <div>
                        <h4 className="font-medium">Pro Tip</h4>
                        <p className="text-sm">
                          Enable voice features in your settings to practice pronunciation. Speaking aloud is one of the most effective ways to improve your language skills.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="flashcards">
                <div className="prose max-w-none dark:prose-invert">
                  <h2>Flashcards</h2>
                  <p>
                    Flashcards are one of the most effective ways to build your vocabulary. Our platform offers an extensive collection of Italian flashcards organized by topics, difficulty levels, and relevance to the CILS B2 exam.
                  </p>
                  
                  <h3>How to Use Flashcards</h3>
                  <ol>
                    <li><strong>Select a deck</strong> - Choose from various categories like everyday vocabulary, formal language, or exam-specific terms</li>
                    <li><strong>Study mode</strong> - Review cards at your own pace, with audio pronunciation for each term</li>
                    <li><strong>Practice mode</strong> - Test your recall by guessing the meaning before revealing the answer</li>
                    <li><strong>Spaced repetition</strong> - The system will automatically schedule cards for review based on your performance</li>
                  </ol>
                  
                  <h3>Creating Custom Flashcards</h3>
                  <p>
                    You can create your own flashcards for personalized learning:
                  </p>
                  <ol>
                    <li>Go to the Flashcards section and click "Create New"</li>
                    <li>Enter the Italian term and the English translation</li>
                    <li>Optionally add a sample sentence showing the word in context</li>
                    <li>Save the card to your personal collection</li>
                  </ol>
                  
                  <div className="not-prose bg-muted p-4 rounded-lg mt-4">
                    <h4 className="font-medium flex items-center gap-2">
                      <Bookmark className="h-4 w-4 text-primary" />
                      Keyboard Shortcuts
                    </h4>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Flip card</span>
                        <kbd className="px-2 py-1 bg-background rounded text-xs">Space</kbd>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Mark as known</span>
                        <kbd className="px-2 py-1 bg-background rounded text-xs">K</kbd>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Next card</span>
                        <kbd className="px-2 py-1 bg-background rounded text-xs">→</kbd>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Previous card</span>
                        <kbd className="px-2 py-1 bg-background rounded text-xs">←</kbd>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="quizzes">
                <div className="prose max-w-none dark:prose-invert">
                  <h2>Multiple Choice Quizzes</h2>
                  <p>
                    Our multiple-choice quizzes help you practice and test your knowledge of Italian vocabulary, grammar, and cultural concepts in a structured format.
                  </p>
                  
                  <h3>Quiz Types</h3>
                  <ul>
                    <li><strong>Grammar quizzes</strong> - Test your understanding of Italian grammar rules</li>
                    <li><strong>Vocabulary quizzes</strong> - Check your word knowledge in various contexts</li>
                    <li><strong>Cultural awareness</strong> - Learn about Italian culture, customs, and history</li>
                    <li><strong>CILS B2 practice tests</strong> - Questions formatted like the actual exam</li>
                  </ul>
                  
                  <h3>Taking a Quiz</h3>
                  <ol>
                    <li>Select a quiz category and difficulty level</li>
                    <li>Read each question carefully before selecting your answer</li>
                    <li>Submit your answers to see your score and review explanations</li>
                    <li>Review your performance analytics to identify areas for improvement</li>
                  </ol>
                  
                  <div className="bg-primary/10 border-l-4 border-primary p-4 rounded my-6">
                    <div className="flex gap-2">
                      <Lightbulb className="h-5 w-5 text-primary shrink-0" />
                      <div>
                        <h4 className="font-medium">Study Tip</h4>
                        <p className="text-sm">
                          For questions you answer incorrectly, create a flashcard to help reinforce that knowledge point. Reviewing your mistakes is one of the most effective ways to learn.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <h3>Progress Tracking</h3>
                  <p>
                    The system tracks your quiz performance over time, showing:
                  </p>
                  <ul>
                    <li>Overall accuracy percentage</li>
                    <li>Strongest and weakest categories</li>
                    <li>Improvement trends over time</li>
                    <li>Recommended focus areas for further study</li>
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="speaking">
                <div className="prose max-w-none dark:prose-invert">
                  <h2>Speaking Practice</h2>
                  <p>
                    Developing your speaking skills is essential for language fluency and success in the CILS B2 exam. Our platform offers various tools to help you practice and improve your Italian pronunciation and conversation abilities.
                  </p>
                  
                  <h3>Voice Recognition Features</h3>
                  <ul>
                    <li><strong>Pronunciation practice</strong> - Repeat words and phrases with real-time feedback</li>
                    <li><strong>Conversation simulations</strong> - Practice responding to common questions and scenarios</li>
                    <li><strong>Oral comprehension</strong> - Listen and respond to audio passages</li>
                    <li><strong>Speaking exercises</strong> - Record longer responses to speaking prompts</li>
                  </ul>
                  
                  <h3>How to Use Speaking Practice</h3>
                  <ol>
                    <li>Ensure your microphone is properly set up and enabled</li>
                    <li>Select a speaking exercise from the available categories</li>
                    <li>Listen to the prompt or example pronunciation</li>
                    <li>Click the microphone button and speak your response</li>
                    <li>Review the feedback on your pronunciation and accuracy</li>
                  </ol>
                  
                  <div className="not-prose bg-muted p-4 rounded-lg mt-4">
                    <h4 className="font-medium flex items-center gap-2">
                      <VolumeIcon className="h-4 w-4 text-primary" />
                      Voice Settings
                    </h4>
                    <p className="text-sm mt-1">
                      You can customize your voice recognition and playback preferences in the Settings page:
                    </p>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>• Select your preferred voice for Italian playback</li>
                      <li>• Adjust speech rate for slower or faster playback</li>
                      <li>• Configure pronunciation sensitivity for feedback</li>
                      <li>• Enable automatic audio playback for new items</li>
                    </ul>
                  </div>
                  
                  <h3 className="mt-6">Speaking Tips</h3>
                  <ul>
                    <li>Practice in a quiet environment for better recognition accuracy</li>
                    <li>Use headphones with a microphone for optimal results</li>
                    <li>Start with slow, deliberate pronunciation and gradually increase your speed</li>
                    <li>Record yourself to compare with native speaker examples</li>
                    <li>Practice speaking aloud daily, even for just a few minutes</li>
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="settings">
                <div className="prose max-w-none dark:prose-invert">
                  <h2>User Settings</h2>
                  <p>
                    Customize your learning experience by configuring various settings to match your preferences and learning style.
                  </p>
                  
                  <h3>Profile Settings</h3>
                  <ul>
                    <li><strong>Personal information</strong> - Update your name, email, and contact details</li>
                    <li><strong>Profile picture</strong> - Add or change your avatar</li>
                    <li><strong>Account security</strong> - Change password and security preferences</li>
                    <li><strong>Subscription management</strong> - View and manage your subscription plan</li>
                  </ul>
                  
                  <h3>Learning Preferences</h3>
                  <ul>
                    <li><strong>Language display</strong> - Choose if you want to see English, Italian, or both languages for instructions</li>
                    <li><strong>Difficulty level</strong> - Set your preferred starting difficulty for exercises</li>
                    <li><strong>Learning focus</strong> - Prioritize different aspects of language learning</li>
                    <li><strong>Daily goals</strong> - Set targets for your daily learning activities</li>
                  </ul>
                  
                  <h3>Voice and Audio Settings</h3>
                  <p>
                    Customize how text-to-speech and voice recognition work:
                  </p>
                  <ul>
                    <li><strong>Voice selection</strong> - Choose from different Italian and English voices</li>
                    <li><strong>Speech rate</strong> - Adjust how quickly the voice speaks</li>
                    <li><strong>Voice pitch</strong> - Modify the pitch of the speech</li>
                    <li><strong>Auto-play audio</strong> - Enable or disable automatic audio playback</li>
                  </ul>
                  
                  <div className="bg-primary/10 border-l-4 border-primary p-4 rounded my-6">
                    <div className="flex gap-2">
                      <Search className="h-5 w-5 text-primary shrink-0" />
                      <div>
                        <h4 className="font-medium">Finding Settings</h4>
                        <p className="text-sm">
                          Access settings by clicking on your profile picture in the top right corner and selecting "Settings" from the dropdown menu. Individual feature settings can also be adjusted within their respective sections.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <h3>Notification Preferences</h3>
                  <p>
                    Control how and when you receive notifications:
                  </p>
                  <ul>
                    <li>Daily reminders to practice</li>
                    <li>Achievement notifications</li>
                    <li>New content alerts</li>
                    <li>Email notification frequency</li>
                    <li>Browser push notification settings</li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Need More Help?</h3>
              <p className="text-muted-foreground mb-4">
                If you have questions that aren't covered in this guide, our support team is ready to assist you.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button asChild>
                  <Link to="/support">Contact Support</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/faq">View FAQs</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserGuide;
