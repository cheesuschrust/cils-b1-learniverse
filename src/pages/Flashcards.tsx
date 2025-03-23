
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Repeat, Volume2 } from 'lucide-react';
import { speak } from '@/utils/textToSpeech';
import SpeakableWord from '@/components/learning/SpeakableWord';

// Sample flashcard data
const sampleFlashcards = [
  { id: 1, italian: 'casa', english: 'house', example: 'La mia casa è grande.', category: 'Nouns' },
  { id: 2, italian: 'mangiare', english: 'to eat', example: 'Mi piace mangiare il gelato.', category: 'Verbs' },
  { id: 3, italian: 'felice', english: 'happy', example: 'Sono felice di vederti.', category: 'Adjectives' },
  { id: 4, italian: 'velocemente', english: 'quickly', example: 'Corre velocemente.', category: 'Adverbs' },
  { id: 5, italian: 'sotto', english: 'under', example: 'Il gatto è sotto il tavolo.', category: 'Prepositions' },
];

const Flashcards: React.FC = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const currentCard = sampleFlashcards[currentCardIndex];
  
  const nextCard = () => {
    setFlipped(false);
    setCurrentCardIndex((currentCardIndex + 1) % sampleFlashcards.length);
    updateProgress();
  };
  
  const prevCard = () => {
    setFlipped(false);
    setCurrentCardIndex((currentCardIndex - 1 + sampleFlashcards.length) % sampleFlashcards.length);
    updateProgress();
  };
  
  const flipCard = () => {
    setFlipped(!flipped);
  };
  
  const updateProgress = () => {
    // This is a simplistic progress calculation
    const newProgress = ((currentCardIndex + 1) / sampleFlashcards.length) * 100;
    setProgress(newProgress);
  };
  
  const handleSpeak = () => {
    const textToSpeak = flipped ? currentCard.example : currentCard.italian;
    speak(textToSpeak, 'it');
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">Italian Flashcards</h1>
          <p className="text-muted-foreground">Practice your Italian vocabulary with these flashcards.</p>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <Badge variant="outline">{currentCard.category}</Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            Card {currentCardIndex + 1} of {sampleFlashcards.length}
          </div>
        </div>
        
        <Card 
          className={`w-full h-80 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${flipped ? 'bg-accent/10' : ''}`}
          onClick={flipCard}
        >
          <CardContent className="flex flex-col items-center justify-center h-full w-full p-6">
            <div className="text-center">
              {flipped ? (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold">{currentCard.english}</h2>
                  <p className="text-lg italic">"{currentCard.example}"</p>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-4">
                  <SpeakableWord 
                    word={currentCard.italian} 
                    language="it"
                    className="text-4xl font-bold"
                    autoPlay={false}
                  />
                  <p className="text-sm text-muted-foreground">(Click to reveal translation)</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-between space-x-4">
          <Button variant="outline" onClick={prevCard}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          
          <Button variant="outline" onClick={handleSpeak}>
            <Volume2 className="mr-2 h-4 w-4" />
            Speak
          </Button>
          
          <Button variant="outline" onClick={flipCard}>
            <Repeat className="mr-2 h-4 w-4" />
            Flip
          </Button>
          
          <Button onClick={nextCard}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        <Progress value={progress} className="w-full" />
      </div>
    </div>
  );
};

export default Flashcards;
