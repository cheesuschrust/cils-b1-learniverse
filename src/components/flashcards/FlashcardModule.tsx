
import React, { useState } from 'react';
import { useFlashcards } from '@/contexts/FlashcardsContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

const FlashcardModule = () => {
  const { user, isAuthenticated } = useAuth();
  const { 
    flashcards, 
    flashcardSets, 
    isLoading, 
    createFlashcardSet 
  } = useFlashcards();
  const [activeTab, setActiveTab] = useState('my-sets');

  if (!isAuthenticated) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Italian Flashcards</CardTitle>
          <CardDescription>
            Please log in to use flashcards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>You need to be logged in to use the flashcards feature.</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading flashcards...</p>
      </div>
    );
  }

  const handleCreateSet = () => {
    createFlashcardSet({
      name: 'New Flashcard Set',
      description: 'A collection of Italian flashcards',
      isPublic: false,
    });
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Italian Flashcards</h1>
      
      <Tabs defaultValue="my-sets" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="my-sets">My Sets</TabsTrigger>
          <TabsTrigger value="all-cards">All Cards</TabsTrigger>
          <TabsTrigger value="public-sets">Public Sets</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-sets" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">My Flashcard Sets</h2>
            <Button onClick={handleCreateSet}>Create New Set</Button>
          </div>
          
          {flashcardSets.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  You haven't created any flashcard sets yet. 
                  Create your first set to start learning Italian!
                </p>
              </CardContent>
              <CardFooter className="flex justify-center pb-6">
                <Button onClick={handleCreateSet}>Create My First Set</Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {flashcardSets.map(set => (
                <Card key={set.id} className="h-full flex flex-col">
                  <CardHeader>
                    <CardTitle>{set.name}</CardTitle>
                    <CardDescription>{set.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {set.cards?.length || 0} cards
                    </p>
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <Button variant="outline" className="w-full">View Set</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="all-cards">
          <h2 className="text-2xl font-semibold mb-6">All Flashcards</h2>
          
          {flashcards.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  You haven't created any flashcards yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {flashcards.map(card => (
                <Card key={card.id}>
                  <CardHeader>
                    <CardTitle>{card.front}</CardTitle>
                    <CardDescription>Tap to reveal</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {card.back}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="public-sets">
          <h2 className="text-2xl font-semibold mb-6">Public Flashcard Sets</h2>
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                Discover flashcard sets shared by other users.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FlashcardModule;
