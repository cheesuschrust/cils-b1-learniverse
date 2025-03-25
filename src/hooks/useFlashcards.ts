
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Flashcard, FlashcardSet, FlashcardStudySession, ImportOptions, ImportResult } from '@/types/flashcard';
import { ContentService } from '@/services/ContentService';
import { useToast } from './use-toast';

// Helper function to calculate the next review date based on spaced repetition algorithm
const calculateNextReviewDate = (level: number): Date => {
  const now = new Date();
  switch(level) {
    case 0: return new Date(now.getTime() + 1000 * 60 * 60); // 1 hour
    case 1: return new Date(now.getTime() + 1000 * 60 * 60 * 6); // 6 hours
    case 2: return new Date(now.getTime() + 1000 * 60 * 60 * 24); // 1 day
    case 3: return new Date(now.getTime() + 1000 * 60 * 60 * 24 * 3); // 3 days
    case 4: return new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7); // 1 week
    case 5: return new Date(now.getTime() + 1000 * 60 * 60 * 24 * 14); // 2 weeks
    case 6: return new Date(now.getTime() + 1000 * 60 * 60 * 24 * 30); // 1 month
    default: return new Date(now.getTime() + 1000 * 60 * 60 * 24 * 60); // 2 months
  }
};

export interface UseFlashcardsReturn {
  flashcards: Flashcard[];
  flashcardSets: FlashcardSet[];
  studySessions: FlashcardStudySession[];
  loading: boolean;
  error: string | null;
  createFlashcard: (data: Omit<Flashcard, 'id' | 'level' | 'dueDate' | 'createdAt'>) => Promise<Flashcard>;
  updateFlashcard: (id: string, data: Partial<Flashcard>) => Promise<Flashcard>;
  deleteFlashcard: (id: string) => Promise<void>;
  createFlashcardSet: (data: Omit<Partial<FlashcardSet>, 'id' | 'createdAt' | 'updatedAt'>) => Promise<FlashcardSet>;
  updateFlashcardSet: (id: string, data: Partial<Omit<FlashcardSet, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<FlashcardSet>;
  deleteFlashcardSet: (id: string) => Promise<void>;
  addFlashcardToSet: (setId: string, flashcardId: string) => Promise<void>;
  removeFlashcardFromSet: (setId: string, flashcardId: string) => Promise<void>;
  importFlashcards: (fileContent: string, options: ImportOptions) => Promise<ImportResult>;
  exportFlashcards: (format: 'csv' | 'json', flashcardIds?: string[]) => Promise<string>;
  reviewFlashcard: (id: string, correct: boolean) => Promise<Flashcard>;
  markAsMastered: (id: string) => Promise<Flashcard>;
  resetMastered: (id: string) => Promise<Flashcard>;
  getStats: () => { total: number, mastered: number, dueToday: number };
  getDueFlashcards: () => Flashcard[];
  getFlashcardById: (id: string) => Flashcard | undefined;
  createStudySession: (setId: string) => Promise<FlashcardStudySession>;
  updateStudySession: (id: string, data: Partial<FlashcardStudySession>) => Promise<FlashcardStudySession>;
  completeStudySession: (id: string, results: { correct: string[], incorrect: string[] }) => Promise<FlashcardStudySession>;
}

export const useFlashcards = (): UseFlashcardsReturn => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [studySessions, setStudySessions] = useState<FlashcardStudySession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Load flashcards on first render
  useState(() => {
    const loadFlashcards = async () => {
      try {
        setLoading(true);
        const cards = await ContentService.getFlashcards();
        setFlashcards(cards);
        // We'd load sets and sessions here too in a full implementation
        setLoading(false);
      } catch (err) {
        setError('Failed to load flashcards');
        setLoading(false);
        toast({
          title: "Error",
          description: "Failed to load flashcards",
          variant: "destructive"
        });
      }
    };

    loadFlashcards();
  });

