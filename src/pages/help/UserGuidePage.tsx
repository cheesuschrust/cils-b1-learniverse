
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HelpNavigation from '@/components/help/HelpNavigation';
import { BookOpen, Settings, Users, CheckSquare, GraduationCap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import BilingualText from '@/components/language/BilingualText';

const UserGuidePage: React.FC = () => {
  const { language } = useLanguage();
  
  return (
    <>
      <Helmet>
        <title>
          {language === 'italian' ? 'Guida Utente - Apprendimento Italiano' : 'User Guide - Italian Learning'}
        </title>
      </Helmet>
      
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <h2 className="text-xl font-bold mb-4">
                <BilingualText
                  english="Help Center"
                  italian="Centro Assistenza"
                />
              </h2>
              <HelpNavigation />
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">
                <BilingualText
                  english="User Guide"
                  italian="Guida Utente"
                />
              </h1>
              <p className="text-muted-foreground">
                <BilingualText
                  english="Comprehensive guide to help you navigate and use our platform effectively"
                  italian="Guida completa per aiutarti a navigare e utilizzare la nostra piattaforma in modo efficace"
                />
              </p>
            </div>
            
            <Tabs defaultValue="getting-started" className="mb-6">
              <TabsList className="mb-4">
                <TabsTrigger value="getting-started">
                  <BilingualText
                    english="Getting Started"
                    italian="Iniziare"
                  />
                </TabsTrigger>
                <TabsTrigger value="account">
                  <BilingualText
                    english="Account"
                    italian="Account"
                  />
                </TabsTrigger>
                <TabsTrigger value="lessons">
                  <BilingualText
                    english="Lessons"
                    italian="Lezioni"
                  />
                </TabsTrigger>
                <TabsTrigger value="features">
                  <BilingualText
                    english="Features"
                    italian="Funzionalità"
                  />
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="getting-started">
                <Card>
                  <CardHeader>
                    <div className="flex items-center mb-2">
                      <BookOpen className="h-6 w-6 text-primary mr-2" />
                      <CardTitle>
                        <BilingualText
                          english="Getting Started with Italian Learning"
                          italian="Iniziare con l'Apprendimento dell'Italiano"
                        />
                      </CardTitle>
                    </div>
                    <CardDescription>
                      <BilingualText
                        english="Everything you need to know to begin your Italian learning journey"
                        italian="Tutto ciò che devi sapere per iniziare il tuo percorso di apprendimento dell'italiano"
                      />
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        <BilingualText
                          english="Welcome to Italian Learning"
                          italian="Benvenuto nell'Apprendimento dell'Italiano"
                        />
                      </h3>
                      <p className="mb-4">
                        <BilingualText
                          english="Our platform is designed to help you learn Italian efficiently through interactive exercises, personalized learning paths, and real-world conversation practice. This guide will help you get started and make the most of our features."
                          italian="La nostra piattaforma è progettata per aiutarti a imparare l'italiano in modo efficiente attraverso esercizi interattivi, percorsi di apprendimento personalizzati e pratica di conversazione nel mondo reale. Questa guida ti aiuterà a iniziare e sfruttare al meglio le nostre funzionalità."
                        />
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        <BilingualText
                          english="Step 1: Complete Your Profile"
                          italian="Passo 1: Completa il Tuo Profilo"
                        />
                      </h3>
                      <p className="mb-4">
                        <BilingualText
                          english="After signing up, complete your profile by specifying your current Italian level, learning goals, and interests. This information helps us tailor your learning experience."
                          italian="Dopo la registrazione, completa il tuo profilo specificando il tuo attuale livello di italiano, gli obiettivi di apprendimento e gli interessi. Queste informazioni ci aiutano a personalizzare la tua esperienza di apprendimento."
                        />
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        <BilingualText
                          english="Step 2: Take the Level Assessment"
                          italian="Passo 2: Fai il Test di Livello"
                        />
                      </h3>
                      <p className="mb-4">
                        <BilingualText
                          english="Our placement test will assess your current Italian proficiency and recommend the appropriate starting point. Don't worry if you're a complete beginner - we have content for all levels."
                          italian="Il nostro test di posizionamento valuterà la tua attuale competenza in italiano e consiglierà il punto di partenza appropriato. Non preoccuparti se sei un principiante assoluto - abbiamo contenuti per tutti i livelli."
                        />
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        <BilingualText
                          english="Step 3: Explore Learning Paths"
                          italian="Passo 3: Esplora i Percorsi di Apprendimento"
                        />
                      </h3>
                      <p className="mb-4">
                        <BilingualText
                          english="Based on your level, you'll be presented with recommended learning paths. Each path consists of structured lessons covering vocabulary, grammar, pronunciation, and cultural aspects."
                          italian="In base al tuo livello, ti verranno presentati percorsi di apprendimento consigliati. Ogni percorso consiste in lezioni strutturate che coprono vocabolario, grammatica, pronuncia e aspetti culturali."
                        />
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        <BilingualText
                          english="Step 4: Set a Study Schedule"
                          italian="Passo 4: Imposta un Programma di Studio"
                        />
                      </h3>
                      <p className="mb-4">
                        <BilingualText
                          english="Consistency is key in language learning. Use our scheduling tool to set up regular study times. You can also enable notifications to remind you when it's time to practice."
                          italian="La costanza è fondamentale nell'apprendimento delle lingue. Utilizza il nostro strumento di programmazione per impostare orari di studio regolari. Puoi anche abilitare le notifiche per ricordarti quando è il momento di esercitarti."
                        />
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="account">
                <Card>
                  <CardHeader>
                    <div className="flex items-center mb-2">
                      <Users className="h-6 w-6 text-primary mr-2" />
                      <CardTitle>
                        <BilingualText
                          english="Managing Your Account"
                          italian="Gestione del Tuo Account"
                        />
                      </CardTitle>
                    </div>
                    <CardDescription>
                      <BilingualText
                        english="Learn how to manage your account settings, subscription, and profile"
                        italian="Scopri come gestire le impostazioni del tuo account, l'abbonamento e il profilo"
                      />
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        <BilingualText
                          english="Account Settings"
                          italian="Impostazioni Account"
                        />
                      </h3>
                      <p>
                        <BilingualText
                          english="You can access your account settings by clicking on your profile picture in the top right corner and selecting 'Settings'. Here you can update your personal information, change your password, and manage email preferences."
                          italian="Puoi accedere alle impostazioni del tuo account cliccando sulla tua foto profilo nell'angolo in alto a destra e selezionando 'Impostazioni'. Qui puoi aggiornare le tue informazioni personali, cambiare la password e gestire le preferenze email."
                        />
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        <BilingualText
                          english="Subscription Management"
                          italian="Gestione Abbonamento"
                        />
                      </h3>
                      <p>
                        <BilingualText
                          english="Navigate to the 'Subscription' tab in your account settings to view your current plan, billing information, and payment history. You can upgrade, downgrade, or cancel your subscription from this section."
                          italian="Vai alla scheda 'Abbonamento' nelle impostazioni del tuo account per visualizzare il tuo piano attuale, le informazioni di fatturazione e la cronologia dei pagamenti. Puoi aggiornare, ridurre o annullare il tuo abbonamento da questa sezione."
                        />
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        <BilingualText
                          english="Profile Customization"
                          italian="Personalizzazione Profilo"
                        />
                      </h3>
                      <p>
                        <BilingualText
                          english="Your profile helps us personalize your learning experience. Keep it updated with your current proficiency level, learning goals, and interests. You can also upload a profile picture and customize your display name."
                          italian="Il tuo profilo ci aiuta a personalizzare la tua esperienza di apprendimento. Mantienilo aggiornato con il tuo attuale livello di competenza, obiettivi di apprendimento e interessi. Puoi anche caricare una foto profilo e personalizzare il tuo nome visualizzato."
                        />
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="lessons">
                <Card>
                  <CardHeader>
                    <div className="flex items-center mb-2">
                      <GraduationCap className="h-6 w-6 text-primary mr-2" />
                      <CardTitle>
                        <BilingualText
                          english="Lessons & Learning Path"
                          italian="Lezioni e Percorso di Apprendimento"
                        />
                      </CardTitle>
                    </div>
                    <CardDescription>
                      <BilingualText
                        english="Understanding how lessons work and how to progress through your learning path"
                        italian="Capire come funzionano le lezioni e come progredire nel tuo percorso di apprendimento"
                      />
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        <BilingualText
                          english="Lesson Structure"
                          italian="Struttura delle Lezioni"
                        />
                      </h3>
                      <p>
                        <BilingualText
                          english="Each lesson is designed to teach specific language skills through a combination of explanations, examples, and interactive exercises. Lessons typically include vocabulary building, grammar explanations, listening comprehension, speaking practice, and cultural notes."
                          italian="Ogni lezione è progettata per insegnare specifiche abilità linguistiche attraverso una combinazione di spiegazioni, esempi ed esercizi interattivi. Le lezioni includono tipicamente costruzione del vocabolario, spiegazioni grammaticali, comprensione dell'ascolto, pratica del parlato e note culturali."
                        />
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        <BilingualText
                          english="Learning Path Progression"
                          italian="Progressione del Percorso di Apprendimento"
                        />
                      </h3>
                      <p>
                        <BilingualText
                          english="Your learning path is organized into units, with each unit focusing on a particular theme or skill set. Complete all lessons in a unit to unlock the next one. Our spaced repetition system will automatically schedule review sessions to help you retain what you've learned."
                          italian="Il tuo percorso di apprendimento è organizzato in unità, con ogni unità focalizzata su un tema particolare o set di abilità. Completa tutte le lezioni in un'unità per sbloccare la successiva. Il nostro sistema di ripetizione spaziata programmerà automaticamente sessioni di revisione per aiutarti a ricordare ciò che hai imparato."
                        />
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        <BilingualText
                          english="Practice Exercises"
                          italian="Esercizi di Pratica"
                        />
                      </h3>
                      <p>
                        <BilingualText
                          english="In addition to structured lessons, you can access standalone practice exercises at any time. These include flashcards for vocabulary, listening exercises, reading comprehension, writing prompts, and speaking practice with our AI conversation partner."
                          italian="Oltre alle lezioni strutturate, puoi accedere a esercizi di pratica autonomi in qualsiasi momento. Questi includono flashcard per il vocabolario, esercizi di ascolto, comprensione della lettura, suggerimenti di scrittura e pratica di conversazione con il nostro partner di conversazione AI."
                        />
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="features">
                <Card>
                  <CardHeader>
                    <div className="flex items-center mb-2">
                      <Settings className="h-6 w-6 text-primary mr-2" />
                      <CardTitle>
                        <BilingualText
                          english="Platform Features"
                          italian="Funzionalità della Piattaforma"
                        />
                      </CardTitle>
                    </div>
                    <CardDescription>
                      <BilingualText
                        english="Explore the various features and tools available to enhance your learning experience"
                        italian="Esplora le varie funzionalità e strumenti disponibili per migliorare la tua esperienza di apprendimento"
                      />
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        <BilingualText
                          english="AI Conversation Partner"
                          italian="Partner di Conversazione AI"
                        />
                      </h3>
                      <p>
                        <BilingualText
                          english="Practice speaking Italian in a safe, judgment-free environment with our AI-powered conversation partner. The system adapts to your level, corrects your mistakes, and helps you improve your pronunciation and fluency."
                          italian="Pratica parlare italiano in un ambiente sicuro e senza giudizi con il nostro partner di conversazione basato su AI. Il sistema si adatta al tuo livello, corregge i tuoi errori e ti aiuta a migliorare la tua pronuncia e fluidità."
                        />
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        <BilingualText
                          english="Progress Tracking"
                          italian="Monitoraggio dei Progressi"
                        />
                      </h3>
                      <p>
                        <BilingualText
                          english="Monitor your learning journey with detailed progress tracking. View statistics on completed lessons, mastered vocabulary, pronunciation accuracy, and overall fluency. Set goals and track your improvement over time."
                          italian="Monitora il tuo percorso di apprendimento con un monitoraggio dettagliato dei progressi. Visualizza statistiche su lezioni completate, vocabolario padroneggiato, accuratezza della pronuncia e fluidità generale. Imposta obiettivi e monitora il tuo miglioramento nel tempo."
                        />
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        <BilingualText
                          english="Flashcard System"
                          italian="Sistema di Flashcard"
                        />
                      </h3>
                      <p>
                        <BilingualText
                          english="Our intelligent flashcard system uses spaced repetition to help you memorize vocabulary and phrases efficiently. Words you find difficult are shown more frequently, while those you know well appear less often."
                          italian="Il nostro sistema intelligente di flashcard utilizza la ripetizione spaziata per aiutarti a memorizzare vocaboli e frasi in modo efficiente. Le parole che trovi difficili vengono mostrate più frequentemente, mentre quelle che conosci bene appaiono meno spesso."
                        />
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        <BilingualText
                          english="Community Features"
                          italian="Funzionalità della Community"
                        />
                      </h3>
                      <p>
                        <BilingualText
                          english="Connect with fellow learners through our community forums. Share tips, ask questions, find language exchange partners, and participate in challenges and events to practice your Italian in a social context."
                          italian="Connettiti con altri studenti attraverso i nostri forum della community. Condividi suggerimenti, fai domande, trova partner per scambi linguistici e partecipa a sfide ed eventi per praticare il tuo italiano in un contesto sociale."
                        />
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <Card className="bg-muted">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      <BilingualText
                        english="Need More Help?"
                        italian="Hai Bisogno di Più Aiuto?"
                      />
                    </h3>
                    <p className="text-muted-foreground">
                      <BilingualText
                        english="If you couldn't find the information you were looking for, our support team is here to help."
                        italian="Se non hai trovato le informazioni che cercavi, il nostro team di supporto è qui per aiutarti."
                      />
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <a href="/help/faq">
                      <Button variant="outline">
                        <CheckSquare className="h-4 w-4 mr-2" />
                        <BilingualText
                          english="View FAQs"
                          italian="Vedi FAQ"
                        />
                      </Button>
                    </a>
                    <a href="/support">
                      <Button>
                        <BilingualText
                          english="Contact Support"
                          italian="Contatta il Supporto"
                        />
                      </Button>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserGuidePage;
