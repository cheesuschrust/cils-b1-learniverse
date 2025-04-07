
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Star, Users, Clock, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FlashcardSet } from '@/types';
import { formatDate } from '@/lib/utils';

interface FlashcardSetCardProps {
  set: FlashcardSet;
  onStudy: (setId: string) => void;
  isPublic?: boolean;
  showDueCount?: boolean;
}

const FlashcardSetCard: React.FC<FlashcardSetCardProps> = ({
  set,
  onStudy,
  isPublic = false,
  showDueCount = false
}) => {
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-200 hover:shadow-md",
      set.isFavorite && "border-yellow-300"
    )}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold line-clamp-1">{set.name}</CardTitle>
          {set.isFavorite && (
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          )}
        </div>
        <CardDescription className="line-clamp-2">
          {set.description || `Italian flashcards for ${set.category || 'learning'}`}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-1 mb-3">
          <Badge variant="outline" className="text-xs">
            {set.category || 'General'}
          </Badge>
          {set.tags?.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <BookOpen className="h-3 w-3 mr-1" />
            <span>Italian</span>
          </div>
          
          {showDueCount && set.dueCount && (
            <div className="flex items-center text-orange-600">
              <Clock className="h-3 w-3 mr-1" />
              <span>{set.dueCount} due</span>
            </div>
          )}
          
          {isPublic && (
            <div className="flex items-center">
              <Users className="h-3 w-3 mr-1" />
              <span>Public</span>
            </div>
          )}
          
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>{formatDate(set.createdAt)}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        <Button 
          onClick={() => onStudy(set.id)} 
          className="w-full"
          variant={set.isFavorite ? "default" : "secondary"}
        >
          Study Now
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FlashcardSetCard;
