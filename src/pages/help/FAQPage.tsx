
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FAQItems, { FAQItemProps } from '@/components/help/FAQItem';
import { Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import BilingualText from '@/components/language/BilingualText';

// Mock FAQ data - in a real app, this would come from an API or database
const faqData: FAQItemProps[] = [
  {
    id: '1',
    category: 'account',
    question: 'How do I reset my password?',
    questionItalian: 'Come posso reimpostare la mia password?',
    answer: 'You can reset your password by clicking on the "Forgot Password" link on the login page. Follow the instructions sent to your email.',
    answerItalian: 'Puoi reimpostare la tua password cliccando sul link "Password dimenticata" nella pagina di accesso. Segui le istruzioni inviate alla tua email.'
  },
  {
    id: '2',
    category: 'account',
    question: 'How do I change my email address?',
    questionItalian: 'Come posso cambiare il mio indirizzo email?',
    answer: 'You can change your email address in your account settings. Go to Profile > Settings > Account Information.',
    answerItalian: 'Puoi cambiare il tuo indirizzo email nelle impostazioni del tuo account. Vai su Profilo > Impostazioni > Informazioni account.'
  },
  {
    id: '3',
    category: 'subscription',
    question: 'What are the benefits of a premium subscription?',
    questionItalian: 'Quali sono i vantaggi di un abbonamento premium?',
    answer: 'Premium subscribers get access to all lessons, unlimited practice exercises, progress tracking, and no ads.',
    answerItalian: 'Gli abbonati premium hanno accesso a tutte le lezioni, esercizi di pratica illimitati, monitoraggio dei progressi e nessuna pubblicità.'
  },
  {
    id: '4',
    category: 'subscription',
    question: 'How do I cancel my subscription?',
    questionItalian: 'Come posso annullare il mio abbonamento?',
    answer: 'You can cancel your subscription in your account settings. Go to Profile > Settings > Subscription > Cancel Subscription.',
    answerItalian: 'Puoi annullare il tuo abbonamento nelle impostazioni del tuo account. Vai su Profilo > Impostazioni > Abbonamento > Annulla abbonamento.'
  },
  {
    id: '5',
    category: 'learning',
    question: 'How often should I practice?',
    questionItalian: 'Con quale frequenza dovrei esercitarmi?',
    answer: 'For best results, we recommend practicing at least 15-20 minutes every day rather than longer sessions less frequently.',
    answerItalian: 'Per ottenere i migliori risultati, ti consigliamo di esercitarti almeno 15-20 minuti ogni giorno piuttosto che sessioni più lunghe ma meno frequenti.'
  },
  {
    id: '6',
    category: 'learning',
    question: 'How does the spaced repetition system work?',
    questionItalian: 'Come funziona il sistema di ripetizione spaziata?',
    answer: 'Our spaced repetition system shows you flashcards at increasing intervals based on how well you know them. Cards you find difficult appear more frequently.',
    answerItalian: 'Il nostro sistema di ripetizione spaziata ti mostra le flashcard a intervalli crescenti in base a quanto le conosci. Le carte che trovi difficili appaiono più frequentemente.'
  },
  {
    id: '7',
    category: 'technical',
    question: 'The audio is not working. What should I do?',
    questionItalian: "L'audio non funziona. Cosa devo fare?",
    answer: 'First, check if your device volume is on. Then ensure you have given browser permission for audio. If the problem persists, try using a different browser or device.',
    answerItalian: 'Prima, controlla se il volume del tuo dispositivo è attivo. Poi assicurati di aver dato al browser il permesso per l\'audio. Se il problema persiste, prova a utilizzare un browser o un dispositivo diverso.'
  },
  {
    id: '8',
    category: 'technical',
    question: 'Can I use the app offline?',
    questionItalian: 'Posso usare l\'app offline?',
    answer: 'Yes, you can download lessons for offline use. Go to the lesson you want to save and click the download icon. You\'ll need to be online for the initial download.',
    answerItalian: 'Sì, puoi scaricare le lezioni per l\'uso offline. Vai alla lezione che vuoi salvare e clicca sull\'icona di download. Dovrai essere online per il download iniziale.'
  },
];

const FAQPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { language } = useLanguage();
  
  const categories = [
    { id: 'all', label: 'All', labelItalian: 'Tutti' },
    { id: 'account', label: 'Account', labelItalian: 'Account' },
    { id: 'subscription', label: 'Subscription', labelItalian: 'Abbonamento' },
    { id: 'learning', label: 'Learning', labelItalian: 'Apprendimento' },
    { id: 'technical', label: 'Technical', labelItalian: 'Tecnico' },
  ];
  
  const filteredFAQs = faqData.filter((faq) => {
    const matchesSearch = searchQuery.length === 0 ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (faq.questionItalian && faq.questionItalian.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (faq.answerItalian && faq.answerItalian.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesSearch;
  });
  
  const getFAQsByCategory = (category: string) => {
    if (category === 'all') return filteredFAQs;
    return filteredFAQs.filter(faq => faq.category === category);
  };
  
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            <BilingualText 
              english="Frequently Asked Questions"
              italian="Domande Frequenti"
            />
          </CardTitle>
          <div className="relative mt-4">
            <Input
              placeholder={language === 'italian' ? "Cerca nelle FAQ..." : "Search FAQs..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="w-full justify-start mb-6 overflow-x-auto flex-nowrap">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  {language === 'italian' ? category.labelItalian : category.label}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <FAQItems items={getFAQsByCategory(category.id)} />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FAQPage;
