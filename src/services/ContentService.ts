
import { v4 as uuidv4 } from 'uuid';
import { Flashcard, FlashcardSet } from '@/types/flashcard';
import { MultipleChoiceQuestion, QuestionSet, QuizAttempt } from '@/types/question';
import { ContentType } from '@/utils/textAnalysis';

// Sample data
const sampleFlashcards: Flashcard[] = [
  { 
    id: '1', 
    italian: 'casa', 
    english: 'house', 
    mastered: false, 
    level: 0,
    dueDate: new Date(), 
    createdAt: new Date(), 
    lastReviewed: new Date() 
  },
  { 
    id: '2', 
    italian: 'cibo', 
    english: 'food', 
    mastered: false, 
    level: 0,
    dueDate: new Date(), 
    createdAt: new Date(), 
    lastReviewed: new Date() 
  },
  { 
    id: '3', 
    italian: 'acqua', 
    english: 'water', 
    mastered: true, 
    level: 5,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
    createdAt: new Date(), 
    lastReviewed: new Date() 
  },
  { 
    id: '4', 
    italian: 'cittadino', 
    english: 'citizen', 
    mastered: false, 
    level: 2,
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), 
    createdAt: new Date(), 
    lastReviewed: new Date() 
  },
  { 
    id: '5', 
    italian: 'diritto', 
    english: 'right (legal)', 
    mastered: false, 
    level: 1,
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), 
    createdAt: new Date(), 
    lastReviewed: new Date() 
  },
  { 
    id: '6', 
    italian: 'buongiorno', 
    english: 'good morning', 
    mastered: false, 
    level: 0,
    dueDate: new Date(), 
    createdAt: new Date(), 
    lastReviewed: new Date() 
  },
  { 
    id: '7', 
    italian: 'grazie', 
    english: 'thank you', 
    mastered: false, 
    level: 0,
    dueDate: new Date(), 
    createdAt: new Date(), 
    lastReviewed: new Date() 
  },
  { 
    id: '8', 
    italian: 'piacere', 
    english: 'pleasure/nice to meet you', 
    mastered: false, 
    level: 0,
    dueDate: new Date(), 
    createdAt: new Date(), 
    lastReviewed: new Date() 
  },
  { 
    id: '9', 
    italian: 'scusa', 
    english: 'excuse me/sorry', 
    mastered: false, 
    level: 0,
    dueDate: new Date(), 
    createdAt: new Date(), 
    lastReviewed: new Date() 
  },
  { 
    id: '10', 
    italian: 'ciao', 
    english: 'hello/goodbye', 
    mastered: false, 
    level: 0,
    dueDate: new Date(), 
    createdAt: new Date(), 
    lastReviewed: new Date() 
  },
];

// Mock storage - in a real app, this would use IndexedDB, localStorage, or a backend database
const storage = {
  flashcards: [...sampleFlashcards],
  attempts: [],
};