  const createFlashcard = useCallback(async (data: Omit<Flashcard, 'id' | 'level' | 'dueDate' | 'createdAt'>) => {
    try {
      const newFlashcard: Flashcard = {
        ...data,
        id: uuidv4(),
        level: 0,
        dueDate: new Date(),
        createdAt: new Date(),
      };
      
      const savedCard = await ContentService.saveFlashcard(newFlashcard);
      
      setFlashcards((prev) => [...prev, savedCard]);
      
      toast({
        title: "Flashcard Created",
        description: "New flashcard has been created successfully"
      });
      
      return savedCard;
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create flashcard",
        variant: "destructive"
      });
      throw err;
    }
  }, [toast]);

  const updateFlashcard = useCallback(async (id: string, data: Partial<Flashcard>) => {
    try {
      const updatedCard = await ContentService.updateFlashcard(id, data);
      
      setFlashcards((prev) => 
        prev.map(card => card.id === id ? updatedCard : card)
      );
      
      // Update the card in any sets it belongs to
      setFlashcardSets((prev) => 
        prev.map(set => ({
          ...set,
          cards: set.cards.map(card => card.id === id ? updatedCard : card),
          updatedAt: new Date()
        }))
      );
      
      toast({
        title: "Flashcard Updated",
        description: "Flashcard has been updated successfully"
      });
      
      return updatedCard;
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update flashcard",
        variant: "destructive"
      });
      throw err;
    }
  }, [toast]);

  const deleteFlashcard = useCallback(async (id: string) => {
    try {
      await ContentService.deleteFlashcard(id);
      
      setFlashcards((prev) => 
        prev.filter(card => card.id !== id)
      );
      
      // Remove the card from any sets it belongs to
      setFlashcardSets((prev) => 
        prev.map(set => ({
          ...set,
          cards: set.cards.filter(card => card.id !== id),
          updatedAt: new Date()
        }))
      );
      
      toast({
        title: "Flashcard Deleted",
        description: "Flashcard has been removed"
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete flashcard",
        variant: "destructive"
      });
      throw err;
    }
  }, [toast]);

  const createFlashcardSet = useCallback(async (data: Omit<Partial<FlashcardSet>, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newSet: FlashcardSet = {
        id: uuidv4(),
        title: data.title || 'Untitled Set',
        description: data.description || '',
        language: data.language || 'italian',
        category: data.category || 'General',
        cards: data.cards || [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setFlashcardSets((prev) => [...prev, newSet]);
      
      toast({
        title: "Set Created",
        description: "New flashcard set has been created"
      });
      
      return newSet;
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create flashcard set",
        variant: "destructive"
      });
      throw err;
    }
  }, [toast]);

  const updateFlashcardSet = useCallback(async (id: string, data: Partial<Omit<FlashcardSet, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      setFlashcardSets((prev) => 
        prev.map(set => {
          if (set.id === id) {
            return {
              ...set,
              ...data,
              updatedAt: new Date()
            };
          }
          return set;
        })
      );
      
      toast({
        title: "Set Updated",
        description: "Flashcard set has been updated"
      });
      
      const updatedSet = flashcardSets.find(set => set.id === id);
      if (!updatedSet) throw new Error('Set not found');
      
      return updatedSet;
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update flashcard set",
        variant: "destructive"
      });
      throw err;
    }
  }, [flashcardSets, toast]);

  const deleteFlashcardSet = useCallback(async (id: string) => {
    try {
      setFlashcardSets((prev) => 
        prev.filter(set => set.id !== id)
      );
      
      toast({
        title: "Set Deleted",
        description: "Flashcard set has been deleted"
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete flashcard set",
        variant: "destructive"
      });
      throw err;
    }
  }, [toast]);

  const addFlashcardToSet = useCallback(async (setId: string, flashcardId: string) => {
    try {
      const card = flashcards.find(c => c.id === flashcardId);
      if (!card) throw new Error('Flashcard not found');
      
      setFlashcardSets((prev) => 
        prev.map(set => {
          if (set.id === setId) {
            // Check if card is already in the set
            if (set.cards.some(c => c.id === flashcardId)) {
              return set;
            }
            
            return {
              ...set,
              cards: [...set.cards, card],
              updatedAt: new Date()
            };
          }
          return set;
        })
      );
      
      toast({
        title: "Card Added",
        description: "Flashcard has been added to the set"
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to add flashcard to set",
        variant: "destructive"
      });
      throw err;
    }
  }, [flashcards, toast]);

  const removeFlashcardFromSet = useCallback(async (setId: string, flashcardId: string) => {
    try {
      setFlashcardSets((prev) => 
        prev.map(set => {
          if (set.id === setId) {
            return {
              ...set,
              cards: set.cards.filter(card => card.id !== flashcardId),
              updatedAt: new Date()
            };
          }
          return set;
        })
      );
      
      toast({
        title: "Card Removed",
        description: "Flashcard has been removed from the set"
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to remove flashcard from set",
        variant: "destructive"
      });
      throw err;
    }
  }, [toast]);

  const importFlashcards = useCallback(async (fileContent: string, options: ImportOptions): Promise<ImportResult> => {
    try {
      const result = await ContentService.importFlashcards(fileContent, options.format);
      
      setFlashcards((prev) => [...prev, ...result]);
      
      // Simulate the ImportResult structure since our ContentService doesn't return this format
      const importResult: ImportResult = {
        imported: result,
        failed: [],
        totalProcessed: result.length
      };
      
      toast({
        title: "Import Successful",
        description: `Imported ${result.length} flashcards`
      });
      
      return importResult;
    } catch (err) {
      toast({
        title: "Import Failed",
        description: "Failed to import flashcards",
        variant: "destructive"
      });
      throw err;
    }
  }, [toast]);

  const exportFlashcards = useCallback(async (format: 'csv' | 'json', flashcardIds?: string[]): Promise<string> => {
    try {
      let cardsToExport = flashcards;
      
      if (flashcardIds && flashcardIds.length > 0) {
        cardsToExport = flashcards.filter(card => flashcardIds.includes(card.id));
      }
      
      // If we have no cards to export, throw an error
      if (cardsToExport.length === 0) {
        throw new Error('No flashcards to export');
      }
      
      const exportData = await ContentService.exportFlashcards(format);
      
      toast({
        title: "Export Successful",
        description: `Exported ${cardsToExport.length} flashcards`
      });
      
      return exportData;
    } catch (err) {
      toast({
        title: "Export Failed",
        description: "Failed to export flashcards",
        variant: "destructive"
      });
      throw err;
    }
  }, [flashcards, toast]);

  const reviewFlashcard = useCallback(async (id: string, correct: boolean): Promise<Flashcard> => {
    try {
      const card = flashcards.find(c => c.id === id);
      if (!card) throw new Error('Flashcard not found');
      
      let newLevel = card.level;
      
      if (correct) {
        // Increase level (capped at 7)
        newLevel = Math.min(7, card.level + 1);
      } else {
        // Decrease level (minimum 0)
        newLevel = Math.max(0, card.level - 1);
      }
      
      const dueDate = calculateNextReviewDate(newLevel);
      
      const updatedCard = await updateFlashcard(id, {
        level: newLevel,
        dueDate,
        lastReviewed: new Date()
      });
      
      return updatedCard;
    } catch (err) {
      toast({
        title: "Review Failed",
        description: "Failed to update flashcard review",
        variant: "destructive"
      });
      throw err;
    }
  }, [flashcards, toast, updateFlashcard]);

  const markAsMastered = useCallback(async (id: string): Promise<Flashcard> => {
    try {
      return await updateFlashcard(id, { mastered: true });
    } catch (err) {
      toast({
        title: "Update Failed",
        description: "Failed to mark flashcard as mastered",
        variant: "destructive"
      });
      throw err;
    }
  }, [updateFlashcard, toast]);

  const resetMastered = useCallback(async (id: string): Promise<Flashcard> => {
    try {
      return await updateFlashcard(id, { 
        mastered: false,
        level: 0,
        dueDate: new Date()
      });
    } catch (err) {
      toast({
        title: "Update Failed",
        description: "Failed to reset flashcard mastery",
        variant: "destructive"
      });
      throw err;
    }
  }, [updateFlashcard, toast]);

  const getStats = useCallback(() => {
    const total = flashcards.length;
    const mastered = flashcards.filter(card => card.mastered).length;
    const now = new Date();
    const dueToday = flashcards.filter(card => 
      !card.mastered && card.dueDate <= now
    ).length;
    
    return { total, mastered, dueToday };
  }, [flashcards]);

  const getDueFlashcards = useCallback(() => {
    const now = new Date();
    return flashcards.filter(card => 
      !card.mastered && card.dueDate <= now
    );
  }, [flashcards]);

  const getFlashcardById = useCallback((id: string) => {
    return flashcards.find(card => card.id === id);
  }, [flashcards]);

  const createStudySession = useCallback(async (setId: string): Promise<FlashcardStudySession> => {
    try {
      const set = flashcardSets.find(s => s.id === setId);
      if (!set) throw new Error('Flashcard set not found');
      
      const newSession: FlashcardStudySession = {
        id: uuidv4(),
        setId,
        userId: 'current-user', // In a real app, get from auth context
        startTime: new Date(),
        cardsStudied: [],
        cardsCorrect: [],
        cardsIncorrect: [],
        createdAt: new Date()
      };
      
      setStudySessions((prev) => [...prev, newSession]);
      
      return newSession;
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create study session",
        variant: "destructive"
      });
      throw err;
    }
  }, [flashcardSets, toast]);

  const updateStudySession = useCallback(async (id: string, data: Partial<FlashcardStudySession>): Promise<FlashcardStudySession> => {
    try {
      setStudySessions((prev) => 
        prev.map(session => session.id === id ? { ...session, ...data } : session)
      );
      
      const updatedSession = studySessions.find(session => session.id === id);
      if (!updatedSession) throw new Error('Study session not found');
      
      return updatedSession;
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update study session",
        variant: "destructive"
      });
      throw err;
    }
  }, [studySessions, toast]);

  const completeStudySession = useCallback(async (
    id: string, 
    results: { correct: string[], incorrect: string[] }
  ): Promise<FlashcardStudySession> => {
    try {
      const session = studySessions.find(s => s.id === id);
      if (!session) throw new Error('Study session not found');
      
      const correctCards = results.correct.map(cardId => {
        const card = flashcards.find(c => c.id === cardId);
        if (!card) throw new Error(`Flashcard ${cardId} not found`);
        return card;
      });
      
      const incorrectCards = results.incorrect.map(cardId => {
        const card = flashcards.find(c => c.id === cardId);
        if (!card) throw new Error(`Flashcard ${cardId} not found`);
        return card;
      });
      
      // Update all the correct cards (increase level)
      await Promise.all(correctCards.map(card => 
        reviewFlashcard(card.id, true)
      ));
      
      // Update all the incorrect cards (decrease level)
      await Promise.all(incorrectCards.map(card => 
        reviewFlashcard(card.id, false)
      ));
      
      const updatedSession = await updateStudySession(id, {
        endTime: new Date(),
        cardsStudied: [...correctCards, ...incorrectCards],
        cardsCorrect: correctCards,
        cardsIncorrect: incorrectCards
      });
      
      toast({
        title: "Study Session Completed",
        description: `Completed with ${correctCards.length} correct out of ${correctCards.length + incorrectCards.length}`
      });
      
      return updatedSession;
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to complete study session",
        variant: "destructive"
      });
      throw err;
    }
  }, [flashcards, reviewFlashcard, studySessions, updateStudySession, toast]);

  return {
    flashcards,
    flashcardSets,
    studySessions,
    loading,
    error,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
    createFlashcardSet,
    updateFlashcardSet,
    deleteFlashcardSet,
    addFlashcardToSet,
    removeFlashcardFromSet,
    importFlashcards,
    exportFlashcards,
    reviewFlashcard,
    markAsMastered,
    resetMastered,
    getStats,
    getDueFlashcards,
    getFlashcardById,
    createStudySession,
    updateStudySession,
    completeStudySession
  };
};

export default useFlashcards;
