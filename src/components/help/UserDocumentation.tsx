
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Search, 
  BookOpen, 
  HelpCircle, 
  FileText, 
  Settings, 
  Lightbulb, 
  CreditCard, 
  Languages, 
  Gamepad2,
  Headphones,
  MessageSquare,
  ImagePlus,
  Mic,
  Bookmark,
  History,
  Printer,
  Download
} from 'lucide-react';

interface DocSection {
  id: string;
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

const UserDocumentation: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Define documentation sections
  const gettingStartedSections: DocSection[] = [
    {
      id: 'welcome',
      title: 'Welcome to Italian Learning Platform',
      icon: <Languages className="h-5 w-5 text-primary" />,
      content: (
        <div className="space-y-4">
          <p>
            Welcome to our Italian Learning Platform! This guide will help you navigate
            the features and get the most out of your learning experience.
          </p>
          <p>
            Our platform offers a comprehensive approach to learning Italian with:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Flashcards with spaced repetition for efficient vocabulary learning</li>
            <li>Multiple-choice questions to test your knowledge</li>
            <li>Listening exercises with native Italian speakers</li>
            <li>Speaking practice with pronunciation feedback</li>
            <li>Writing exercises with grammar and spelling feedback</li>
          </ul>
          <p>
            This documentation will guide you through each feature and help you
            make the most of your learning journey.
          </p>
        </div>
      )
    },
    {
      id: 'account',
      title: 'Setting Up Your Account',
      icon: <Settings className="h-5 w-5 text-primary" />,
      content: (
        <div className="space-y-4">
          <p>
            To get the most out of the platform, customize your account settings to
            match your learning preferences.
          </p>
          
          <h3 className="font-medium text-lg">Profile Settings</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Click on your profile picture in the top right corner</li>
            <li>Select "Settings" from the dropdown menu</li>
            <li>Update your profile information, including your current Italian proficiency level</li>
            <li>Set your learning goals and daily study reminders</li>
            <li>Save your changes</li>
          </ol>
          
          <h3 className="font-medium text-lg">Learning Preferences</h3>
          <p>
            Customize your learning experience by setting preferences for:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Difficulty level (Beginner, Intermediate, Advanced)</li>
            <li>Daily learning targets</li>
            <li>Content categories (vocabulary, grammar, conversation, etc.)</li>
            <li>Audio playback speed</li>
            <li>Voice selection for pronunciation</li>
          </ul>
        </div>
      )
    },
    {
      id: 'dashboard',
      title: 'Navigating Your Dashboard',
      icon: <Gamepad2 className="h-5 w-5 text-primary" />,
      content: (
        <div className="space-y-4">
          <p>
            Your dashboard is the central hub for your Italian learning journey.
            Here's how to navigate it effectively:
          </p>
          
          <h3 className="font-medium text-lg">Dashboard Overview</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Progress Summary:</strong> View your overall progress and daily streak</li>
            <li><strong>Today's Tasks:</strong> See your daily learning activities</li>
            <li><strong>Recent Activity:</strong> Review your most recent learning sessions</li>
            <li><strong>Learning Stats:</strong> Track your performance across different skills</li>
            <li><strong>Recommended Content:</strong> Personalized content based on your progress</li>
          </ul>
          
          <h3 className="font-medium text-lg">Quick Navigation</h3>
          <p>
            Use the main navigation menu to quickly access different learning activities:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Flashcards:</strong> Build your vocabulary through spaced repetition</li>
            <li><strong>Multiple Choice:</strong> Test your knowledge with quizzes</li>
            <li><strong>Listening:</strong> Improve your comprehension with audio exercises</li>
            <li><strong>Speaking:</strong> Practice pronunciation with feedback</li>
            <li><strong>Writing:</strong> Develop your writing skills with guided exercises</li>
            <li><strong>Calendar:</strong> View your learning schedule and progress over time</li>
          </ul>
        </div>
      )
    },
    {
      id: 'subscription',
      title: 'Understanding Subscription Plans',
      icon: <CreditCard className="h-5 w-5 text-primary" />,
      content: (
        <div className="space-y-4">
          <p>
            Our platform offers different subscription tiers to meet your learning needs.
          </p>
          
          <h3 className="font-medium text-lg">Free Plan</h3>
          <p>
            With the free plan, you can access:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>One question per category per day (flashcards, multiple choice, etc.)</li>
            <li>Basic progress tracking</li>
            <li>Standard content with ads</li>
          </ul>
          
          <h3 className="font-medium text-lg">Premium Plan</h3>
          <p>
            Upgrade to Premium to unlock:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Unlimited questions across all categories</li>
            <li>Ad-free experience</li>
            <li>Advanced progress tracking and analytics</li>
            <li>Downloadable content for offline learning</li>
            <li>Priority support</li>
            <li>All premium content and features</li>
          </ul>
          
          <h3 className="font-medium text-lg">Educational Plan</h3>
          <p>
            Perfect for schools and educational institutions:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Multiple user accounts (30+ students)</li>
            <li>Teacher administration tools</li>
            <li>Custom content creation</li>
            <li>Detailed student progress reports</li>
            <li>Education-specific learning materials</li>
            <li>Bulk account management</li>
          </ul>
          
          <p className="mt-4">
            To upgrade your subscription, visit the Subscription page from your account menu.
          </p>
        </div>
      )
    },
  ];
  
