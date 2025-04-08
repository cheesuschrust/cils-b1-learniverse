
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import BilingualTitle from '@/components/language/BilingualTitle';
import BilingualText from '@/components/language/BilingualText';
import { useBilingualTitle } from '@/hooks/useBilingualTitle';
import { SpeakableWord } from '@/components/ui/speakable-word';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Headphones, MessageSquare, BookOpen } from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  
  // Set the page title
  useBilingualTitle(
    'Italian Learning for CILS Citizenship Test', 
    'Apprendimento Italiano per l\'Esame di Cittadinanza CILS'
  );
  
  const features = [
    {
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      titleEnglish: "Reading Practice",
      titleItalian: "Pratica di Lettura",
      descriptionEnglish: "Practice reading comprehension with authentic texts",
      descriptionItalian: "Esercita la comprensione della lettura con testi autentici"
    },
    {
      icon: <Headphones className="h-8 w-8 text-primary" />,
      titleEnglish: "Listening Practice",
      titleItalian: "Pratica di Ascolto",
      descriptionEnglish: "Improve your listening skills with native speakers",
      descriptionItalian: "Migliora le tue capacità di ascolto con madrelingua"
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-primary" />,
      titleEnglish: "Speaking Practice",
      titleItalian: "Pratica di Conversazione",
      descriptionEnglish: "Practice speaking with AI-powered conversation partners",
      descriptionItalian: "Esercitati a parlare con partner di conversazione basati su AI"
    }
  ];
  
  const benefits = [
    {
      english: "Tailored specifically for the CILS citizenship test requirements",
      italian: "Creato specificamente per i requisiti del test di cittadinanza CILS"
    },
    {
      english: "Learn at your own pace with personalized learning paths",
      italian: "Impara al tuo ritmo con percorsi di apprendimento personalizzati"
    },
    {
      english: "Track your progress and identify areas for improvement",
      italian: "Monitora i tuoi progressi e identifica aree di miglioramento"
    },
    {
      english: "Practice with real exam-style questions and scenarios",
      italian: "Esercitati con domande e scenari in stile esame reale"
    }
  ];
  
  return (
    <div className="px-4 py-12 md:py-24">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto text-center">
        <div className="flex justify-center mb-8">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 bg-italian-green w-1/3 h-full"></div>
            <div className="absolute inset-0 left-1/3 bg-italian-white w-1/3 h-full"></div>
            <div className="absolute inset-0 left-2/3 bg-italian-red w-1/3 h-full"></div>
          </div>
        </div>
        
        <BilingualTitle
          english="Master Italian for Your Citizenship Journey"
          italian="Padroneggia l'Italiano per il Tuo Percorso di Cittadinanza"
          as="h1"
          className="text-4xl md:text-6xl mb-4"
          showSpeak
        />
        
        <div className="max-w-3xl mx-auto mb-8">
          <BilingualText
            english="Prepare effectively for the CILS B1 Citizenship Test with our specialized platform. Build your Italian language skills through interactive exercises tailored to the exam requirements."
            italian="Preparati efficacemente per l'Esame di Cittadinanza CILS B1 con la nostra piattaforma specializzata. Costruisci le tue competenze linguistiche italiane attraverso esercizi interattivi adattati ai requisiti dell'esame."
            className="text-xl text-muted-foreground"
          />
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <Button size="lg" onClick={() => navigate('/signup')}>
            {language === 'english' ? 'Get Started' : 
             language === 'italian' ? 'Inizia Ora' : 
             'Get Started / Inizia Ora'}
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/about')}>
            {language === 'english' ? 'Learn More' : 
             language === 'italian' ? 'Scopri di Più' : 
             'Learn More / Scopri di Più'}
          </Button>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="max-w-7xl mx-auto py-16">
        <BilingualTitle
          english="Complete Learning Experience"
          italian="Esperienza di Apprendimento Completa"
          as="h2"
          className="text-3xl md:text-4xl text-center mb-12"
        />
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {language === 'english' ? feature.titleEnglish : 
                   language === 'italian' ? feature.titleItalian : 
                   `${feature.titleEnglish} / ${feature.titleItalian}`}
                </h3>
                <p className="text-muted-foreground">
                  {language === 'english' ? feature.descriptionEnglish : 
                   language === 'italian' ? feature.descriptionItalian : 
                   feature.descriptionEnglish}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto py-16 bg-muted/30 rounded-lg p-8">
        <BilingualTitle
          english="Why Choose Our Platform"
          italian="Perché Scegliere la Nostra Piattaforma"
          as="h2"
          className="text-3xl md:text-4xl text-center mb-12"
        />
        
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="mt-1 bg-primary rounded-full p-1 text-primary-foreground">
                <Check className="h-4 w-4" />
              </div>
              <div>
                <BilingualText
                  english={benefit.english}
                  italian={benefit.italian}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="max-w-4xl mx-auto py-16 text-center">
        <BilingualTitle
          english="Ready to Start Your Journey?"
          italian="Pronto a Iniziare il Tuo Percorso?"
          as="h2"
          className="text-3xl md:text-4xl mb-6"
        />
        
        <BilingualText
          english="Join thousands of successful students who have achieved their citizenship goals with our platform."
          italian="Unisciti a migliaia di studenti di successo che hanno raggiunto i loro obiettivi di cittadinanza con la nostra piattaforma."
          className="text-xl text-muted-foreground mb-8"
        />
        
        <Button size="lg" onClick={() => navigate('/signup')}>
          {language === 'english' ? 'Start Free Trial' : 
           language === 'italian' ? 'Inizia Prova Gratuita' : 
           'Start Free Trial / Inizia Prova Gratuita'}
        </Button>
      </section>
    </div>
  );
};

export default HomePage;
