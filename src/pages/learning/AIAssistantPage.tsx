
import React from 'react';
import AIAssistant from '@/components/ai/AIAssistant';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AIAssistantPage: React.FC = () => {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Italian AI Assistant</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AIAssistant 
            initialContext="Italian citizenship exam preparation"
            assistantName="Lucia"
            showTranslation={true}
          />
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Practice Topics</CardTitle>
              <CardDescription>Suggested topics to practice with your AI assistant</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="beginner">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="beginner">Beginner</TabsTrigger>
                  <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>
                <TabsContent value="beginner" className="space-y-2 mt-4">
                  <button className="w-full p-2 text-left hover:bg-muted rounded-md text-sm">
                    Come ti chiami? (What's your name?)
                  </button>
                  <button className="w-full p-2 text-left hover:bg-muted rounded-md text-sm">
                    Di dove sei? (Where are you from?)
                  </button>
                  <button className="w-full p-2 text-left hover:bg-muted rounded-md text-sm">
                    Quali lingue parli? (What languages do you speak?)
                  </button>
                  <button className="w-full p-2 text-left hover:bg-muted rounded-md text-sm">
                    Come si dice "thank you" in italiano? (How do you say "thank you" in Italian?)
                  </button>
                </TabsContent>
                <TabsContent value="intermediate" className="space-y-2 mt-4">
                  <button className="w-full p-2 text-left hover:bg-muted rounded-md text-sm">
                    Puoi parlarmi della cultura italiana? (Can you tell me about Italian culture?)
                  </button>
                  <button className="w-full p-2 text-left hover:bg-muted rounded-md text-sm">
                    Come posso migliorare il mio italiano? (How can I improve my Italian?)
                  </button>
                  <button className="w-full p-2 text-left hover:bg-muted rounded-md text-sm">
                    Quali sono i requisiti per la cittadinanza? (What are the requirements for citizenship?)
                  </button>
                </TabsContent>
                <TabsContent value="advanced" className="space-y-2 mt-4">
                  <button className="w-full p-2 text-left hover:bg-muted rounded-md text-sm">
                    Discussione sulla politica italiana contemporanea (Discussion on contemporary Italian politics)
                  </button>
                  <button className="w-full p-2 text-left hover:bg-muted rounded-md text-sm">
                    L'importanza dell'UE per l'Italia (The importance of the EU for Italy)
                  </button>
                  <button className="w-full p-2 text-left hover:bg-muted rounded-md text-sm">
                    L'economia italiana nel contesto globale (The Italian economy in the global context)
                  </button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>AI Assistant Tips</CardTitle>
              <CardDescription>How to get the most from your conversation</CardDescription>
            </CardHeader>
            <CardContent className="text-sm">
              <ul className="space-y-2">
                <li>• Ask the assistant to explain grammar points you're confused about</li>
                <li>• Request translations of specific phrases</li>
                <li>• Practice different scenarios like ordering at a restaurant or asking for directions</li>
                <li>• Try to respond in Italian as much as possible</li>
                <li>• Ask for corrections to improve your writing</li>
                <li>• Use the speech function to improve your pronunciation</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Citizenship Exam Topics</CardTitle>
              <CardDescription>Key topics to know for the citizenship test</CardDescription>
            </CardHeader>
            <CardContent className="text-sm">
              <ul className="space-y-1">
                <li>• Italian Constitution and Government</li>
                <li>• Rights and Duties of Citizens</li>
                <li>• Italian History and Geography</li>
                <li>• Italian Culture and Traditions</li>
                <li>• EU Integration and Role</li>
                <li>• Current Political System</li>
                <li>• National Symbols</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage;