  const featureSections: DocSection[] = [
    {
      id: 'flashcards',
      title: 'Flashcards System',
      icon: <Bookmark className="h-5 w-5 text-primary" />,
      content: (
        <div className="space-y-4">
          <p>
            Our flashcard system uses spaced repetition to optimize your memorization
            of Italian vocabulary and phrases.
          </p>
          
          <h3 className="font-medium text-lg">How to Use Flashcards</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Navigate to the Flashcards section from the main menu</li>
            <li>Select a category or create your own flashcard set</li>
            <li>For each card, try to recall the answer before revealing it</li>
            <li>Rate your confidence with the word using the buttons provided</li>
            <li>The system will schedule reviews based on your performance</li>
          </ol>
          
          <h3 className="font-medium text-lg">Creating Custom Flashcard Sets</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Click "Create New Set" in the Flashcards section</li>
            <li>Name your set and select a category</li>
            <li>Add cards individually with Italian and English translations</li>
            <li>Optionally include example sentences, images, or audio</li>
            <li>Save your set when complete</li>
          </ol>
          
          <h3 className="font-medium text-lg">Importing Flashcards</h3>
          <p>
            You can import flashcards from CSV, TXT, or Anki files:
          </p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Click "Import" in the Flashcards section</li>
            <li>Select your file format</li>
            <li>Upload your file</li>
            <li>Map the columns to Italian and English fields</li>
            <li>Confirm and complete the import</li>
          </ol>
          
          <h3 className="font-medium text-lg">Understanding Spaced Repetition</h3>
          <p>
            Our spaced repetition system:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Shows cards you struggle with more frequently</li>
            <li>Spaces out reviews of well-remembered cards</li>
            <li>Optimizes your learning to combat the forgetting curve</li>
            <li>Adapts to your individual learning pace</li>
          </ul>
        </div>
      )
    },
    {
      id: 'multiple-choice',
      title: 'Multiple Choice Quizzes',
      icon: <HelpCircle className="h-5 w-5 text-primary" />,
      content: (
        <div className="space-y-4">
          <p>
            Multiple choice quizzes help test your knowledge of Italian vocabulary,
            grammar, and comprehension.
          </p>
          
          <h3 className="font-medium text-lg">Taking a Quiz</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Navigate to the Multiple Choice section from the main menu</li>
            <li>Select a quiz category and difficulty level</li>
            <li>Read each question carefully and select the best answer</li>
            <li>Review your answers after completing the quiz</li>
            <li>See explanations for incorrect answers to learn from mistakes</li>
          </ol>
          
          <h3 className="font-medium text-lg">Quiz Categories</h3>
          <p>
            Our platform offers quizzes in various categories:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Vocabulary:</strong> Test your knowledge of Italian words</li>
            <li><strong>Grammar:</strong> Practice verb conjugations, articles, and grammar rules</li>
            <li><strong>Comprehension:</strong> Test understanding of text passages</li>
            <li><strong>Conversation:</strong> Practice dialogue and appropriate responses</li>
            <li><strong>Culture:</strong> Learn about Italian history, geography, and customs</li>
          </ul>
          
          <h3 className="font-medium text-lg">Difficulty Levels</h3>
          <p>
            Quizzes are available in three difficulty levels:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Beginner:</strong> Basic vocabulary and simple grammar</li>
            <li><strong>Intermediate:</strong> More complex grammar and expanded vocabulary</li>
            <li><strong>Advanced:</strong> Nuanced language usage and complex topics</li>
          </ul>
          
          <h3 className="font-medium text-lg">Quiz Progress Tracking</h3>
          <p>
            Track your progress in the "Quiz History" section, which shows:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Your overall score for each quiz</li>
            <li>Performance trends over time</li>
            <li>Areas where you excel or need improvement</li>
            <li>Recommendations for future study based on quiz results</li>
          </ul>
        </div>
      )
    },
    {
      id: 'listening',
      title: 'Listening Exercises',
      icon: <Headphones className="h-5 w-5 text-primary" />,
      content: (
        <div className="space-y-4">
          <p>
            Listening exercises help train your ear to understand spoken Italian
            from native speakers.
          </p>
          
          <h3 className="font-medium text-lg">Types of Listening Exercises</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Comprehension:</strong> Listen to a passage and answer questions</li>
            <li><strong>Dictation:</strong> Listen and type what you hear</li>
            <li><strong>Dialogue Practice:</strong> Follow conversations between native speakers</li>
            <li><strong>Audio Flashcards:</strong> Associate spoken words with meanings</li>
          </ul>
          
          <h3 className="font-medium text-lg">Using the Audio Player</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Click the play button to start the audio</li>
            <li>Use the speed controls to adjust playback speed (0.5x-2x)</li>
            <li>Click the repeat button to listen again</li>
            <li>Use the segment buttons to focus on specific parts of longer audio</li>
          </ol>
          
          <h3 className="font-medium text-lg">Tips for Effective Listening Practice</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Listen to the full audio once without reading the text</li>
            <li>Try to identify key words and phrases</li>
            <li>Use context clues to understand unfamiliar words</li>
            <li>Practice regularly with various types of content</li>
            <li>Gradually increase the difficulty and speed</li>
          </ul>
          
          <h3 className="font-medium text-lg">Content Difficulty Levels</h3>
          <p>
            We offer audio content at different levels:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Beginner:</strong> Slow, clear speech with basic vocabulary</li>
            <li><strong>Intermediate:</strong> Natural speech pace with some complex vocabulary</li>
            <li><strong>Advanced:</strong> Native-speed dialogue with regional accents and idioms</li>
          </ul>
        </div>
      )
    },
    {
      id: 'speaking',
      title: 'Speaking Practice',
      icon: <Mic className="h-5 w-5 text-primary" />,
      content: (
        <div className="space-y-4">
          <p>
            Speaking practice helps you develop proper pronunciation and build
            confidence in speaking Italian.
          </p>
          
          <h3 className="font-medium text-lg">Getting Started with Speaking Exercises</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Ensure your microphone is properly connected and working</li>
            <li>Navigate to the Speaking section from the main menu</li>
            <li>Select an exercise type and difficulty level</li>
            <li>Follow the on-screen instructions for each activity</li>
          </ol>
          
          <h3 className="font-medium text-lg">Types of Speaking Activities</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Pronunciation Practice:</strong> Repeat words and phrases</li>
            <li><strong>Conversation Simulation:</strong> Respond to prompts in dialogue scenarios</li>
            <li><strong>Read Aloud:</strong> Practice reading Italian text</li>
            <li><strong>Question & Answer:</strong> Respond to questions in Italian</li>
            <li><strong>Picture Description:</strong> Describe images in Italian</li>
          </ul>
          
          <h3 className="font-medium text-lg">Understanding Pronunciation Feedback</h3>
          <p>
            After each speaking exercise, you'll receive feedback on:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Overall pronunciation accuracy</li>
            <li>Specific sounds or words that need improvement</li>
            <li>Rhythm and intonation patterns</li>
            <li>Stress placement within words</li>
          </ul>
          
          <h3 className="font-medium text-lg">Tips for Better Pronunciation</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Listen carefully to the example audio before speaking</li>
            <li>Practice difficult sounds repeatedly</li>
            <li>Record yourself and compare with native speakers</li>
            <li>Use the slowdown feature to break down complex sounds</li>
            <li>Practice daily, even if just for a few minutes</li>
          </ul>
        </div>
      )
    },
    {
      id: 'writing',
      title: 'Writing Exercises',
      icon: <FileText className="h-5 w-5 text-primary" />,
      content: (
        <div className="space-y-4">
          <p>
            Writing exercises help you develop your Italian writing skills with
            real-time feedback and guidance.
          </p>
          
          <h3 className="font-medium text-lg">Types of Writing Exercises</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Guided Writing:</strong> Complete sentences with prompts</li>
            <li><strong>Free Writing:</strong> Write short essays or paragraphs</li>
            <li><strong>Translation:</strong> Translate text between English and Italian</li>
            <li><strong>Grammar Practice:</strong> Focus on specific grammar constructs</li>
            <li><strong>Creative Writing:</strong> Write stories or descriptions in Italian</li>
          </ul>
          
          <h3 className="font-medium text-lg">Using the Writing Editor</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Select a writing exercise from the Writing section</li>
            <li>Read the instructions and prompts carefully</li>
            <li>Type your response in the editor</li>
            <li>Use the toolbar for special characters and formatting</li>
            <li>Submit when ready for feedback</li>
          </ol>
          
          <h3 className="font-medium text-lg">Understanding Writing Feedback</h3>
          <p>
            After submitting your writing, you'll receive:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Grammar corrections highlighted in the text</li>
            <li>Vocabulary suggestions and alternatives</li>
            <li>Style and clarity feedback</li>
            <li>Overall assessment of your writing</li>
          </ul>
          
          <h3 className="font-medium text-lg">Tips for Improving Your Writing</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Start with shorter, simpler texts and gradually increase complexity</li>
            <li>Review feedback carefully and note recurring mistakes</li>
            <li>Keep a vocabulary journal of new words and phrases</li>
            <li>Practice applying grammar rules consistently</li>
            <li>Read Italian texts to absorb natural writing styles</li>
          </ul>
        </div>
      )
    },
    {
      id: 'calendar',
      title: 'Learning Calendar',
      icon: <Calendar className="h-5 w-5 text-primary" />,
      content: (
        <div className="space-y-4">
          <p>
            The Learning Calendar helps you organize your study schedule and track
            your progress over time.
          </p>
          
          <h3 className="font-medium text-lg">Calendar Features</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Activity Tracking:</strong> See your daily learning activities</li>
            <li><strong>Streak Counter:</strong> Track consecutive days of learning</li>
            <li><strong>Scheduled Reviews:</strong> View upcoming flashcard reviews</li>
            <li><strong>Goal Setting:</strong> Set and monitor daily/weekly learning goals</li>
            <li><strong>Progress Visualization:</strong> View your improvement over time</li>
          </ul>
          
          <h3 className="font-medium text-lg">Using the Calendar</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Access the Calendar from the main navigation menu</li>
            <li>Select a day to view activities completed on that day</li>
            <li>Use the month view to see your overall activity patterns</li>
            <li>Check the heat map to visualize your engagement intensity</li>
          </ol>
          
          <h3 className="font-medium text-lg">Setting Learning Goals</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Click "Set Goals" in the Calendar section</li>
            <li>Define daily or weekly targets for each activity type</li>
            <li>Set specific objectives (e.g., "Master 50 new words this month")</li>
            <li>Track your progress toward these goals</li>
          </ol>
          
          <h3 className="font-medium text-lg">Progress Reports</h3>
          <p>
            Access detailed progress reports that show:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Time spent on each activity type</li>
            <li>Progress trends over weeks and months</li>
            <li>Vocabulary growth rate</li>
            <li>Skill improvement in different areas</li>
            <li>Achievement of learning goals</li>
          </ul>
        </div>
      )
    },
  ];
  
