
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, RotateCw } from 'lucide-react';
import { FlashcardComponentProps, Flashcard } from '@/types';
import SpeakableWord from './SpeakableWord';

const FlashcardComponent: React.FC<FlashcardComponentProps> = ({
  card,
  onUpdate,
  onDelete,
  showActions = true
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  
  const handleEdit = () => {
    if (onUpdate) {
      onUpdate(card);
    }
  };
  
  const handleDelete = () => {
    if (onDelete) {
      onDelete(card.id);
    }
  };
  
  return (
    <Card className="w-full h-full min-h-[200px] flex flex-col shadow-md hover:shadow-lg transition-shadow">
      <CardContent 
        className={`flex-1 p-6 flex flex-col items-center justify-center cursor-pointer ${
          isFlipped ? 'bg-secondary/20' : 'bg-card'
        }`}
        onClick={handleFlip}
      >
        <div className="w-full flex justify-end mb-2">
          {card.tags && card.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 justify-end">
              {card.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {card.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{card.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
        
        <div className="flex-1 flex items-center justify-center w-full">
          <div className="flex flex-col items-center">
            <p className="text-xl font-medium text-center mb-2">
              {isFlipped ? card.back : card.front}
            </p>
            
            <SpeakableWord 
              word={isFlipped ? card.back : card.front}
              language={isFlipped ? 'en' : 'it'}
              showTooltip={true}
              tooltipContent={`Listen to ${isFlipped ? 'English' : 'Italian'} pronunciation`}
            />
          </div>
        </div>
        
        <div className="w-full mt-4 text-sm text-muted-foreground">
          <p className="text-center">
            {isFlipped ? 'English' : 'Italian'}
            <RotateCw size={14} className="inline-block ml-1" />
          </p>
        </div>
      </CardContent>
      
      {showActions && (
        <CardFooter className="p-3 flex justify-between border-t">
          <Button variant="ghost" size="sm" onClick={handleEdit}>
            <Pencil size={16} className="mr-1" /> Edit
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDelete} className="text-destructive">
            <Trash2 size={16} className="mr-1" /> Delete
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default FlashcardComponent;
