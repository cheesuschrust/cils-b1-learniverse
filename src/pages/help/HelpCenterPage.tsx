
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, FileText, HelpCircle, MessageSquare, ThumbsUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import BilingualText from '@/components/language/BilingualText';

const HelpCenterPage: React.FC = () => {
  const { language } = useLanguage();
  
  const helpCategories = [
    {
      title: 'User Guide',
      titleItalian: 'Guida Utente',
      description: 'Get started with our comprehensive user guide',
      descriptionItalian: 'Inizia con la nostra guida utente completa',
      icon: <BookOpen className="h-8 w-8" />,
      link: '/help/user-guide',
      color: 'bg-blue-50 dark:bg-blue-900',
      textColor: 'text-blue-500 dark:text-blue-300',
    },
    {
      title: 'FAQ',
      titleItalian: 'Domande Frequenti',
      description: 'Find answers to commonly asked questions',
      descriptionItalian: 'Trova risposte alle domande più frequenti',
      icon: <HelpCircle className="h-8 w-8" />,
      link: '/help/faq',
      color: 'bg-purple-50 dark:bg-purple-900',
      textColor: 'text-purple-500 dark:text-purple-300',
    },
    {
      title: 'Tutorials',
      titleItalian: 'Tutorial',
      description: 'Step-by-step guides for specific features',
      descriptionItalian: 'Guide passo-passo per funzionalità specifiche',
      icon: <FileText className="h-8 w-8" />,
      link: '/help/tutorials',
      color: 'bg-green-50 dark:bg-green-900',
      textColor: 'text-green-500 dark:text-green-300',
    },
    {
      title: 'Contact Support',
      titleItalian: 'Contatta il Supporto',
      description: 'Get in touch with our support team',
      descriptionItalian: 'Mettiti in contatto con il nostro team di supporto',
      icon: <MessageSquare className="h-8 w-8" />,
      link: '/support',
      color: 'bg-amber-50 dark:bg-amber-900',
      textColor: 'text-amber-500 dark:text-amber-300',
    }
  ];
  
  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-4">
          <BilingualText
            english="Help Center"
            italian="Centro Assistenza"
          />
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          <BilingualText
            english="Find answers, learn how to use our platform, and get support when you need it."
            italian="Trova risposte, impara a utilizzare la nostra piattaforma e ricevi assistenza quando ne hai bisogno."
          />
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {helpCategories.map((category, index) => (
          <Link to={category.link} key={index}>
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader>
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${category.color}`}>
                  <div className={category.textColor}>{category.icon}</div>
                </div>
                <CardTitle>
                  {language === 'italian' ? category.titleItalian : category.title}
                </CardTitle>
                <CardDescription>
                  {language === 'italian' ? category.descriptionItalian : category.description}
                </CardDescription>
              </CardHeader>
              <CardFooter className="pt-0">
                <Button variant="outline" className="w-full" asChild>
                  <span>
                    <BilingualText
                      english="View"
                      italian="Visualizza"
                    />
                    <span className="sr-only">
                      {language === 'italian' ? category.titleItalian : category.title}
                    </span>
                  </span>
                </Button>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
      
      <div className="bg-muted rounded-lg p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">
          <BilingualText
            english="Didn't find what you were looking for?"
            italian="Non hai trovato quello che cercavi?"
          />
        </h2>
        <p className="text-muted-foreground mb-4">
          <BilingualText
            english="Our support team is ready to help you with any questions or issues."
            italian="Il nostro team di supporto è pronto ad aiutarti con qualsiasi domanda o problema."
          />
        </p>
        <div className="flex justify-center">
          <Button asChild>
            <Link to="/support">
              <MessageSquare className="h-4 w-4 mr-2" />
              <BilingualText
                english="Contact Support"
                italian="Contatta il Supporto"
              />
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="mt-10 p-6 border rounded-lg bg-background">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <ThumbsUp className="h-6 w-6 text-primary mr-3" />
            <h3 className="text-lg font-medium">
              <BilingualText
                english="Was this help center useful?"
                italian="Questo centro assistenza ti è stato utile?"
              />
            </h3>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <BilingualText
                english="Yes"
                italian="Sì"
              />
            </Button>
            <Button variant="outline" size="sm">
              <BilingualText
                english="No"
                italian="No"
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage;
