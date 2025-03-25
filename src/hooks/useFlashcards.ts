
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from './useLocalStorage';
import { useAIUtils } from '@/contexts/AIUtilsContext';

export interface Flashcard {
  id: string;
  italian: string;
  english: string;
  mastered: boolean;
  createdAt: Date;
  lastReviewed?: Date;
  reviewCount?: number;
  nextReviewDate?: Date;
  difficulty?: 'easy' | 'medium' | 'hard';
  notes?: string;
  tags?: string[];
  examples?: string[];
}

export interface FlashcardSet {
  id: string;
  name: string;
  description?: string;
  cards: Flashcard[];
  createdAt: Date;
  lastModified: Date;
  tags?: string[];
  category?: string;
  authorId?: string;
}

export interface FlashcardStats {
  total: number;
  mastered: number;
  dueToday: number;
  averageReviewTime?: number;
  learningRate?: number;
  lastStudySession?: Date;
}

export interface ImportResult {
  imported: number;
  failed: number;
  errors: string[];
}

// Interfaces for importing from CSV and other formats
export interface ImportOptions {
  format: 'csv' | 'json' | 'anki' | 'txt';
  separator?: string;
  hasHeader?: boolean;
  italianColumn?: number;
  englishColumn?: number;
  setName?: string;
}

export interface UseFlashcardsReturn {
  flashcards: Flashcard[];
  flashcardSets: FlashcardSet[];
  createFlashcard: (italian: string, english: string, tags?: string[]) => Flashcard;
  updateFlashcard: (id: string, updates: Partial<Flashcard>) => void;
  deleteFlashcard: (id: string) => void;
  getFlashcardById: (id: string) => Flashcard | undefined;
  createFlashcardSet: (name: string, description?: string, tags?: string[]) => FlashcardSet;
  updateFlashcardSet: (id: string, updates: Partial<FlashcardSet>) => void;
  deleteFlashcardSet: (id: string) => void;
  getFlashcardSetById: (id: string) => FlashcardSet | undefined;
  addFlashcardToSet: (cardId: string, setId: string) => void;
  removeFlashcardFromSet: (cardId: string, setId: string) => void;
  getStats: () => FlashcardStats;
  markAsMastered: (id: string) => void;
  resetMastered: (id: string) => void;
  importFlashcards: (content: string, options: ImportOptions) => Promise<ImportResult>;
  exportFlashcards: (setId?: string, format?: 'csv' | 'json') => string;
  getDueFlashcards: (limit?: number) => Flashcard[];
  reviewFlashcard: (id: string, difficulty: 'easy' | 'medium' | 'hard') => void;
  generateAIFlashcards: (content: string, count?: number) => Promise<Flashcard[]>;
}

