
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import HelpCenter from '@/components/help/HelpCenter';
import UserDocumentation from '@/components/help/UserDocumentation';
import SupportChat from '@/components/help/SupportChat';
import SupportForm from '@/components/help/SupportForm';
import GlobalNotificationCenter from '@/components/notifications/GlobalNotificationCenter';
import { LifeBuoy, BookOpen, MessageSquare, Send, Bell } from 'lucide-react';
import BilingualText from '@/components/language/BilingualText';
import { useLanguage } from '@/contexts/LanguageContext';

const SupportCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState('help');
  const { language } = useLanguage();
  
  const getTitle = () => {
    switch (language) {
      case 'italian': return 'Centro di Supporto - Apprendimento Italiano';
      case 'english': return 'Support Center - Italian Learning';
      case 'both': return 'Support Center / Centro di Supporto';
      default: return 'Support Center';
    }
  };
  
  return (
    <>
      <Helmet>
        <title>{getTitle()}</title>
      </Helmet>
      
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              {language === 'italian' ? 'Centro di Supporto' : 'Support Center'}
            </h1>
            <BilingualText
              english="Find answers, documentation, and get help with any issues"
              italian="Trova risposte, documentazione e ricevi aiuto per qualsiasi problema"
              className="text-muted-foreground"
            />
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-8">
            <TabsTrigger value="help" className="flex-1 py-3">
              <LifeBuoy className="h-4 w-4 mr-2" />
              <BilingualText
                english="Help Center"
                italian="Centro Aiuto"
                className="inline-flex"
              />
            </TabsTrigger>
            <TabsTrigger value="docs" className="flex-1 py-3">
              <BookOpen className="h-4 w-4 mr-2" />
              <BilingualText
                english="Documentation"
                italian="Documentazione"
                className="inline-flex"
              />
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex-1 py-3">
              <MessageSquare className="h-4 w-4 mr-2" />
              <BilingualText
                english="Chat Support"
                italian="Supporto Chat"
                className="inline-flex"
              />
            </TabsTrigger>
            <TabsTrigger value="ticket" className="flex-1 py-3">
              <Send className="h-4 w-4 mr-2" />
              <BilingualText
                english="Submit Ticket"
                italian="Invia Ticket"
                className="inline-flex"
              />
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex-1 py-3">
              <Bell className="h-4 w-4 mr-2" />
              <BilingualText
                english="Notifications"
                italian="Notifiche"
                className="inline-flex"
              />
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="help">
            <HelpCenter />
          </TabsContent>
          
          <TabsContent value="docs">
            <UserDocumentation />
          </TabsContent>
          
          <TabsContent value="chat">
            <Card>
              <CardContent className="pt-6">
                <SupportChat />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ticket">
            <Card>
              <CardContent className="pt-6">
                <SupportForm />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <div className="max-w-2xl mx-auto">
              <GlobalNotificationCenter />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default SupportCenter;
