
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, ChevronRight, RotateCcw, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Flashcard {
  id: string;
  italian: string;
  english: string;
  example?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
}

const mockFlashcards: Flashcard[] = [
  {
    id: '1',
    italian: 'Buongiorno',
    english: 'Good morning',
    example: 'Buongiorno, come stai oggi?',
    difficulty: 'beginner',
    category: 'greetings'
  },
  {
    id: '2',
    italian: 'Arrivederci',
    english: 'Goodbye',
    example: 'Arrivederci, a domani!',
    difficulty: 'beginner',
    category: 'greetings'
  },
  {
    id: '3',
    italian: 'Per favore',
    english: 'Please',
    example: 'Per favore, mi passi il sale?',
    difficulty: 'beginner',
    category: 'common phrases'
  },
  {
    id: '4',
    italian: 'Cittadinanza',
    english: 'Citizenship',
    example: 'Ho ottenuto la cittadinanza italiana l\'anno scorso.',
    difficulty: 'intermediate',
    category: 'CILS B1'
  },
  {
    id: '5',
    italian: 'Permesso di soggiorno',
    english: 'Residence permit',
    example: 'Devo rinnovare il mio permesso di soggiorno.',
    difficulty: 'intermediate',
    category: 'CILS B1'
  }
];

const FlashcardModule: React.FC = () => {
  const [cards, setCards] = useState<Flashcard[]>(mockFlashcards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filteredCards, setFilteredCards] = useState<Flashcard[]>(cards);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredCards(cards);
    } else {
      setFilteredCards(cards.filter(card => card.category === selectedCategory));
    }
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [selectedCategory, cards]);

  const handleNext = () => {
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      toast({
        title: "End of deck",
        description: "You've reached the end of this flashcard deck.",
      });
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleSpeakText = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        filteredCards[currentIndex]?.italian
      );
      utterance.lang = 'it-IT';
      window.speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Not supported",
        description: "Text-to-speech is not supported in your browser.",
        variant: "destructive"
      });
    }
  };

  const categories = ['all', ...Array.from(new Set(cards.map(card => card.category)))];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4 overflow-auto">
          {categories.map(category => (
            <TabsTrigger 
              key={category} 
              value={category}
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {filteredCards.length > 0 ? (
        <div className="space-y-6">
          <div className="perspective w-full">
            <Card 
              className={`transition-all duration-500 ${isFlipped ? 'rotate-y-180' : ''}`}
              onClick={handleFlip}
            >
              <div className="backface-hidden w-full">
                <CardContent className="p-6 text-center min-h-[200px] flex flex-col justify-center items-center">
                  <h3 className="text-2xl font-semibold mb-2">
                    {filteredCards[currentIndex]?.italian}
                  </h3>
                  {!isFlipped && filteredCards[currentIndex]?.example && (
                    <p className="text-muted-foreground italic">
                      {filteredCards[currentIndex]?.example}
                    </p>
                  )}
                </CardContent>
              </div>
              
              <div className="absolute inset-0 backface-hidden rotate-y-180">
                <CardContent className="p-6 text-center min-h-[200px] flex flex-col justify-center items-center">
                  <h3 className="text-2xl font-semibold mb-2">
                    {filteredCards[currentIndex]?.english}
                  </h3>
                  <p className="text-muted-foreground">
                    Tap card to flip back
                  </p>
                </CardContent>
              </div>
            </Card>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handlePrevious}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleNext}
                disabled={currentIndex === filteredCards.length - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              {currentIndex + 1} of {filteredCards.length}
            </p>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleSpeakText}
                title="Speak Italian text"
              >
                <Volume2 className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleFlip}
                title="Flip card"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No flashcards available in this category.</p>
        </div>
      )}
    </div>
  );
};

export default FlashcardModule;
