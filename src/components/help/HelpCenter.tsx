
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Bookmark, BookOpen, HelpCircle, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import BilingualText from '@/components/language/BilingualText';

// FAQ Item component
const FAQItem: React.FC<{ question: string, answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-border py-4">
      <button 
        className="flex w-full justify-between items-start text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="font-medium">{question}</h3>
        <span className="ml-2 flex-shrink-0">
          {isOpen ? (
            <HelpCircle className="h-5 w-5 text-primary" />
          ) : (
            <HelpCircle className="h-5 w-5 text-muted-foreground" />
          )}
        </span>
      </button>
      
      {isOpen && (
        <div className="mt-2 text-muted-foreground">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

const HelpCenter: React.FC = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Define FAQ items with bilingual support
  const faqItems = [
    {
      id: 'faq-1',
      question: language === 'italian' 
        ? 'Come posso iniziare con la piattaforma?' 
        : 'How do I get started with the platform?',
      answer: language === 'italian'
        ? 'Inizia creando un account e completando il test di livello. Ti consiglieremo lezioni e materiali didattici in base al tuo livello attuale.'
        : 'Start by creating an account and completing the level test. We will recommend lessons and teaching materials based on your current level.'
    },
    {
      id: 'faq-2',
      question: language === 'italian'
        ? 'Qual è la differenza tra i piani gratuiti e premium?'
        : 'What is the difference between free and premium plans?',
      answer: language === 'italian'
        ? 'Il piano gratuito offre accesso a lezioni di base, flashcard e quiz. Il piano premium include tutte le funzionalità, contenuti esclusivi, valutazione AI e supporto prioritario.'
        : 'The free plan provides access to basic lessons, flashcards, and quizzes. The premium plan includes all features, exclusive content, AI assessment, and priority support.'
    },
    {
      id: 'faq-3',
      question: language === 'italian'
        ? 'Posso accedere ai contenuti offline?'
        : 'Can I access content offline?',
      answer: language === 'italian'
        ? 'Gli utenti premium possono scaricare lezioni, flashcard e materiali audio per l\'uso offline nell\'app mobile.'
        : 'Premium users can download lessons, flashcards, and audio materials for offline use in the mobile app.'
    }
  ];
  
  // Filter FAQ items based on search
  const filteredFAQs = searchQuery
    ? faqItems.filter(item => 
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqItems;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <BilingualText
            english="Help Center"
            italian="Centro Assistenza"
          />
        </CardTitle>
        <CardDescription>
          <BilingualText
            english="Find answers to common questions and learn how to use the platform"
            italian="Trova risposte alle domande comuni e impara a utilizzare la piattaforma"
          />
        </CardDescription>
        
        <div className="relative mt-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-10"
            placeholder={language === 'italian' ? 'Cerca aiuto...' : 'Search for help...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="faq" className="mt-2">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="faq">
              <HelpCircle className="h-4 w-4 mr-2" />
              <BilingualText english="FAQ" italian="FAQ" />
            </TabsTrigger>
            <TabsTrigger value="guides">
              <BookOpen className="h-4 w-4 mr-2" />
              <BilingualText english="Guides" italian="Guide" />
            </TabsTrigger>
            <TabsTrigger value="contact">
              <MessageSquare className="h-4 w-4 mr-2" />
              <BilingualText english="Contact" italian="Contatti" />
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="faq">
            <div className="space-y-1">
              {filteredFAQs.length > 0 ? (
                filteredFAQs.map(item => (
                  <FAQItem 
                    key={item.id} 
                    question={item.question} 
                    answer={item.answer} 
                  />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <BilingualText
                    english="No results found. Try a different search term or browse our guides."
                    italian="Nessun risultato trovato. Prova un termine di ricerca diverso o sfoglia le nostre guide."
                  />
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="guides">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-base flex items-center">
                    <Bookmark className="h-4 w-4 mr-2 text-primary" />
                    <BilingualText 
                      english="Getting Started Guide" 
                      italian="Guida Introduttiva" 
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground">
                    <BilingualText
                      english="Learn the basics of the platform and how to set up your account."
                      italian="Impara le basi della piattaforma e come configurare il tuo account."
                    />
                  </p>
                  <Button variant="link" className="px-0 py-1 h-auto">
                    <BilingualText english="Read guide" italian="Leggi la guida" />
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-base flex items-center">
                    <Bookmark className="h-4 w-4 mr-2 text-primary" />
                    <BilingualText 
                      english="Using Flashcards" 
                      italian="Utilizzare le Flashcard" 
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground">
                    <BilingualText
                      english="Learn how to create and use flashcards to improve your vocabulary."
                      italian="Impara come creare e utilizzare le flashcard per migliorare il tuo vocabolario."
                    />
                  </p>
                  <Button variant="link" className="px-0 py-1 h-auto">
                    <BilingualText english="Read guide" italian="Leggi la guida" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="contact">
            <div className="space-y-4">
              <p className="text-muted-foreground">
                <BilingualText
                  english="Can't find what you're looking for? Get in touch with our support team."
                  italian="Non riesci a trovare quello che stai cercando? Contatta il nostro team di supporto."
                />
              </p>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Button className="sm:flex-1">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  <BilingualText english="Live Chat" italian="Chat dal vivo" />
                </Button>
                <Button variant="outline" className="sm:flex-1">
                  <BilingualText english="Submit a Ticket" italian="Invia un Ticket" />
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default HelpCenter;
