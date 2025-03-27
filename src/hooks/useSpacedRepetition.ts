
import { useState, useCallback, useEffect } from 'react';
import { Flashcard } from '@/types/flashcard';
import { calculateNextReview, daysUntilReview, isDueForReview, generateReviewSchedule } from '@/utils/spacedRepetition';
import { useAIUtils } from '@/contexts/AIUtilsContext';
import { optimizeStudySchedule } from '@/utils/AIIntegrationUtils';
import { useGamification } from '@/hooks/useGamification';
import { useToast } from '@/hooks/use-toast';

export const useSpacedRepetition = (initialFlashcards: Flashcard[] = []) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>(initialFlashcards);
  const [dueCards, setDueCards] = useState<Flashcard[]>([]);
  const [reviewSchedule, setReviewSchedule] = useState<any>({});
  const [performanceData, setPerformanceData] = useState<{[id: string]: number}>({});
  const { isAIEnabled } = useAIUtils();
  const { awardXp } = useGamification();
  const { toast } = useToast();

  useEffect(() => {
    const due = flashcards.filter(card => 
      card.nextReview && isDueForReview(new Date(card.nextReview))
    );
    setDueCards(due);
    setReviewSchedule(generateReviewSchedule(flashcards));
  }, [flashcards]);

  const processAnswer = useCallback((
    flashcardId: string, 
    correct: boolean, 
    confidence: number = 0.5
  ) => {
    setFlashcards(currentCards => {
      const updatedCards = currentCards.map(card => {
        if (card.id !== flashcardId) return card;
        
        const newPerformanceData = {
          ...performanceData,
          [flashcardId]: correct ? confidence : 0.1
        };
        setPerformanceData(newPerformanceData);
        
        // Add missing properties if needed
        const consecutiveCorrect = correct 
          ? ((card as any).consecutiveCorrect || 0) + 1 
          : 0;
        
        const currentFactor = (card as any).difficultyFactor || 2.5;
        const { nextReviewDate, difficultyFactor } = calculateNextReview(
          correct,
          currentFactor,
          consecutiveCorrect
        );
        
        const newLevel = Math.min(5, Math.floor(difficultyFactor * 2 - 2));
        const wasMastered = card.level >= 5;
        const isMastered = newLevel >= 5 && correct;
        
        if (isMastered && !wasMastered) {
          awardXp(10, "Flashcard mastered");
          toast({
            title: "Flashcard Mastered!",
            description: "You've mastered this card and earned 10 XP!"
          });
        }
        
        return {
          ...card,
          nextReview: nextReviewDate,
          difficultyFactor, // We'll add this to the type later
          consecutiveCorrect, // We'll add this to the type later
          level: newLevel,
          mastered: isMastered
        };
      });
      
      return updatedCards;
    });
  }, [performanceData, awardXp, toast]);

  const optimizeSchedules = useCallback(() => {
    if (!isAIEnabled || flashcards.length === 0) return;
    
    try {
      const optimizedCards = optimizeStudySchedule(flashcards, performanceData);
      setFlashcards(optimizedCards);
      
      toast({
        title: "Study Schedule Optimized",
        description: "Your flashcard review schedule has been optimized based on your performance."
      });
    } catch (error) {
      console.error("Error optimizing study schedules:", error);
    }
  }, [flashcards, performanceData, isAIEnabled, toast]);

  const getRecommendedStudySessions = useCallback(() => {
    const sessions = [];
    
    if (dueCards.length > 0) {
      sessions.push({
        priority: "high",
        title: "Review Due Cards",
        description: `${dueCards.length} cards need review today`,
        duration: Math.ceil(dueCards.length * 0.5)
      });
    }
    
    const upcomingDueDates = Object.keys(reviewSchedule.dueByDate || {})
      .sort()
      .filter(date => {
        const dateObj = new Date(date);
        const now = new Date();
        const diffDays = Math.ceil((dateObj.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays > 0 && diffDays <= 3;
      });
    
    if (upcomingDueDates.length > 0) {
      const totalCards = upcomingDueDates.reduce(
        (sum, date) => sum + (reviewSchedule.dueByDate[date] || 0), 0
      );
      
      sessions.push({
        priority: "medium",
        title: "Upcoming Reviews",
        description: `${totalCards} cards due in the next 3 days`,
        duration: Math.ceil(totalCards * 0.5)
      });
    }
    
    return sessions;
  }, [dueCards, reviewSchedule]);

  return {
    flashcards,
    setFlashcards,
    dueCards,
    reviewSchedule,
    processAnswer,
    optimizeSchedules,
    getRecommendedStudySessions
  };
};

export default useSpacedRepetition;