export const useFlashcards = (): UseFlashcardsReturn => {
  const { toast } = useToast();
  const { isAIEnabled } = useAIUtils();
  const [flashcards, setFlashcards] = useLocalStorage<Flashcard[]>('flashcards', []);
  const [flashcardSets, setFlashcardSets] = useLocalStorage<FlashcardSet[]>('flashcard-sets', []);

  // Create a new flashcard
  const createFlashcard = useCallback((italian: string, english: string, tags: string[] = []): Flashcard => {
    const newCard: Flashcard = {
      id: uuidv4(),
      italian,
      english,
      mastered: false,
      createdAt: new Date(),
      lastReviewed: new Date(),
      reviewCount: 0,
      tags,
      difficulty: 'medium'
    };

    setFlashcards(prev => [...prev, newCard]);
    
    toast({
      title: "Flashcard Created",
      description: `Successfully created flashcard for "${italian}"`,
    });
    
    return newCard;
  }, [setFlashcards, toast]);

  // Update an existing flashcard
  const updateFlashcard = useCallback((id: string, updates: Partial<Flashcard>) => {
    setFlashcards(prev => prev.map(card => 
      card.id === id ? { ...card, ...updates } : card
    ));
  }, [setFlashcards]);

  // Delete a flashcard
  const deleteFlashcard = useCallback((id: string) => {
    setFlashcards(prev => prev.filter(card => card.id !== id));
    
    // Also remove this card from any sets
    setFlashcardSets(prev => prev.map(set => ({
      ...set,
      cards: set.cards.filter(cardId => cardId !== id)
    })));
    
    toast({
      title: "Flashcard Deleted",
      description: "Flashcard has been removed from your collection."
    });
  }, [setFlashcards, setFlashcardSets, toast]);

  // Get a flashcard by ID
  const getFlashcardById = useCallback((id: string) => {
    return flashcards.find(card => card.id === id);
  }, [flashcards]);

  // Create a new flashcard set
  const createFlashcardSet = useCallback((name: string, description?: string, tags: string[] = []): FlashcardSet => {
    const newSet: FlashcardSet = {
      id: uuidv4(),
      name,
      description,
      cards: [],
      createdAt: new Date(),
      lastModified: new Date(),
      tags
    };

    setFlashcardSets(prev => [...prev, newSet]);
    
    toast({
      title: "Flashcard Set Created",
      description: `Successfully created set "${name}"`
    });
    
    return newSet;
  }, [setFlashcardSets, toast]);

  // Update an existing flashcard set
  const updateFlashcardSet = useCallback((id: string, updates: Partial<FlashcardSet>) => {
    setFlashcardSets(prev => prev.map(set => 
      set.id === id ? { ...set, ...updates, lastModified: new Date() } : set
    ));
  }, [setFlashcardSets]);

  // Delete a flashcard set
  const deleteFlashcardSet = useCallback((id: string) => {
    setFlashcardSets(prev => prev.filter(set => set.id !== id));
    
    toast({
      title: "Flashcard Set Deleted",
      description: "Flashcard set has been removed."
    });
  }, [setFlashcardSets, toast]);

  // Get a flashcard set by ID
  const getFlashcardSetById = useCallback((id: string) => {
    return flashcardSets.find(set => set.id === id);
  }, [flashcardSets]);

  // Add a flashcard to a set
  const addFlashcardToSet = useCallback((cardId: string, setId: string) => {
    setFlashcardSets(prev => prev.map(set => {
      if (set.id === setId && !set.cards.includes(cardId)) {
        return {
          ...set,
          cards: [...set.cards, cardId],
          lastModified: new Date()
        };
      }
      return set;
    }));
  }, [setFlashcardSets]);

  // Remove a flashcard from a set
  const removeFlashcardFromSet = useCallback((cardId: string, setId: string) => {
    setFlashcardSets(prev => prev.map(set => {
      if (set.id === setId) {
        return {
          ...set,
          cards: set.cards.filter(id => id !== cardId),
          lastModified: new Date()
        };
      }
      return set;
    }));
  }, [setFlashcardSets]);

  // Get flashcard statistics
  const getStats = useCallback((): FlashcardStats => {
    const total = flashcards.length;
    const mastered = flashcards.filter(card => card.mastered).length;
    const dueToday = flashcards.filter(card => {
      if (card.mastered) return false;
      if (!card.nextReviewDate) return true;
      const today = new Date();
      return new Date(card.nextReviewDate) <= today;
    }).length;

    return {
      total,
      mastered,
      dueToday
    };
  }, [flashcards]);

  // Mark a flashcard as mastered
  const markAsMastered = useCallback((id: string) => {
    updateFlashcard(id, { mastered: true });
    
    toast({
      title: "Mastered!",
      description: "Flashcard marked as mastered.",
      variant: "default",
    });
  }, [updateFlashcard, toast]);

  // Reset mastered status
  const resetMastered = useCallback((id: string) => {
    updateFlashcard(id, { mastered: false });
  }, [updateFlashcard]);

  // Import flashcards from CSV, JSON, or other formats
  const importFlashcards = useCallback(async (content: string, options: ImportOptions): Promise<ImportResult> => {
    const result: ImportResult = {
      imported: 0,
      failed: 0,
      errors: []
    };
    
    try {
      const lines: string[] = [];
      let parsedContent: any[] = [];
      
      // Parse the content based on format
      switch (options.format) {
        case 'csv':
          // Split by line, respect quoted values
          const rows = content.split('\n');
          const separator = options.separator || ',';
          
          // Skip header if specified
          const startIndex = options.hasHeader ? 1 : 0;
          
          for (let i = startIndex; i < rows.length; i++) {
            const row = rows[i].trim();
            if (!row) continue;
            
            // Parse CSV handling quoted values properly
            let inQuote = false;
            let currentValue = '';
            let values = [];
            
            for (let char of row) {
              if (char === '"' && (inQuote && row[row.indexOf(char) + 1] !== '"')) {
                inQuote = false;
              } else if (char === '"' && !inQuote) {
                inQuote = true;
              } else if (char === separator && !inQuote) {
                values.push(currentValue);
                currentValue = '';
              } else {
                currentValue += char;
              }
            }
            
            // Add the last value
            values.push(currentValue);
            
            // Get Italian and English values from the appropriate columns
            const italianColumn = options.italianColumn || 0;
            const englishColumn = options.englishColumn || 1;
            
            if (values.length > Math.max(italianColumn, englishColumn)) {
              const italian = values[italianColumn].trim().replace(/^"|"$/g, '');
              const english = values[englishColumn].trim().replace(/^"|"$/g, '');
              
              if (italian && english) {
                parsedContent.push({ italian, english });
              } else {
                result.failed++;
                result.errors.push(`Row ${i + 1}: Missing Italian or English value`);
              }
            } else {
              result.failed++;
              result.errors.push(`Row ${i + 1}: Not enough columns`);
            }
          }
          break;
          
        case 'json':
          try {
            const jsonData = JSON.parse(content);
            
            if (Array.isArray(jsonData)) {
              parsedContent = jsonData.map(item => {
                // Try to handle different JSON structures
                const italian = item.italian || item.term || item.front || item.question;
                const english = item.english || item.definition || item.back || item.answer;
                
                if (!italian || !english) {
                  result.failed++;
                  result.errors.push(`Missing Italian or English value in JSON item`);
                  return null;
                }
                
                return { italian, english };
              }).filter(Boolean);
            } else {
              result.failed++;
              result.errors.push('JSON data is not an array');
            }
          } catch (error) {
            result.failed++;
            result.errors.push(`JSON parse error: ${error instanceof Error ? error.message : String(error)}`);
          }
          break;
          
        case 'txt':
          // Assume format is one pair per line with separator between terms
          const separator2 = options.separator || '\t';
          const pairs = content.split('\n');
          
          for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i].trim();
            if (!pair) continue;
            
            const [italian, english] = pair.split(separator2).map(s => s.trim());
            
            if (italian && english) {
              parsedContent.push({ italian, english });
            } else {
              result.failed++;
              result.errors.push(`Line ${i + 1}: Invalid format`);
            }
          }
          break;
          
        case 'anki':
          // Basic Anki export format handling
          const ankiLines = content.split('\n');
          
          for (let i = 0; i < ankiLines.length; i++) {
            const line = ankiLines[i].trim();
            if (!line) continue;
            
            // Anki typically uses tab as separator
            const parts = line.split('\t');
            
            if (parts.length >= 2) {
              const italian = parts[0].trim();
              const english = parts[1].trim();
              
              // Strip HTML tags if present
              const cleanItalian = italian.replace(/<[^>]*>/g, '');
              const cleanEnglish = english.replace(/<[^>]*>/g, '');
              
              if (cleanItalian && cleanEnglish) {
                parsedContent.push({ italian: cleanItalian, english: cleanEnglish });
              } else {
                result.failed++;
                result.errors.push(`Line ${i + 1}: Missing Italian or English value after HTML cleaning`);
              }
            } else {
              result.failed++;
              result.errors.push(`Line ${i + 1}: Not enough columns`);
            }
          }
          break;
      }
      
      // Create flashcards from the parsed content
      let setId: string | undefined;
      
      // Create a new set if setName is provided
      if (options.setName) {
        const newSet = createFlashcardSet(options.setName);
        setId = newSet.id;
      }
      
      // Add flashcards
      for (const item of parsedContent) {
        try {
          const newCard = createFlashcard(item.italian, item.english);
          
          if (setId) {
            addFlashcardToSet(newCard.id, setId);
          }
          
          result.imported++;
        } catch (error) {
          result.failed++;
          result.errors.push(`Failed to create flashcard: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
      
      return result;
    } catch (error) {
      result.errors.push(`Import error: ${error instanceof Error ? error.message : String(error)}`);
      return result;
    }
  }, [createFlashcard, createFlashcardSet, addFlashcardToSet]);

  // Export flashcards to CSV or JSON
  const exportFlashcards = useCallback((setId?: string, format: 'csv' | 'json' = 'csv') => {
    let cardsToExport: Flashcard[] = [];
    
    if (setId) {
      const set = flashcardSets.find(s => s.id === setId);
      if (set) {
        cardsToExport = flashcards.filter(card => set.cards.includes(card.id));
      }
    } else {
      cardsToExport = flashcards;
    }
    
    if (format === 'csv') {
      // Export to CSV
      const header = 'Italian,English,Mastered,CreatedAt\n';
      const rows = cardsToExport.map(card => {
        // Properly handle commas in the text
        const italian = `"${card.italian.replace(/"/g, '""')}"`;
        const english = `"${card.english.replace(/"/g, '""')}"`;
        
        return `${italian},${english},${card.mastered},${card.createdAt}`;
      }).join('\n');
      
      return header + rows;
    } else {
      // Export to JSON
      return JSON.stringify(cardsToExport, null, 2);
    }
  }, [flashcards, flashcardSets]);

  // Get flashcards due for review based on spaced repetition algorithm
  const getDueFlashcards = useCallback((limit?: number): Flashcard[] => {
    const today = new Date();
    
    const dueCards = flashcards
      .filter(card => !card.mastered && (!card.nextReviewDate || new Date(card.nextReviewDate) <= today))
      .sort((a, b) => {
        // Sort by due date (oldest first)
        const aNext = a.nextReviewDate ? new Date(a.nextReviewDate) : new Date(0);
        const bNext = b.nextReviewDate ? new Date(b.nextReviewDate) : new Date(0);
        return aNext.getTime() - bNext.getTime();
      });
    
    return limit ? dueCards.slice(0, limit) : dueCards;
  }, [flashcards]);

  // Review a flashcard and update its next review date based on difficulty
  const reviewFlashcard = useCallback((id: string, difficulty: 'easy' | 'medium' | 'hard') => {
    const card = flashcards.find(c => c.id === id);
    if (!card) return;
    
    const reviewCount = (card.reviewCount || 0) + 1;
    const now = new Date();
    
    // Calculate next review date based on spaced repetition
    let nextInterval: number;
    
    switch (difficulty) {
      case 'easy':
        // Easy - longer interval
        nextInterval = Math.pow(2, reviewCount) * 1.5;
        break;
      case 'medium':
        // Medium - standard interval
        nextInterval = Math.pow(2, reviewCount);
        break;
      case 'hard':
        // Hard - shorter interval
        nextInterval = Math.pow(1.5, reviewCount);
        break;
      default:
        nextInterval = Math.pow(2, reviewCount);
    }
    
    // Cap interval at 60 days
    nextInterval = Math.min(nextInterval, 60);
    
    const nextReviewDate = new Date();
    nextReviewDate.setDate(now.getDate() + nextInterval);
    
    updateFlashcard(id, {
      lastReviewed: now,
      reviewCount,
      nextReviewDate,
      difficulty
    });
  }, [flashcards, updateFlashcard]);

  // Generate flashcards using AI
  const generateAIFlashcards = useCallback(async (content: string, count: number = 10): Promise<Flashcard[]> => {
    if (!isAIEnabled) {
      toast({
        title: "AI Features Disabled",
        description: "Enable AI features in settings to use flashcard generation.",
        variant: "destructive"
      });
      
      throw new Error('AI features are disabled');
    }
    
    try {
      toast({
        title: "Generating Flashcards",
        description: "AI is analyzing your content to create flashcards...",
      });
      
      // For demo purposes, we'll create some mock flashcards
      // In a real implementation, this would call an AI service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const generatedCards: Flashcard[] = [];
      
      // Extract significant terms from the content
      const terms = content
        .split(/[.!?,;:\n\r\t\s]+/)
        .filter(word => word.length > 4)
        .filter((v, i, a) => a.indexOf(v) === i) // Remove duplicates
        .slice(0, count);
      
      // Create mock translations
      const translations: Record<string, string> = {
        'italiano': 'Italian',
        'inglese': 'English',
        'ciao': 'hello',
        'computer': 'computer',
        'programma': 'program',
        'sviluppatore': 'developer',
        'codice': 'code',
        'applicazione': 'application',
        'linguaggio': 'language',
        'tecnologia': 'technology',
        'internet': 'internet',
        'sistema': 'system',
        'tempo': 'time',
        'persona': 'person',
        'giorno': 'day',
        'settimana': 'week',
        'mese': 'month',
        'anno': 'year',
        'studio': 'study',
        'libro': 'book',
        'pagina': 'page',
        'parola': 'word',
        'frase': 'sentence',
        'domanda': 'question',
        'risposta': 'answer',
        'amico': 'friend',
        'famiglia': 'family',
        'casa': 'house',
        'citta': 'city',
        'paese': 'country'
      };
      
      // Create flashcards from the terms
      for (let i = 0; i < Math.min(terms.length, count); i++) {
        const term = terms[i];
        
        // Simulate AI translation
        let translation = translations[term.toLowerCase()];
        
        // If no translation found, generate a mock one
        if (!translation) {
          translation = `${term} (en)`;
        }
        
        // Create the flashcard
        const newCard = createFlashcard(term, translation);
        generatedCards.push(newCard);
      }
      
      toast({
        title: "Flashcards Generated",
        description: `Successfully created ${generatedCards.length} flashcards from your content.`,
      });
      
      return generatedCards;
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate flashcards",
        variant: "destructive",
      });
      
      throw error;
    }
  }, [isAIEnabled, createFlashcard, toast]);

  return {
    flashcards,
    flashcardSets,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
    getFlashcardById,
    createFlashcardSet,
    updateFlashcardSet,
    deleteFlashcardSet,
    getFlashcardSetById,
    addFlashcardToSet,
    removeFlashcardFromSet,
    getStats,
    markAsMastered,
    resetMastered,
    importFlashcards,
    exportFlashcards,
    getDueFlashcards,
    reviewFlashcard,
    generateAIFlashcards
  };
};
