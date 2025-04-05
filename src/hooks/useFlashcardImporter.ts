
import { useState, useCallback } from 'react';
import { Flashcard, ImportFormat } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface ImportResult {
  imported: Flashcard[];
  failed: { line: string; reason: string }[];
  totalProcessed: number;
}

export function useFlashcardImporter() {
  const [importFormat, setImportFormat] = useState<ImportFormat>({
    type: 'csv',
    delimiter: ',',
    hasHeader: true,
    encoding: 'utf-8',
    fieldMap: {
      italian: 'italian',
      english: 'english',
      tags: 'tags',
      level: 'level'
    }
  });
  
  // Import from text (CSV, JSON, etc)
  const importFromText = useCallback(async (text: string, options?: Partial<ImportFormat>): Promise<Flashcard[]> => {
    const format = { ...importFormat, ...options };
    
    if (!text) {
      throw new Error('No text provided for import');
    }
    
    try {
      if (format.type === 'json' || text.trim().startsWith('[') || text.trim().startsWith('{')) {
        return importFromJson(text);
      } else if (format.type === 'csv' || format.type === 'text') {
        return importFromCsv(text, format);
      } else {
        throw new Error(`Unsupported format: ${format.type}`);
      }
    } catch (error) {
      console.error('Error importing from text:', error);
      throw error;
    }
  }, [importFormat]);
  
  // Import from a file
  const importFromFile = useCallback(async (file: File, options?: Partial<ImportFormat>): Promise<Flashcard[]> => {
    const format = { ...importFormat, ...options };
    
    try {
      const text = await readFileAsText(file);
      return importFromText(text, format);
    } catch (error) {
      console.error('Error importing from file:', error);
      throw error;
    }
  }, [importFormat, importFromText]);
  
  // Read file as text
  const readFileAsText = useCallback(async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        resolve(reader.result as string);
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsText(file);
    });
  }, []);
  
  // Import from JSON format
  const importFromJson = useCallback(async (text: string): Promise<Flashcard[]> => {
    try {
      const json = JSON.parse(text);
      let cards: any[] = [];
      
      if (Array.isArray(json)) {
        cards = json;
      } else if (json && typeof json === 'object') {
        if (json.cards && Array.isArray(json.cards)) {
          cards = json.cards;
        } else {
          cards = [json];
        }
      }
      
      return cards.map(card => {
        if (!card.italian && !card.front && !card.term) {
          throw new Error('Missing Italian/front field in JSON data');
        }
        
        if (!card.english && !card.back && !card.definition) {
          throw new Error('Missing English/back field in JSON data');
        }
        
        return {
          id: card.id || uuidv4(),
          front: card.front || card.italian || card.term || '',
          back: card.back || card.english || card.definition || '',
          italian: card.italian || card.front || card.term || '',
          english: card.english || card.back || card.definition || '',
          difficulty: typeof card.difficulty === 'number' ? card.difficulty : 1,
          tags: Array.isArray(card.tags) ? card.tags : 
            (typeof card.tags === 'string' ? card.tags.split(',').map(t => t.trim()) : []),
          level: typeof card.level === 'number' ? card.level : 1,
          mastered: Boolean(card.mastered),
          lastReviewed: card.lastReviewed ? new Date(card.lastReviewed) : null,
          nextReview: card.nextReview ? new Date(card.nextReview) : new Date(Date.now() + 86400000),
          createdAt: new Date(),
          updatedAt: new Date()
        };
      });
    } catch (error) {
      console.error('Error parsing JSON:', error);
      throw new Error('Invalid JSON format: ' + (error instanceof Error ? error.message : String(error)));
    }
  }, []);
  
  // Import from CSV format
  const importFromCsv = useCallback(async (text: string, format: ImportFormat): Promise<Flashcard[]> => {
    try {
      const lines = text.split('\n').filter(line => line.trim());
      if (lines.length === 0) {
        throw new Error('CSV file is empty');
      }
      
      // Skip header if needed
      const startIdx = format.hasHeader ? 1 : 0;
      if (startIdx >= lines.length) {
        throw new Error('CSV file contains only a header row');
      }
      
      // Determine field indices for mapping
      let italianIdx = 0;
      let englishIdx = 1;
      let tagsIdx = 2;
      let levelIdx = 3;
      const fieldMap = format.fieldMap || {};
      
      if (format.hasHeader) {
        const headers = lines[0].split(format.delimiter || ',').map(h => h.trim().toLowerCase());
        
        // Try to find column indices by header names
        for (let i = 0; i < headers.length; i++) {
          const header = headers[i];
          if (header === fieldMap.italian || header === 'italian' || header === 'front' || header === 'term') {
            italianIdx = i;
          } else if (header === fieldMap.english || header === 'english' || header === 'back' || header === 'definition') {
            englishIdx = i;
          } else if (header === fieldMap.tags || header === 'tags' || header === 'category') {
            tagsIdx = i;
          } else if (header === fieldMap.level || header === 'level' || header === 'difficulty') {
            levelIdx = i;
          }
        }
      }
      
      // Process data rows
      const cards: Flashcard[] = [];
      
      for (let i = startIdx; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        try {
          // Handle quoted fields correctly
          const fields = parseCSVLine(line, format.delimiter || ',');
          
          // Check that we have the minimum fields required
          if (fields.length <= Math.max(italianIdx, englishIdx)) {
            console.warn(`Line ${i+1} does not have enough fields, skipping`);
            continue;
          }
          
          // Extract fields
          const italian = fields[italianIdx]?.trim() || '';
          const english = fields[englishIdx]?.trim() || '';
          
          // Skip if either main field is missing
          if (!italian || !english) {
            console.warn(`Line ${i+1} is missing Italian or English field, skipping`);
            continue;
          }
          
          // Parse tags
          let tags: string[] = [];
          if (fields.length > tagsIdx && fields[tagsIdx]) {
            const tagsField = fields[tagsIdx];
            if (tagsField.startsWith('[') && tagsField.endsWith(']')) {
              // JSON array format
              try {
                tags = JSON.parse(tagsField);
              } catch {
                tags = [tagsField];
              }
            } else {
              // Comma-separated string
              tags = tagsField.split(',').map(tag => tag.trim()).filter(Boolean);
            }
          }
          
          // Parse level
          let level = 1;
          if (fields.length > levelIdx && fields[levelIdx]) {
            const levelValue = parseInt(fields[levelIdx], 10);
            if (!isNaN(levelValue)) {
              level = levelValue;
            }
          }
          
          // Create flashcard
          cards.push({
            id: uuidv4(),
            front: italian,
            back: english,
            italian: italian,
            english: english,
            difficulty: 1, // Default difficulty
            tags: tags,
            level: level,
            mastered: false,
            lastReviewed: null,
            nextReview: new Date(Date.now() + 86400000), // Default to tomorrow
            createdAt: new Date(),
            updatedAt: new Date()
          });
        } catch (error) {
          console.warn(`Error parsing line ${i+1}:`, error);
          // Continue with other lines
        }
      }
      
      if (cards.length === 0) {
        throw new Error('No valid flashcards found in the CSV data');
      }
      
      return cards;
      
    } catch (error) {
      console.error('Error parsing CSV:', error);
      throw new Error('Invalid CSV format: ' + (error instanceof Error ? error.message : String(error)));
    }
  }, []);
  
  // Helper to parse CSV lines handling quoted fields
  const parseCSVLine = useCallback((line: string, delimiter: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (i < line.length - 1 && line[i + 1] === '"') {
          // Escaped quote
          current += '"';
          i++; // Skip the next quote
        } else {
          // Toggle quote mode
          inQuotes = !inQuotes;
        }
      } else if (char === delimiter && !inQuotes) {
        // Field separator outside quotes
        result.push(current);
        current = '';
      } else {
        // Regular character
        current += char;
      }
    }
    
    // Add the last field
    result.push(current);
    return result;
  }, []);
  
  return {
    importFromText,
    importFromFile,
    setImportFormat,
    importFormat
  };
}

export default useFlashcardImporter;
