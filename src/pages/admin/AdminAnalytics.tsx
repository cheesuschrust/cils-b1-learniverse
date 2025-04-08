
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import BilingualText from '@/components/language/BilingualText';

const AdminAnalytics: React.FC = () => {
  const { language } = useLanguage();
  
  return (
    <>
      <Helmet>
        <title>
          {language === 'italian' ? 'Analytics - Dashboard Admin' : 'Analytics - Admin Dashboard'}
        </title>
      </Helmet>
      
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">
          <BilingualText
            english="Admin Analytics Dashboard"
            italian="Dashboard Analitica Admin"
          />
        </h1>
        
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">
              <BilingualText
                english="User Analytics"
                italian="Analisi Utenti"
              />
            </TabsTrigger>
            <TabsTrigger value="content">
              <BilingualText
                english="Content Analytics"
                italian="Analisi Contenuti"
              />
            </TabsTrigger>
            <TabsTrigger value="subscription">
              <BilingualText
                english="Subscription Analytics"
                italian="Analisi Abbonamenti"
              />
            </TabsTrigger>
            <TabsTrigger value="ai">
              <BilingualText
                english="AI Usage Analytics"
                italian="Analisi Utilizzo IA"
              />
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  <BilingualText
                    english="User Growth"
                    italian="Crescita Utenti"
                  />
                </CardTitle>
                <CardDescription>
                  <BilingualText
                    english="Monthly user registration trends"
                    italian="Tendenze mensili di registrazione utenti"
                  />
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] bg-muted/40 rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">
                    <BilingualText
                      english="User growth chart will be displayed here"
                      italian="Il grafico di crescita degli utenti sarà visualizzato qui"
                    />
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  <BilingualText
                    english="Content Usage"
                    italian="Utilizzo Contenuti"
                  />
                </CardTitle>
                <CardDescription>
                  <BilingualText
                    english="Most accessed learning materials"
                    italian="Materiali didattici più consultati"
                  />
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] bg-muted/40 rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">
                    <BilingualText
                      english="Content usage chart will be displayed here"
                      italian="Il grafico di utilizzo dei contenuti sarà visualizzato qui"
                    />
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="subscription" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  <BilingualText
                    english="Subscription Revenue"
                    italian="Entrate da Abbonamenti"
                  />
                </CardTitle>
                <CardDescription>
                  <BilingualText
                    english="Monthly revenue trends"
                    italian="Tendenze mensili delle entrate"
                  />
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] bg-muted/40 rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">
                    <BilingualText
                      english="Revenue chart will be displayed here"
                      italian="Il grafico delle entrate sarà visualizzato qui"
                    />
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ai" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  <BilingualText
                    english="AI Feature Usage"
                    italian="Utilizzo Funzionalità IA"
                  />
                </CardTitle>
                <CardDescription>
                  <BilingualText
                    english="Usage statistics for AI-powered features"
                    italian="Statistiche di utilizzo per funzionalità basate su IA"
                  />
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] bg-muted/40 rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">
                    <BilingualText
                      english="AI usage chart will be displayed here"
                      italian="Il grafico di utilizzo dell'IA sarà visualizzato qui"
                    />
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default AdminAnalytics;
