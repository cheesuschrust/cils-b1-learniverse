
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import BilingualText from '@/components/language/BilingualText';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { useToast } from '@/hooks/use-toast';

// Mock data for user growth
const userGrowthData = [
  { month: 'Jan', users: 120 },
  { month: 'Feb', users: 145 },
  { month: 'Mar', users: 190 },
  { month: 'Apr', users: 210 },
  { month: 'May', users: 250 },
  { month: 'Jun', users: 320 },
  { month: 'Jul', users: 380 },
  { month: 'Aug', users: 450 },
  { month: 'Sep', users: 520 },
  { month: 'Oct', users: 590 },
  { month: 'Nov', users: 650 },
  { month: 'Dec', users: 720 },
];

// Mock data for content usage
const contentUsageData = [
  { name: 'Vocabulary', value: 40 },
  { name: 'Grammar', value: 30 },
  { name: 'Reading', value: 15 },
  { name: 'Listening', value: 10 },
  { name: 'Speaking', value: 5 },
];

// Mock data for subscription revenue
const revenueData = [
  { month: 'Jan', revenue: 5000 },
  { month: 'Feb', revenue: 6200 },
  { month: 'Mar', revenue: 7800 },
  { month: 'Apr', revenue: 8500 },
  { month: 'May', revenue: 9200 },
  { month: 'Jun', revenue: 10500 },
  { month: 'Jul', revenue: 11200 },
  { month: 'Aug', revenue: 12000 },
  { month: 'Sep', revenue: 13500 },
  { month: 'Oct', revenue: 14800 },
  { month: 'Nov', revenue: 15700 },
  { month: 'Dec', revenue: 16900 },
];

// Mock data for AI usage
const aiUsageData = [
  { feature: 'Translation', usage: 450 },
  { feature: 'Content Generation', usage: 380 },
  { feature: 'Voice Synthesis', usage: 320 },
  { feature: 'Grammar Correction', usage: 280 },
  { feature: 'Speech Recognition', usage: 210 },
];

// Colors for pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AdminAnalytics: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleExportData = () => {
    toast({
      title: language === 'italian' ? 'Dati esportati' : 'Data exported',
      description: language === 'italian' 
        ? 'I dati sono stati esportati con successo' 
        : 'The data has been successfully exported',
    });
  };
  
  return (
    <>
      <Helmet>
        <title>
          {language === 'italian' ? 'Analytics - Dashboard Admin' : 'Analytics - Admin Dashboard'}
        </title>
      </Helmet>
      
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            <BilingualText
              english="Admin Analytics Dashboard"
              italian="Dashboard Analitica Admin"
            />
          </h1>
          
          <button
            onClick={handleExportData}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
          >
            <BilingualText
              english="Export Data"
              italian="Esporta Dati"
            />
          </button>
        </div>
        
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
                {isLoading ? (
                  <div className="h-[300px] bg-muted/40 rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">
                      <BilingualText
                        english="Loading chart data..."
                        italian="Caricamento dati del grafico..."
                      />
                    </p>
                  </div>
                ) : (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={userGrowthData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="users" 
                          stroke="#8884d8" 
                          activeDot={{ r: 8 }} 
                          name={language === 'italian' ? 'Utenti' : 'Users'}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
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
                {isLoading ? (
                  <div className="h-[300px] bg-muted/40 rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">
                      <BilingualText
                        english="Loading chart data..."
                        italian="Caricamento dati del grafico..."
                      />
                    </p>
                  </div>
                ) : (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={contentUsageData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {contentUsageData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
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
                {isLoading ? (
                  <div className="h-[300px] bg-muted/40 rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">
                      <BilingualText
                        english="Loading chart data..."
                        italian="Caricamento dati del grafico..."
                      />
                    </p>
                  </div>
                ) : (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={revenueData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => ['$' + value, language === 'italian' ? 'Entrate' : 'Revenue']} />
                        <Legend />
                        <Bar 
                          dataKey="revenue" 
                          fill="#82ca9d" 
                          name={language === 'italian' ? 'Entrate ($)' : 'Revenue ($)'}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
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
                {isLoading ? (
                  <div className="h-[300px] bg-muted/40 rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">
                      <BilingualText
                        english="Loading chart data..."
                        italian="Caricamento dati del grafico..."
                      />
                    </p>
                  </div>
                ) : (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={aiUsageData}
                        margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="feature" />
                        <Tooltip />
                        <Legend />
                        <Bar 
                          dataKey="usage" 
                          fill="#8884d8" 
                          name={language === 'italian' ? 'Utilizzo' : 'Usage'}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default AdminAnalytics;