  const supportSections: DocSection[] = [
    {
      id: 'chatbot',
      title: 'Using the Support Chatbot',
      icon: <MessageSquare className="h-5 w-5 text-primary" />,
      content: (
        <div className="space-y-4">
          <p>
            Our AI-powered support chatbot is available 24/7 to answer questions
            about the platform and provide assistance.
          </p>
          
          <h3 className="font-medium text-lg">Accessing the Chatbot</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Click the chat icon in the bottom right corner of any page</li>
            <li>Type your question or select from suggested topics</li>
            <li>Receive instant responses to common questions</li>
          </ol>
          
          <h3 className="font-medium text-lg">Tips for Effective Chatbot Use</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Ask specific questions for more accurate answers</li>
            <li>Use clear, concise language</li>
            <li>Provide context about what you're trying to accomplish</li>
            <li>Rate responses to help improve the chatbot</li>
            <li>Use suggested follow-up questions to get more information</li>
          </ul>
          
          <h3 className="font-medium text-lg">When to Escalate to Human Support</h3>
          <p>
            If the chatbot can't resolve your issue, you can escalate to human support:
          </p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Click "Need more help?" in the chat window</li>
            <li>Select "Contact Support Team"</li>
            <li>Fill in the support request form with details of your issue</li>
            <li>Submit the form to create a support ticket</li>
          </ol>
          
          <h3 className="font-medium text-lg">Chatbot Knowledge Base</h3>
          <p>
            Our chatbot is trained to help with:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Account and subscription questions</li>
            <li>Technical issues and troubleshooting</li>
            <li>Feature explanations and tutorials</li>
            <li>Content recommendations</li>
            <li>General Italian language questions</li>
          </ul>
        </div>
      )
    },
    {
      id: 'feedback',
      title: 'Providing Feedback',
      icon: <Lightbulb className="h-5 w-5 text-primary" />,
      content: (
        <div className="space-y-4">
          <p>
            We value your feedback to improve the platform. Here's how you can
            share your thoughts and suggestions.
          </p>
          
          <h3 className="font-medium text-lg">In-App Feedback</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Click on your profile picture in the top right corner</li>
            <li>Select "Feedback" from the dropdown menu</li>
            <li>Choose a feedback category (Bug Report, Feature Request, Content Issue, General Feedback)</li>
            <li>Provide a detailed description of your feedback</li>
            <li>Include screenshots if relevant</li>
            <li>Submit your feedback</li>
          </ol>
          
          <h3 className="font-medium text-lg">Content-Specific Feedback</h3>
          <p>
            Provide feedback on specific learning content:
          </p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Look for the "Feedback" button at the bottom of any exercise</li>
            <li>Rate the quality and difficulty of the content</li>
            <li>Report any issues or inaccuracies</li>
            <li>Suggest improvements</li>
          </ol>
          
          <h3 className="font-medium text-lg">Feature Requests</h3>
          <p>
            Have an idea for a new feature? Here's how to suggest it:
          </p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Go to the Feedback section</li>
            <li>Select "Feature Request"</li>
            <li>Describe the feature and how it would benefit users</li>
            <li>Provide any examples or references if available</li>
          </ol>
          
          <h3 className="font-medium text-lg">Bug Reports</h3>
          <p>
            If you encounter a technical issue, please provide:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>A clear description of what happened</li>
            <li>Steps to reproduce the issue</li>
            <li>Your device type and browser</li>
            <li>Screenshots showing the problem</li>
            <li>Any error messages you received</li>
          </ul>
        </div>
      )
    },
    {
      id: 'support-tickets',
      title: 'Support Tickets',
      icon: <FileText className="h-5 w-5 text-primary" />,
      content: (
        <div className="space-y-4">
          <p>
            For issues that require personalized assistance, you can create a
            support ticket.
          </p>
          
          <h3 className="font-medium text-lg">Creating a Support Ticket</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Navigate to the Support Center from the main menu</li>
            <li>Click "Create Support Ticket"</li>
            <li>Select a category for your issue</li>
            <li>Provide a clear subject and detailed description</li>
            <li>Attach any relevant files or screenshots</li>
            <li>Submit your ticket</li>
          </ol>
          
          <h3 className="font-medium text-lg">Ticket Priority Levels</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Low:</strong> General questions, feature inquiries</li>
            <li><strong>Medium:</strong> Non-critical issues that affect your experience</li>
            <li><strong>High:</strong> Issues preventing you from using key features</li>
            <li><strong>Critical:</strong> Account access or payment issues</li>
          </ul>
          
          <h3 className="font-medium text-lg">Tracking Your Tickets</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Go to the Support Center</li>
            <li>Select "My Tickets"</li>
            <li>View the status and history of all your tickets</li>
            <li>Add additional information if requested by support</li>
          </ol>
          
          <h3 className="font-medium text-lg">Response Times</h3>
          <p>
            Our support team aims to respond within:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Free Users:</strong> 24-48 hours</li>
            <li><strong>Premium Users:</strong> 4-12 hours</li>
            <li><strong>Educational Accounts:</strong> 2-8 hours</li>
          </ul>
          <p>
            Response times may be longer during weekends and holidays.
          </p>
        </div>
      )
    },
    {
      id: 'troubleshooting',
      title: 'Common Troubleshooting',
      icon: <Settings className="h-5 w-5 text-primary" />,
      content: (
        <div className="space-y-4">
          <p>
            Here are solutions to common issues you might encounter.
          </p>
          
          <h3 className="font-medium text-lg">Audio Issues</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>No sound playing:</strong> Check your device volume, ensure your browser has permission to play audio, and try using headphones</li>
            <li><strong>Microphone not working:</strong> Verify browser permissions, check if your microphone is connected properly, and try using a different browser</li>
            <li><strong>Audio quality issues:</strong> Check your internet connection, close other applications using audio, and try refreshing the page</li>
          </ul>
          
          <h3 className="font-medium text-lg">Login Problems</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Can't remember password:</strong> Use the "Forgot Password" link on the login page</li>
            <li><strong>Account locked:</strong> Wait 30 minutes or contact support if the issue persists</li>
            <li><strong>Email verification issues:</strong> Check your spam folder, request a new verification email, or contact support</li>
          </ul>
          
          <h3 className="font-medium text-lg">Content Loading Issues</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Slow loading:</strong> Check your internet connection, clear browser cache, or try a different browser</li>
            <li><strong>Content not displaying:</strong> Refresh the page, clear cache, or try using incognito mode</li>
            <li><strong>Images not loading:</strong> Verify your internet connection and browser permissions</li>
          </ul>
          
          <h3 className="font-medium text-lg">General Performance Tips</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Use an up-to-date browser (Chrome, Firefox, Safari, or Edge)</li>
            <li>Close unnecessary tabs and applications</li>
            <li>Clear browser cache regularly</li>
            <li>Ensure your device meets minimum system requirements</li>
            <li>Use a stable internet connection</li>
          </ul>
        </div>
      )
    },
  ];
  
