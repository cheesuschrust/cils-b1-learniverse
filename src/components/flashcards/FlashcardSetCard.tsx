
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Star, Clock } from 'lucide-react';

interface FlashcardSetProps {
  set: {
    id: string;
    name: string;
    description: string;
    cards?: any[];
    dueCount?: number;
    totalCards?: number;
    isFavorite?: boolean;
    lastStudied?: string;
    category?: string;
  };
  onStudy: (setId: string) => void;
  isPublic?: boolean;
  showDueCount?: boolean;
}

const FlashcardSetCard: React.FC<FlashcardSetProps> = ({ 
  set, 
  onStudy,
  isPublic = false,
  showDueCount = false
}) => {
  const cardCount = set.totalCards || set.cards?.length || 0;
  
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="flex-1">{set.name}</CardTitle>
          {set.isFavorite && <Star className="h-5 w-5 text-yellow-500 fill-yellow-400" />}
        </div>
        <CardDescription>{set.description}</CardDescription>
        
        {set.category && (
          <Badge variant="outline" className="mt-2">
            {set.category}
          </Badge>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 mr-1" /> 
            <span>{cardCount} cards</span>
          </div>
          
          {showDueCount && set.dueCount && set.dueCount > 0 && (
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-amber-500" />
              <span className="text-amber-500 font-medium">{set.dueCount} due</span>
            </div>
          )}
          
          {set.lastStudied && (
            <div className="text-xs">
              Last studied: {new Date(set.lastStudied).toLocaleDateString()}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="mt-auto">
        <Button 
          variant="default" 
          className="w-full" 
          onClick={() => onStudy(set.id)}
        >
          {isPublic ? "View Set" : "Study Now"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FlashcardSetCard;
