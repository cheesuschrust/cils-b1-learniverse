
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SupportChat from '@/components/help/SupportChat';
import SupportForm from '@/components/help/SupportForm';
import FAQItems, { FAQItemProps } from '@/components/help/FAQItem';
import { HelpCircle, FileText, MailQuestion, MessagesSquare, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSystemLog } from '@/hooks/use-system-log';

// FAQ data
const faqItems: FAQItemProps[] = [
  {
    id: 'faq-1',
    question: 'How do I reset my password?',
    answer: 'You can reset your password by clicking on the "Forgot Password" link on the login page. You\'ll receive an email with instructions to reset your password. Make sure to check your spam folder if you don\'t see the email in your inbox.'
  },
  {
    id: 'faq-2',
    question: 'Can I use the platform on mobile devices?',
    answer: 'Yes, our platform is fully responsive and works on all devices including smartphones and tablets. You can access all features through your mobile browser without needing to download a separate app.'
  },
  {
    id: 'faq-3',
    question: 'How many flashcards can I create?',
    answer: 'The number of flashcards you can create depends on your subscription plan. Free users can create up to 100 flashcards, while premium users have unlimited access. You can view your current limits in your account settings.'
  },
  {
    id: 'faq-4',
    question: 'How does the speaking practice work?',
    answer: 'Our speaking practice feature uses advanced AI to analyze your pronunciation and provide feedback. You simply speak into your microphone, and the system will compare your speech to native speakers. Make sure to allow microphone access when prompted.'
  },
  {
    id: 'faq-5',
    question: 'Can I track my progress over time?',
    answer: 'Yes, you can track your progress in the "Progress" section of your dashboard. This shows your activity, test scores, and improvement over time for each language skill (reading, writing, speaking, listening). You can also export this data as a PDF report.'
  },
  {
    id: 'faq-6',
    question: 'Is my data secure on the platform?',
    answer: 'Yes, we take data security very seriously. All user data is encrypted both in transit and at rest. We use industry-standard security protocols and never share your personal information with third parties without your explicit consent.'
  },
  {
    id: 'faq-7',
    question: 'How do I cancel my subscription?',
    answer: 'You can cancel your subscription at any time by going to Settings > Subscription > Cancel Subscription. Your account will remain active until the end of your current billing period. After cancellation, your account will revert to the free plan.'
  },
  {
    id: 'faq-8',
    question: 'Can I download content for offline use?',
    answer: 'Yes, premium users can download lessons, flashcards, and audio files for offline use. Look for the download icon next to content you want to save. Downloaded content will be available in the "Downloads" section when you\'re offline.'
  }
];

// Documentation sections
const documentationSections = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    content: `
# Getting Started

Welcome to our language learning platform! This guide will help you get started with the basic features.

## Creating your account

1. Navigate to the Sign Up page
2. Fill in your details and verify your email
3. Set your language preferences

## Setting up your profile

1. Go to Profile settings
2. Add your learning goals
3. Set your daily study reminder
4. Complete your profile to connect with other learners

## Your first lesson

1. Go to the Dashboard
2. Select a lesson from the recommended section
3. Complete all exercises to mark the lesson as complete
4. Review your performance on the lesson summary page

Remember that consistency is key to language learning. Even 15 minutes a day can lead to significant progress over time.
`
  },
  {
    id: 'flashcards',
    title: 'Using Flashcards',
    content: `
# Using Flashcards

Flashcards are a powerful tool for memorizing vocabulary. Here's how to use them effectively.

## Creating flashcards

1. Navigate to the Flashcards section
2. Click "Create New" to add a flashcard
3. Enter the term and definition
4. Optionally add an example sentence and audio
5. Save your flashcard to a deck

## Organizing with decks

1. Create themed decks (e.g., "Food vocabulary", "Travel phrases")
2. Review flashcards by deck
3. Track mastery level for each deck

## Spaced repetition

Our system uses spaced repetition to optimize your learning:
- Cards you find difficult will appear more frequently
- Cards you know well will appear less often
- Review notifications will remind you when it's time to review

## Tips for effective flashcard learning

- Study small batches (15-20 cards) in one session
- Say the words out loud when reviewing
- Create associations with images or memories
- Review regularly, especially before bedtime
`
  },
  {
    id: 'speaking-practice',
    title: 'Speaking Practice',
    content: `
# Speaking Practice

Improve your pronunciation and conversational skills with our AI-powered speaking tools.

## Setting up your microphone

1. Make sure your device has a working microphone
2. When prompted, allow the browser to access your microphone
3. Run a quick sound check before starting exercises

## Types of speaking exercises

1. **Pronunciation drills**: Repeat words and phrases to practice specific sounds
2. **Sentence reading**: Read complete sentences to practice flow and intonation
3. **Conversation responses**: Reply to prompts in a conversational context
4. **Free speaking**: Practice speaking freely on suggested topics

## Understanding feedback

Our AI analyzes several aspects of your speech:
- Pronunciation accuracy
- Intonation patterns
- Speaking speed
- Grammatical correctness
- Vocabulary usage

Look for color-coded feedback highlighting areas for improvement.

## Practice tips

- Warm up by reading aloud before starting exercises
- Record yourself and compare with native speakers
- Practice difficult sounds repeatedly
- Participate in language exchange sessions
`
  },
  {
    id: 'tracking-progress',
    title: 'Tracking Progress',
    content: `
# Tracking Progress

Our platform provides detailed insights into your language learning journey.

## Progress dashboard

1. View your overall language proficiency score
2. See breakdown by skill area (reading, writing, speaking, listening)
3. Track daily streak and study time
4. Set and monitor learning goals

## Skill assessments

Take periodic assessments to:
- Measure your current level
- Identify areas for improvement
- Get personalized study recommendations
- Compare your progress over time

## Analytics features

1. **Activity calendar**: View your study patterns
2. **Time distribution**: See how you allocate time across different skills
3. **Error analysis**: Identify recurring mistakes
4. **Vocabulary growth**: Track new words learned

## Setting goals

1. Go to the Goals section in your profile
2. Set measurable, achievable goals (e.g., "Learn 20 new words per week")
3. Track your progress toward each goal
4. Adjust goals as needed based on your progress
`
  }
];

