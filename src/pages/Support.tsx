
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HelpCircle, MessageSquare, Mail, FileText, Phone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import BilingualText from '@/components/language/BilingualText';

const Support: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  
  return (
    <>
      <Helmet>
        <title>
          {language === 'italian' ? 'Supporto - Apprendimento Italiano' : 'Support - Italian Learning'}
        </title>
      </Helmet>
      
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-4">
            <BilingualText
              english="Support"
              italian="Supporto"
            />
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            <BilingualText
              english="Have questions or need assistance? Our support team is here to help you with any issues or questions you may have."
              italian="Hai domande o hai bisogno di assistenza? Il nostro team di supporto è qui per aiutarti con qualsiasi problema o domanda tu possa avere."
            />
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <Card>
            <CardHeader>
              <div className="bg-primary/10 p-4 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>
                <BilingualText
                  english="Live Chat"
                  italian="Chat dal Vivo"
                />
              </CardTitle>
              <CardDescription>
                <BilingualText
                  english="Chat with our support team in real-time"
                  italian="Chatta in tempo reale con il nostro team di supporto"
                />
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button className="w-full">
                <BilingualText
                  english="Start Chat"
                  italian="Inizia Chat"
                />
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="bg-primary/10 p-4 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>
                <BilingualText
                  english="Email Support"
                  italian="Supporto Email"
                />
              </CardTitle>
              <CardDescription>
                <BilingualText
                  english="Send an email and get a response within 24 hours"
                  italian="Invia un'email e ricevi una risposta entro 24 ore"
                />
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button className="w-full" variant="outline" asChild>
                <a href="mailto:support@italianlearning.com">
                  <BilingualText
                    english="Email Us"
                    italian="Scrivici"
                  />
                </a>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="bg-primary/10 p-4 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <HelpCircle className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>
                <BilingualText
                  english="Help Center"
                  italian="Centro Assistenza"
                />
              </CardTitle>
              <CardDescription>
                <BilingualText
                  english="Browse our knowledge base and FAQs"
                  italian="Sfoglia la nostra knowledge base e le FAQ"
                />
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button className="w-full" variant="outline" onClick={() => navigate('/help')}>
                <BilingualText
                  english="Visit Help Center"
                  italian="Visita Centro Assistenza"
                />
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <Card className="mb-10">
          <CardHeader>
            <CardTitle>
              <BilingualText
                english="Submit a Support Ticket"
                italian="Invia un Ticket di Supporto"
              />
            </CardTitle>
            <CardDescription>
              <BilingualText
                english="Need more specific help? Submit a support ticket and our team will get back to you as soon as possible."
                italian="Hai bisogno di aiuto più specifico? Invia un ticket di supporto e il nostro team ti risponderà il prima possibile."
              />
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full md:w-auto" onClick={() => navigate('/support-center')}>
              <FileText className="h-4 w-4 mr-2" />
              <BilingualText
                english="Submit Ticket"
                italian="Invia Ticket"
              />
            </Button>
          </CardFooter>
        </Card>
        
        <div className="bg-muted rounded-lg p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">
                <BilingualText
                  english="Need Immediate Assistance?"
                  italian="Hai Bisogno di Assistenza Immediata?"
                />
              </h2>
              <p className="text-muted-foreground">
                <BilingualText
                  english="Call our dedicated support line for urgent matters."
                  italian="Chiama la nostra linea di supporto dedicata per questioni urgenti."
                />
              </p>
            </div>
            <div className="flex items-center">
              <Phone className="h-6 w-6 mr-2 text-primary" />
              <span className="text-lg font-medium">+1 (800) 123-4567</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Support;
