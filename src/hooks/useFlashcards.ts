
import { useState, useEffect } from 'react';
import { Flashcard, FlashcardSet, FlashcardStats } from '@/types/interface-fixes';

const mockFlashcards: Flashcard[] = [
  {
    id: '1',
    italian: 'casa',
    english: 'house',
    level: 0,
    mastered: false,
    tags: ['basics', 'nouns'],
    createdAt: new Date(),
    updatedAt: new Date(),
    nextReview: new Date(),
    lastReviewed: null
  },
  {
    id: '2',
    italian: 'cane',
    english: 'dog',
    level: 1,
    mastered: false,
    tags: ['animals'],
    createdAt: new Date(),
    updatedAt: new Date(),
    nextReview: new Date(),
    lastReviewed: new Date()
  }
];

const mockFlashcardSets: FlashcardSet[] = [
  {
    id: '1',
    name: 'Basic Italian',
    description: 'Common Italian words and phrases',
    tags: ['basics', 'beginner'],
    cards: mockFlashcards,
    createdAt: new Date(),
    updatedAt: new Date(),
    totalCards: mockFlashcards.length,
    masteredCards: 0,
    category: 'general',
    difficulty: 'beginner',
    isPublic: true,
    creator: 'system',
    isFavorite: false
  }
];

export interface ImportOptions {
  italianColumn: string;
  englishColumn: string;
  tagsColumn: string;
}

export interface ImportResult {
  success: boolean;
  importedCards?: Flashcard[];
  imported?: number;
  failed?: number;
  skipped?: number;
  errors?: string[];
}

export type ImportFormat = 'csv' | 'json' | 'anki' | 'quizlet';

export interface UseFlashcardsReturn {
  flashcards: Flashcard[];
  flashcardSets: FlashcardSet[];
  stats: FlashcardStats;
  createFlashcardSet: (setData: Omit<FlashcardSet, 'id' | 'createdAt' | 'updatedAt' | 'totalCards' | 'masteredCards'>) => FlashcardSet;
  updateFlashcardSet: (id: string, data: Partial<FlashcardSet>) => void;
  deleteFlashcardSet: (id: string) => void;
  addFlashcard: (card: Omit<Flashcard, 'id' | 'createdAt' | 'updatedAt'>) => Flashcard;
  updateFlashcard: (id: string, data: Partial<Flashcard>) => void;
  deleteFlashcard: (id: string) => void;
  addCardToSet: (setId: string, cardId: string) => void;
  removeCardFromSet: (setId: string, cardId: string) => void;
  markCardAsMastered: (id: string, mastered: boolean) => void;
  updateCardDifficulty: (id: string, level: number) => void;
  getDueCards: () => Flashcard[];
  getDifficultCards: () => Flashcard[];
  allTags: string[];
  importCards: (cards: Partial<Flashcard>[]) => ImportResult;
}

