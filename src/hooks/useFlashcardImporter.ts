
import { useState, useCallback } from 'react';
import { ImportFormat, Flashcard } from '@/types/interface-fixes';
import Papa from 'papaparse';

export interface UseFlashcardImporterProps {
  onImportComplete?: (flashcards: Partial<Flashcard>[]) => void;
  onError?: (error: Error) => void;
}

export const useFlashcardImporter = ({
  onImportComplete,
  onError
}: UseFlashcardImporterProps = {}) => {
  const [isImporting, setIsImporting] = useState(false);
  const [importFormat, setImportFormat] = useState<ImportFormat>({
    format: 'csv',
    fieldMap: {
      italian: 'italian',
      english: 'english',
      tags: 'tags',
      level: 'level',
      mastered: 'mastered',
      examples: 'examples',
      explanation: 'explanation'
    },
    delimiter: ',',
    hasHeaders: true
  });
  const [error, setError] = useState<Error | null>(null);
  
  // Update import format settings
  const updateImportFormat = useCallback((updates: Partial<ImportFormat>) => {
    setImportFormat(prev => ({
      ...prev,
      ...updates
    }));
  }, []);
  
  // Parse CSV data
  const parseCSV = useCallback((csvText: string): any[] => {
    const parseResult = Papa.parse(csvText, {
      header: importFormat.hasHeaders,
      delimiter: importFormat.delimiter || ',',
      skipEmptyLines: true
    });
    
    if (parseResult.errors && parseResult.errors.length > 0) {
      throw new Error(`CSV parse error: ${parseResult.errors[0].message}`);
    }
    
    return parseResult.data;
  }, [importFormat.hasHeaders, importFormat.delimiter]);
  
  // Parse JSON data
  const parseJSON = useCallback((jsonText: string): any[] => {
    try {
      const parsed = JSON.parse(jsonText);
      if (Array.isArray(parsed)) {
        return parsed;
      } else if (typeof parsed === 'object' && parsed !== null) {
        // Handle case where JSON is an object with an array property
        // Check common array properties like 'cards', 'flashcards', 'items', 'data'
        const arrayProps = ['cards', 'flashcards', 'items', 'data'];
        for (const prop of arrayProps) {
          if (Array.isArray(parsed[prop])) {
            return parsed[prop];
          }
        }
        // If no array property found, wrap the single object in an array
        return [parsed];
      }
      throw new Error('Invalid JSON format. Expected an array or object with cards array.');
    } catch (err) {
      throw new Error(`JSON parse error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, []);
  
  // Map raw imported data to flashcard format
  const mapToFlashcards = useCallback((rawData: any[]): Partial<Flashcard>[] => {
    const { fieldMap } = importFormat;
    
    return rawData.map(item => {
      // Extract fields based on field mapping
      const flashcard: Partial<Flashcard> = {
        front: String(item[fieldMap.italian] || ''),
        back: String(item[fieldMap.english] || ''),
        italian: String(item[fieldMap.italian] || ''),
        english: String(item[fieldMap.english] || '')
      };
      
      // Only add fields that exist in the source data
      if (fieldMap.tags && item[fieldMap.tags]) {
        const tagsValue = item[fieldMap.tags];
        flashcard.tags = Array.isArray(tagsValue) 
          ? tagsValue 
          : typeof tagsValue === 'string'
            ? tagsValue.split(',').map(tag => tag.trim())
            : [];
      } else {
        flashcard.tags = [];
      }
      
      if (fieldMap.level && item[fieldMap.level] !== undefined) {
        flashcard.level = Number(item[fieldMap.level]) || 0;
      }
      
      if (fieldMap.mastered && item[fieldMap.mastered] !== undefined) {
        const masteredValue = item[fieldMap.mastered];
        flashcard.mastered = typeof masteredValue === 'boolean' 
          ? masteredValue 
          : masteredValue === 'true' || masteredValue === '1' || masteredValue === 'yes';
      }
      
      if (fieldMap.examples && item[fieldMap.examples]) {
        const examplesValue = item[fieldMap.examples];
        flashcard.examples = Array.isArray(examplesValue) 
          ? examplesValue 
          : typeof examplesValue === 'string'
            ? [examplesValue]
            : [];
      }
      
      if (fieldMap.explanation && item[fieldMap.explanation]) {
        flashcard.explanation = String(item[fieldMap.explanation]);
      }
      
      return flashcard;
    }).filter(card => card.front && card.back); // Only include cards with both fields
  }, [importFormat]);
  
  // Import from file
  const importFromFile = useCallback(async (file: File): Promise<Partial<Flashcard>[]> => {
    setIsImporting(true);
    setError(null);
    
    try {
      const fileText = await file.text();
      let rawData: any[] = [];
      
      // Parse based on file type
      if (importFormat.format === 'csv') {
        rawData = parseCSV(fileText);
      } else if (importFormat.format === 'json') {
        rawData = parseJSON(fileText);
      } else if (importFormat.format === 'txt') {
        // For txt formats, assume tab-separated data
        rawData = parseCSV(fileText.replace(/\t/g, ','));
      } else {
        throw new Error(`Unsupported import format: ${importFormat.format}`);
      }
      
      // Map to flashcards
      const flashcards = mapToFlashcards(rawData);
      
      if (flashcards.length === 0) {
        throw new Error('No valid flashcards found in the imported file.');
      }
      
      // Call the completion handler if provided
      if (onImportComplete) {
        onImportComplete(flashcards);
      }
      
      setIsImporting(false);
      return flashcards;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown import error');
      setError(error);
      
      if (onError) {
        onError(error);
      }
      
      setIsImporting(false);
      throw error;
    }
  }, [importFormat.format, parseCSV, parseJSON, mapToFlashcards, onImportComplete, onError]);
  
  // Import from text
  const importFromText = useCallback((text: string, format: 'csv' | 'json' | 'txt' = 'csv'): Promise<Partial<Flashcard>[]> => {
    setIsImporting(true);
    setError(null);
    
    try {
      let rawData: any[] = [];
      
      // Parse based on format
      if (format === 'csv') {
        rawData = parseCSV(text);
      } else if (format === 'json') {
        rawData = parseJSON(text);
      } else if (format === 'txt') {
        // For txt formats, assume tab-separated data
        rawData = parseCSV(text.replace(/\t/g, ','));
      } else {
        throw new Error(`Unsupported import format: ${format}`);
      }
      
      // Map to flashcards
      const flashcards = mapToFlashcards(rawData);
      
      if (flashcards.length === 0) {
        throw new Error('No valid flashcards found in the imported text.');
      }
      
      // Call the completion handler if provided
      if (onImportComplete) {
        onImportComplete(flashcards);
      }
      
      setIsImporting(false);
      return Promise.resolve(flashcards);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown import error');
      setError(error);
      
      if (onError) {
        onError(error);
      }
      
      setIsImporting(false);
      return Promise.reject(error);
    }
  }, [parseCSV, parseJSON, mapToFlashcards, onImportComplete, onError]);
  
  return {
    importFromFile,
    importFromText,
    updateImportFormat,
    importFormat,
    isImporting,
    error
  };
};

export default useFlashcardImporter;
