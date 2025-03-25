
import { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { Flashcard } from '@/services/ContentService';

export interface FlashcardSet {
  id: string;
  title: string;
  description: string;
  cards: Flashcard[];
  language: 'english' | 'italian';
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FlashcardStudySession {
  id: string;
  setId: string;
  cardsStudied: number;
  correctCount: number;
  startedAt: Date;
  completedAt?: Date;
  duration?: number; // in seconds
}

export interface UseFlashcardsReturn {
  flashcards: Flashcard[];
  addFlashcard: (card: Omit<Flashcard, 'id' | 'mastered' | 'createdAt'>) => Flashcard;
  deleteFlashcard: (id: string) => void;
  updateFlashcard: (id: string, updates: Partial<Flashcard>) => void;
  toggleMastery: (id: string) => void;
  
  flashcardSets: FlashcardSet[];
  addFlashcardSet: (set: Omit<FlashcardSet, 'id' | 'createdAt' | 'updatedAt'>) => FlashcardSet;
  deleteFlashcardSet: (id: string) => void;
  updateFlashcardSet: (id: string, updates: Partial<Omit<FlashcardSet, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  getFlashcardSetById: (id: string) => FlashcardSet | undefined;
  addCardToSet: (setId: string, card: Omit<Flashcard, 'id' | 'mastered' | 'createdAt'>) => void;
  removeCardFromSet: (setId: string, cardId: string) => void;
  
  studySessions: FlashcardStudySession[];
  startStudySession: (setId: string) => FlashcardStudySession;
  completeStudySession: (sessionId: string, results: { correctCount: number }) => void;
  deleteStudySession: (id: string) => void;
  
  importFlashcards: (fileContent: string, format: 'csv' | 'json') => Promise<Flashcard[]>;
  exportFlashcards: (format: 'csv' | 'json', onlyMastered?: boolean) => string;
  exportFlashcardSet: (setId: string, format: 'csv' | 'json') => string;
  
  getMasteryStats: () => { total: number; mastered: number; percentage: number };
  getRecentlyStudied: () => Flashcard[];
  getDueForReview: () => Flashcard[];
}

export const useFlashcards = (): UseFlashcardsReturn => {
  const { toast } = useToast();
  
  // State for flashcards and flashcard sets
  const [flashcards, setFlashcards] = useLocalStorage<Flashcard[]>('flashcards', []);
  const [flashcardSets, setFlashcardSets] = useLocalStorage<FlashcardSet[]>('flashcard-sets', []);
  const [studySessions, setStudySessions] = useLocalStorage<FlashcardStudySession[]>('study-sessions', []);
  
  // Add a flashcard
  const addFlashcard = useCallback((card: Omit<Flashcard, 'id' | 'mastered' | 'createdAt'>): Flashcard => {
    try {
      const newCard: Flashcard = {
        ...card,
        id: uuidv4(),
        mastered: false,
        level: 0,
        createdAt: new Date(),
        lastReviewed: new Date(),
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000) // Due in 1 day
      };
      
      setFlashcards((prev: Flashcard[]) => [...prev, newCard]);
      
      toast({
        title: "Flashcard Added",
        description: `Successfully added "${card.italian} - ${card.english}"`,
      });
      
      return newCard;
    } catch (error) {
      console.error("Error adding flashcard:", error);
      toast({
        title: "Error Adding Flashcard",
        description: "There was a problem adding the flashcard.",
        variant: "destructive"
      });
      throw error;
    }
  }, [setFlashcards, toast]);
  
  // Delete a flashcard
  const deleteFlashcard = useCallback((id: string) => {
    try {
      setFlashcards((prev: Flashcard[]) => prev.filter(card => card.id !== id));
      
      // Also remove from any sets
      setFlashcardSets((prev: FlashcardSet[]) => 
        prev.map(set => ({
          ...set,
          cards: set.cards.filter(card => card.id !== id),
          updatedAt: new Date()
        }))
      );
      
      toast({
        title: "Flashcard Deleted",
        description: "The flashcard has been deleted.",
      });
    } catch (error) {
      console.error("Error deleting flashcard:", error);
      toast({
        title: "Error Deleting Flashcard",
        description: "There was a problem deleting the flashcard.",
        variant: "destructive"
      });
    }
  }, [setFlashcards, setFlashcardSets, toast]);
  
  // Update a flashcard
  const updateFlashcard = useCallback((id: string, updates: Partial<Flashcard>) => {
    try {
      setFlashcards((prev: Flashcard[]) => prev.map(card => 
        card.id === id
          ? { ...card, ...updates }
          : card
      ));
      
      // Also update in any sets
      setFlashcardSets((prev: FlashcardSet[]) => 
        prev.map(set => ({
          ...set,
          cards: set.cards.map(card => 
            card.id === id
              ? { ...card, ...updates }
              : card
          ),
          updatedAt: new Date()
        }))
      );
    } catch (error) {
      console.error("Error updating flashcard:", error);
      toast({
        title: "Error Updating Flashcard",
        description: "There was a problem updating the flashcard.",
        variant: "destructive"
      });
    }
  }, [setFlashcards, setFlashcardSets, toast]);
  
  // Toggle mastery status
  const toggleMastery = useCallback((id: string) => {
    try {
      setFlashcards((prev: Flashcard[]) => prev.map(card => 
        card.id === id
          ? { 
              ...card, 
              mastered: !card.mastered,
              isMastered: !card.mastered, 
              level: !card.mastered ? 5 : card.level // Set to max level if mastered
            }
          : card
      ));
      
      // Also update in any sets
      setFlashcardSets((prev: FlashcardSet[]) => 
        prev.map(set => ({
          ...set,
          cards: set.cards.map(card => 
            card.id === id
              ? { 
                  ...card, 
                  mastered: !card.mastered,
                  isMastered: !card.mastered, 
                  level: !card.mastered ? 5 : card.level 
                }
              : card
          ),
          updatedAt: new Date()
        }))
      );
      
      const card = flashcards.find(card => card.id === id);
      toast({
        title: card?.mastered ? "Card Unmarked" : "Card Mastered",
        description: card?.mastered 
          ? "The card has been returned to your study list." 
          : "The card has been marked as mastered.",
      });
    } catch (error) {
      console.error("Error toggling mastery:", error);
      toast({
        title: "Error Updating Flashcard",
        description: "There was a problem updating the flashcard.",
        variant: "destructive"
      });
    }
  }, [flashcards, setFlashcards, setFlashcardSets, toast]);
  
  // Add a flashcard set
  const addFlashcardSet = useCallback((set: Omit<FlashcardSet, 'id' | 'createdAt' | 'updatedAt'>): FlashcardSet => {
    try {
      const newSet: FlashcardSet = {
        ...set,
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setFlashcardSets((prev: FlashcardSet[]) => [...prev, newSet]);
      
      toast({
        title: "Flashcard Set Created",
        description: `Successfully created "${set.title}"`,
      });
      
      return newSet;
    } catch (error) {
      console.error("Error adding flashcard set:", error);
      toast({
        title: "Error Creating Flashcard Set",
        description: "There was a problem creating the flashcard set.",
        variant: "destructive"
      });
      throw error;
    }
  }, [setFlashcardSets, toast]);
  
  // Delete a flashcard set
  const deleteFlashcardSet = useCallback((id: string) => {
    try {
      setFlashcardSets((prev: FlashcardSet[]) => prev.filter(set => set.id !== id));
      
      toast({
        title: "Flashcard Set Deleted",
        description: "The flashcard set has been deleted.",
      });
    } catch (error) {
      console.error("Error deleting flashcard set:", error);
      toast({
        title: "Error Deleting Flashcard Set",
        description: "There was a problem deleting the flashcard set.",
        variant: "destructive"
      });
    }
  }, [setFlashcardSets, toast]);
  
  // Update a flashcard set
  const updateFlashcardSet = useCallback((id: string, updates: Partial<Omit<FlashcardSet, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      setFlashcardSets((prev: FlashcardSet[]) => prev.map(set => 
        set.id === id
          ? { ...set, ...updates, updatedAt: new Date() }
          : set
      ));
    } catch (error) {
      console.error("Error updating flashcard set:", error);
      toast({
        title: "Error Updating Flashcard Set",
        description: "There was a problem updating the flashcard set.",
        variant: "destructive"
      });
    }
  }, [setFlashcardSets, toast]);
  
  // Get a flashcard set by ID
  const getFlashcardSetById = useCallback((id: string) => {
    return flashcardSets.find(set => set.id === id);
  }, [flashcardSets]);
  
  // Add a card to a set
  const addCardToSet = useCallback((setId: string, card: Omit<Flashcard, 'id' | 'mastered' | 'createdAt'>) => {
    try {
      // First add the card to the general flashcards if it doesn't exist
      let cardToAdd: Flashcard;
      const existingCard = flashcards.find(c => c.italian === card.italian && c.english === card.english);
      
      if (existingCard) {
        cardToAdd = existingCard;
      } else {
        cardToAdd = addFlashcard(card);
      }
      
      // Now add to the set if it's not already there
      setFlashcardSets((prev: FlashcardSet[]) => prev.map(set => {
        if (set.id !== setId) return set;
        
        // Check if the card is already in the set
        const alreadyInSet = set.cards.some(c => c.id === cardToAdd.id);
        if (alreadyInSet) return set;
        
        return {
          ...set,
          cards: [...set.cards, cardToAdd],
          updatedAt: new Date()
        };
      }));
      
      toast({
        title: "Card Added to Set",
        description: `Successfully added "${card.italian} - ${card.english}" to the set.`,
      });
    } catch (error) {
      console.error("Error adding card to set:", error);
      toast({
        title: "Error Adding Card to Set",
        description: "There was a problem adding the card to the set.",
        variant: "destructive"
      });
    }
  }, [flashcards, addFlashcard, setFlashcardSets, toast]);
  
  // Remove a card from a set
  const removeCardFromSet = useCallback((setId: string, cardId: string) => {
    try {
      setFlashcardSets((prev: FlashcardSet[]) => prev.map(set => {
        if (set.id !== setId) return set;
        
        return {
          ...set,
          cards: set.cards.filter(card => card.id !== cardId),
          updatedAt: new Date()
        };
      }));
      
      toast({
        title: "Card Removed from Set",
        description: "The card has been removed from the set.",
      });
    } catch (error) {
      console.error("Error removing card from set:", error);
      toast({
        title: "Error Removing Card",
        description: "There was a problem removing the card from the set.",
        variant: "destructive"
      });
    }
  }, [setFlashcardSets, toast]);
  
  // Start a study session
  const startStudySession = useCallback((setId: string): FlashcardStudySession => {
    try {
      const session: FlashcardStudySession = {
        id: uuidv4(),
        setId,
        cardsStudied: 0,
        correctCount: 0,
        startedAt: new Date()
      };
      
      setStudySessions((prev: FlashcardStudySession[]) => [...prev, session]);
      
      return session;
    } catch (error) {
      console.error("Error starting study session:", error);
      toast({
        title: "Error Starting Session",
        description: "There was a problem starting the study session.",
        variant: "destructive"
      });
      throw error;
    }
  }, [setStudySessions, toast]);
  
  // Complete a study session
  const completeStudySession = useCallback((sessionId: string, results: { correctCount: number }) => {
    try {
      setStudySessions((prev: FlashcardStudySession[]) => prev.map(session => {
        if (session.id !== sessionId) return session;
        
        const completedAt = new Date();
        const duration = Math.round((completedAt.getTime() - new Date(session.startedAt).getTime()) / 1000);
        
        return {
          ...session,
          correctCount: results.correctCount,
          cardsStudied: getFlashcardSetById(session.setId)?.cards.length || 0,
          completedAt,
          duration
        };
      }));
      
      toast({
        title: "Study Session Completed",
        description: `You got ${results.correctCount} cards correct!`,
      });
    } catch (error) {
      console.error("Error completing study session:", error);
      toast({
        title: "Error Completing Session",
        description: "There was a problem saving your study session.",
        variant: "destructive"
      });
    }
  }, [setStudySessions, getFlashcardSetById, toast]);
  
  // Delete a study session
  const deleteStudySession = useCallback((id: string) => {
    try {
      setStudySessions((prev: FlashcardStudySession[]) => prev.filter(session => session.id !== id));
    } catch (error) {
      console.error("Error deleting study session:", error);
      toast({
        title: "Error Deleting Session",
        description: "There was a problem deleting the study session.",
        variant: "destructive"
      });
    }
  }, [setStudySessions, toast]);
  
  // Import flashcards
  const importFlashcards = useCallback(async (fileContent: string, format: 'csv' | 'json'): Promise<Flashcard[]> => {
    try {
      let importedCards: Flashcard[] = [];
      
      if (format === 'csv') {
        const lines = fileContent.split('\n');
        const headers = lines[0].toLowerCase().split(',');
        
        const italianIndex = headers.findIndex(h => h.includes('italian') || h.includes('italiano'));
        const englishIndex = headers.findIndex(h => h.includes('english') || h.includes('inglese'));
        
        if (italianIndex === -1 || englishIndex === -1) {
          throw new Error('CSV file must contain columns for Italian and English words');
        }
        
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          const values = line.split(',');
          const italian = values[italianIndex]?.trim();
          const english = values[englishIndex]?.trim();
          
          if (italian && english) {
            const newCard = addFlashcard({ italian, english });
            importedCards.push(newCard);
          }
        }
      } else if (format === 'json') {
        try {
          const parsed = JSON.parse(fileContent);
          
          if (Array.isArray(parsed)) {
            for (const item of parsed) {
              if (item.italian && item.english) {
                const newCard = addFlashcard({
                  italian: item.italian,
                  english: item.english
                });
                importedCards.push(newCard);
              }
            }
          }
        } catch (e) {
          throw new Error('Invalid JSON format');
        }
      }
      
      toast({
        title: "Import Successful",
        description: `Imported ${importedCards.length} flashcards.`,
      });
      
      return importedCards;
    } catch (error) {
      console.error("Error importing flashcards:", error);
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Failed to import flashcards",
        variant: "destructive"
      });
      throw error;
    }
  }, [addFlashcard, toast]);
  
  // Export flashcards
  const exportFlashcards = useCallback((format: 'csv' | 'json', onlyMastered: boolean = false): string => {
    try {
      const cardsToExport = onlyMastered 
        ? flashcards.filter(card => card.mastered) 
        : flashcards;
      
      if (format === 'csv') {
        const headers = 'italian,english,mastered\n';
        const rows = cardsToExport.map(card => 
          `${card.italian},${card.english},${card.mastered ? 'true' : 'false'}`
        ).join('\n');
        
        return headers + rows;
      } else {
        return JSON.stringify(cardsToExport, null, 2);
      }
    } catch (error) {
      console.error("Error exporting flashcards:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export flashcards",
        variant: "destructive"
      });
      throw error;
    }
  }, [flashcards, toast]);
  
  // Export a specific flashcard set
  const exportFlashcardSet = useCallback((setId: string, format: 'csv' | 'json'): string => {
    try {
      const set = getFlashcardSetById(setId);
      
      if (!set) {
        throw new Error('Flashcard set not found');
      }
      
      if (format === 'csv') {
        const headers = 'italian,english,mastered\n';
        const rows = set.cards.map(card => 
          `${card.italian},${card.english},${card.mastered ? 'true' : 'false'}`
        ).join('\n');
        
        return headers + rows;
      } else {
        return JSON.stringify({
          title: set.title,
          description: set.description,
          language: set.language,
          category: set.category,
          cards: set.cards
        }, null, 2);
      }
    } catch (error) {
      console.error("Error exporting flashcard set:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export flashcard set",
        variant: "destructive"
      });
      throw error;
    }
  }, [getFlashcardSetById, toast]);
  
  // Get mastery statistics
  const getMasteryStats = useCallback(() => {
    const total = flashcards.length;
    const mastered = flashcards.filter(card => card.mastered).length;
    const percentage = total > 0 ? Math.round((mastered / total) * 100) : 0;
    
    return { total, mastered, percentage };
  }, [flashcards]);
  
  // Get recently studied flashcards
  const getRecentlyStudied = useCallback(() => {
    return [...flashcards]
      .filter(card => card.lastReviewed)
      .sort((a, b) => {
        const dateA = a.lastReviewed ? new Date(a.lastReviewed).getTime() : 0;
        const dateB = b.lastReviewed ? new Date(b.lastReviewed).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 10);
  }, [flashcards]);
  
  // Get flashcards due for review
  const getDueForReview = useCallback(() => {
    const now = new Date();
    
    return flashcards
      .filter(card => !card.mastered && card.dueDate && new Date(card.dueDate) <= now)
      .sort((a, b) => {
        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
        return dateA - dateB; // Earliest first
      });
  }, [flashcards]);
  
  // Initialize with sample data if needed
  useEffect(() => {
    if (flashcards.length === 0) {
      const sampleFlashcards = [
        { italian: 'casa', english: 'house' },
        { italian: 'gatto', english: 'cat' },
        { italian: 'cane', english: 'dog' },
        { italian: 'libro', english: 'book' },
        { italian: 'penna', english: 'pen' }
      ];
      
      sampleFlashcards.forEach(card => {
        addFlashcard(card);
      });
      
      // Add a sample set
      if (flashcardSets.length === 0) {
        addFlashcardSet({
          title: 'Basic Italian Vocabulary',
          description: 'Essential words for beginners',
          cards: [],
          language: 'italian',
          category: 'Beginner'
        });
      }
    }
  }, [flashcards.length, flashcardSets.length, addFlashcard, addFlashcardSet]);
  
  return {
    flashcards,
    addFlashcard,
    deleteFlashcard,
    updateFlashcard,
    toggleMastery,
    
    flashcardSets,
    addFlashcardSet,
    deleteFlashcardSet,
    updateFlashcardSet,
    getFlashcardSetById,
    addCardToSet,
    removeCardFromSet,
    
    studySessions,
    startStudySession,
    completeStudySession,
    deleteStudySession,
    
    importFlashcards,
    exportFlashcards,
    exportFlashcardSet,
    
    getMasteryStats,
    getRecentlyStudied,
    getDueForReview
  };
};

export default useFlashcards;
