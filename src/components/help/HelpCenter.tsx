
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Bookmark, HelpCircle, Send, MessageCircle } from 'lucide-react';
import EnhancedChatbot from '@/components/chatbot/EnhancedChatbot';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const HelpCenter: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Sample FAQ data
  const faqItems: FAQItem[] = [
    {
      id: 'faq-1',
      question: 'How many questions do I get per day as a free user?',
      answer: 'Free users get one question per day for each exercise type (flashcards, multiple choice, listening, speaking, and writing). Upgrade to premium for unlimited questions and an ad-free experience.',
      category: 'subscription'
    },
    {
      id: 'faq-2',
      question: 'How does the spaced repetition system work?',
      answer: 'Our spaced repetition system schedules flashcards based on your performance. Cards you find difficult will appear more frequently, while those you master will appear less often. This optimizes your memory retention and learning efficiency.',
      category: 'features'
    },
    {
      id: 'faq-3',
      question: 'Can I practice speaking Italian with the app?',
      answer: 'Yes! Our speaking practice feature uses AI to evaluate your pronunciation and provides detailed feedback. You can practice with guided exercises and conversation simulations to improve your Italian speaking skills.',
      category: 'features'
    },
    {
      id: 'faq-4',
      question: 'How can I import my own vocabulary lists?',
      answer: 'You can import vocabulary lists in various formats including CSV, TXT, and Anki decks. Go to the Flashcards section, click on "Import", and follow the instructions to map your columns and create a new flashcard set.',
      category: 'content'
    },
    {
      id: 'faq-5',
      question: 'Is there a mobile app available?',
      answer: 'Yes, we have mobile apps for both iOS and Android. You can download them from the App Store or Google Play Store. Your account and progress will sync across all your devices.',
      category: 'general'
    },
    {
      id: 'faq-6',
      question: 'How do I change my account settings?',
      answer: 'To change your account settings, click on your profile picture in the top right corner, then select "Settings". From there, you can update your profile information, change your password, and manage your notification preferences.',
      category: 'account'
    }
  ];
  
  // Filter FAQ items based on search query and selected category
  const filteredFAQs = faqItems.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Get unique categories from FAQ items
  const categories = ['all', ...new Set(faqItems.map(item => item.category))];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>
              Find answers to common questions about our Italian learning platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-2 overflow-auto pb-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {category}
                </Button>
              ))}
            </div>
            
            {filteredFAQs.length > 0 ? (
              <div className="space-y-4">
                {filteredFAQs.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <h3 className="font-medium text-lg flex items-start">
                      <HelpCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-1" />
                      <span>{item.question}</span>
                    </h3>
                    <p className="mt-2 text-muted-foreground pl-7">{item.answer}</p>
                    <div className="flex justify-between items-center mt-2 pl-7">
                      <Badge className="capitalize">{item.category}</Badge>
                      <Button variant="ghost" size="sm">
                        <Bookmark className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <HelpCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No FAQs found matching your search criteria.</p>
                <p className="text-sm">Try adjusting your search or category filter.</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
            <CardDescription>
              Can't find what you're looking for? Contact our support team directly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <h3 className="font-medium text-lg flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Chat Support
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Chat with our support team for immediate assistance with your questions.
                </p>
                <Button className="mt-3 w-full">
                  Start Chat
                </Button>
              </div>
              
              <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <h3 className="font-medium text-lg flex items-center">
                  <Send className="h-5 w-5 mr-2" />
                  Email Support
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Send us an email and we'll get back to you within 24 hours.
                </p>
                <Button className="mt-3 w-full" variant="outline">
                  Send Email
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="md:col-span-1">
        <EnhancedChatbot />
      </div>
    </div>
  );
};

// Helper Badge component
const Badge = ({ children, className = "" }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary-foreground ${className}`}>
    {children}
  </span>
);

export default HelpCenter;
