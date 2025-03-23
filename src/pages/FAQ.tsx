
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { HelpCircle, Search, MessageSquare, CreditCard, Users, Bookmark, Zap, Layers, Book, Brain } from 'lucide-react';

const FAQ = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = React.useState('');
  
  // FAQ data organized by categories
  const faqData = [
    {
      category: 'account',
      icon: <Users className="h-4 w-4" />,
      title: 'Account & Subscription',
      items: [
        {
          question: 'How do I create an account?',
          answer: 'You can create an account by clicking on the "Sign Up" button on the homepage. Fill in your details, including your email address and a secure password, then follow the verification steps to complete your registration.',
          tags: ['account', 'signup', 'registration']
        },
        {
          question: 'What subscription plans are available?',
          answer: 'We offer several subscription options: a free plan with basic features, a monthly premium plan, and an annual premium plan with a discount. The premium plans include unlimited access to all features, no ads, and priority support.',
          tags: ['subscription', 'plans', 'pricing']
        },
        {
          question: 'How do I upgrade my subscription?',
          answer: 'To upgrade your subscription, go to your Account Settings and click on the "Subscription" tab. From there, you can view the available plans and select the one that best suits your needs. You\'ll be guided through the payment process.',
          tags: ['subscription', 'upgrade', 'payment']
        },
        {
          question: 'Can I cancel my subscription at any time?',
          answer: 'Yes, you can cancel your subscription at any time from your Account Settings. Go to the "Subscription" tab and click on "Cancel Subscription". Your premium access will continue until the end of your current billing period.',
          tags: ['subscription', 'cancel', 'refund']
        }
      ]
    },
    {
      category: 'learning',
      icon: <Book className="h-4 w-4" />,
      title: 'Learning Features',
      items: [
        {
          question: 'How do flashcards work?',
          answer: 'Our flashcards system uses spaced repetition to help you memorize Italian vocabulary efficiently. Each card shows an Italian word or phrase, and you can flip it to see the translation. After reviewing a card, you can mark it as "Known" or "Need Practice" which determines when you\'ll see it again.',
          tags: ['flashcards', 'vocabulary', 'practice']
        },
        {
          question: 'What types of exercises are available?',
          answer: 'We offer a variety of exercise types including multiple-choice questions, writing prompts, speaking practice, listening comprehension, and grammar exercises. Each is designed to develop different language skills needed for the CILS B2 exam.',
          tags: ['exercises', 'practice', 'types']
        },
        {
          question: 'How is my progress tracked?',
          answer: 'The platform tracks your activity across all learning modules. You can view detailed statistics on your dashboard, including time spent learning, accuracy rates, vocabulary mastered, and your estimated CILS level. This helps you identify areas for improvement.',
          tags: ['progress', 'tracking', 'statistics']
        },
        {
          question: 'Is the content aligned with the CILS B2 exam?',
          answer: 'Yes, all our learning content is specifically designed to align with the CILS B2 citizenship exam requirements. We cover the vocabulary, grammar, cultural knowledge, and communication skills that will be tested in the actual exam.',
          tags: ['content', 'CILS', 'exam']
        }
      ]
    },
    {
      category: 'technical',
      icon: <Zap className="h-4 w-4" />,
      title: 'Technical Support',
      items: [
        {
          question: 'Which browsers are supported?',
          answer: 'Our platform works best on recent versions of Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated for the best experience, especially for features like voice recognition and audio playback.',
          tags: ['browsers', 'compatibility', 'technical']
        },
        {
          question: 'How do I enable voice recognition?',
          answer: 'To use voice recognition features, you need to grant microphone permissions to our website. When prompted, click "Allow" in your browser\'s permission dialog. You can also check your browser settings to ensure microphone access is enabled for our site.',
          tags: ['voice', 'microphone', 'permissions']
        },
        {
          question: 'Can I use the platform on my mobile device?',
          answer: 'Yes, our platform is fully responsive and works on smartphones and tablets. For the best experience, we recommend using our mobile app, available for both iOS and Android devices, which offers additional features like offline learning.',
          tags: ['mobile', 'responsive', 'app']
        },
        {
          question: 'What should I do if I encounter a technical issue?',
          answer: 'If you experience any technical problems, first try refreshing the page or clearing your browser cache. If the issue persists, contact our support team through the Help section with details about the problem, including your device, browser, and what you were trying to do.',
          tags: ['issues', 'bugs', 'support']
        }
      ]
    },
    {
      category: 'content',
      icon: <Layers className="h-4 w-4" />,
      title: 'Content & Resources',
      items: [
        {
          question: 'How often is new content added?',
          answer: 'We add new learning materials weekly, including vocabulary sets, practice exercises, and cultural content. Premium users receive immediate access to all new content, while free users may have access to selected new materials.',
          tags: ['content', 'updates', 'new']
        },
        {
          question: 'Can I download materials for offline study?',
          answer: 'Premium users can download PDF resources, vocabulary lists, and audio files for offline study. In our mobile app, premium users can also save lesson modules for offline access when internet connectivity is limited.',
          tags: ['download', 'offline', 'resources']
        },
        {
          question: 'Are there any study groups or community features?',
          answer: 'Yes, we have a community forum where learners can connect, ask questions, and share tips. Premium users can also join weekly conversation groups led by Italian tutors, which are great for practice and meeting fellow learners.',
          tags: ['community', 'groups', 'forum']
        },
        {
          question: 'How accurate is the content for the CILS exam?',
          answer: 'Our content is developed by Italian language experts familiar with the CILS B2 citizenship exam requirements. We regularly update our materials based on the latest exam patterns and feedback from users who have taken the test.',
          tags: ['accuracy', 'CILS', 'exam']
        }
      ]
    },
    {
      category: 'ai',
      icon: <Brain className="h-4 w-4" />,
      title: 'AI Features',
      items: [
        {
          question: 'How does the AI personalize my learning experience?',
          answer: 'Our AI system analyzes your performance across different exercises, identifying your strengths and weaknesses. It then adjusts the difficulty and focuses on areas where you need more practice, creating a learning path tailored to your specific needs.',
          tags: ['AI', 'personalization', 'learning']
        },
        {
          question: 'How accurate is the voice recognition?',
          answer: 'Our voice recognition technology is quite accurate for most standard Italian pronunciations. It can recognize various accents but works best in quiet environments. The system is designed to be forgiving for learners while still providing helpful feedback on pronunciation.',
          tags: ['voice', 'recognition', 'accuracy']
        },
        {
          question: 'Can the AI help with writing corrections?',
          answer: 'Yes, our AI can analyze your written Italian responses, identifying grammar errors, vocabulary usage issues, and suggesting improvements. It provides detailed feedback that helps you understand your mistakes and learn from them.',
          tags: ['AI', 'writing', 'corrections']
        },
        {
          question: 'How is my data used to improve the platform?',
          answer: 'With your permission, anonymized data about your learning patterns and interactions with the platform helps us improve our AI systems and content. This data never includes personal information and is used solely to enhance the learning experience for all users.',
          tags: ['data', 'privacy', 'improvements']
        }
      ]
    }
  ];
  
  // Filter FAQs based on search query
  const filteredFaqs = searchQuery
    ? faqData.map(category => ({
        ...category,
        items: category.items.filter(item => 
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tags.some(tag => tag.includes(searchQuery.toLowerCase()))
        )
      })).filter(category => category.items.length > 0)
    : faqData;
  
  return (
    <div className="container py-6">
      <Helmet>
        <title>Frequently Asked Questions | CILS B2 Cittadinanza</title>
      </Helmet>
      
      <div className="flex flex-col items-center text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
        <p className="text-muted-foreground max-w-2xl mb-6">
          Find answers to common questions about our platform. If you need additional help, feel free to contact our support team.
        </p>
        
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search for questions..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground" 
              onClick={() => setSearchQuery('')}
            >
              ✕
            </button>
          )}
        </div>
      </div>
      
      {searchQuery && filteredFaqs.length === 0 ? (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No results found</h3>
              <p className="text-muted-foreground mb-4">
                We couldn't find any FAQs matching your search. Try different keywords or ask our support team.
              </p>
              <Button asChild>
                <Link to="/support">Contact Support</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {filteredFaqs.map((category, index) => (
            <Card key={category.category} className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {category.icon}
                  {category.title}
                </CardTitle>
                <CardDescription>
                  {category.category === 'account' && 'Questions about accounts, profiles, and subscriptions'}
                  {category.category === 'learning' && 'Information about learning features and exercises'}
                  {category.category === 'technical' && 'Help with technical issues and platform usage'}
                  {category.category === 'content' && 'Questions about our learning content and resources'}
                  {category.category === 'ai' && 'Details about our AI-powered learning features'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  {category.items.map((item, itemIndex) => (
                    <AccordionItem key={itemIndex} value={`${category.category}-${itemIndex}`}>
                      <AccordionTrigger className="text-left">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        <p className="mb-3">{item.answer}</p>
                        <div className="flex flex-wrap gap-2">
                          {item.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs" onClick={() => setSearchQuery(tag)}>
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </>
      )}
      
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-4">
            <h3 className="text-lg font-medium mb-2">Still have questions?</h3>
            <p className="text-muted-foreground mb-4">
              If you couldn't find the answer you were looking for, please reach out to our support team.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild>
                <Link to="/support" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Contact Support
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/user-guide" className="flex items-center gap-2">
                  <Book className="h-4 w-4" />
                  Read User Guide
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FAQ;