const Support: React.FC = () => {
  const [activeTab, setActiveTab] = useState('faq');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFaqs, setFilteredFaqs] = useState(faqItems);
  const [selectedDocSection, setSelectedDocSection] = useState(documentationSections[0].id);
  const { logUserAction } = useSystemLog();
  
  // Filter FAQs based on search query
  const handleSearchFaq = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredFaqs(faqItems);
      return;
    }
    
    const filtered = faqItems.filter(
      item => 
        item.question.toLowerCase().includes(query.toLowerCase()) ||
        item.answer.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredFaqs(filtered);
  };
  
  // Log tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    logUserAction(`Viewed support ${value} tab`);
  };
  
  return (
    <div className="container py-6">
      <Helmet>
        <title>Support | Language Learning Platform</title>
      </Helmet>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Support & Help</h1>
      </div>
      
      <Tabs defaultValue="faq" value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            <span>FAQ</span>
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessagesSquare className="h-4 w-4" />
            <span>AI Assistant</span>
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <MailQuestion className="h-4 w-4" />
            <span>Contact Support</span>
          </TabsTrigger>
          <TabsTrigger value="docs" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Documentation</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="faq" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Find answers to common questions about the platform
              </CardDescription>
              
              <div className="relative mt-2">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search FAQs..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => handleSearchFaq(e.target.value)}
                />
              </div>
            </CardHeader>
            
            <CardContent>
              {filteredFaqs.length > 0 ? (
                <FAQItems items={filteredFaqs} />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No FAQs found matching your search. Try different keywords or ask our support team.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="chat">
          <SupportChat />
        </TabsContent>
        
        <TabsContent value="contact">
          <SupportForm />
        </TabsContent>
        
        <TabsContent value="docs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documentation</CardTitle>
              <CardDescription>
                Detailed guides and instructions for using our platform
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1">
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium mb-2">Sections</h3>
                    {documentationSections.map((section) => (
                      <Button
                        key={section.id}
                        variant={selectedDocSection === section.id ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setSelectedDocSection(section.id)}
                      >
                        {section.title}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="md:col-span-3">
                  <ScrollArea className="h-[500px] rounded-md border p-4">
                    {documentationSections.find(s => s.id === selectedDocSection)?.content.split('\n').map((paragraph, i) => {
                      if (paragraph.startsWith('# ')) {
                        return <h1 key={i} className="text-2xl font-bold mb-4">{paragraph.replace('# ', '')}</h1>;
                      } else if (paragraph.startsWith('## ')) {
                        return <h2 key={i} className="text-xl font-semibold mt-6 mb-3">{paragraph.replace('## ', '')}</h2>;
                      } else if (paragraph.startsWith('- ')) {
                        return <li key={i} className="ml-6 mb-1">{paragraph.replace('- ', '')}</li>;
                      } else if (paragraph === '') {
                        return <div key={i} className="my-2" />;
                      } else if (paragraph.startsWith('1. ')) {
                        // Handle numbered lists - this is a simplified approach
                        return <div key={i} className="ml-6 mb-1">{paragraph}</div>;
                      } else {
                        return <p key={i} className="mb-3">{paragraph}</p>;
                      }
                    })}
                  </ScrollArea>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Support;
