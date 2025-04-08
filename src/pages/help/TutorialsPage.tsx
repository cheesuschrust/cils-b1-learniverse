
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HelpNavigation from '@/components/help/HelpNavigation';
import { FileText, BookOpen, Video, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import BilingualText from '@/components/language/BilingualText';
import { Button } from '@/components/ui/button';

const TutorialsPage: React.FC = () => {
  const { language } = useLanguage();
  
  const beginnerTutorials = [
    {
      id: 'begin-1',
      title: 'Getting Started with Italian',
      titleItalian: 'Iniziare con l\'italiano',
      description: 'Learn the basics of Italian pronunciation and greetings',
      descriptionItalian: 'Impara le basi della pronuncia italiana e dei saluti',
      type: 'text',
      duration: '10 min',
      icon: <FileText className="h-5 w-5" />,
      link: '/tutorials/getting-started'
    },
    {
      id: 'begin-2',
      title: 'Understanding Italian Articles',
      titleItalian: 'Capire gli articoli italiani',
      description: 'Master the use of definite and indefinite articles',
      descriptionItalian: 'Padroneggia l\'uso degli articoli determinativi e indeterminativi',
      type: 'video',
      duration: '8 min',
      icon: <Video className="h-5 w-5" />,
      link: '/tutorials/italian-articles'
    }
  ];
  
  const intermediateTutorials = [
    {
      id: 'inter-1',
      title: 'Past Tense in Italian',
      titleItalian: 'Il passato in italiano',
      description: 'Learn when to use passato prossimo vs imperfetto',
      descriptionItalian: 'Impara quando usare il passato prossimo e l\'imperfetto',
      type: 'text',
      duration: '15 min',
      icon: <FileText className="h-5 w-5" />,
      link: '/tutorials/past-tense'
    },
    {
      id: 'inter-2',
      title: 'Conversational Practice Guide',
      titleItalian: 'Guida alla pratica conversazionale',
      description: 'Techniques to improve your speaking fluency',
      descriptionItalian: 'Tecniche per migliorare la tua fluidità nel parlare',
      type: 'interactive',
      duration: '20 min',
      icon: <BookOpen className="h-5 w-5" />,
      link: '/tutorials/conversation-practice'
    }
  ];
  
  const advancedTutorials = [
    {
      id: 'adv-1',
      title: 'Subjunctive Mood Mastery',
      titleItalian: 'Padronanza del congiuntivo',
      description: 'Deep dive into the Italian subjunctive mood',
      descriptionItalian: 'Immersione profonda nel congiuntivo italiano',
      type: 'text',
      duration: '25 min',
      icon: <FileText className="h-5 w-5" />,
      link: '/tutorials/subjunctive'
    },
    {
      id: 'adv-2',
      title: 'Regional Expressions & Dialects',
      titleItalian: 'Espressioni regionali e dialetti',
      description: 'Understanding regional variations in Italian',
      descriptionItalian: 'Comprendere le variazioni regionali dell\'italiano',
      type: 'video',
      duration: '30 min',
      icon: <Video className="h-5 w-5" />,
      link: '/tutorials/dialects'
    }
  ];
  
  const TutorialCard = ({ tutorial }: { tutorial: typeof beginnerTutorials[0] }) => (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="bg-primary/10 p-2 rounded-full">
            {tutorial.icon}
          </div>
          <div className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {tutorial.duration}
          </div>
        </div>
        <CardTitle className="mt-2">
          {language === 'italian' ? tutorial.titleItalian : tutorial.title}
        </CardTitle>
        <CardDescription>
          {language === 'italian' ? tutorial.descriptionItalian : tutorial.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" className="w-full" asChild>
          <a href={tutorial.link} className="flex items-center justify-center">
            <BilingualText
              english="Start Tutorial"
              italian="Inizia Tutorial"
            />
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
  
  return (
    <>
      <Helmet>
        <title>
          {language === 'italian' ? 'Tutorial - Apprendimento Italiano' : 'Tutorials - Italian Learning'}
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
                  english="Tutorials"
                  italian="Tutorial"
                />
              </h1>
              <p className="text-muted-foreground">
                <BilingualText
                  english="Step-by-step guides to help you learn Italian effectively."
                  italian="Guide passo-passo per aiutarti a imparare l'italiano in modo efficace."
                />
              </p>
            </div>
            
            <Tabs defaultValue="beginner" className="mb-6">
              <TabsList className="mb-4">
                <TabsTrigger value="beginner">
                  <BilingualText
                    english="Beginner"
                    italian="Principiante"
                  />
                </TabsTrigger>
                <TabsTrigger value="intermediate">
                  <BilingualText
                    english="Intermediate"
                    italian="Intermedio"
                  />
                </TabsTrigger>
                <TabsTrigger value="advanced">
                  <BilingualText
                    english="Advanced"
                    italian="Avanzato"
                  />
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="beginner">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {beginnerTutorials.map(tutorial => (
                    <TutorialCard key={tutorial.id} tutorial={tutorial} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="intermediate">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {intermediateTutorials.map(tutorial => (
                    <TutorialCard key={tutorial.id} tutorial={tutorial} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="advanced">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {advancedTutorials.map(tutorial => (
                    <TutorialCard key={tutorial.id} tutorial={tutorial} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
            
            <Card className="bg-muted">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      <BilingualText
                        english="Can't find what you're looking for?"
                        italian="Non trovi quello che cerchi?"
                      />
                    </h3>
                    <p className="text-muted-foreground">
                      <BilingualText
                        english="Ask our community or submit a request for new tutorials."
                        italian="Chiedi alla nostra community o invia una richiesta per nuovi tutorial."
                      />
                    </p>
                  </div>
                  <Button asChild>
                    <a href="/support">
                      <BilingualText
                        english="Request a Tutorial"
                        italian="Richiedi un Tutorial"
                      />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default TutorialsPage;
