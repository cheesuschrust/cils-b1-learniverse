
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RotateCcw, VolumeUp } from 'lucide-react';
import SpeakableWord from '@/components/learning/SpeakableWord';

interface FlashcardData {
  id: string;
  front: string;
  back: string;
  example: string;
}

const flashcardSets = [
  {
    id: 'basics',
    name: 'Basics',
    description: 'Essential words and phrases for beginners',
    progress: 68,
    cards: [
      { id: '1', front: 'ciao', back: 'hello, hi', example: 'Ciao, come stai?' },
      { id: '2', front: 'grazie', back: 'thank you', example: 'Grazie per il tuo aiuto.' },
      { id: '3', front: 'per favore', back: 'please', example: 'Per favore, puoi aiutarmi?' },
      { id: '4', front: 'scusa', back: 'excuse me, sorry', example: 'Scusa, non ho capito.' },
      { id: '5', front: 'buongiorno', back: 'good morning', example: 'Buongiorno, come va?' },
    ]
  },
  {
    id: 'food',
    name: 'Food & Dining',
    description: 'Vocabulary for restaurants and food',
    progress: 42,
    cards: [
      { id: '1', front: 'pizza', back: 'pizza', example: 'Mi piace la pizza con funghi.' },
      { id: '2', front: 'pasta', back: 'pasta', example: 'La pasta è un piatto italiano.' },
      { id: '3', front: 'caffè', back: 'coffee', example: 'Vorrei un caffè, per favore.' },
      { id: '4', front: 'acqua', back: 'water', example: 'Un bicchiere d\'acqua, per favore.' },
      { id: '5', front: 'vino', back: 'wine', example: 'Preferisco il vino rosso.' },
    ]
  },
  {
    id: 'travel',
    name: 'Travel',
    description: 'Essential words for getting around Italy',
    progress: 25,
    cards: [
      { id: '1', front: 'stazione', back: 'station', example: 'La stazione è vicina?' },
      { id: '2', front: 'aeroporto', back: 'airport', example: 'L\'aeroporto è a 30 minuti da qui.' },
      { id: '3', front: 'biglietto', back: 'ticket', example: 'Dove posso comprare un biglietto?' },
      { id: '4', front: 'albergo', back: 'hotel', example: 'Questo albergo è molto bello.' },
      { id: '5', front: 'spiaggia', back: 'beach', example: 'Andiamo alla spiaggia!' },
    ]
  }
];

const FlashcardPage = () => {
  const [activeSet, setActiveSet] = useState(flashcardSets[0]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  const currentCard = activeSet.cards[currentCardIndex];
  
  const handleNext = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prevIndex) => 
      prevIndex === activeSet.cards.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const handlePrevious = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prevIndex) => 
      prevIndex === 0 ? activeSet.cards.length - 1 : prevIndex - 1
    );
  };
  
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Flashcards</h1>
        <p className="text-muted-foreground">Review vocabulary with interactive flashcards</p>
      </div>
      
      <Tabs defaultValue={activeSet.id} className="space-y-8">
        <TabsList className="grid grid-cols-3 max-w-md mx-auto">
          {flashcardSets.map(set => (
            <TabsTrigger 
              key={set.id} 
              value={set.id}
              onClick={() => {
                setActiveSet(set);
                setCurrentCardIndex(0);
                setIsFlipped(false);
              }}
            >
              {set.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {flashcardSets.map(set => (
          <TabsContent key={set.id} value={set.id} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{set.name}</CardTitle>
                <CardDescription>{set.description}</CardDescription>
                <Progress value={set.progress} className="h-2 mt-2" />
                <p className="text-xs text-right mt-1 text-muted-foreground">
                  {set.progress}% complete
                </p>
              </CardHeader>
              
              <CardContent>
                <div className="min-h-[300px] flex flex-col items-center justify-center">
                  <div 
                    className={`w-full max-w-md aspect-[3/2] rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 ${
                      isFlipped ? "rotate-y-180" : ""
                    }`}
                    onClick={handleFlip}
                  >
                    {/* Front of card */}
                    <div 
                      className={`absolute w-full h-full backface-hidden rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 flex flex-col items-center justify-center p-6 ${
                        isFlipped ? "opacity-0" : "opacity-100"
                      }`}
                    >
                      <SpeakableWord 
                        word={currentCard.front} 
                        language="it" 
                        className="text-4xl font-medium mb-4" 
                      />
                      <p className="text-sm text-muted-foreground mt-4">Click to flip card</p>
                    </div>
                    
                    {/* Back of card */}
                    <div 
                      className={`absolute w-full h-full backface-hidden rounded-xl bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950 dark:to-purple-950 flex flex-col items-center justify-center p-6 ${
                        isFlipped ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <div className="text-2xl font-medium mb-4">{currentCard.back}</div>
                      <p className="text-sm italic text-center">"{currentCard.example}"</p>
                      <SpeakableWord 
                        word={currentCard.example} 
                        language="it" 
                        className="text-sm mt-4" 
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={handlePrevious}
                    title="Previous card"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">
                    {currentCardIndex + 1} / {activeSet.cards.length}
                  </span>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handleNext}
                    title="Next card"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsFlipped(!isFlipped)}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Flip
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default FlashcardPage;
