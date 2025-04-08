
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import FAQSection from './FAQSection';

const FAQS = [
  {
    question: "What is the CILS Citizenship Test?",
    answer: "The CILS (Certificazione di Italiano come Lingua Straniera) is a certification of Italian language proficiency required for citizenship applications. The B1 level is typically required for citizenship purposes.",
    category: "exam"
  },
  {
    question: "How does this platform help me prepare?",
    answer: "Our platform provides daily practice questions, flashcards, reading and listening exercises, and mock tests specifically designed for the CILS B1 citizenship test requirements.",
    category: "platform"
  },
  {
    question: "What is the difference between free and premium plans?",
    answer: "The free plan provides limited access to basic practice questions and flashcards. The premium plan offers unlimited access to all features including mock tests, AI-powered feedback, and advanced exercises.",
    category: "subscription"
  },
  {
    question: "How do I track my progress?",
    answer: "Your progress is automatically tracked in the dashboard. You can see your improvement over time, weak areas that need more practice, and your success rate for different question types.",
    category: "platform"
  },
  {
    question: "Can I practice on mobile devices?",
    answer: "Yes! Our platform is fully responsive and works on all devices including smartphones and tablets, allowing you to practice anywhere.",
    category: "technical"
  },
  {
    question: "What are the requirements for the Italian citizenship test?",
    answer: "Italian citizenship applicants typically need to demonstrate a B1 level of language proficiency through an approved certification like CILS. The test covers reading, writing, listening, and speaking skills.",
    category: "exam"
  },
  {
    question: "How do I cancel my premium subscription?",
    answer: "You can cancel your subscription at any time from your account settings. You'll continue to have premium access until the end of your current billing period.",
    category: "subscription"
  },
  {
    question: "Is there a guarantee I'll pass the test?",
    answer: "While we can't guarantee everyone will pass, our platform is specifically designed to prepare you thoroughly for the CILS B1 requirements, and consistent practice using our resources significantly increases your chances of success.",
    category: "platform"
  }
];

const HelpCenter: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  
  const filteredFAQs = searchQuery
    ? FAQS.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    : FAQS;

  return (
    <div className="space-y-8">
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            placeholder="Search for help topics..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              className="absolute right-0 top-0 h-full"
              onClick={() => setSearchQuery('')}
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      <FAQSection
        title="Frequently Asked Questions"
        description={searchQuery ? `Search results for "${searchQuery}"` : "Find answers to common questions about our platform and the Italian citizenship test."}
        categories={["exam", "platform", "subscription", "technical"]}
        items={filteredFAQs}
      />
      
      <div className="text-center">
        <p className="text-muted-foreground mb-4">
          Can't find what you're looking for?
        </p>
        <Button asChild>
          <a href="#ticket">Contact Support</a>
        </Button>
      </div>
    </div>
  );
};

export default HelpCenter;
