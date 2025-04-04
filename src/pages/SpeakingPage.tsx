
import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { SpeakingModule } from '@/components/speaking/SpeakingModule';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { AuthGuard } from '@/components/common/AuthGuard';

export default function SpeakingPage() {
  const { toast } = useToast();
  const { user, isPremium } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [userStats, setUserStats] = useState<any>(null);

  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      
      try {
        // Mock user stats loading
        setTimeout(() => {
          setUserStats({
            speaking_score: 65,
            practice_sessions: 12,
            last_practice: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
          });
          
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading user data:', error);
        toast({
          title: 'Error',
          description: 'Could not load your speaking data. Please try again later.',
          variant: 'destructive',
        });
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, [toast, user]);

  return (
    <AuthGuard>
      <Helmet>
        <title>Speaking Practice | ItalianMaster</title>
      </Helmet>
      
      <div className="container py-6 space-y-6 max-w-6xl">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Speaking Practice</h1>
          <p className="text-muted-foreground">
            Improve your Italian pronunciation and speaking skills with interactive exercises
          </p>
          
          {userStats && (
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="px-3 py-1">
                Speaking Level: {userStats.speaking_score ? Math.floor(userStats.speaking_score / 20) + 1 : 1}
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                Sessions: {userStats.practice_sessions}
              </Badge>
              {!isPremium() && (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800">
                  Free Account
                </Badge>
              )}
            </div>
          )}
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-[200px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs defaultValue="practice" className="space-y-4">
            <TabsList>
              <TabsTrigger value="practice">Practice</TabsTrigger>
              <TabsTrigger value="conversation">Conversation</TabsTrigger>
              <TabsTrigger value="pronunciation">Pronunciation Drills</TabsTrigger>
            </TabsList>
            
            <TabsContent value="practice">
              <SpeakingModule />
            </TabsContent>
            
            <TabsContent value="conversation">
              <Card>
                <CardHeader>
                  <CardTitle>Conversation Practice</CardTitle>
                  <CardDescription>
                    Practice real-life conversations in Italian with our AI conversation partner
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-8 rounded-lg text-center">
                    <h3 className="text-lg font-medium mb-2">Premium Feature</h3>
                    <p className="text-muted-foreground mb-4">
                      Upgrade to a premium account to access the AI conversation partner
                    </p>
                    <a href="/subscription" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                      Upgrade to Premium
                    </a>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="pronunciation">
              <Card>
                <CardHeader>
                  <CardTitle>Pronunciation Drills</CardTitle>
                  <CardDescription>
                    Focused exercises to improve your Italian accent and pronunciation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Double Consonants</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">Practice properly pronouncing double consonants in Italian</p>
                        <div className="mt-3 space-y-2">
                          <div className="bg-muted p-2 rounded">bella vs. bela</div>
                          <div className="bg-muted p-2 rounded">anno vs. ano</div>
                          <div className="bg-muted p-2 rounded">fatto vs. fato</div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Rolled R Sound</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">Learn to properly roll your Rs in Italian words</p>
                        <div className="mt-3 space-y-2">
                          <div className="bg-muted p-2 rounded">Roma</div>
                          <div className="bg-muted p-2 rounded">carro</div>
                          <div className="bg-muted p-2 rounded">terra</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </AuthGuard>
  );
}
