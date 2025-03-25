import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from './useLocalStorage';
import { Flashcard, FlashcardSet, FlashcardStats, ImportOptions, ImportResult } from '@/types/flashcard';

const DEFAULT_FLASHCARDS: Flashcard[] = [
  {
    id: '1',
    italian: 'Ciao',
    english: 'Hello',
    level: 1,
    mastered: false,
    tags: ['greeting', 'basic'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    italian: 'Grazie',
    english: 'Thank you',
    explanation: 'Used to express gratitude',
    level: 1,
    mastered: false,
    tags: ['courtesy', 'basic'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const DEFAULT_SETS: FlashcardSet[] = [
  {
    id: '1',
    name: 'Basic Italian Greetings',
    description: 'Essential greetings and phrases for beginners',
    tags: ['beginner', 'greetings'],
    cards: ['1', '2'],
    createdAt: new Date(),
    updatedAt: new Date(),
    totalCards: 2,
    masteredCards: 0
  }
];

export interface UseFlashcardsReturn {
  flashcards: Flashcard[];
  flashcardSets: FlashcardSet[];
  createFlashcard: (data: Omit<Flashcard, 'id' | 'createdAt' | 'updatedAt'>) => Flashcard;
  updateFlashcard: (id: string, data: Partial<Flashcard>) => Flashcard | null;
  deleteFlashcard: (id: string) => boolean;
  createFlashcardSet: (data: Omit<FlashcardSet, 'id' | 'createdAt' | 'updatedAt' | 'totalCards' | 'masteredCards'>) => FlashcardSet;
  updateFlashcardSet: (id: string, data: Partial<FlashcardSet>) => FlashcardSet | null;
  deleteFlashcardSet: (id: string) => boolean;
  importFlashcards: (content: string, options: ImportOptions) => Promise<ImportResult>;
  exportFlashcards: (setId?: string, format?: 'csv' | 'json') => string;
  addFlashcardToSet: (flashcardId: string, setId: string) => boolean;
  removeFlashcardFromSet: (flashcardId: string, setId: string) => boolean;
  getStats: () => FlashcardStats;
  markAsMastered: (id: string) => void;
  resetMastered: (id: string) => void;
  getDueFlashcards: () => Flashcard[];
  reviewFlashcard: (id: string, performanceRating: number) => void;
  getFlashcardById: (id: string) => Flashcard | undefined;
  getFlashcardSetById: (id: string) => FlashcardSet | undefined;
}

export const useFlashcards = (): UseFlashcardsReturn => {
  const [flashcards, setFlashcards] = useLocalStorage<Flashcard[]>('flashcards', DEFAULT_FLASHCARDS);
  const [flashcardSets, setFlashcardSets] = useLocalStorage<FlashcardSet[]>('flashcard-sets', DEFAULT_SETS);
  
  const createFlashcard = (data: Omit<Flashcard, 'id' | 'createdAt' | 'updatedAt'>): Flashcard => {
    const now = new Date();
    const newFlashcard: Flashcard = {
      ...data,
      id: uuidv4(),
      level: data.level || 1,
      mastered: data.mastered || false,
      tags: data.tags || [],
      createdAt: now,
      updatedAt: now
    };
    
    setFlashcards((prev: Flashcard[]) => [...prev, newFlashcard]);
    return newFlashcard;
  };
  
  const updateFlashcard = (id: string, data: Partial<Flashcard>): Flashcard | null => {
    let updatedCard: Flashcard | null = null;
    
    setFlashcards((prev: Flashcard[]) => {
      const index = prev.findIndex(card => card.id === id);
      if (index === -1) return prev;
      
      const updatedCards = [...prev];
      updatedCards[index] = {
        ...updatedCards[index],
        ...data,
        updatedAt: new Date()
      };
      
      updatedCard = updatedCards[index];
      return updatedCards;
    });
    
    return updatedCard;
  };
  
  const deleteFlashcard = (id: string): boolean => {
    let success = false;
    
    setFlashcards((prev: Flashcard[]) => {
      const index = prev.findIndex(card => card.id === id);
      if (index === -1) return prev;
      
      success = true;
      const updatedCards = [...prev];
      updatedCards.splice(index, 1);
      return updatedCards;
    });
    
    setFlashcardSets((prevSets: FlashcardSet[]) => {
      return prevSets.map(set => {
        if (set.cards.includes(id)) {
          const updatedCards = set.cards.filter(cardId => cardId !== id);
          return {
            ...set,
            cards: updatedCards,
            totalCards: updatedCards.length,
            masteredCards: calculateMasteredCards(updatedCards, flashcards),
            updatedAt: new Date()
          };
        }
        return set;
      });
    });
    
    return success;
  };
  
  const createFlashcardSet = (data: Omit<FlashcardSet, 'id' | 'createdAt' | 'updatedAt' | 'totalCards' | 'masteredCards'>): FlashcardSet => {
    const now = new Date();
    const newSet: FlashcardSet = {
      ...data,
      id: uuidv4(),
      cards: data.cards || [],
      totalCards: data.cards?.length || 0,
      masteredCards: calculateMasteredCards(data.cards || [], flashcards),
      createdAt: now,
      updatedAt: now
    };
    
    setFlashcardSets((prevSets: FlashcardSet[]) => [...prevSets, newSet]);
    return newSet;
  };
  
  const updateFlashcardSet = (id: string, data: Partial<FlashcardSet>): FlashcardSet | null => {
    let updatedSet: FlashcardSet | null = null;
    
    setFlashcardSets((prevSets: FlashcardSet[]) => {
      const index = prevSets.findIndex(set => set.id === id);
      if (index === -1) return prevSets;
      
      const updatedSets = [...prevSets];
      updatedSets[index] = {
        ...updatedSets[index],
        ...data,
        updatedAt: new Date()
      };
      
      if (data.cards) {
        updatedSets[index].totalCards = data.cards.length;
        updatedSets[index].masteredCards = calculateMasteredCards(data.cards, flashcards);
      }
      
      updatedSet = updatedSets[index];
      return updatedSets;
    });
    
    return updatedSet;
  };
  
  const deleteFlashcardSet = (id: string): boolean => {
    let success = false;
    
    setFlashcardSets((prevSets: FlashcardSet[]) => {
      const index = prevSets.findIndex(set => set.id === id);
      if (index === -1) return prevSets;
      
      success = true;
      const updatedSets = [...prevSets];
      updatedSets.splice(index, 1);
      return updatedSets;
    });
    
    return success;
  };
  
  const addFlashcardToSet = (flashcardId: string, setId: string): boolean => {
    let success = false;
    
    setFlashcardSets((prevSets: FlashcardSet[]) => {
      const setIndex = prevSets.findIndex(set => set.id === setId);
      if (setIndex === -1) return prevSets;
      
      const set = prevSets[setIndex];
      if (set.cards.includes(flashcardId)) return prevSets;
      
      success = true;
      const updatedSets = [...prevSets];
      const updatedCards = [...set.cards, flashcardId];
      
      updatedSets[setIndex] = {
        ...set,
        cards: updatedCards,
        totalCards: updatedCards.length,
        masteredCards: calculateMasteredCards(updatedCards, flashcards),
        updatedAt: new Date()
      };
      
      return updatedSets;
    });
    
    return success;
  };
  
  const removeFlashcardFromSet = (flashcardId: string, setId: string): boolean => {
    let success = false;
    
    setFlashcardSets((prevSets: FlashcardSet[]) => {
      const setIndex = prevSets.findIndex(set => set.id === setId);
      if (setIndex === -1) return prevSets;
      
      const set = prevSets[setIndex];
      if (!set.cards.includes(flashcardId)) return prevSets;
      
      success = true;
      const updatedSets = [...prevSets];
      const updatedCards = set.cards.filter(id => id !== flashcardId);
      
      updatedSets[setIndex] = {
        ...set,
        cards: updatedCards,
        totalCards: updatedCards.length,
        masteredCards: calculateMasteredCards(updatedCards, flashcards),
        updatedAt: new Date()
      };
      
      return updatedSets;
    });
    
    return success;
  };
  
  const calculateMasteredCards = (cardIds: string[], allCards: Flashcard[]): number => {
    return cardIds.reduce((count, id) => {
      const card = allCards.find(c => c.id === id);
      return card?.mastered ? count + 1 : count;
    }, 0);
  };
  
  const getStats = (): FlashcardStats => {
    const totalCards = flashcards.length;
    const masteredCards = flashcards.filter(card => card.mastered).length;
    
    const levels = flashcards.map(card => card.level);
    const averageLevel = levels.length > 0 
      ? levels.reduce((sum, level) => sum + level, 0) / levels.length 
      : 0;
    
    const dueCards = getDueFlashcards().length;
    
    const reviewStreak = 3;
    
    const reviewHistory = [
      {
        date: new Date(Date.now() - 86400000 * 2),
        correct: 8,
        incorrect: 2
      },
      {
        date: new Date(Date.now() - 86400000),
        correct: 12,
        incorrect: 3
      },
      {
        date: new Date(),
        correct: 7,
        incorrect: 1
      }
    ];
    
    return {
      totalCards,
      masteredCards,
      averageLevel,
      dueCards,
      reviewStreak,
      lastReview: reviewHistory[reviewHistory.length - 1]?.date,
      reviewHistory
    };
  };
  
  const markAsMastered = (id: string): void => {
    updateFlashcard(id, { mastered: true });
    
    setFlashcardSets((prevSets: FlashcardSet[]) => {
      return prevSets.map(set => {
        if (set.cards.includes(id)) {
          return {
            ...set,
            masteredCards: set.masteredCards + 1,
            updatedAt: new Date()
          };
        }
        return set;
      });
    });
  };
  
  const resetMastered = (id: string): void => {
    const card = flashcards.find(c => c.id === id);
    if (card?.mastered) {
      updateFlashcard(id, { mastered: false });
      
      setFlashcardSets((prevSets: FlashcardSet[]) => {
        return prevSets.map(set => {
          if (set.cards.includes(id)) {
            return {
              ...set,
              masteredCards: Math.max(0, set.masteredCards - 1),
              updatedAt: new Date()
            };
          }
          return set;
        });
      });
    }
  };
  
  const getDueFlashcards = (): Flashcard[] => {
    const now = new Date();
    return flashcards.filter(card => 
      !card.mastered && 
      (!card.nextReview || card.nextReview <= now)
    );
  };
  
  const reviewFlashcard = (id: string, performanceRating: number): void => {
    const card = flashcards.find(c => c.id === id);
    if (!card) return;
    
    let newLevel = card.level;
    let daysUntilNextReview = 1;
    
    if (performanceRating === 0) {
      newLevel = 1;
      daysUntilNextReview = 1;
    } else if (performanceRating === 1) {
      daysUntilNextReview = card.level;
    } else {
      newLevel = card.level + 1;
      daysUntilNextReview = Math.pow(2, newLevel - 1);
    }
    
    daysUntilNextReview = Math.min(daysUntilNextReview, 90);
    
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + daysUntilNextReview);
    
    updateFlashcard(id, {
      level: newLevel,
      lastReviewed: new Date(),
      nextReview: nextReview,
      mastered: newLevel >= 8
    });
  };
  
  const importFlashcards = async (content: string, options: ImportOptions): Promise<ImportResult> => {
    const result: ImportResult = {
      successful: 0,
      failed: 0,
      warnings: [],
      importedCards: []
    };
    
    try {
      if (options.format === 'csv') {
        const rows = content.split('\n');
        const hasHeaders = options.hasHeaders || false;
        const separator = options.separator || ',';
        
        const startIndex = hasHeaders ? 1 : 0;
        
        const italianCol = options.italianColumn ?? 0;
        const englishCol = options.englishColumn ?? 1;
        const notesCol = options.notesColumn ?? 2;
        const tagCol = options.tagColumn;
        
        for (let i = startIndex; i < rows.length; i++) {
          const row = rows[i].trim();
          if (!row) continue;
          
          try {
            const cells = row.split(separator);
            
            if (cells.length < 2) {
              result.warnings.push(`Row ${i+1}: Not enough columns`);
              result.failed++;
              continue;
            }
            
            const italian = cells[italianCol]?.trim() || '';
            const english = cells[englishCol]?.trim() || '';
            
            if (!italian || !english) {
              result.warnings.push(`Row ${i+1}: Missing Italian or English text`);
              result.failed++;
              continue;
            }
            
            const explanation = notesCol !== undefined && cells[notesCol] 
              ? cells[notesCol].trim() 
              : undefined;
            
            const tags = tagCol !== undefined && cells[tagCol]
              ? cells[tagCol].trim().split(',').map(tag => tag.trim())
              : ['imported'];
            
            const newCard = createFlashcard({
              italian,
              english,
              explanation,
              tags,
              level: 1,
              mastered: false
            });
            
            result.importedCards.push(newCard);
            result.successful++;
          } catch (err) {
            result.warnings.push(`Row ${i+1}: Failed to parse`);
            result.failed++;
          }
        }
      } else if (options.format === 'json') {
        try {
          const json = JSON.parse(content);
          
          if (Array.isArray(json)) {
            for (const item of json) {
              if (item.italian && item.english) {
                const newCard = createFlashcard({
                  italian: item.italian,
                  english: item.english,
                  explanation: item.explanation || item.notes,
                  tags: Array.isArray(item.tags) ? item.tags : ['imported'],
                  level: typeof item.level === 'number' ? item.level : 1,
                  mastered: !!item.mastered
                });
                
                result.importedCards.push(newCard);
                result.successful++;
              } else {
                result.failed++;
                result.warnings.push('Item missing required fields');
              }
            }
          } else {
            result.failed++;
            result.warnings.push('JSON is not an array');
          }
        } catch (err) {
          result.failed++;
          result.warnings.push('Invalid JSON format');
        }
      } else {
        result.failed++;
        result.warnings.push(`Unsupported format: ${options.format}`);
      }
      
      if (result.importedCards.length > 0) {
        const newSet = createFlashcardSet({
          name: `Imported Cards (${new Date().toLocaleString()})`,
          description: `Imported from ${options.format.toUpperCase()}`,
          tags: ['imported'],
          cards: result.importedCards.map(card => card.id)
        });
        
        result.setId = newSet.id;
      }
      
      return result;
    } catch (error) {
      console.error("Import error:", error);
      result.failed++;
      result.warnings.push('Unexpected error during import');
      return result;
    }
  };
  
  const exportFlashcards = (setId?: string, format: 'csv' | 'json' = 'csv'): string => {
    let cardsToExport: Flashcard[] = [];
    
    if (setId) {
      const set = flashcardSets.find(s => s.id === setId);
      if (set) {
        cardsToExport = set.cards
          .map(id => flashcards.find(c => c.id === id))
          .filter((card): card is Flashcard => !!card);
      }
    } else {
      cardsToExport = [...flashcards];
    }
    
    if (format === 'csv') {
      let csv = 'Italian,English,Explanation,Tags\n';
      
      cardsToExport.forEach(card => {
        const italian = escapeCsvField(card.italian);
        const english = escapeCsvField(card.english);
        const explanation = escapeCsvField(card.explanation || '');
        const tags = escapeCsvField(card.tags.join(', '));
        
        csv += `${italian},${english},${explanation},${tags}\n`;
      });
      
      return csv;
    } else if (format === 'json') {
      return JSON.stringify(cardsToExport, null, 2);
    }
    
    throw new Error(`Unsupported export format: ${format}`);
  };
  
  const escapeCsvField = (field: string): string => {
    if (!field) return '';
    
    if (/[",\n\r]/.test(field)) {
      return `"${field.replace(/"/g, '""')}"`;
    }
    
    return field;
  };
  
  const getFlashcardById = (id: string): Flashcard | undefined => {
    return flashcards.find(card => card.id === id);
  };
  
  const getFlashcardSetById = (id: string): FlashcardSet | undefined => {
    return flashcardSets.find(set => set.id === id);
  };
  
  return {
    flashcards,
    flashcardSets,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
    createFlashcardSet,
    updateFlashcardSet,
    deleteFlashcardSet,
    importFlashcards,
    exportFlashcards,
    addFlashcardToSet,
    removeFlashcardFromSet,
    getStats,
    markAsMastered,
    resetMastered,
    getDueFlashcards,
    reviewFlashcard,
    getFlashcardById,
    getFlashcardSetById
  };
};

export type { Flashcard, FlashcardSet, FlashcardStats };