// Helper to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const ContentService = {
  // Flashcard methods
  getFlashcards: async (): Promise<Flashcard[]> => {
    // Simulate API call
    await delay(300);
    return [...storage.flashcards];
  },
  
  saveFlashcard: async (flashcard: Omit<Flashcard, 'id' | 'createdAt' | 'lastReviewed'> | Flashcard): Promise<Flashcard> => {
    const newCard: Flashcard = {
      ...('id' in flashcard ? flashcard : { ...flashcard, id: uuidv4() }),
      createdAt: 'createdAt' in flashcard ? flashcard.createdAt : new Date(),
      lastReviewed: 'lastReviewed' in flashcard ? flashcard.lastReviewed : new Date(),
    };
    
    storage.flashcards.push(newCard);
    return newCard;
  },
  
  updateFlashcard: async (id: string, updates: Partial<Flashcard>): Promise<Flashcard> => {
    const index = storage.flashcards.findIndex(card => card.id === id);
    if (index === -1) {
      throw new Error(`Flashcard with id ${id} not found`);
    }
    
    const updatedCard = {
      ...storage.flashcards[index],
      ...updates,
      lastReviewed: new Date(),
    };
    
    storage.flashcards[index] = updatedCard;
    return updatedCard;
  },
  
  deleteFlashcard: async (id: string): Promise<void> => {
    const index = storage.flashcards.findIndex(card => card.id === id);
    if (index === -1) {
      throw new Error(`Flashcard with id ${id} not found`);
    }
    
    storage.flashcards.splice(index, 1);
  },
  
  importFlashcards: async (fileContent: string, format: 'csv' | 'json' = 'csv'): Promise<Flashcard[]> => {
    await delay(500);
    let importedCards: Flashcard[] = [];
    
    try {
      if (format === 'csv') {
        // Parse CSV content
        const lines = fileContent.split('\n');
        const headers = lines[0].split(',');
        
        // Find the indices for italian and english columns
        const italianIndex = headers.findIndex(h => h.toLowerCase().includes('italian') || h.toLowerCase().includes('italiano'));
        const englishIndex = headers.findIndex(h => h.toLowerCase().includes('english') || h.toLowerCase().includes('inglese'));
        
        if (italianIndex === -1 || englishIndex === -1) {
          throw new Error('CSV file must contain columns for Italian and English words');
        }
        
        // Parse each line (skip header)
        lines.slice(1).forEach(line => {
          if (!line.trim()) return; // Skip empty lines
          
          const values = line.split(',');
          const italian = values[italianIndex]?.trim();
          const english = values[englishIndex]?.trim();
          
          if (italian && english) {
            importedCards.push({
              id: uuidv4(),
              italian,
              english,
              mastered: false,
              level: 0,
              dueDate: new Date(),
              createdAt: new Date(),
              lastReviewed: new Date()
            });
          }
        });
      } else if (format === 'json') {
        // Parse JSON content
        const parsed = JSON.parse(fileContent);
        
        if (Array.isArray(parsed)) {
          importedCards = parsed.map(item => ({
            id: uuidv4(),
            italian: item.italian || '',
            english: item.english || '',
            mastered: item.mastered || false,
            level: item.level || 0,
            dueDate: new Date(),
            createdAt: new Date(),
            lastReviewed: new Date()
          }));
        }
      }
      
      // Add imported cards to storage
      storage.flashcards = [...storage.flashcards, ...importedCards];
      return importedCards;
      
    } catch (error) {
      console.error('Error importing flashcards:', error);
      throw new Error('Failed to import flashcards. Please check the file format.');
    }
  },
  
  exportFlashcards: async (format: 'csv' | 'json' = 'csv', onlyMastered = false): Promise<string> => {
    await delay(300);
    
    const cardsToExport = onlyMastered 
      ? storage.flashcards.filter(card => card.mastered) 
      : storage.flashcards;
    
    if (format === 'csv') {
      // Generate CSV
      const headers = ['italian', 'english', 'mastered', 'level'];
      const rows = cardsToExport.map(card => 
        `${card.italian},${card.english},${card.mastered ? 'true' : 'false'},${card.level}`
      );
      
      return [headers.join(','), ...rows].join('\n');
    } else {
      // Generate JSON
      return JSON.stringify(cardsToExport, null, 2);
    }
  },
  
  // Question methods
  getQuestionSets: async (): Promise<QuestionSet[]> => {
    await delay(300);
    return []; // Mock implementation
  },
  
  saveQuestionSet: async (questionSet: Omit<QuestionSet, 'id' | 'createdAt' | 'updatedAt'>): Promise<QuestionSet> => {
    await delay(300);
    return {
      ...questionSet,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
  },
  
  // Speaking methods
  getSpeakingExercises: async (difficulty?: string, category?: string): Promise<any[]> => {
    await delay(300);
    return []; // Mock implementation
  },
  
  // Listening methods
  getListeningExercises: async (difficulty?: string, category?: string): Promise<any[]> => {
    await delay(300);
    return []; // Mock implementation
  },
  
  // Writing methods
  getWritingExercises: async (difficulty?: string, category?: string): Promise<any[]> => {
    await delay(300);
    return []; // Mock implementation
  },
};
