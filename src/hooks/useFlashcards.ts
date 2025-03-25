import { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { useLocalStorage } from './useLocalStorage';
import { Flashcard, FlashcardSet, ImportFormat, ImportOptions, ImportResult } from '@/types/flashcard';

const initialFlashcards: Flashcard[] = [
  {
    id: '1',
    italian: 'ciao',
    english: 'hello',
    explanation: 'A common greeting',
    level: 1,
    mastered: false,
    dueDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    italian: 'grazie',
    english: 'thank you',
    explanation: 'Expressing gratitude',
    level: 1,
    mastered: false,
    dueDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const initialFlashcardSets: FlashcardSet[] = [
  {
    id: 'set1',
    name: 'Italian Basics',
    title: 'Basic Italian Phrases',
    description: 'Essential phrases for beginners',
    cards: initialFlashcards,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'system',
    isPublic: true,
    cardCount: initialFlashcards.length,
    masteredCount: 0,
    language: 'italian',
    category: 'vocabulary',
    tags: ['basics', 'italian', 'phrases'],
    difficulty: 'beginner',
  },
];

export const useFlashcards = () => {
  const [flashcards, setFlashcards] = useLocalStorage<Flashcard[]>('flashcards', initialFlashcards);
  const [flashcardSets, setFlashcardSets] = useLocalStorage<FlashcardSet[]>('flashcardSets', initialFlashcardSets);

  useEffect(() => {
    // Update cardCount and masteredCount whenever flashcards change
    const updatedSets = flashcardSets.map(set => ({
      ...set,
      cardCount: set.cards?.length || 0,
      masteredCount: set.cards?.filter(card => card.mastered).length || 0,
    }));
    setFlashcardSets(updatedSets);
  }, [flashcards]);

  const createFlashcard = (data: Omit<Flashcard, 'id' | 'createdAt' | 'updatedAt'>): Flashcard => {
    const newFlashcard: Flashcard = {
      id: uuid(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setFlashcards(prev => [...prev, newFlashcard]);
    return newFlashcard;
  };

  const updateFlashcard = (id: string, updates: Partial<Flashcard>): void => {
    setFlashcards(prev =>
      prev.map(flashcard =>
        flashcard.id === id ? { ...flashcard, ...updates, updatedAt: new Date() } : flashcard
      )
    );
  };

  const deleteFlashcard = (id: string): void => {
    setFlashcards(prev => prev.filter(flashcard => flashcard.id !== id));
    // Also remove the card from any sets it belongs to
    setFlashcardSets(prevSets =>
      prevSets.map(set => ({
        ...set,
        cards: set.cards.filter(card => card.id !== id),
      }))
    );
  };

  const getFlashcard = (id: string): Flashcard | undefined => {
    return flashcards.find(flashcard => flashcard.id === id);
  };

  const listFlashcards = (): Flashcard[] => {
    return [...flashcards];
  };

  const createFlashcardSet = (data: Partial<FlashcardSet>): FlashcardSet => {
    return {
      id: uuid(),
      name: data.name || 'New Set',
      title: data.title,
      description: data.description || '',
      cards: data.cards || [],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: data.createdBy,
      isPublic: data.isPublic || false,
      cardCount: data.cards?.length || 0,
      masteredCount: data.cards?.filter(card => card.mastered).length || 0,
      language: data.language || 'italian',
      category: data.category || 'vocabulary',
      tags: data.tags || [],
      difficulty: data.difficulty || 'beginner',
    };
  };

  const addCardToSet = (cardId: string, setId: string): void => {
    const cardToAdd = getFlashcard(cardId);
    if (!cardToAdd) {
      console.error(`Flashcard with id ${cardId} not found`);
      return;
    }

    setFlashcardSets(prevSets =>
      prevSets.map(set => {
        if (set.id === setId) {
          if (set.cards.find(card => card.id === cardId)) {
            console.warn(`Flashcard with id ${cardId} already exists in set ${setId}`);
            return set;
          }
          return { ...set, cards: [...set.cards, cardToAdd] };
        }
        return set;
      })
    );
  };

  const removeCardFromSet = (cardId: string, setId: string): void => {
    setFlashcardSets(prevSets =>
      prevSets.map(set => {
        if (set.id === setId) {
          return { ...set, cards: set.cards.filter(card => card.id !== cardId) };
        }
        return set;
      })
    );
  };

  const updateFlashcardSet = (id: string, updates: Partial<FlashcardSet>): void => {
    setFlashcardSets(prev =>
      prev.map(set => (set.id === id ? { ...set, ...updates, updatedAt: new Date() } : set))
    );
  };

  const deleteFlashcardSet = (id: string): void => {
    setFlashcardSets(prev => prev.filter(set => set.id !== id));
  };

  const getFlashcardSet = (id: string): FlashcardSet | undefined => {
    return flashcardSets.find(set => set.id === id);
  };

  const listFlashcardSets = (): FlashcardSet[] => {
    return [...flashcardSets];
  };

  const importFlashcards = async (content: string, options: ImportOptions): Promise<ImportResult> => {
    // Simulate server processing delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let importedCards: Flashcard[] = [];
    let errors: string[] = [];
    
    try {
      if (options.format === 'json') {
        try {
          const parsedCards = JSON.parse(content);
          if (!Array.isArray(parsedCards)) {
            throw new Error('Invalid JSON format: Expected an array of flashcards.');
          }
          
          importedCards = parsedCards.map((card: any) => ({
            id: uuid(),
            italian: card.italian || '',
            english: card.english || '',
            explanation: card.explanation || '',
            example: card.example || '',
            level: card.level || 1,
            mastered: card.mastered || false,
            dueDate: card.dueDate ? new Date(card.dueDate) : new Date(),
            setId: options.setName,
            createdAt: new Date(),
            updatedAt: new Date(),
            lastReviewed: card.lastReviewed ? new Date(card.lastReviewed) : undefined,
            nextReviewDate: card.nextReviewDate ? new Date(card.nextReviewDate) : undefined,
            tags: card.tags || [],
            audio: card.audio,
            image: card.image,
            notes: card.notes,
          }));
        } catch (jsonError) {
          errors.push(`JSON Parsing Error: ${jsonError}`);
        }
      } else if (options.format === 'csv' || options.format === 'txt') {
        const separator = options.separator || ',';
        const lines = content.split('\n');
        const header = options.hasHeader ? lines.shift()?.split(separator) : null;
        
        lines.forEach((line, index) => {
          if (line.trim() === '') return; // Skip empty lines
          
          const values = line.split(separator);
          
          try {
            const italian = values[options.italianColumn || 0]?.trim() || '';
            const english = values[options.englishColumn || 1]?.trim() || '';
            
            if (!italian || !english) {
              throw new Error(`Missing Italian or English term in line ${index + 1}`);
            }
            
            const newCard: Flashcard = {
              id: uuid(),
              italian,
              english,
              explanation: '',
              example: '',
              level: 1,
              mastered: false,
              dueDate: new Date(),
              setId: options.setName,
              createdAt: new Date(),
              updatedAt: new Date(),
              tags: [],
            };
            importedCards.push(newCard);
          } catch (csvError) {
            errors.push(`Line ${index + 1} - ${csvError}`);
          }
        });
      } else if (options.format === 'anki') {
        const lines = content.split('\n');
        lines.forEach((line, index) => {
          if (line.trim() === '') return;
          
          try {
            const [italian, english] = line.split('\t');
            if (!italian || !english) {
              throw new Error(`Missing Italian or English term in line ${index + 1}`);
            }
            
            const newCard: Flashcard = {
              id: uuid(),
              italian: italian.trim(),
              english: english.trim(),
              explanation: '',
              example: '',
              level: 1,
              mastered: false,
              dueDate: new Date(),
              setId: options.setName,
              createdAt: new Date(),
              updatedAt: new Date(),
              tags: [],
            };
            importedCards.push(newCard);
          } catch (ankiError) {
            errors.push(`Line ${index + 1} - ${ankiError}`);
          }
        });
      } else {
        throw new Error(`Unsupported import format: ${options.format}`);
      }
      
      if (options.setName) {
        // If a set name is provided, either add to existing or create a new set
        const existingSet = flashcardSets.find(set => set.name === options.setName);
        if (existingSet) {
          // Add imported cards to existing set
          setFlashcardSets(prevSets =>
            prevSets.map(set =>
              set.id === existingSet.id
                ? { ...set, cards: [...set.cards, ...importedCards] }
                : set
            )
          );
        } else {
          // Create a new set with imported cards
          const newSet: FlashcardSet = {
            id: uuid(),
            name: options.setName,
            title: options.setName,
            description: 'Imported flashcards',
            cards: importedCards,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: 'user',
            isPublic: false,
            cardCount: importedCards.length,
            masteredCount: 0,
            language: 'italian',
            category: 'vocabulary',
            tags: [],
            difficulty: 'beginner',
          };
          setFlashcardSets(prevSets => [...prevSets, newSet]);
        }
      } else {
        // If no set name, just add cards to the general flashcards list
        setFlashcards(prevCards => [...prevCards, ...importedCards]);
      }
      
      const result: ImportResult = {
        success: importedCards.length,
        failed: errors.length,
        total: importedCards.length + errors.length,
        errors,
        importedCards,
        imported: importedCards.length
      };
      
      return result;
    } catch (error) {
      console.error('Flashcard import error:', error);
      errors.push(error instanceof Error ? error.message : 'Unknown error');
      
      return {
        success: 0,
        failed: errors.length,
        total: 0,
        errors,
        importedCards: [],
        imported: 0
      };
    }
  };

  const exportFlashcards = (setId?: string, format: 'csv' | 'json' = 'csv'): string => {
    let cardsToExport: Flashcard[];
    
    if (setId) {
      const set = getFlashcardSet(setId);
      if (!set) {
        throw new Error(`Flashcard set with id ${setId} not found`);
      }
      cardsToExport = set.cards;
    } else {
      cardsToExport = flashcards;
    }
    
    if (format === 'json') {
      return JSON.stringify(cardsToExport, null, 2);
    } else { // CSV
      const csvHeader = 'italian,english,explanation,example,level,mastered,dueDate,tags,audio,image,notes\n';
      const csvRows = cardsToExport.map(card => {
        const escapedItalian = card.italian.replace(/"/g, '""');
        const escapedEnglish = card.english.replace(/"/g, '""');
        const escapedExplanation = (card.explanation || '').replace(/"/g, '""');
        const escapedExample = (card.example || '').replace(/"/g, '""');
        const escapedTags = (card.tags || []).join(';');
        const dueDate = card.dueDate ? card.dueDate.toISOString() : '';
        
        return `"${escapedItalian}","${escapedEnglish}","${escapedExplanation}","${escapedExample}",${card.level},${card.mastered},${dueDate},"${escapedTags}","${card.audio || ''}","${card.image || ''}","${card.notes || ''}"`;
      });
      return csvHeader + csvRows.join('\n');
    }
  };

  return {
    flashcards,
    flashcardSets,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
    getFlashcard,
    listFlashcards,
    createFlashcardSet,
    addCardToSet,
    removeCardFromSet,
    updateFlashcardSet,
    deleteFlashcardSet,
    getFlashcardSet,
    listFlashcardSets,
    importFlashcards,
    exportFlashcards,
  };
};