export const useFlashcards = (): UseFlashcardsReturn => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>(mockFlashcards);
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>(mockFlashcardSets);
  
  // Extract all unique tags
  const allTags = [...new Set(flashcards.flatMap(card => card.tags))];
  
  // Calculate stats
  const stats: FlashcardStats = {
    totalReviews: flashcards.reduce((sum, card) => sum + (card.lastReviewed ? 1 : 0), 0),
    correctReviews: flashcards.filter(card => card.level >= 2).length,
    averageScore: flashcards.length 
      ? flashcards.reduce((sum, card) => sum + card.level, 0) / flashcards.length * 25 // 0-4 scale to 0-100
      : 0,
    streak: 5, // Mock streak value
    lastReviewDate: new Date(Date.now() - 86400000), // Yesterday
  };
  
  // Create a new flashcard
  const addFlashcard = (card: Omit<Flashcard, 'id' | 'createdAt' | 'updatedAt'>): Flashcard => {
    const newCard: Flashcard = {
      ...card,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setFlashcards(prev => [...prev, newCard]);
    return newCard;
  };
  
  // Update an existing flashcard
  const updateFlashcard = (id: string, data: Partial<Flashcard>) => {
    setFlashcards(prev => 
      prev.map(card => 
        card.id === id 
          ? { ...card, ...data, updatedAt: new Date() } 
          : card
      )
    );
  };
  
  // Delete a flashcard
  const deleteFlashcard = (id: string) => {
    setFlashcards(prev => prev.filter(card => card.id !== id));
    
    // Also remove from any sets
    setFlashcardSets(prevSets => 
      prevSets.map(set => ({
        ...set,
        cards: set.cards.filter(card => card.id !== id),
        totalCards: set.cards.filter(card => card.id !== id).length
      }))
    );
  };
  
  // Create a new flashcard set
  const createFlashcardSet = (setData: Omit<FlashcardSet, 'id' | 'createdAt' | 'updatedAt' | 'totalCards' | 'masteredCards'>): FlashcardSet => {
    const newSet: FlashcardSet = {
      ...setData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      totalCards: setData.cards ? setData.cards.length : 0,
      masteredCards: setData.cards ? setData.cards.filter(card => card.mastered).length : 0
    };
    
    setFlashcardSets(prev => [...prev, newSet]);
    return newSet;
  };
  
  // Update a flashcard set
  const updateFlashcardSet = (id: string, data: Partial<FlashcardSet>) => {
    setFlashcardSets(prevSets => 
      prevSets.map(set => 
        set.id === id 
          ? { ...set, ...data, updatedAt: new Date() } 
          : set
      )
    );
  };
  
  // Delete a flashcard set
  const deleteFlashcardSet = (id: string) => {
    setFlashcardSets(prevSets => prevSets.filter(set => set.id !== id));
  };
  
  // Add a card to a set
  const addCardToSet = (setId: string, cardId: string) => {
    const card = flashcards.find(c => c.id === cardId);
    if (!card) return;
    
    setFlashcardSets(prevSets => 
      prevSets.map(set => {
        if (set.id !== setId) return set;
        
        // Check if card is already in the set
        if (set.cards.some(c => c.id === cardId)) return set;
        
        const updatedCards = [...set.cards, card];
        return {
          ...set,
          cards: updatedCards,
          totalCards: updatedCards.length,
          masteredCards: updatedCards.filter(c => c.mastered).length,
          updatedAt: new Date()
        };
      })
    );
  };
  
  // Remove a card from a set
  const removeCardFromSet = (setId: string, cardId: string) => {
    setFlashcardSets(prevSets => 
      prevSets.map(set => {
        if (set.id !== setId) return set;
        
        const updatedCards = set.cards.filter(card => card.id !== cardId);
        return {
          ...set,
          cards: updatedCards,
          totalCards: updatedCards.length,
          masteredCards: updatedCards.filter(card => card.mastered).length,
          updatedAt: new Date()
        };
      })
    );
  };
  
  // Mark a card as mastered/unmastered
  const markCardAsMastered = (id: string, mastered: boolean) => {
    updateFlashcard(id, { mastered });
    
    // Update mastered count in sets
    setFlashcardSets(prevSets => 
      prevSets.map(set => {
        const cardIndex = set.cards.findIndex(card => card.id === id);
        if (cardIndex === -1) return set;
        
        const updatedCards = [...set.cards];
        updatedCards[cardIndex] = { ...updatedCards[cardIndex], mastered };
        
        return {
          ...set,
          cards: updatedCards,
          masteredCards: updatedCards.filter(card => card.mastered).length,
          updatedAt: new Date()
        };
      })
    );
  };
  
  // Update card difficulty
  const updateCardDifficulty = (id: string, level: number) => {
    // Calculate next review date based on spaced repetition algorithm
    const nextReview = new Date();
    const daysToAdd = level === 0 ? 1 : Math.pow(2, level);
    nextReview.setDate(nextReview.getDate() + daysToAdd);
    
    updateFlashcard(id, { level, nextReview, lastReviewed: new Date() });
  };
  
  // Get cards due for review today
  const getDueCards = () => {
    const today = new Date();
    return flashcards.filter(card => {
      if (card.mastered) return false;
      if (!card.nextReview) return true;
      const reviewDate = new Date(card.nextReview);
      return today >= reviewDate;
    });
  };
  
  // Get difficult cards (level 0-2)
  const getDifficultCards = () => {
    return flashcards.filter(card => !card.mastered && card.level <= 2);
  };
  
  // Import cards
  const importCards = (cards: Partial<Flashcard>[]): ImportResult => {
    try {
      const importedCards = cards.map(card => {
        return addFlashcard({
          italian: card.italian || '',
          english: card.english || '',
          level: card.level || 0,
          mastered: card.mastered || false,
          tags: card.tags || [],
          nextReview: new Date(),
          lastReviewed: null
        });
      });
      
      return {
        success: true,
        importedCards,
        imported: importedCards.length,
        failed: 0,
        skipped: 0,
        errors: []
      };
    } catch (error) {
      console.error('Failed to import cards:', error);
      return { 
        success: false,
        imported: 0,
        failed: cards.length,
        skipped: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  };
  
  return {
    flashcards,
    flashcardSets,
    stats,
    addFlashcard,
    updateFlashcard,
    deleteFlashcard,
    createFlashcardSet,
    updateFlashcardSet,
    deleteFlashcardSet,
    addCardToSet,
    removeCardFromSet,
    markCardAsMastered,
    updateCardDifficulty,
    getDueCards,
    getDifficultCards,
    allTags,
    importCards
  };
};
