import { useState, useCallback, useEffect } from 'react';
import { Flashcard, FlashcardSet, FlashcardStats } from '@/types/interface-fixes';
import { v4 as uuidv4 } from 'uuid';

export const useFlashcards = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>(() => {
    const savedFlashcards = localStorage.getItem('flashcards');
    return savedFlashcards ? JSON.parse(savedFlashcards) : [];
  });
  
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>(() => {
    const savedSets = localStorage.getItem('flashcard-sets');
    return savedSets ? JSON.parse(savedSets) : [];
  });
  
  useEffect(() => {
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
  }, [flashcards]);
  
  useEffect(() => {
    localStorage.setItem('flashcard-sets', JSON.stringify(flashcardSets));
  }, [flashcardSets]);
  
  const addFlashcard = useCallback((flashcard: Omit<Flashcard, 'id' | 'createdAt' | 'updatedAt'>): Flashcard => {
    const now = new Date();
    const newFlashcard: Flashcard = {
      id: uuidv4(),
      ...flashcard,
      createdAt: now,
      updatedAt: now,
      nextReview: flashcard.nextReview || now
    };
    
    setFlashcards(prev => [...prev, newFlashcard]);
    return newFlashcard;
  }, []);
  
  const updateFlashcard = useCallback((id: string, updates: Partial<Flashcard>): Flashcard | null => {
    let updatedCard: Flashcard | null = null;
    
    setFlashcards(prev => {
      const index = prev.findIndex(card => card.id === id);
      if (index === -1) return prev;
      
      const updated = {
        ...prev[index],
        ...updates,
        updatedAt: new Date()
      };
      
      updatedCard = updated;
      const newCards = [...prev];
      newCards[index] = updated;
      return newCards;
    });
    
    return updatedCard;
  }, []);
  
  const deleteFlashcard = useCallback((id: string): boolean => {
    let deleted = false;
    
    setFlashcards(prev => {
      const index = prev.findIndex(card => card.id === id);
      if (index === -1) return prev;
      
      deleted = true;
      const newCards = [...prev];
      newCards.splice(index, 1);
      return newCards;
    });
    
    setFlashcardSets(prev => {
      return prev.map(set => ({
        ...set,
        cards: set.cards.filter(card => card.id !== id),
        totalCards: set.cards.filter(card => card.id !== id).length,
        masteredCards: set.cards.filter(card => card.id !== id && card.mastered).length
      }));
    });
    
    return deleted;
  }, []);
  
  const createFlashcardSet = useCallback((set: Omit<FlashcardSet, 'id' | 'cards' | 'createdAt' | 'updatedAt' | 'totalCards' | 'masteredCards' | 'tags' | 'isFavorite' | 'creator'>): FlashcardSet => {
    const now = new Date();
    const newSet: FlashcardSet = {
      id: uuidv4(),
      cards: [],
      totalCards: 0,
      masteredCards: 0,
      tags: [],
      creator: 'user',
      isFavorite: false,
      createdAt: now,
      updatedAt: now,
      ...set
    };
    
    setFlashcardSets(prev => [...prev, newSet]);
    return newSet;
  }, []);
  
  const addCardToSet = useCallback((setId: string, cardId: string): boolean => {
    let added = false;
    
    setFlashcardSets(prev => {
      const setIndex = prev.findIndex(set => set.id === setId);
      if (setIndex === -1) return prev;
      
      const card = flashcards.find(card => card.id === cardId);
      if (!card) return prev;
      
      if (prev[setIndex].cards.some(c => c.id === cardId)) {
        return prev;
      }
      
      added = true;
      const newSets = [...prev];
      newSets[setIndex] = {
        ...newSets[setIndex],
        cards: [...newSets[setIndex].cards, card],
        totalCards: newSets[setIndex].totalCards + 1,
        masteredCards: card.mastered ? newSets[setIndex].masteredCards + 1 : newSets[setIndex].masteredCards,
        updatedAt: new Date()
      };
      
      return newSets;
    });
    
    return added;
  }, [flashcards]);
  
  const removeCardFromSet = useCallback((setId: string, cardId: string): boolean => {
    let removed = false;
    
    setFlashcardSets(prev => {
      const setIndex = prev.findIndex(set => set.id === setId);
      if (setIndex === -1) return prev;
      
      const cardIndex = prev[setIndex].cards.findIndex(card => card.id === cardId);
      if (cardIndex === -1) return prev;
      
      removed = true;
      const newSets = [...prev];
      const card = newSets[setIndex].cards[cardIndex];
      newSets[setIndex] = {
        ...newSets[setIndex],
        cards: newSets[setIndex].cards.filter(c => c.id !== cardId),
        totalCards: newSets[setIndex].totalCards - 1,
        masteredCards: card.mastered ? newSets[setIndex].masteredCards - 1 : newSets[setIndex].masteredCards,
        updatedAt: new Date()
      };
      
      return newSets;
    });
    
    return removed;
  }, []);
  
  const markCardAsMastered = useCallback((cardId: string, mastered: boolean = true): Flashcard | null => {
    const card = updateFlashcard(cardId, { mastered });
    
    if (card) {
      setFlashcardSets(prev => {
        return prev.map(set => {
          const hasCard = set.cards.some(c => c.id === cardId);
          if (!hasCard) return set;
          
          return {
            ...set,
            cards: set.cards.map(c => c.id === cardId ? card : c),
            masteredCards: mastered
              ? set.masteredCards + 1
              : Math.max(0, set.masteredCards - 1)
          };
        });
      });
    }
    
    return card;
  }, [updateFlashcard]);
  
  const updateCardDifficulty = useCallback((cardId: string, rating: number): Flashcard | null => {
    const now = new Date();
    let nextReviewDays = 1;
    let newLevel = 0;
    
    if (rating >= 4) {
      const card = flashcards.find(c => c.id === cardId);
      newLevel = card ? Math.min(5, card.level + 1) : 1;
      nextReviewDays = Math.pow(2, newLevel);
    } else if (rating >= 3) {
      const card = flashcards.find(c => c.id === cardId);
      newLevel = card ? card.level : 0;
      nextReviewDays = Math.max(1, Math.pow(1.5, newLevel));
    } else {
      const card = flashcards.find(c => c.id === cardId);
      newLevel = card ? Math.max(0, card.level - 1) : 0;
      nextReviewDays = 1;
    }
    
    const nextReview = new Date(now);
    nextReview.setDate(nextReview.getDate() + nextReviewDays);
    
    return updateFlashcard(cardId, {
      level: newLevel,
      lastReviewed: now,
      nextReview,
      mastered: newLevel >= 5
    });
  }, [flashcards, updateFlashcard]);
  
  const allTags = [...new Set(flashcards.flatMap(card => card.tags))];
  
  const getDueCards = useCallback((): Flashcard[] => {
    const now = new Date();
    return flashcards.filter(card => !card.mastered && new Date(card.nextReview) <= now);
  }, [flashcards]);
  
  const getDifficultCards = useCallback((): Flashcard[] => {
    return flashcards.filter(card => !card.mastered && card.level <= 1);
  }, [flashcards]);
  
  const getFlashcardStats = useCallback((): FlashcardStats => {
    const total = flashcards.length;
    const mastered = flashcards.filter(card => card.mastered).length;
    const learning = flashcards.filter(card => !card.mastered).length;
    const toReview = getDueCards().length;
    
    const masteredCards = flashcards.filter(card => card.mastered && card.lastReviewed);
    let totalDays = 0;
    
    masteredCards.forEach(card => {
      if (card.lastReviewed && card.createdAt) {
        const msDiff = new Date(card.lastReviewed).getTime() - new Date(card.createdAt).getTime();
        totalDays += msDiff / (1000 * 60 * 60 * 24);
      }
    });
    
    const avgMasteryTime = masteredCards.length > 0 ? totalDays / masteredCards.length : 0;
    
    return {
      total,
      mastered,
      learning,
      toReview,
      avgMasteryTime
    };
  }, [flashcards, getDueCards]);
  
  const importCards = useCallback((cards: Partial<Flashcard>[]): Flashcard[] => {
    const importedCards: Flashcard[] = [];
    
    cards.forEach(card => {
      if (card.italian && card.english) {
        const newCard = addFlashcard({
          italian: card.italian,
          english: card.english,
          explanation: card.explanation || '',
          level: card.level || 0,
          mastered: card.mastered || false,
          tags: card.tags || [],
          nextReview: new Date(),
          lastReviewed: null
        });
        
        importedCards.push(newCard);
      }
    });
    
    return importedCards;
  }, [addFlashcard]);
  
  const exportCards = useCallback((): string => {
    return JSON.stringify(flashcards, null, 2);
  }, [flashcards]);
  
  const getFlashcardSetById = useCallback((id: string): FlashcardSet | undefined => {
    return flashcardSets.find(set => set.id === id);
  }, [flashcardSets]);
  
  return {
    flashcards,
    flashcardSets,
    addFlashcard,
    updateFlashcard,
    deleteFlashcard,
    createFlashcardSet,
    addCardToSet,
    removeCardFromSet,
    markCardAsMastered,
    updateCardDifficulty,
    getFlashcardStats,
    importCards,
    exportCards,
    allTags,
    getDueCards,
    getDifficultCards,
    getFlashcardSetById
  };
};

export default useFlashcards;
