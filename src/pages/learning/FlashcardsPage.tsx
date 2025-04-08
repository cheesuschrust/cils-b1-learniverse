
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import Flashcard from '@/components/learning/Flashcard';

const FlashcardsPage: React.FC = () => {
  const { user } = useAuth();
  
  // Mock flashcards (to be replaced with actual data from Supabase)
  const mockFlashcards = [
    { id: '1', front: 'Ciao', back: 'Hello' },
    { id: '2', front: 'Grazie', back: 'Thank you' },
    { id: '3', front: 'Piacere', back: 'Nice to meet you' },
    { id: '4', front: 'Arrivederci', back: 'Goodbye' },
    { id: '5', front: 'Buongiorno', back: 'Good morning' },
  ];
  
  const handleMarkCorrect = () => {
    console.log('Marked as correct');
  };
  
  const handleMarkIncorrect = () => {
    console.log('Marked as incorrect');
  };
  
  return (
    <>
      <Helmet>
        <title>Flashcards | CILS Italian Exam Prep</title>
      </Helmet>
      
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Flashcards</h1>
            <p className="text-muted-foreground">Practice your Italian vocabulary with flashcards</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline">Create Set</Button>
            <Button>Add Card</Button>
          </div>
        </div>
        
        <Tabs defaultValue="practice" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-2 mb-8">
            <TabsTrigger value="practice">Practice</TabsTrigger>
            <TabsTrigger value="browse">Browse Sets</TabsTrigger>
          </TabsList>
          
          <TabsContent value="practice" className="space-y-8">
            <div className="flex flex-col items-center space-y-8">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-medium mb-2">Today's Flashcards</h2>
                <p className="text-muted-foreground">
                  {user 
                    ? 'Study these cards to improve your Italian vocabulary' 
                    : 'Sign in to track your progress and save difficult cards'}
                </p>
              </div>
              
              {mockFlashcards.map((card, index) => (
                <div key={card.id} className="w-full max-w-md">
                  <Flashcard
                    front={card.front}
                    back={card.back}
                    onMarkCorrect={handleMarkCorrect}
                    onMarkIncorrect={handleMarkIncorrect}
                  />
                </div>
              ))}
              
              {!user && (
                <div className="bg-muted p-4 rounded-lg text-center max-w-md w-full mt-8">
                  <p className="mb-4">Create an account to track your progress and create custom flashcard sets</p>
                  <Button variant="default">Sign Up</Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="browse" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Mock flashcard sets to be replaced with data from Supabase */}
              {[1, 2, 3, 4, 5, 6].map((set) => (
                <div key={set} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-medium mb-2">Basic Italian Phrases {set}</h3>
                  <p className="text-muted-foreground mb-4">Set of essential Italian phrases for beginners</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">20 cards</span>
                    <Button variant="outline" size="sm">Study</Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default FlashcardsPage;
