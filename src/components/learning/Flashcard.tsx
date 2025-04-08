
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface FlashcardProps {
  front: string;
  back: string;
  onMarkCorrect?: () => void;
  onMarkIncorrect?: () => void;
}

const Flashcard: React.FC<FlashcardProps> = ({
  front,
  back,
  onMarkCorrect,
  onMarkIncorrect
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="w-full max-w-md mx-auto perspective-1000">
      <motion.div 
        className="relative w-full h-64 cursor-pointer"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 300, damping: 30 }}
        onClick={handleFlip}
      >
        {/* Front side */}
        <Card className={`absolute w-full h-full backface-hidden ${isFlipped ? 'invisible' : 'visible'}`}>
          <CardContent className="flex items-center justify-center h-full p-6 text-xl font-medium">
            {front}
          </CardContent>
        </Card>

        {/* Back side */}
        <Card 
          className={`absolute w-full h-full backface-hidden ${!isFlipped ? 'invisible' : 'visible'}`}
          style={{ transform: 'rotateY(180deg)' }}
        >
          <CardContent className="flex flex-col items-center justify-between h-full p-6">
            <div className="flex-1 flex items-center justify-center text-xl font-medium">
              {back}
            </div>
            
            {(onMarkCorrect || onMarkIncorrect) && (
              <div className="flex justify-center space-x-4 w-full mt-4">
                {onMarkIncorrect && (
                  <Button 
                    variant="outline" 
                    className="flex-1 bg-destructive/10 hover:bg-destructive/20 border-destructive/30"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkIncorrect();
                      setIsFlipped(false);
                    }}
                  >
                    Incorrect
                  </Button>
                )}
                
                {onMarkCorrect && (
                  <Button 
                    variant="outline" 
                    className="flex-1 bg-success/10 hover:bg-success/20 border-success/30"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkCorrect();
                      setIsFlipped(false);
                    }}
                  >
                    Correct
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Flashcard;