  const additionalSections: DocSection[] = [
    {
      id: 'accessibility',
      title: 'Accessibility Features',
      icon: <HelpCircle className="h-5 w-5 text-primary" />,
      content: (
        <div className="space-y-4">
          <p>
            Our platform includes several accessibility features to ensure everyone
            can learn Italian effectively.
          </p>
          
          <h3 className="font-medium text-lg">Available Accessibility Features</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Screen Reader Compatibility:</strong> All content is optimized for screen readers</li>
            <li><strong>Keyboard Navigation:</strong> Full functionality without requiring a mouse</li>
            <li><strong>Text Size Adjustment:</strong> Change text size in Settings</li>
            <li><strong>Color Contrast Options:</strong> High contrast mode available</li>
            <li><strong>Audio Transcripts:</strong> Text versions of all audio content</li>
            <li><strong>Alt Text:</strong> Descriptive text for all images</li>
          </ul>
          
          <h3 className="font-medium text-lg">Enabling Accessibility Features</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Click on your profile picture in the top right corner</li>
            <li>Select "Settings" from the dropdown menu</li>
            <li>Navigate to the "Accessibility" tab</li>
            <li>Enable or adjust features as needed</li>
            <li>Save your changes</li>
          </ol>
          
          <h3 className="font-medium text-lg">Accessibility Feedback</h3>
          <p>
            We're committed to improving accessibility. If you encounter any issues or have suggestions:
          </p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Use the "Accessibility Feedback" form in the Support Center</li>
            <li>Describe the issue or suggestion in detail</li>
            <li>Include the page or feature where you encountered the issue</li>
          </ol>
        </div>
      )
    },
    {
      id: 'offline',
      title: 'Offline Learning Mode',
      icon: <Download className="h-5 w-5 text-primary" />,
      content: (
        <div className="space-y-4">
          <p>
            Premium users can download content for offline learning when an internet
            connection isn't available.
          </p>
          
          <h3 className="font-medium text-lg">Downloading Content for Offline Use</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Navigate to the content you want to download</li>
            <li>Look for the download icon or button</li>
            <li>Select the content you want to make available offline</li>
            <li>Click "Download" and wait for the download to complete</li>
          </ol>
          
          <h3 className="font-medium text-lg">Types of Downloadable Content</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Flashcard Sets:</strong> Download entire sets for offline review</li>
            <li><strong>Multiple Choice Quizzes:</strong> Save quizzes for offline practice</li>
            <li><strong>Listening Exercises:</strong> Download audio files with transcripts</li>
            <li><strong>Reading Materials:</strong> Save texts and articles</li>
            <li><strong>Grammar Guides:</strong> Download reference materials</li>
          </ul>
          
          <h3 className="font-medium text-lg">Using Offline Mode</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Ensure you've downloaded the desired content while online</li>
            <li>When offline, open the app and navigate to the "Downloads" section</li>
            <li>Access your downloaded content and use it as normal</li>
            <li>Your progress will sync when you reconnect to the internet</li>
          </ol>
          
          <h3 className="font-medium text-lg">Managing Offline Content</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>View all downloaded content in the "Downloads" section</li>
            <li>Delete unnecessary downloads to free up space</li>
            <li>See when content was last updated</li>
            <li>Check storage usage in Settings</li>
          </ul>
          <p className="text-muted-foreground mt-2">
            Note: Some features, like speaking practice and writing feedback, require an internet connection.
          </p>
        </div>
      )
    },
    {
      id: 'printing',
      title: 'Printing Learning Materials',
      icon: <Printer className="h-5 w-5 text-primary" />,
      content: (
        <div className="space-y-4">
          <p>
            Premium users can print learning materials for physical reference or study.
          </p>
          
          <h3 className="font-medium text-lg">Printable Content Types</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Flashcard Sets:</strong> Print as study cards or reference sheets</li>
            <li><strong>Grammar Guides:</strong> Print comprehensive reference materials</li>
            <li><strong>Vocabulary Lists:</strong> Print themed word collections</li>
            <li><strong>Reading Texts:</strong> Print with or without translations</li>
            <li><strong>Exercise Worksheets:</strong> Print practice exercises</li>
          </ul>
          
          <h3 className="font-medium text-lg">How to Print Materials</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Navigate to the content you want to print</li>
            <li>Look for the print icon or "Print" option</li>
            <li>Select your print preferences (format, included elements, etc.)</li>
            <li>Click "Generate PDF" to create a printable version</li>
            <li>Use your browser's print function or save the PDF</li>
          </ol>
          
          <h3 className="font-medium text-lg">Print Customization Options</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Flashcards:</strong> Choose between 2-sided cards or list format</li>
            <li><strong>Content Selection:</strong> Include or exclude examples, notes, etc.</li>
            <li><strong>Paper Size:</strong> Optimize for different paper formats</li>
            <li><strong>Font Size:</strong> Adjust for better readability</li>
            <li><strong>Include QR Codes:</strong> Link printed materials to online audio</li>
          </ul>
          
          <p className="text-muted-foreground mt-2">
            Note: Printed materials are for personal use only and subject to our copyright policy.
          </p>
        </div>
      )
    },
    {
      id: 'privacy',
      title: 'Privacy & Data Management',
      icon: <FileText className="h-5 w-5 text-primary" />,
      content: (
        <div className="space-y-4">
          <p>
            We take your privacy seriously. Here's how we handle your data and how
            you can manage your privacy settings.
          </p>
          
          <h3 className="font-medium text-lg">Data We Collect</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Account Information:</strong> Email, name, profile data</li>
            <li><strong>Learning Data:</strong> Progress, scores, completed activities</li>
            <li><strong>Usage Information:</strong> Login times, features used</li>
            <li><strong>Content Created:</strong> Flashcards, notes, recordings</li>
            <li><strong>Technical Data:</strong> Device information, IP address</li>
          </ul>
          
          <h3 className="font-medium text-lg">How We Use Your Data</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide and improve our services</li>
            <li>Personalize your learning experience</li>
            <li>Track and analyze your progress</li>
            <li>Communicate important information about your account</li>
            <li>Develop new features based on usage patterns</li>
          </ul>
          
          <h3 className="font-medium text-lg">Managing Your Privacy</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Access your privacy settings from your account page</li>
            <li>Control what data is collected and how it's used</li>
            <li>Manage email preferences and notifications</li>
            <li>Choose whether to share learning achievements</li>
            <li>Control third-party integrations</li>
          </ol>
          
          <h3 className="font-medium text-lg">Your Data Rights</h3>
          <p>
            You have the right to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access a copy of your personal data</li>
            <li>Correct inaccurate information</li>
            <li>Delete your account and associated data</li>
            <li>Export your learning data</li>
            <li>Restrict certain types of processing</li>
          </ul>
          
          <p className="mt-4">
            For more information, please review our complete <a href="/privacy-policy" className="text-primary underline">Privacy Policy</a>.
          </p>
        </div>
      )
    },
    {
      id: 'keyboard-shortcuts',
      title: 'Keyboard Shortcuts',
      icon: <Gamepad2 className="h-5 w-5 text-primary" />,
      content: (
        <div className="space-y-4">
          <p>
            Use keyboard shortcuts to navigate the platform more efficiently.
          </p>
          
          <h3 className="font-medium text-lg">General Navigation</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="font-medium">Alt + D</div>
            <div>Go to Dashboard</div>
            <div className="font-medium">Alt + F</div>
            <div>Go to Flashcards</div>
            <div className="font-medium">Alt + Q</div>
            <div>Go to Multiple Choice</div>
            <div className="font-medium">Alt + L</div>
            <div>Go to Listening</div>
            <div className="font-medium">Alt + S</div>
            <div>Go to Speaking</div>
            <div className="font-medium">Alt + W</div>
            <div>Go to Writing</div>
            <div className="font-medium">Alt + C</div>
            <div>Go to Calendar</div>
            <div className="font-medium">Alt + H</div>
            <div>Open Help</div>
          </div>
          
          <h3 className="font-medium text-lg">Flashcard Navigation</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="font-medium">Space</div>
            <div>Flip Card</div>
            <div className="font-medium">→</div>
            <div>Next Card</div>
            <div className="font-medium">←</div>
            <div>Previous Card</div>
            <div className="font-medium">1</div>
            <div>Again (Hard)</div>
            <div className="font-medium">2</div>
            <div>Good</div>
            <div className="font-medium">3</div>
            <div>Easy</div>
            <div className="font-medium">M</div>
            <div>Mark as Mastered</div>
          </div>
          
          <h3 className="font-medium text-lg">Audio Controls</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="font-medium">P</div>
            <div>Play/Pause</div>
            <div className="font-medium">R</div>
            <div>Replay</div>
            <div className="font-medium">+</div>
            <div>Increase Speed</div>
            <div className="font-medium">-</div>
            <div>Decrease Speed</div>
            <div className="font-medium">M</div>
            <div>Mute/Unmute</div>
          </div>
          
          <h3 className="font-medium text-lg">Quiz Navigation</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="font-medium">1-4</div>
            <div>Select Answer Option</div>
            <div className="font-medium">N</div>
            <div>Next Question</div>
            <div className="font-medium">P</div>
            <div>Previous Question</div>
            <div className="font-medium">S</div>
            <div>Submit Quiz</div>
            <div className="font-medium">R</div>
            <div>Review Answers</div>
          </div>
          
          <p className="text-muted-foreground mt-4">
            Press Shift + ? at any time to view available keyboard shortcuts for your current page.
          </p>
        </div>
      )
    },
  ];
  
