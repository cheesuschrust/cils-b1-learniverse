
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flashcard } from '@/types/flashcard';
import { format, isAfter, isBefore, formatDistanceToNow, addDays } from 'date-fns';
import { Calendar, TrendingUp, Brain, CheckCircle } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { InfoIcon } from 'lucide-react';

interface SpacedRepetitionInfoProps {
  flashcard: Flashcard;
}

const SpacedRepetitionInfo: React.FC<SpacedRepetitionInfoProps> = ({ flashcard }) => {
  const isOverdue = flashcard.nextReview && isBefore(new Date(flashcard.nextReview), new Date());
  const isDueToday = flashcard.nextReview && 
    isBefore(new Date(flashcard.nextReview), addDays(new Date(), 1)) && 
    !isBefore(new Date(flashcard.nextReview), new Date(new Date().setHours(0, 0, 0, 0)));
  
  const getNextReviewText = () => {
    if (!flashcard.nextReview) return 'Not scheduled';
    if (isOverdue) return `Overdue by ${formatDistanceToNow(new Date(flashcard.nextReview))}`;
    if (isDueToday) return 'Due today';
    return `Due ${formatDistanceToNow(new Date(flashcard.nextReview), { addSuffix: true })}`;
  };
  
  const getStatusColor = () => {
    if (flashcard.mastered) return 'text-green-500';
    if (isOverdue) return 'text-red-500';
    if (isDueToday) return 'text-yellow-500';
    return 'text-blue-500';
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          <span>Spaced Repetition Status</span>
          <HoverCard>
            <HoverCardTrigger asChild>
              <button className="inline-flex">
                <InfoIcon className="h-4 w-4 opacity-70" />
              </button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 p-3 text-sm">
              <p>Spaced repetition is a learning technique that incorporates increasing intervals of time between reviews to improve long-term retention.</p>
              <ul className="mt-2 space-y-1">
                <li><span className="font-medium">Level:</span> Represents your familiarity with the flashcard (0-5)</li>
                <li><span className="font-medium">Mastered:</span> Whether you've fully learned this flashcard</li>
                <li><span className="font-medium">Review schedule:</span> The optimal time to review this flashcard next</li>
              </ul>
            </HoverCardContent>
          </HoverCard>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Next Review</div>
            <div className={`flex items-center text-sm font-medium ${getStatusColor()}`}>
              <Calendar className="mr-1 h-4 w-4" />
              {getNextReviewText()}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Current Level</div>
            <div className="flex items-center text-sm font-medium">
              <TrendingUp className="mr-1 h-4 w-4 text-blue-500" />
              {flashcard.level} / 5
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Status</div>
            <div className="flex items-center text-sm font-medium">
              <Brain className="mr-1 h-4 w-4 text-purple-500" />
              {flashcard.mastered ? 'Mastered' : 'Learning'}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Last Reviewed</div>
            <div className="flex items-center text-sm font-medium">
              <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
              {flashcard.lastReviewed 
                ? formatDistanceToNow(new Date(flashcard.lastReviewed), { addSuffix: true })
                : 'Never'
              }
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpacedRepetitionInfo;
