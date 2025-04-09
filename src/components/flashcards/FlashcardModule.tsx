
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import FlashcardComponent from './FlashcardComponent';
import { supabase } from '@/lib/supabase-client';
import { useToast } from '@/hooks/use-toast';

// Sample categories - in a full implementation, these would come from the database
const categories = [
  { id: 'vocabulary', name: 'Vocabulary', color: 'bg-blue-500' },
  { id: 'grammar', name: 'Grammar', color: 'bg-green-500' },
  { id: 'phrases', name: 'Common Phrases', color: 'bg-purple-500' },
  { id: 'verbs', name: 'Verb Conjugation', color: 'bg-orange-500' },
  { id: 'culture', name: 'Cultural Knowledge', color: 'bg-pink-500' },
];

// Sample flashcards - in a full implementation, these would come from the database
const sampleFlashcards = [
  {
    id: '1',
    category: 'vocabulary',
    italian: 'la casa',
    english: 'the house',
    examples: ['Abito in una casa grande.'],
    level: 1,
    mastered: false,
  },
  {
    id: '2',
    category: 'vocabulary',
    italian: 'il cane',
    english: 'the dog',
    examples: ['Ho un cane nero.'],
    level: 1,
    mastered: false,
  },
  {
    id: '3',
    category: 'grammar',
    italian: 'Io sono',
    english: 'I am',
    examples: ['Io sono italiano.'],
    level: 1,
    mastered: false,
  },
  {
    id: '4',
    category: 'phrases',
    italian: 'Come stai?',
    english: 'How are you?',
    examples: ['Ciao, come stai oggi?'],
    level: 1,
    mastered: false,
  },
  {
    id: '5',
    category: 'verbs',
    italian: 'parlare - io parlo',
    english: 'to speak - I speak',
    examples: ['Io parlo italiano.'],
    level: 1,
    mastered: false,
  },
];

const FlashcardModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState('vocabulary');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [userFlashcards, setUserFlashcards] = useState(sampleFlashcards);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Filter flashcards by active category
  const filteredCards = userFlashcards.filter(card => card.category === activeTab);
  const currentCard = filteredCards[currentCardIndex] || null;

  useEffect(() => {
    // Reset card index when changing tabs
    setCurrentCardIndex(0);
  }, [activeTab]);

  useEffect(() => {
    const fetchFlashcards = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        // In a real implementation, this would fetch from Supabase
        // For now, we're using the sample data with a delay to simulate loading
        setTimeout(() => {
          setUserFlashcards(sampleFlashcards);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching flashcards:', error);
        toast({
          title: 'Error',
          description: 'Failed to load flashcards',
          variant: 'destructive',
        });
        setIsLoading(false);
      }
    };

    fetchFlashcards();
  }, [user, toast]);

  const handleNextCard = () => {
    if (currentCardIndex < filteredCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      // Cycle back to the first card
      setCurrentCardIndex(0);
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    } else {
      // Cycle to the last card
      setCurrentCardIndex(filteredCards.length - 1);
    }
  };

  const handleRating = async (rating: number) => {
    // In a real implementation, this would update the rating in Supabase
    console.log(`Rating card ${currentCard?.id} with ${rating}`);
    
    // For now, just move to the next card
    handleNextCard();
  };

  const handleSkip = () => {
    handleNextCard();
  };

  const handleMarkAsMastered = async () => {
    if (!currentCard) return;
    
    // In a real implementation, this would update mastery status in Supabase
    const updatedFlashcards = userFlashcards.map(card => {
      if (card.id === currentCard.id) {
        return { ...card, mastered: !card.mastered };
      }
      return card;
    });
    
    setUserFlashcards(updatedFlashcards);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <TabsList className="bg-muted/50 overflow-x-auto max-w-full flex-grow">
            {categories.map(category => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="min-w-[110px]"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="whitespace-nowrap">
              {filteredCards.length} cards
            </Badge>
            
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleMarkAsMastered}
              disabled={!currentCard}
            >
              {currentCard?.mastered ? 'Unmark as Mastered' : 'Mark as Mastered'}
            </Button>
          </div>
        </div>
        
        {categories.map(category => (
          <TabsContent key={category.id} value={category.id} className="mt-0">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>{category.name} Flashcards</CardTitle>
                <CardDescription>
                  Practice your Italian {category.name.toLowerCase()} skills
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : filteredCards.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No flashcards available for this category.</p>
                    <Button className="mt-4" variant="outline">
                      Add New Flashcard
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between mb-4">
                      <Button onClick={handlePrevCard} variant="outline" size="sm">
                        Previous
                      </Button>
                      <span className="text-sm text-muted-foreground pt-1">
                        {currentCardIndex + 1} of {filteredCards.length}
                      </span>
                      <Button onClick={handleNextCard} variant="outline" size="sm">
                        Next
                      </Button>
                    </div>
                    
                    {currentCard && (
                      <FlashcardComponent
                        card={currentCard}
                        onRating={handleRating}
                        onSkip={handleSkip}
                        showPronunciation={true}
                      />
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default FlashcardModule;