  // Function to filter sections based on search query
  const filterSections = (sections: DocSection[]) => {
    if (!searchQuery) return sections;
    
    return sections.filter(section => 
      section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (typeof section.content === 'string' && section.content.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };
  
  return (
    <div className="bg-background">
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <Card className="border-none shadow-none bg-transparent">
          <CardHeader className="px-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle className="text-3xl flex items-center">
                  <BookOpen className="mr-2 h-8 w-8 text-primary" />
                  User Documentation
                </CardTitle>
                <CardDescription className="text-lg">
                  Everything you need to know about using the Italian Learning Platform
                </CardDescription>
              </div>
              
              <div className="w-full md:w-auto">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search documentation..."
                    className="pl-8 w-full md:w-[300px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="px-0">
            <Tabs defaultValue="getting-started" className="w-full">
              <TabsList className="w-full justify-start mb-8 overflow-x-auto flex-nowrap">
                <TabsTrigger value="getting-started" className="flex items-center whitespace-nowrap">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Getting Started
                </TabsTrigger>
                <TabsTrigger value="features" className="flex items-center whitespace-nowrap">
                  <Languages className="h-4 w-4 mr-2" />
                  Learning Features
                </TabsTrigger>
                <TabsTrigger value="support" className="flex items-center whitespace-nowrap">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Support & Help
                </TabsTrigger>
                <TabsTrigger value="additional" className="flex items-center whitespace-nowrap">
                  <FileText className="h-4 w-4 mr-2" />
                  Additional Resources
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="getting-started">
                <div className="space-y-6">
                  {searchQuery && filterSections(gettingStartedSections).length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
                      <Button variant="link" onClick={() => setSearchQuery('')}>Clear search</Button>
                    </div>
                  ) : (
                    <Accordion type="single" collapsible className="w-full">
                      {filterSections(gettingStartedSections).map((section) => (
                        <AccordionItem key={section.id} value={section.id}>
                          <AccordionTrigger className="text-left">
                            <div className="flex items-center">
                              {section.icon}
                              <span className="ml-2">{section.title}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <ScrollArea className="max-h-[70vh]">
                              <div className="p-4">
                                {section.content}
                              </div>
                            </ScrollArea>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="features">
                <div className="space-y-6">
                  {searchQuery && filterSections(featureSections).length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
                      <Button variant="link" onClick={() => setSearchQuery('')}>Clear search</Button>
                    </div>
                  ) : (
                    <Accordion type="single" collapsible className="w-full">
                      {filterSections(featureSections).map((section) => (
                        <AccordionItem key={section.id} value={section.id}>
                          <AccordionTrigger className="text-left">
                            <div className="flex items-center">
                              {section.icon}
                              <span className="ml-2">{section.title}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <ScrollArea className="max-h-[70vh]">
                              <div className="p-4">
                                {section.content}
                              </div>
                            </ScrollArea>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="support">
                <div className="space-y-6">
                  {searchQuery && filterSections(supportSections).length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
                      <Button variant="link" onClick={() => setSearchQuery('')}>Clear search</Button>
                    </div>
                  ) : (
                    <Accordion type="single" collapsible className="w-full">
                      {filterSections(supportSections).map((section) => (
                        <AccordionItem key={section.id} value={section.id}>
                          <AccordionTrigger className="text-left">
                            <div className="flex items-center">
                              {section.icon}
                              <span className="ml-2">{section.title}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <ScrollArea className="max-h-[70vh]">
                              <div className="p-4">
                                {section.content}
                              </div>
                            </ScrollArea>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="additional">
                <div className="space-y-6">
                  {searchQuery && filterSections(additionalSections).length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
                      <Button variant="link" onClick={() => setSearchQuery('')}>Clear search</Button>
                    </div>
                  ) : (
                    <Accordion type="single" collapsible className="w-full">
                      {filterSections(additionalSections).map((section) => (
                        <AccordionItem key={section.id} value={section.id}>
                          <AccordionTrigger className="text-left">
                            <div className="flex items-center">
                              {section.icon}
                              <span className="ml-2">{section.title}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <ScrollArea className="max-h-[70vh]">
                              <div className="p-4">
                                {section.content}
                              </div>
                            </ScrollArea>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-12 border-t pt-8">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-medium">Need more help?</h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  If you couldn't find the information you need in our documentation,
                  our support team is here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
                  <Button className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat with Support
                  </Button>
                  <Button variant="outline" className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Create Support Ticket
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDocumentation;
