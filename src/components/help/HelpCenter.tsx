
import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  ChevronRight, 
  BookOpen, 
  MessageSquare, 
  FileQuestion, 
  LifeBuoy
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FAQItems, FAQItemProps } from '@/components/help/FAQItem';
import SupportChat from '@/components/help/SupportChat';
import SupportForm from '@/components/help/SupportForm';

// Mock data for demo purposes
const faqData: FAQItemProps[] = [
  {
    id: 'faq-1',
    question: 'How does the spaced repetition system work?',
    answer: 'Our spaced repetition system schedules flashcards for review at optimal intervals based on your performance. When you mark a card as "Easy", the interval before you see it again increases. If you mark it as "Hard", the interval decreases. This algorithm ensures you focus on difficult cards while efficiently learning new material.'
  },
  {
    id: 'faq-2',
    question: 'Can I import vocabulary from other applications?',
    answer: 'Yes! You can import vocabulary from CSV, JSON, or plain text files. Go to the Flashcards section and click "Import". The system will automatically detect the format and guide you through mapping columns. You can also import directly from popular apps like Anki, Quizlet, and Memrise.'
  },
  {
    id: 'faq-3',
    question: 'How accurate is the pronunciation feedback?',
    answer: 'Our pronunciation feedback system uses advanced speech recognition algorithms to analyze your pronunciation. It compares your speech patterns to native speakers and provides specific feedback on areas for improvement. The system has about 95% accuracy for standard Italian pronunciations.'
  },
  {
    id: 'faq-4',
    question: 'Is there a limit to how many flashcards I can create?',
    answer: 'Free accounts can create up to 500 flashcards and 50 sets. Premium accounts have unlimited flashcards and sets. All accounts can organize cards into custom categories and tags for better organization.'
  },
  {
    id: 'faq-5',
    question: 'How do I track my learning progress?',
    answer: 'Visit the Progress section to see detailed statistics about your learning journey. You can view metrics like study time, mastery percentage, streak data, and performance trends. The dashboard also shows recommendations for what to study next based on your performance.'
  },
  {
    id: 'faq-6',
    question: 'Can I use the app offline?',
    answer: 'Yes, most features work offline. Your data will synchronize when you reconnect to the internet. Note that AI-powered features like pronunciation feedback require an internet connection.'
  },
  {
    id: 'faq-7',
    question: 'How do I reset my progress on a particular set?',
    answer: 'To reset progress, go to the Flashcard set, click the three dots menu, and select "Reset Progress". You can choose to reset all cards or only specific ones. This resets the spaced repetition data without deleting the cards themselves.'
  },
  {
    id: 'faq-8',
    question: 'Can I share my flashcard sets with others?',
    answer: 'Yes! You can share any flashcard set by clicking the "Share" button. You can generate a link for direct sharing or make your set public in the community library. You can also control editing permissions when sharing with specific users.'
  }
];

const popularTopics = [
  { id: 'topic-1', title: 'Getting Started Guide', icon: BookOpen },
  { id: 'topic-2', title: 'Flashcard Creation', icon: FileQuestion },
  { id: 'topic-3', title: 'Importing & Exporting', icon: ChevronRight },
  { id: 'topic-4', title: 'Spaced Repetition', icon: ChevronRight },
  { id: 'topic-5', title: 'Pronunciation Practice', icon: MessageSquare },
  { id: 'topic-6', title: 'Account Settings', icon: ChevronRight },
];

export interface HelpCenterProps {
  className?: string;
}

export const HelpCenter: React.FC<HelpCenterProps> = ({ className = "" }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFaqs, setFilteredFaqs] = useState<FAQItemProps[]>(faqData);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredFaqs(faqData);
      return;
    }
    
    const filtered = faqData.filter(
      faq => 
        faq.question.toLowerCase().includes(query) || 
        faq.answer.toLowerCase().includes(query)
    );
    
    setFilteredFaqs(filtered);
  };
  
  return (
    <Card className={`${className} w-full max-w-4xl mx-auto`}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <HelpCircle className="h-5 w-5 mr-2 text-primary" />
          Help Center
        </CardTitle>
        <div className="relative mt-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for help articles..."
            className="pl-8"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="faq">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="faq" className="flex-1">FAQs</TabsTrigger>
            <TabsTrigger value="topics" className="flex-1">Popular Topics</TabsTrigger>
            <TabsTrigger value="chat" className="flex-1">Chat Support</TabsTrigger>
            <TabsTrigger value="ticket" className="flex-1">Submit Ticket</TabsTrigger>
          </TabsList>
          
          <TabsContent value="faq">
            <ScrollArea className="h-[500px] pr-4">
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileQuestion className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No FAQs found matching "{searchQuery}"</p>
                  <p className="text-sm mt-1">Try a different search term or browse the popular topics</p>
                </div>
              ) : (
                <FAQItems items={filteredFaqs} />
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="topics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {popularTopics.map(topic => (
                <Button 
                  key={topic.id}
                  variant="outline" 
                  className="justify-start h-auto py-4 px-4"
                >
                  <topic.icon className="h-5 w-5 mr-2 text-primary" />
                  <span>{topic.title}</span>
                </Button>
              ))}
            </div>
            
            <div className="mt-8 bg-primary/5 p-4 rounded-lg">
              <h3 className="font-medium flex items-center">
                <LifeBuoy className="h-5 w-5 mr-2 text-primary" />
                Need more help?
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Can't find what you're looking for? Contact our support team for personalized assistance.
              </p>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm">
                  View Knowledge Base
                </Button>
                <Button size="sm">
                  Contact Support
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="chat">
            <SupportChat />
          </TabsContent>
          
          <TabsContent value="ticket">
            <SupportForm />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default HelpCenter;
