
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import FAQSection from './FAQSection';
import { BilingualText } from '@/components/language/BilingualText';

const FAQS = [
  {
    question: "What is the CILS Citizenship Test?",
    questionItalian: "Cos'è l'esame di cittadinanza CILS?",
    answer: "The CILS (Certificazione di Italiano come Lingua Straniera) is a certification of Italian language proficiency required for citizenship applications. The B1 level is typically required for citizenship purposes.",
    answerItalian: "Il CILS (Certificazione di Italiano come Lingua Straniera) è una certificazione di competenza linguistica italiana richiesta per le domande di cittadinanza. Il livello B1 è generalmente richiesto per scopi di cittadinanza.",
    category: "exam"
  },
  {
    question: "How does this platform help me prepare?",
    questionItalian: "Come mi aiuta questa piattaforma a prepararmi?",
    answer: "Our platform provides daily practice questions, flashcards, reading and listening exercises, and mock tests specifically designed for the CILS B1 citizenship test requirements.",
    answerItalian: "La nostra piattaforma offre domande di pratica quotidiane, flashcard, esercizi di lettura e ascolto, e test simulati progettati specificamente per i requisiti dell'esame di cittadinanza CILS B1.",
    category: "platform"
  },
  {
    question: "What is the difference between free and premium plans?",
    questionItalian: "Qual è la differenza tra i piani gratuiti e premium?",
    answer: "The free plan provides limited access to basic practice questions and flashcards. The premium plan offers unlimited access to all features including mock tests, AI-powered feedback, and advanced exercises.",
    answerItalian: "Il piano gratuito offre accesso limitato a domande di pratica di base e flashcard. Il piano premium offre accesso illimitato a tutte le funzionalità, inclusi test simulati, feedback basato su AI ed esercizi avanzati.",
    category: "subscription"
  },
  {
    question: "How do I track my progress?",
    questionItalian: "Come posso monitorare i miei progressi?",
    answer: "Your progress is automatically tracked in the dashboard. You can see your improvement over time, weak areas that need more practice, and your success rate for different question types.",
    answerItalian: "I tuoi progressi vengono automaticamente monitorati nella dashboard. Puoi vedere il tuo miglioramento nel tempo, le aree deboli che necessitano di più pratica e il tuo tasso di successo per diversi tipi di domande.",
    category: "platform"
  },
  {
    question: "Can I practice on mobile devices?",
    questionItalian: "Posso esercitarmi su dispositivi mobili?",
    answer: "Yes! Our platform is fully responsive and works on all devices including smartphones and tablets, allowing you to practice anywhere.",
    answerItalian: "Sì! La nostra piattaforma è completamente responsive e funziona su tutti i dispositivi, inclusi smartphone e tablet, permettendoti di esercitarti ovunque.",
    category: "technical"
  },
  {
    question: "What are the requirements for the Italian citizenship test?",
    questionItalian: "Quali sono i requisiti per il test di cittadinanza italiana?",
    answer: "Italian citizenship applicants typically need to demonstrate a B1 level of language proficiency through an approved certification like CILS. The test covers reading, writing, listening, and speaking skills.",
    answerItalian: "I richiedenti la cittadinanza italiana in genere devono dimostrare un livello B1 di competenza linguistica attraverso una certificazione approvata come il CILS. Il test copre le competenze di lettura, scrittura, ascolto e conversazione.",
    category: "exam"
  },
  {
    question: "How do I cancel my premium subscription?",
    questionItalian: "Come posso annullare il mio abbonamento premium?",
    answer: "You can cancel your subscription at any time from your account settings. You'll continue to have premium access until the end of your current billing period.",
    answerItalian: "Puoi annullare il tuo abbonamento in qualsiasi momento dalle impostazioni del tuo account. Continuerai ad avere accesso premium fino alla fine del tuo periodo di fatturazione corrente.",
    category: "subscription"
  },
  {
    question: "Is there a guarantee I'll pass the test?",
    questionItalian: "C'è una garanzia che supererò il test?",
    answer: "While we can't guarantee everyone will pass, our platform is specifically designed to prepare you thoroughly for the CILS B1 requirements, and consistent practice using our resources significantly increases your chances of success.",
    answerItalian: "Sebbene non possiamo garantire che tutti supereranno l'esame, la nostra piattaforma è specificamente progettata per prepararti a fondo per i requisiti CILS B1, e l'esercizio costante utilizzando le nostre risorse aumenta significativamente le tue possibilità di successo.",
    category: "platform"
  }
];

const HelpCenter: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  
  const filteredFAQs = searchQuery
    ? FAQS.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.questionItalian?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answerItalian?.toLowerCase().includes(searchQuery.toLowerCase())
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
              <BilingualText
                english="Clear"
                italian="Cancella"
                className="inline-flex"
              />
            </Button>
          )}
        </div>
      </div>

      <FAQSection
        title="Frequently Asked Questions"
        titleItalian="Domande Frequenti"
        description={searchQuery ? `Search results for "${searchQuery}"` : "Find answers to common questions about our platform and the Italian citizenship test."}
        descriptionItalian={searchQuery ? `Risultati della ricerca per "${searchQuery}"` : "Trova risposte alle domande comuni sulla nostra piattaforma e sull'esame di cittadinanza italiana."}
        categories={["exam", "platform", "subscription", "technical"]}
        items={filteredFAQs}
      />
      
      <div className="text-center">
        <BilingualText
          english="Can't find what you're looking for?"
          italian="Non riesci a trovare quello che stai cercando?"
          className="text-muted-foreground mb-4"
        />
        <Button asChild>
          <a href="#ticket">
            <BilingualText
              english="Contact Support"
              italian="Contatta il Supporto"
              className="inline-flex"
            />
          </a>
        </Button>
      </div>
    </div>
  );
};

export default HelpCenter;
