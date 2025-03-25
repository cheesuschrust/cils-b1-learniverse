
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

const SupportCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState('help');
  
  return (
    <>
      <Helmet>
        <title>Support Center - Italian Learning</title>
      </Helmet>
      
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Support Center</h1>
            <p className="text-muted-foreground">
              Find answers, documentation, and get help with any issues
            </p>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-8">
            <TabsTrigger value="help" className="flex-1 py-3">
              <LifeBuoy className="h-4 w-4 mr-2" />
              Help Center
            </TabsTrigger>
            <TabsTrigger value="docs" className="flex-1 py-3">
              <BookOpen className="h-4 w-4 mr-2" />
              Documentation
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex-1 py-3">
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat Support
            </TabsTrigger>
            <TabsTrigger value="ticket" className="flex-1 py-3">
              <Send className="h-4 w-4 mr-2" />
              Submit Ticket
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex-1 py-3">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
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
