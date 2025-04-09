
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

// Sample flashcard data
const SAMPLE_FLASHCARDS = [
  {
    id: 1,
    front: "Parlare",
    back: "To talk, to speak",
    example: "Io parlo italiano.",
    level: "A1",
    category: "Verbs"
  },
  {
    id: 2,
    front: "Ascoltare",
    back: "To listen",
    example: "Ascolto la radio ogni mattina.",
    level: "A1",
    category: "Verbs"
  },
  {
    id: 3,
    front: "Leggere",
    back: "To read",
    example: "Leggo un libro interessante.",
    level: "A1",
    category: "Verbs"
  },
  {
    id: 4,
    front: "Scrivere",
    back: "To write",
    example: "Scrivo una lettera a mia madre.",
    level: "A1",
    category: "Verbs"
  },
  {
    id: 5,
    front: "La casa",
    back: "The house",
    example: "Abito in una casa grande.",
    level: "A1",
    category: "Nouns"
  }
];

// Sample categories
const CATEGORIES = [
  { id: 1, name: "All" },
  { id: 2, name: "Verbs" },
  { id: 3, name: "Nouns" },
  { id: 4, name: "Adjectives" },
  { id: 5, name: "Common phrases" }
];

type Flashcard = {
  id: number;
  front: string;
  back: string;
  example: string;
  level: string;
  category: string;
};

const FlashcardModule: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>(SAMPLE_FLASHCARDS);
  const [studyCards, setStudyCards] = useState<Flashcard[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (activeCategory === "All") {
      setStudyCards(flashcards);
    } else {
      setStudyCards(flashcards.filter(card => card.category === activeCategory));
    }
    setActiveCardIndex(0);
    setIsFlipped(false);
  }, [activeCategory, flashcards]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNextCard = () => {
    if (activeCardIndex < studyCards.length - 1) {
      setActiveCardIndex(activeCardIndex + 1);
      setIsFlipped(false);
    } else {
      toast({
        title: "End of stack",
        description: "You've reached the end of this flashcard stack.",
      });
    }
  };

  const handlePrevCard = () => {
    if (activeCardIndex > 0) {
      setActiveCardIndex(activeCardIndex - 1);
      setIsFlipped(false);
    }
  };

  const currentCard = studyCards[activeCardIndex];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="study" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="study">Study</TabsTrigger>
          <TabsTrigger value="browse">Browse</TabsTrigger>
        </TabsList>
        
        <TabsContent value="study" className="space-y-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {CATEGORIES.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.name ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryChange(category.name)}
              >
                {category.name}
              </Button>
            ))}
          </div>
          
          {studyCards.length > 0 ? (
            <>
              <Card 
                className="w-full h-64 cursor-pointer perspective"
                onClick={handleFlip}
              >
                <div className={`relative w-full h-full transition-all duration-500 ${isFlipped ? "rotate-y-180" : ""}`}>
                  <div className={`absolute w-full h-full backface-hidden flex flex-col justify-center items-center p-6 ${isFlipped ? "invisible" : ""}`}>
                    <h3 className="text-2xl font-bold mb-4">{currentCard.front}</h3>
                    <p className="text-sm text-muted-foreground">Click to reveal answer</p>
                  </div>
                  
                  <div className={`absolute w-full h-full backface-hidden rotate-y-180 flex flex-col justify-center items-center p-6 ${isFlipped ? "" : "invisible"}`}>
                    <h3 className="text-2xl font-bold mb-2">{currentCard.back}</h3>
                    <p className="text-sm italic mb-4">"{currentCard.example}"</p>
                    <p className="text-xs text-muted-foreground">Level: {currentCard.level}</p>
                  </div>
                </div>
              </Card>
              
              <div className="flex justify-between items-center mt-4">
                <Button 
                  variant="outline" 
                  onClick={handlePrevCard}
                  disabled={activeCardIndex === 0}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  {activeCardIndex + 1} of {studyCards.length}
                </span>
                <Button 
                  variant="outline" 
                  onClick={handleNextCard}
                  disabled={activeCardIndex === studyCards.length - 1}
                >
                  Next
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p>No flashcards available in this category.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="browse" className="space-y-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {CATEGORIES.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.name ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryChange(category.name)}
              >
                {category.name}
              </Button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {studyCards.map((card) => (
              <Card key={card.id} className="h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{card.front}</CardTitle>
                  <CardDescription>{card.level} • {card.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">{card.back}</p>
                  <p className="text-sm italic mt-2">"{card.example}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FlashcardModule;
