
import { useState } from 'react';
import { ImportFormat, ImportOptions, ImportResult, Flashcard, FlashcardSet } from '@/types/flashcard';
import { useFlashcards } from './useFlashcards';

export const useFlashcardImporter = () => {
  const { importFlashcards, exportFlashcards, flashcardSets } = useFlashcards();
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImport = async (content: string, options: ImportOptions): Promise<ImportResult> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await importFlashcards(content, options);
      setImportResult(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred during import';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (setId?: string, format: 'csv' | 'json' = 'csv'): string => {
    try {
      return exportFlashcards(setId, format);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred during export';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return {
    handleImport,
    handleExport,
    importResult,
    loading,
    error,
    flashcardSets
  };
};

export type { ImportOptions, ImportResult, Flashcard, FlashcardSet, ImportFormat };
