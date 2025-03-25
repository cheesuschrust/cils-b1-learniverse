
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Flashcard } from '@/hooks/useFlashcards';
import { CalendarDays, Brain, Zap, AlertTriangle } from 'lucide-react';
import { format, differenceInDays, isFuture } from 'date-fns';

interface SpacedRepetitionInfoProps {
  card: Flashcard;
  compact?: boolean;
}

export const SpacedRepetitionInfo: React.FC<SpacedRepetitionInfoProps> = ({
  card,
  compact = false
}) => {
  const { level, lastReviewed, dueDate, isMastered } = card;
  
  // Calculate percentage progress (0-100)
  const levelProgress = (level / 5) * 100;
  
  // Format dates
  const lastReviewedText = lastReviewed 
    ? format(new Date(lastReviewed), 'PP') 
    : 'Not reviewed yet';
  
  const dueDateText = dueDate 
    ? format(new Date(dueDate), 'PP') 
    : 'Review now';
  
  // Calculate days until review
  const daysUntilReview = dueDate && isFuture(new Date(dueDate))
    ? differenceInDays(new Date(dueDate), new Date())
    : 0;
  
  const getDifficultyText = () => {
    if (level === 0) return 'Very difficult';
    if (level === 1) return 'Difficult';
    if (level === 2) return 'Somewhat difficult';
    if (level === 3) return 'Moderate';
    if (level === 4) return 'Easy';
    return 'Very easy';
  };
  
  if (compact) {
    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium">
            {isMastered ? (
              <Badge variant="outline" className="text-green-500 border-green-500">
                <Brain className="h-3 w-3 mr-1" />
                Mastered
              </Badge>
            ) : (
              <span className="text-xs">Level {level}/5</span>
            )}
          </span>
          
          {dueDate && daysUntilReview > 0 ? (
            <span className="text-xs text-muted-foreground">
              Due in {daysUntilReview} day{daysUntilReview !== 1 ? 's' : ''}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">
              Review now
            </span>
          )}
        </div>
        <Progress value={levelProgress} className={
          isMastered ? "bg-green-100" : 
          level >= 3 ? "bg-blue-100" : 
          level >= 1 ? "bg-yellow-100" : 
          "bg-red-100"
        } />
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Learning Progress</CardTitle>
        <CardDescription>Spaced repetition details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Knowledge Level</span>
            <span className="text-sm text-muted-foreground">{level}/5 - {getDifficultyText()}</span>
          </div>
          <Progress value={levelProgress} className={
            isMastered ? "bg-green-100" : 
            level >= 3 ? "bg-blue-100" : 
            level >= 1 ? "bg-yellow-100" : 
            "bg-red-100"
          } />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <span className="text-xs font-medium flex items-center">
              <CalendarDays className="h-3 w-3 mr-1" />
              Last Reviewed
            </span>
            <p className="text-sm text-muted-foreground">{lastReviewedText}</p>
          </div>
          
          <div className="space-y-1">
            <span className="text-xs font-medium flex items-center">
              <CalendarDays className="h-3 w-3 mr-1" />
              Next Review
            </span>
            <p className="text-sm text-muted-foreground">{dueDateText}</p>
          </div>
        </div>
        
        <div className="pt-2 border-t">
          {isMastered ? (
            <div className="flex items-center text-green-600">
              <Brain className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Mastered! Great job!</span>
            </div>
          ) : dueDate && daysUntilReview > 0 ? (
            <div className="flex items-center text-blue-600">
              <Zap className="h-4 w-4 mr-2" />
              <span className="text-sm">
                Due for review in {daysUntilReview} day{daysUntilReview !== 1 ? 's' : ''}
              </span>
            </div>
          ) : (
            <div className="flex items-center text-orange-600">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <span className="text-sm">Ready for review now</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SpacedRepetitionInfo;
